import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { n as createServerRpc, t as auth } from "./auth-CLHUWdtF.mjs";
import { t as prisma } from "./prisma-B-Q1fYN8.mjs";
import { n as objectType, r as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badges.functions-DFYF3IYP.js
async function getAuthOrThrow() {
	const authResult = await auth();
	if (!authResult.userId) throw new Error("Unauthorized");
	return authResult;
}
var setMemberBadge_createServerFn_handler = createServerRpc({
	id: "376fd73665b13b06400c3384ba76533dfef6e176d34de03ff056c9bf0236a061",
	name: "setMemberBadge",
	filename: "src/lib/badges.functions.ts"
}, (opts) => setMemberBadge.__executeServer(opts));
var setMemberBadge = createServerFn({ method: "POST" }).validator((data) => objectType({
	user_id: stringType(),
	badge: stringType().trim().max(24).nullable()
}).parse(data)).handler(setMemberBadge_createServerFn_handler, async ({ data }) => {
	const authResult = await getAuthOrThrow();
	if ((await prisma.userRole.findFirst({
		where: { user_id: authResult.userId },
		select: { role: true }
	}))?.role !== "admin") throw new Error("Forbidden");
	const badge = data.badge && data.badge.length > 0 ? data.badge : null;
	if (badge === "Developer" || badge?.toLowerCase() === "developer") {
		if ((await prisma.profile.findUnique({
			where: { id: authResult.userId },
			select: { badge: true }
		}))?.badge !== "Developer") throw new Error("Only a Developer can assign the Developer badge");
	}
	if ((await prisma.profile.findUnique({
		where: { id: data.user_id },
		select: { badge: true }
	}))?.badge === "Developer" && badge !== "Developer") {
		if ((await prisma.profile.findUnique({
			where: { id: authResult.userId },
			select: { badge: true }
		}))?.badge !== "Developer") throw new Error("Only a Developer can change the Developer badge");
	}
	await prisma.profile.update({
		where: { id: data.user_id },
		data: { badge }
	});
	return { ok: true };
});
//#endregion
export { setMemberBadge_createServerFn_handler };
