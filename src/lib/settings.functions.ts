import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAuth } from "@clerk/tanstack-start/server";
import { prisma } from "@/lib/prisma";

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
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.profile.update({
      where: { id: auth.userId },
      data: updates,
    });
    return true;
  });

export const checkPasscode = createServerFn({ method: "GET" }).handler(async () => {
  const auth = await getAuthOrThrow(getReqOrThrow());
  const profile = await prisma.profile.findUnique({
    where: { id: auth.userId },
    select: { passcode: true },
  });
  return !!profile?.passcode;
});

export const verifyPasscode = createServerFn({ method: "POST" })
  .validator((pin: string) => pin)
  .handler(async ({ data: pin }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    const profile = await prisma.profile.findUnique({
      where: { id: auth.userId },
      select: { passcode: true },
    });
    return profile?.passcode === pin;
  });

export const updatePasscode = createServerFn({ method: "POST" })
  .validator((pin: string) => pin)
  .handler(async ({ data: pin }) => {
    const auth = await getAuthOrThrow(getReqOrThrow());
    await prisma.profile.update({
      where: { id: auth.userId },
      data: { passcode: pin },
    });
    return true;
  });
