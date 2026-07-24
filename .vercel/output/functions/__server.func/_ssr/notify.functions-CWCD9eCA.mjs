import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { n as createServerRpc, t as auth } from "./auth-CLHUWdtF.mjs";
import { t as broadcast } from "./ably.functions-Zufw-W-F.mjs";
import { t as prisma } from "./prisma-B-Q1fYN8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notify.functions-CWCD9eCA.js
async function getAuthOrThrow() {
	const authResult = await auth();
	if (!authResult.userId) throw new Error("Unauthorized");
	return authResult;
}
var serverSendNotifications_createServerFn_handler = createServerRpc({
	id: "3a20abb96be728216fcd1ca6c8cb8e283f6391d5c637b055a96340d4214eebc8",
	name: "serverSendNotifications",
	filename: "src/lib/notify.functions.ts"
}, (opts) => serverSendNotifications.__executeServer(opts));
var serverSendNotifications = createServerFn({ method: "POST" }).validator((items) => items).handler(serverSendNotifications_createServerFn_handler, async ({ data: items }) => {
	await getAuthOrThrow();
	if (items.length === 0) return true;
	const ids = Array.from(new Set(items.map((i) => i.user_id)));
	const prefs = await prisma.profile.findMany({
		where: { id: { in: ids } },
		select: {
			id: true,
			notify_tasks: true,
			notify_messages: true
		}
	});
	const prefMap = /* @__PURE__ */ new Map();
	for (const p of prefs) prefMap.set(p.id, {
		notify_tasks: p.notify_tasks !== false,
		notify_messages: p.notify_messages !== false
	});
	const filtered = items.filter((it) => {
		if (it.type === "mention") return true;
		const p = prefMap.get(it.user_id);
		if (!p) return true;
		if (it.type === "message") return p.notify_messages;
		if (it.type === "task" || it.type.startsWith("task_")) return p.notify_tasks;
		return true;
	});
	if (filtered.length === 0) return true;
	await prisma.notification.createMany({ data: filtered.map((f) => ({
		user_id: f.user_id,
		type: f.type,
		message: f.message,
		link: f.link ?? null
	})) });
	const appId = process.env.VITE_ONESIGNAL_APP_ID;
	const apiKey = process.env.VITE_ONESIGNAL_API_KEY;
	if (appId && apiKey) for (const it of filtered) try {
		await fetch("https://onesignal.com/api/v1/notifications", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${apiKey}`
			},
			body: JSON.stringify({
				app_id: appId,
				include_aliases: { external_id: [it.user_id] },
				target_channel: "push",
				headings: { en: "WorkMonitor" },
				contents: { en: it.message },
				data: { link: it.link }
			})
		});
	} catch (err) {
		console.error("OneSignal push error:", err);
	}
	for (const it of filtered) await broadcast("notifications", `user-${it.user_id}`, { type: "new_notification" });
	return true;
});
var fetchNotifications_createServerFn_handler = createServerRpc({
	id: "71a72a659f626eee787f895363753763c3a1f50eb2d25e027bf7bee573e193e7",
	name: "fetchNotifications",
	filename: "src/lib/notify.functions.ts"
}, (opts) => fetchNotifications.__executeServer(opts));
var fetchNotifications = createServerFn({ method: "GET" }).handler(fetchNotifications_createServerFn_handler, async () => {
	const authResult = await getAuthOrThrow();
	return await prisma.notification.findMany({
		where: { user_id: authResult.userId },
		orderBy: { created_at: "desc" },
		take: 50
	});
});
var markNotificationsRead_createServerFn_handler = createServerRpc({
	id: "140617c1940b9622eeac24ba215f2b81f2191c23ae5264c774096ea21d009644",
	name: "markNotificationsRead",
	filename: "src/lib/notify.functions.ts"
}, (opts) => markNotificationsRead.__executeServer(opts));
var markNotificationsRead = createServerFn({ method: "POST" }).validator((data) => data).handler(markNotificationsRead_createServerFn_handler, async ({ data: { id } }) => {
	const authResult = await getAuthOrThrow();
	if (id) await prisma.notification.update({
		where: { id },
		data: { read: true }
	});
	else await prisma.notification.updateMany({
		where: {
			user_id: authResult.userId,
			read: false
		},
		data: { read: true }
	});
	return true;
});
var clearNotifications_createServerFn_handler = createServerRpc({
	id: "3ef3e4f44c2fb59f1da38937f52b8bd989a85719d72322c6010f5899719f209a",
	name: "clearNotifications",
	filename: "src/lib/notify.functions.ts"
}, (opts) => clearNotifications.__executeServer(opts));
var clearNotifications = createServerFn({ method: "POST" }).handler(clearNotifications_createServerFn_handler, async () => {
	const authResult = await getAuthOrThrow();
	await prisma.notification.deleteMany({ where: { user_id: authResult.userId } });
	return true;
});
//#endregion
export { clearNotifications_createServerFn_handler, fetchNotifications_createServerFn_handler, markNotificationsRead_createServerFn_handler, serverSendNotifications_createServerFn_handler };
