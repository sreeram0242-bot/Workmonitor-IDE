import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "@clerk/tanstack-start/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMyProfile = createServerFn({ method: "GET" }).handler(async () => {
  const req = getRequest();
  if (!req) return null;
  const auth = await getAuth(req);
  if (!auth.userId) return null;

  // Find user role
  let roleRow = await prisma.userRole.findUnique({
    where: { id: auth.userId }, // Wait, UserRole pk is id? Or user_id?
  });

  if (!roleRow) {
    // Check if by user_id
    const byUserId = await prisma.userRole.findFirst({
      where: { user_id: auth.userId },
    });
    roleRow = byUserId;
  }

  // Find profile
  const profile = await prisma.profile.findUnique({
    where: { id: auth.userId },
  });

  return {
    role: roleRow?.role || "user",
    profile: profile || null,
  };
});
