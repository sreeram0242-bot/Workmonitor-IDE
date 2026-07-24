import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "@clerk/tanstack-start/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

function getReqOrThrow() {
  const req = getRequest();
  if (!req) throw new Error("No request");
  return req;
}

async function getAuthOrThrow(req: Request) {
  const auth = await getAuth(req);
  if (!auth.userId) throw new Error("Unauthorized");
  return auth;
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
    const auth = await getAuthOrThrow(getReqOrThrow());
    const roleRow = await prisma.userRole.findUnique({
      where: { id: auth.userId },
      select: { role: true },
    });

    if (roleRow?.role !== "admin") {
      throw new Error("Forbidden");
    }

    const badge = data.badge && data.badge.length > 0 ? data.badge : null;

    // Developer badge is protected: only an existing Developer can grant or revoke it.
    if (badge === "Developer" || badge?.toLowerCase() === "developer") {
      const me = await prisma.profile.findUnique({
        where: { id: auth.userId },
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
        where: { id: auth.userId },
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
