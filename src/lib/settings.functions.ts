import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { prisma } from "@/lib/prisma";

async function getAuthOrThrow() {
  try {
    const authResult = await auth();
    if (!authResult.userId) throw new Error("Unauthorized (no userId)");
    return authResult;
  } catch (e) {
    console.error("getAuthOrThrow failed:", e);
    throw e;
  }
}

export const updateProfile = createServerFn({ method: "POST" })
  .validator(
    (updates: {
      avatar_url?: string;
      notify_tasks?: boolean;
      notify_messages?: boolean;
      presence_hidden?: boolean;
    }) => updates,
  )
  .handler(async ({ data: updates }) => {
    const authResult = await getAuthOrThrow();
    await prisma.profile.update({
      where: { id: authResult.userId },
      data: updates,
    });
    return true;
  });

export const checkPasscode = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const authResult = await getAuthOrThrow();
    const profile = await prisma.profile.findUnique({
      where: { id: authResult.userId },
      select: { passcode_hash: true },
    });
    return !!profile?.passcode_hash;
  } catch (e) {
    console.error("checkPasscode error:", e);
    throw e;
  }
});

export const verifyPasscode = createServerFn({ method: "POST" })
  .validator((pin: string) => pin)
  .handler(async ({ data: pin }) => {
    const authResult = await getAuthOrThrow();
    const profile = await prisma.profile.findUnique({
      where: { id: authResult.userId },
      select: { passcode_hash: true },
    });
    return profile?.passcode_hash === pin;
  });

export const updatePasscode = createServerFn({ method: "POST" })
  .validator((pin: string) => pin)
  .handler(async ({ data: pin }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.profile.update({
      where: { id: auth.userId },
      data: { passcode_hash: pin },
    });
    return true;
  });
