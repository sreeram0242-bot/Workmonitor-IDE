import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const setMemberBadge = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      user_id: z.string().uuid(),
      badge: z.string().trim().max(24).nullable(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (roleRow?.role !== "admin") {
      throw new Response("Forbidden", { status: 403 });
    }
    const badge = data.badge && data.badge.length > 0 ? data.badge : null;

    // Developer badge is protected: only an existing Developer can grant or revoke it.
    if (badge === "Developer" || badge?.toLowerCase() === "developer") {
      const { data: me } = await context.supabase
        .from("profiles").select("badge").eq("id", context.userId).maybeSingle();
      if ((me as any)?.badge !== "Developer") {
        throw new Response("Only a Developer can assign the Developer badge", { status: 403 });
      }
    }
    // Also block removing/overwriting an existing Developer badge unless caller is Developer
    const { data: target } = await context.supabase
      .from("profiles").select("badge").eq("id", data.user_id).maybeSingle();
    if ((target as any)?.badge === "Developer" && badge !== "Developer") {
      const { data: me } = await context.supabase
        .from("profiles").select("badge").eq("id", context.userId).maybeSingle();
      if ((me as any)?.badge !== "Developer") {
        throw new Response("Only a Developer can change the Developer badge", { status: 403 });
      }
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ badge } as any)
      .eq("id", data.user_id);
    if (error) throw new Response(error.message, { status: 400 });
    return { ok: true };
  });

