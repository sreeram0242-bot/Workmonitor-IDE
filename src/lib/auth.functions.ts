import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { prisma } from "@/lib/prisma";

export const getMyProfile = createServerFn({ method: "GET" }).handler(async () => {
  let authResult;
  try {
    authResult = await auth();
  } catch (e) {
    console.error("Clerk auth error:", e);
    return null;
  }
  if (!authResult?.userId) return null;

  // Find user role
  let roleRow = await prisma.userRole.findFirst({
    where: { user_id: authResult.userId },
  });

  // Find profile
  const profile = await prisma.profile.findUnique({
    where: { id: authResult.userId },
  });

  return {
    role: roleRow?.role || "user",
    profile: profile || null,
  };
});
