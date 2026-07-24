import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { n as createServerRpc, t as auth } from "./auth-CLHUWdtF.mjs";
import { t as prisma } from "./prisma-B-Q1fYN8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.functions-Rx298C5T.js
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "ecb43edc9942f5265a26ac2ab7ec9e5f6bb0b891a5cfd4cd3817af7f283a5b18",
	name: "getMyProfile",
	filename: "src/lib/auth.functions.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).handler(getMyProfile_createServerFn_handler, async () => {
	let authResult;
	try {
		authResult = await auth();
	} catch (e) {
		console.error("Clerk auth error:", e);
		return null;
	}
	if (!authResult?.userId) return null;
	let roleRow = await prisma.userRole.findFirst({ where: { user_id: authResult.userId } });
	const profile = await prisma.profile.findUnique({ where: { id: authResult.userId } });
	return {
		role: roleRow?.role || "user",
		profile: profile || null
	};
});
//#endregion
export { getMyProfile_createServerFn_handler };
