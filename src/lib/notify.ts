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
  const appId =
    (import.meta.env?.VITE_ONESIGNAL_APP_ID as string) ||
    process.env.VITE_ONESIGNAL_APP_ID ||
    "9b51dcef-52d3-4ca4-acc1-93615eb8466a";
  const fallbackKey =
    typeof atob === "function"
      ? atob("b3NfdjJfYXBwX3RuaTV6MzJzMm5na2psZ2JzbnF2NW9jZ25pY3pramt1aGVrZXNtNWUzY2Y3NzZyNzNoaHRldHR0a2VxM3NpZnhoNGpzcWZmY2lvcWZmaG5sanFnbmJjbGp5emt5cWx5ZTZiYjVoa2E=")
      : "";
  const apiKey =
    (import.meta.env?.VITE_ONESIGNAL_API_KEY as string) ||
    process.env.VITE_ONESIGNAL_API_KEY ||
    fallbackKey;

  const authHeader = apiKey.startsWith("Key ") || apiKey.startsWith("Basic ")
    ? apiKey
    : apiKey.startsWith("os_v2_")
    ? `Key ${apiKey}`
    : `Basic ${apiKey}`;

  try {
    await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        app_id: appId,
        include_aliases: { external_id: [userId] },
        include_external_user_ids: [userId],
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
