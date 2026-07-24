import { i as serverSendNotifications } from "./notify.functions-D_BPJVUt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notify-B0135TIm.js
/**
* Insert notifications, filtering out recipients who have opted out of the
* relevant category via their profile preferences. @mentions always deliver.
*/
async function sendNotifications(items) {
	if (items.length === 0) return;
	await serverSendNotifications({ data: items });
}
async function scheduleOneSignalNotification(userId, title, message, sendAfter) {
	const appId = "9b51dcef-52d3-4ca4-acc1-93615eb8466a";
	const apiKey = "os_v2_app_tni5z32s2ngkjlgbsnqv5ocgnjtaiftlgkdedu4xzavskcq4tyrrhhhluxeDcJHrrHSgvFpsYxqb6g97uaQTd2kE31rPUeDZTeDsjVq";
	try {
		await fetch("https://onesignal.com/api/v1/notifications", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${apiKey}`
			},
			body: JSON.stringify({
				app_id: appId,
				include_aliases: { external_id: [userId] },
				target_channel: "push",
				headings: { en: title },
				contents: { en: message },
				send_after: sendAfter.toISOString()
			})
		});
	} catch (err) {
		console.error("OneSignal schedule error:", err);
	}
}
//#endregion
export { sendNotifications as n, scheduleOneSignalNotification as t };
