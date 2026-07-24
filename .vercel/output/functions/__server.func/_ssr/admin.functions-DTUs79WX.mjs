import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { n as createServerRpc, t as auth } from "./auth-CLHUWdtF.mjs";
import { t as clerkClient } from "./clerkClient-CmX8gpIv.mjs";
import { t as prisma } from "./prisma-B-Q1fYN8.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.functions-DTUs79WX.js
async function getAuthOrThrow() {
	const authResult = await auth();
	if (!authResult.userId) throw new Error("Unauthorized");
	return authResult;
}
var createUserSchema = objectType({
	email: stringType().email(),
	password: stringType().min(6),
	full_name: stringType().min(1),
	position: stringType().min(1),
	role: enumType(["admin", "user"])
});
var createTeamMember_createServerFn_handler = createServerRpc({
	id: "94e3d6b0a5205320fd9ba8db5cb4203f6f544416368229f4eccd00021138b1f3",
	name: "createTeamMember",
	filename: "src/lib/admin.functions.ts"
}, (opts) => createTeamMember.__executeServer(opts));
var createTeamMember = createServerFn({ method: "POST" }).validator((data) => createUserSchema.parse(data)).handler(createTeamMember_createServerFn_handler, async ({ data }) => {
	const authResult = await getAuthOrThrow();
	if ((await prisma.userRole.findFirst({
		where: { user_id: authResult.userId },
		select: { role: true }
	}))?.role !== "admin") throw new Error("Forbidden");
	try {
		const user = await (await clerkClient()).users.createUser({
			emailAddress: [data.email],
			password: data.password,
			firstName: data.full_name.split(" ")[0] || "",
			lastName: data.full_name.split(" ").slice(1).join(" ") || "",
			publicMetadata: { role: data.role }
		});
		const existingRole = await prisma.userRole.findFirst({ where: { user_id: user.id } });
		if (existingRole) await prisma.userRole.update({
			where: { id: existingRole.id },
			data: { role: data.role }
		});
		else await prisma.userRole.create({ data: {
			user_id: user.id,
			role: data.role
		} });
		await prisma.profile.upsert({
			where: { id: user.id },
			update: {
				full_name: data.full_name,
				position: data.position
			},
			create: {
				id: user.id,
				full_name: data.full_name,
				position: data.position
			}
		});
		return { id: user.id };
	} catch (e) {
		console.error("createTeamMember error:", JSON.stringify(e, null, 2));
		if (e?.errors && e.errors.length > 0) throw new Error(e.errors[0].longMessage || e.errors[0].message || "Failed to create user");
		throw new Error(e?.message ?? "Failed to create user");
	}
});
var deleteTeamMember_createServerFn_handler = createServerRpc({
	id: "9b121076e029773654de80b83810d59bd4fe46b5997385f0cbf0ee3d2dcc19c9",
	name: "deleteTeamMember",
	filename: "src/lib/admin.functions.ts"
}, (opts) => deleteTeamMember.__executeServer(opts));
var deleteTeamMember = createServerFn({ method: "POST" }).validator((data) => objectType({ user_id: stringType() }).parse(data)).handler(deleteTeamMember_createServerFn_handler, async ({ data }) => {
	const authResult = await getAuthOrThrow();
	if ((await prisma.userRole.findFirst({
		where: { user_id: authResult.userId },
		select: { role: true }
	}))?.role !== "admin") throw new Error("Forbidden");
	if (data.user_id === authResult.userId) throw new Error("Cannot delete yourself");
	try {
		await (await clerkClient()).users.deleteUser(data.user_id);
		await prisma.userRole.deleteMany({ where: { user_id: data.user_id } });
		await prisma.profile.deleteMany({ where: { id: data.user_id } });
		return { ok: true };
	} catch (e) {
		throw new Error(e?.message ?? "Failed to delete user");
	}
});
var resetUserPasscode_createServerFn_handler = createServerRpc({
	id: "83500b398eff707b81eae12c1712f2d93d12041a42896a6a1ed8647de013d7b9",
	name: "resetUserPasscode",
	filename: "src/lib/admin.functions.ts"
}, (opts) => resetUserPasscode.__executeServer(opts));
var resetUserPasscode = createServerFn({ method: "POST" }).validator((data) => data).handler(resetUserPasscode_createServerFn_handler, async ({ data: { targetUserId } }) => {
	const authResult = await getAuthOrThrow();
	if ((await prisma.userRole.findFirst({
		where: { user_id: authResult.userId },
		select: { role: true }
	}))?.role !== "admin") throw new Error("Forbidden");
	await prisma.profile.update({
		where: { id: targetUserId },
		data: { passcode_hash: null }
	});
	return true;
});
var fetchDevStats_createServerFn_handler = createServerRpc({
	id: "e096aa0c9b24bc4cb68d27ed213f9395313d9925db59d34c638c6643b4666dda",
	name: "fetchDevStats",
	filename: "src/lib/admin.functions.ts"
}, (opts) => fetchDevStats.__executeServer(opts));
var fetchDevStats = createServerFn({ method: "GET" }).handler(fetchDevStats_createServerFn_handler, async () => {
	const authResult = await getAuthOrThrow();
	if ((await prisma.profile.findUnique({ where: { id: authResult.userId } }))?.badge !== "Developer") throw new Error("Forbidden");
	const [users, tasks, messages, approved] = await Promise.all([
		prisma.profile.count(),
		prisma.task.count(),
		prisma.message.count(),
		prisma.task.count({ where: { status: "approved" } })
	]);
	return {
		users,
		tasks,
		messages,
		approved
	};
});
//#endregion
export { createTeamMember_createServerFn_handler, deleteTeamMember_createServerFn_handler, fetchDevStats_createServerFn_handler, resetUserPasscode_createServerFn_handler };
