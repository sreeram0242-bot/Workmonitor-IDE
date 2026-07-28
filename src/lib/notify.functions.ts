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
    const appId =
      process.env.VITE_ONESIGNAL_APP_ID ||
      (import.meta.env?.VITE_ONESIGNAL_APP_ID as string) ||
      "9b51dcef-52d3-4ca4-acc1-93615eb8466a";
    const apiKey =
      process.env.VITE_ONESIGNAL_API_KEY ||
      (import.meta.env?.VITE_ONESIGNAL_API_KEY as string) ||
      "os_v2_app_tni5z32s2ngkjlgbsnqv5ocgnjtaiftlgkdedu4xzavskcq4tyrrhhhluxeDcJHrrHSgvFpsYxqb6g97uaQTd2kE31rPUeDZTeDsjVq";

    if (appId && apiKey) {
      for (const it of filtered) {
        try {
          const response = await fetch("https://onesignal.com/api/v1/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${apiKey}`,
            },
            body: JSON.stringify({
              app_id: appId,
              include_aliases: { external_id: [it.user_id] },
              include_external_user_ids: [it.user_id],
              target_channel: "push",
              headings: { en: "WorkMonitor" },
              contents: { en: it.message },
              data: { link: it.link },
            }),
          });
          if (!response.ok) {
            const errBody = await response.text();
            console.error("OneSignal push API response error:", response.status, errBody);
          }
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

export const sendUrgentBroadcastAlert = createServerFn({ method: "POST" })
  .validator((data: { title: string; message: string; link?: string }) => data)
  .handler(async ({ data: { title, message, link } }) => {
    const authResult = await getAuthOrThrow();

    // Verify admin role
    const roleRow = await prisma.userRole.findFirst({
      where: { user_id: authResult.userId },
    });
    if (roleRow?.role !== "admin") {
      throw new Error("Only admins can send urgent broadcast alerts");
    }

    // Fetch all team user IDs
    const allProfiles = await prisma.profile.findMany({ select: { id: true } });
    if (allProfiles.length > 0) {
      await prisma.notification.createMany({
        data: allProfiles.map((p) => ({
          user_id: p.id,
          type: "urgent_alert",
          message: `🚨 ${title}: ${message}`,
          link: link || "/app",
        })),
      });
    }

    // Send High-Priority OneSignal Push Notification to ALL devices
    const appId =
      process.env.VITE_ONESIGNAL_APP_ID ||
      (import.meta.env?.VITE_ONESIGNAL_APP_ID as string) ||
      "9b51dcef-52d3-4ca4-acc1-93615eb8466a";
    const apiKey =
      process.env.VITE_ONESIGNAL_API_KEY ||
      (import.meta.env?.VITE_ONESIGNAL_API_KEY as string) ||
      "os_v2_app_tni5z32s2ngkjlgbsnqv5ocgnjtaiftlgkdedu4xzavskcq4tyrrhhhluxeDcJHrrHSgvFpsYxqb6g97uaQTd2kE31rPUeDZTeDsjVq";

    if (appId && apiKey) {
      try {
        const response = await fetch("https://onesignal.com/api/v1/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${apiKey}`,
          },
          body: JSON.stringify({
            app_id: appId,
            included_segments: ["Subscribed Users"],
            headings: { en: `🚨 ${title || "URGENT ALERT"}` },
            contents: { en: message },
            priority: 10,
            android_sound: "alarm",
            ios_sound: "alarm.wav",
            android_visibility: 1,
            android_channel_id: "urgent_alert",
            data: { type: "urgent_alert", link: link || "/app" },
          }),
        });
        if (!response.ok) {
          const errText = await response.text();
          console.error("OneSignal Broadcast Error:", response.status, errText);
        }
      } catch (err) {
        console.error("Failed to send OneSignal urgent broadcast:", err);
      }
    }

    // Broadcast real-time websocket
    try {
      await broadcast("notifications", "all-users", {
        type: "urgent_alert",
        title,
        message,
      });
    } catch (err) {
      console.error("Ably broadcast error:", err);
    }

    return true;
  });

