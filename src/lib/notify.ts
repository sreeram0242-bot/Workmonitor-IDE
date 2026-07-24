import {
  serverSendNotifications,
  fetchNotifications,
  markNotificationsRead,
  clearNotifications,
  type NotifyPayload,
} from "./notify.functions";

export type { NotifyPayload } from "./notify.functions";
export { fetchNotifications, markNotificationsRead, clearNotifications };

/**
 * Insert notifications, filtering out recipients who have opted out of the
 * relevant category via their profile preferences. @mentions always deliver.
 */
export async function sendNotifications(items: NotifyPayload[]) {
  if (items.length === 0) return;
  await serverSendNotifications({ data: items });
}

export async function scheduleOneSignalNotification(
  userId: string,
  title: string,
  message: string,
  sendAfter: Date,
) {
  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
  const apiKey = import.meta.env.VITE_ONESIGNAL_API_KEY;
  if (!appId || !apiKey) return;

  try {
    await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        include_aliases: { external_id: [userId] },
        target_channel: "push",
        headings: { en: title },
        contents: { en: message },
        send_after: sendAfter.toISOString(),
      }),
    });
  } catch (err) {
    console.error("OneSignal schedule error:", err);
  }
}
