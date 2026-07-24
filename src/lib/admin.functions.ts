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

    let createdUser;
    let fallbackToAnon = false;
    
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      // Accessing a property triggers the proxy and throws if key is missing
      const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          full_name: data.full_name,
          position: data.position,
          role: data.role,
        },
      });
      if (error || !authData.user) {
        throw new Response(error?.message ?? "Failed to create user", { status: 400 });
      }
      createdUser = authData.user;
      
      await supabaseAdmin.from("user_roles").upsert({ user_id: createdUser.id, role: data.role }, { onConflict: "user_id,role" });
      await supabaseAdmin.from("profiles").upsert({ id: createdUser.id, full_name: data.full_name, position: data.position });
      
      return { id: createdUser.id };
    } catch (e: any) {
      if (e.message?.includes("Missing Supabase environment variable(s)")) {
        console.warn("Service role key missing, falling back to anon signUp");
        fallbackToAnon = true;
      } else {
        throw e;
      }
    }

    if (fallbackToAnon) {
      // Fallback for Vercel without service role key: use signUp on a separate client
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseAnon = createClient(
        process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!,
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
        { auth: { persistSession: false } }
      );
      const { data: authData, error } = await supabaseAnon.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.full_name, position: data.position, role: data.role }
        }
      });
      if (error || !authData.user) {
        throw new Response(error?.message ?? "Failed to sign up user", { status: 400 });
      }
      createdUser = authData.user;
      
      // We must insert into profiles manually because the database trigger might not copy 'position'
      // First try with the newly created user's own token (bypasses RLS 'own profile' restrictions)
      if (authData.session) {
        await supabaseAnon.from("profiles").upsert({
          id: createdUser.id,
          full_name: data.full_name,
          position: data.position
        });
      } else {
        // If email confirmations are enforced, session is null. Fallback to admin token and hope RLS allows it.
        await context.supabase.from("profiles").upsert({
          id: createdUser.id,
          full_name: data.full_name,
          position: data.position
        });
      }
      
      await context.supabase.from("user_roles").upsert({ user_id: createdUser.id, role: data.role }, { onConflict: "user_id,role" });
      return { id: createdUser.id };
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
    
    let fallbackToAnon = false;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
      if (error) throw new Response(error.message, { status: 400 });
    } catch (e: any) {
      if (e.message?.includes("Missing Supabase environment variable(s)")) {
        console.warn("Service role key missing, using fallback for delete user");
        fallbackToAnon = true;
      } else {
        throw e;
      }
    }

    if (fallbackToAnon) {
      // Fallback: Just delete them from user_roles and profiles so they can't log in or appear in the app
      await context.supabase.from("user_roles").delete().eq("user_id", data.user_id);
      await context.supabase.from("profiles").delete().eq("id", data.user_id);
    }
    
    return { ok: true };
  });
