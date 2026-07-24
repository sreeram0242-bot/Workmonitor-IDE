import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { prisma } from "@/lib/prisma";
import { broadcast } from "@/lib/ably.functions";
import { triggerNotification } from "@/lib/notify.functions";
import { z } from "zod";


async function getAuthOrThrow() {
  const authResult = await auth();
  if (!authResult.userId) throw new Error("Unauthorized");
  return authResult;
}

export const setMemberBadge = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        user_id: z.string(),
        badge: z.string().trim().max(24).nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const authResult = await getAuthOrThrow();
    const roleRow = await prisma.userRole.findFirst({
      where: { user_id: authResult.userId },
      select: { role: true },
    });

    if (roleRow?.role !== "admin") {
      throw new Error("Forbidden");
    }

    const badge = data.badge && data.badge.length > 0 ? data.badge : null;

    // Developer badge is protected: only an existing Developer can grant or revoke it.
    if (badge === "Developer" || badge?.toLowerCase() === "developer") {
      const me = await prisma.profile.findUnique({
        where: { id: authResult.userId },
        select: { badge: true },
      });
      if (me?.badge !== "Developer") {
        throw new Error("Only a Developer can assign the Developer badge");
      }
    }
    // Also block removing/overwriting an existing Developer badge unless caller is Developer
    const target = await prisma.profile.findUnique({
      where: { id: data.user_id },
      select: { badge: true },
    });
    if (target?.badge === "Developer" && badge !== "Developer") {
      const me = await prisma.profile.findUnique({
        where: { id: authResult.userId },
        select: { badge: true },
      });
      if (me?.badge !== "Developer") {
        throw new Error("Only a Developer can change the Developer badge");
      }
    }

    await prisma.profile.update({
      where: { id: data.user_id },
      data: { badge },
    });

    return { ok: true };
  });
