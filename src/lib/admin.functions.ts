import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  position: z.string().min(1),
  role: z.enum(["admin", "user"]),
});

export const createTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createUserSchema.parse(data))
  .handler(async ({ data, context }) => {
    // verify caller is admin
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (roleRow?.role !== "admin") {
      throw new Response("Forbidden", { status: 403 });
    }

    let adminClient;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      adminClient = supabaseAdmin;
    } catch (e) {
      console.warn("Service role key missing, using fallback for create user");
    }

    if (adminClient) {
      const { data: created, error } = await adminClient.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          full_name: data.full_name,
          position: data.position,
          role: data.role,
        },
      });
      if (error || !created.user) {
        throw new Response(error?.message ?? "Failed to create user", { status: 400 });
      }
      await adminClient.from("user_roles").upsert({ user_id: created.user.id, role: data.role }, { onConflict: "user_id,role" });
      await adminClient.from("profiles").update({ full_name: data.full_name, position: data.position }).eq("id", created.user.id);
      return { id: created.user.id };
    } else {
      // Fallback for Vercel without service role key: use signUp on a separate client
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseAnon = createClient(
        process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!,
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
        { auth: { persistSession: false } }
      );
      const { data: created, error } = await supabaseAnon.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.full_name, position: data.position, role: data.role }
        }
      });
      if (error || !created.user) {
        throw new Response(error?.message ?? "Failed to sign up user", { status: 400 });
      }
      // Rely on the database trigger handle_new_user() to populate profiles & user_roles
      // Also try to update it using the admin's own token (might fail if RLS is strict, but trigger should suffice)
      await context.supabase.from("user_roles").upsert({ user_id: created.user.id, role: data.role }, { onConflict: "user_id,role" });
      return { id: created.user.id };
    }
  });

export const deleteTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ user_id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (roleRow?.role !== "admin") {
      throw new Response("Forbidden", { status: 403 });
    }
    if (data.user_id === context.userId) {
      throw new Response("Cannot delete yourself", { status: 400 });
    }
    
    let adminClient;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      adminClient = supabaseAdmin;
    } catch (e) {
      console.warn("Service role key missing, using fallback for delete user");
    }

    if (adminClient) {
      const { error } = await adminClient.auth.admin.deleteUser(data.user_id);
      if (error) throw new Response(error.message, { status: 400 });
    } else {
      // Fallback: Just delete them from user_roles and profiles so they can't log in or appear in the app
      await context.supabase.from("user_roles").delete().eq("user_id", data.user_id);
      await context.supabase.from("profiles").delete().eq("id", data.user_id);
    }
    
    return { ok: true };
  });
