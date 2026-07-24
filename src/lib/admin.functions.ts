import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getAuth, clerkClient } from "@clerk/tanstack-start/server";
import { getRequest } from "@tanstack/react-start/server";
import { prisma } from "@/lib/prisma";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  position: z.string().min(1),
  role: z.enum(["admin", "user"]),
});

export const createTeamMember = createServerFn({ method: "POST" })
  .validator((data: unknown) => createUserSchema.parse(data))
  .handler(async ({ data }) => {
    const req = getRequest();
    if (!req) throw new Error("No request");
    const auth = await getAuth(req);
    if (!auth.userId) throw new Error("Unauthorized");

    const callerRole = await prisma.userRole.findUnique({
      where: { user_id: auth.userId },
      select: { role: true },
    });
    if (callerRole?.role !== "admin") {
      throw new Error("Forbidden");
    }

    try {
      const client = await clerkClient();
      const user = await client.users.createUser({
        emailAddress: [data.email],
        password: data.password,
        firstName: data.full_name.split(" ")[0] || "",
        lastName: data.full_name.split(" ").slice(1).join(" ") || "",
        publicMetadata: { role: data.role },
      });

      await prisma.userRole.upsert({
        where: { user_id_role: { user_id: user.id, role: data.role } },
        update: { role: data.role },
        create: { user_id: user.id, role: data.role },
      });
      await prisma.profile.upsert({
        where: { id: user.id },
        update: { full_name: data.full_name, position: data.position },
        create: { id: user.id, full_name: data.full_name, position: data.position },
      });

      return { id: user.id };
    } catch (e: any) {
      throw new Error(e?.message ?? "Failed to create user");
    }
  });

export const deleteTeamMember = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ user_id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const req = getRequest();
    if (!req) throw new Error("No request");
    const auth = await getAuth(req);
    if (!auth.userId) throw new Error("Unauthorized");

    const callerRole = await prisma.userRole.findUnique({
      where: { user_id: auth.userId },
      select: { role: true },
    });
    if (callerRole?.role !== "admin") {
      throw new Error("Forbidden");
    }
    if (data.user_id === auth.userId) {
      throw new Error("Cannot delete yourself");
    }

    try {
      const client = await clerkClient();
      await client.users.deleteUser(data.user_id);

      await prisma.userRole.deleteMany({ where: { user_id: data.user_id } });
      await prisma.profile.deleteMany({ where: { id: data.user_id } });

      return { ok: true };
    } catch (e: any) {
      throw new Error(e?.message ?? "Failed to delete user");
    }
  });

export const resetUserPasscode = createServerFn({ method: "POST" })
  .validator((data: { targetUserId: string }) => data)
  .handler(async ({ data: { targetUserId } }) => {
    const req = getRequest();
    if (!req) throw new Error("No request");
    const auth = await getAuth(req);
    if (!auth.userId) throw new Error("Unauthorized");

    const callerRole = await prisma.userRole.findUnique({
      where: { user_id: auth.userId },
      select: { role: true },
    });
    if (callerRole?.role !== "admin") {
      throw new Error("Forbidden");
    }

    await prisma.profile.update({
      where: { id: targetUserId },
      data: { passcode: null },
    });

    return true;
  });

export const fetchDevStats = createServerFn({ method: "GET" }).handler(async () => {
  const req = getRequest();
  if (!req) throw new Error("No request");
  const auth = await getAuth(req);
  if (!auth.userId) throw new Error("Unauthorized");

  const callerProfile = await prisma.profile.findUnique({
    where: { id: auth.userId },
  });
  if (callerProfile?.badge !== "Developer") {
    throw new Error("Forbidden");
  }

  const [users, tasks, messages, approved] = await Promise.all([
    prisma.profile.count(),
    prisma.task.count(),
    prisma.message.count(),
    prisma.task.count({ where: { status: "approved" } }),
  ]);

  return { users, tasks, messages, approved };
});
