import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { auth, clerkClient } from "@clerk/tanstack-react-start/server";
import { prisma } from "@/lib/prisma";

async function getAuthOrThrow() {
  const authResult = await auth();
  if (!authResult.userId) throw new Error("Unauthorized");
  return authResult;
}

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
    const authResult = await getAuthOrThrow();

    const callerRole = await prisma.userRole.findFirst({
      where: { user_id: authResult.userId },
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

      // Prisma upsert needs a unique field. We don't have user_id_role unique constraint,
      // so we use findFirst and update/create manually
      const existingRole = await prisma.userRole.findFirst({ where: { user_id: user.id } });
      if (existingRole) {
        await prisma.userRole.update({ where: { id: existingRole.id }, data: { role: data.role } });
      } else {
        await prisma.userRole.create({ data: { user_id: user.id, role: data.role } });
      }
      
      await prisma.profile.upsert({
        where: { id: user.id },
        update: { full_name: data.full_name, position: data.position },
        create: { id: user.id, full_name: data.full_name, position: data.position },
      });

      return { id: user.id };
    } catch (e: any) {
      console.error("createTeamMember error:", JSON.stringify(e, null, 2));
      if (e?.errors && e.errors.length > 0) {
        throw new Error(e.errors[0].longMessage || e.errors[0].message || "Failed to create user");
      }
      throw new Error(e?.message ?? "Failed to create user");
    }
  });

export const deleteTeamMember = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ user_id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const authResult = await getAuthOrThrow();

    const callerRole = await prisma.userRole.findFirst({
      where: { user_id: authResult.userId },
      select: { role: true },
    });
    if (callerRole?.role !== "admin") {
      throw new Error("Forbidden");
    }
    if (data.user_id === authResult.userId) {
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
    const authResult = await getAuthOrThrow();

    const callerRole = await prisma.userRole.findFirst({
      where: { user_id: authResult.userId },
      select: { role: true },
    });
    if (callerRole?.role !== "admin") {
      throw new Error("Forbidden");
    }

    await prisma.profile.update({
      where: { id: targetUserId },
      data: { passcode_hash: null },
    });

    return true;
  });

export const fetchDevStats = createServerFn({ method: "GET" }).handler(async () => {
  const authResult = await getAuthOrThrow();

  const callerProfile = await prisma.profile.findUnique({
    where: { id: authResult.userId },
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
