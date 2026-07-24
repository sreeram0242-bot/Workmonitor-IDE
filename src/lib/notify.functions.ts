import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import { prisma } from "@/lib/prisma";
import { broadcast } from "@/lib/ably.functions";

async function getAuthOrThrow() {
  const authResult = await auth();
  if (!authResult.userId) throw new Error("Unauthorized");
  return authResult;
}

export type NotifyType = "task" | "message" | "mention" | "team" | string;

export interface NotifyPayload {
  user_id: string;
  type: NotifyType;
  message: string;
  link?: string | null;
}

export const serverSendNotifications = createServerFn({ method: "POST" })
  .validator((items: NotifyPayload[]) => items)
  .handler(async ({ data: items }) => {
    const authResult = await getAuthOrThrow();
    if (items.length === 0) return true;

    const ids = Array.from(new Set(items.map((i) => i.user_id)));
    const prefs = await prisma.profile.findMany({
      where: { id: { in: ids } },
      select: { id: true, notify_tasks: true, notify_messages: true },
    });

    const prefMap = new Map<string, { notify_tasks: boolean; notify_messages: boolean }>();
    for (const p of prefs) {
      prefMap.set(p.id, {
        notify_tasks: p.notify_tasks !== false,
        notify_messages: p.notify_messages !== false,
      });
    }

    const filtered = items.filter((it) => {
      if (it.type === "mention") return true;
      const p = prefMap.get(it.user_id);
      if (!p) return true;
      if (it.type === "message") return p.notify_messages;
      if (it.type === "task" || it.type.startsWith("task_")) return p.notify_tasks;
      return true;
    });

    if (filtered.length === 0) return true;

    await prisma.notification.createMany({
      data: filtered.map((f) => ({
        user_id: f.user_id,
        type: f.type,
        message: f.message,
        link: f.link ?? null,
      })),
    });

    // Send Push Notifications via OneSignal
    const appId = process.env.VITE_ONESIGNAL_APP_ID;
    const apiKey = process.env.VITE_ONESIGNAL_API_KEY;
    if (appId && apiKey) {
      for (const it of filtered) {
        try {
          await fetch("https://onesignal.com/api/v1/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${apiKey}`,
            },
            body: JSON.stringify({
              app_id: appId,
              include_aliases: { external_id: [it.user_id] },
              target_channel: "push",
              headings: { en: "WorkMonitor" },
              contents: { en: it.message },
              data: { link: it.link },
            }),
          });
        } catch (err) {
          console.error("OneSignal push error:", err);
        }
      }
    }

    for (const it of filtered) {
      await broadcast("notifications", `user-${it.user_id}`, { type: "new_notification" });
    }

    return true;
  });

export const fetchNotifications = createServerFn({ method: "GET" }).handler(async () => {
  const authResult = await getAuthOrThrow();
  const notifications = await prisma.notification.findMany({
    where: { user_id: authResult.userId },
    orderBy: { created_at: "desc" },
    take: 50,
  });
  return notifications;
});

export const markNotificationsRead = createServerFn({ method: "POST" })
  .validator((data: { id?: string }) => data)
  .handler(async ({ data: { id } }) => {
    const authResult = await getAuthOrThrow();
    if (id) {
      await prisma.notification.update({
        where: { id },
        data: { read: true },
      });
    } else {
      await prisma.notification.updateMany({
        where: { user_id: authResult.userId, read: false },
        data: { read: true },
      });
    }
    return true;
  });

export const clearNotifications = createServerFn({ method: "POST" }).handler(async () => {
  const authResult = await getAuthOrThrow();
  await prisma.notification.deleteMany({
    where: { user_id: authResult.userId },
  });
  return true;
});
