import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { n as createServerRpc, t as auth } from "./auth-CLHUWdtF.mjs";
import { t as prisma } from "./prisma-B-Q1fYN8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings.functions-WMplNfs1.js
async function getAuthOrThrow() {
	try {
		const authResult = await auth();
		if (!authResult.userId) throw new Error("Unauthorized (no userId)");
		return authResult;
	} catch (e) {
		console.error("getAuthOrThrow failed:", e);
		throw e;
	}
}
var updateProfile_createServerFn_handler = createServerRpc({
	id: "c14bb099578dfe3967b4a82ad6946961511cfbb2e5ca307160fb2c9dfdb697c1",
	name: "updateProfile",
	filename: "src/lib/settings.functions.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).validator((updates) => updates).handler(updateProfile_createServerFn_handler, async ({ data: updates }) => {
	const authResult = await getAuthOrThrow();
	await prisma.profile.update({
		where: { id: authResult.userId },
		data: updates
	});
	return true;
});
var checkPasscode_createServerFn_handler = createServerRpc({
	id: "c8e698b2b544849d26207116d9f8ccf9324d4bca11a13a70fb0b74900cd502f0",
	name: "checkPasscode",
	filename: "src/lib/settings.functions.ts"
}, (opts) => checkPasscode.__executeServer(opts));
var checkPasscode = createServerFn({ method: "POST" }).handler(checkPasscode_createServerFn_handler, async () => {
	try {
		const authResult = await getAuthOrThrow();
		return !!(await prisma.profile.findUnique({
			where: { id: authResult.userId },
			select: { passcode_hash: true }
		}))?.passcode_hash;
	} catch (e) {
		console.error("checkPasscode error:", e);
		throw e;
	}
});
var verifyPasscode_createServerFn_handler = createServerRpc({
	id: "34f1e48d172984cfdb3513394f391495bdb7ee3778de923261ffd83b48a31ba1",
	name: "verifyPasscode",
	filename: "src/lib/settings.functions.ts"
}, (opts) => verifyPasscode.__executeServer(opts));
var verifyPasscode = createServerFn({ method: "POST" }).validator((pin) => pin).handler(verifyPasscode_createServerFn_handler, async ({ data: pin }) => {
	const authResult = await getAuthOrThrow();
	return (await prisma.profile.findUnique({
		where: { id: authResult.userId },
		select: { passcode_hash: true }
	}))?.passcode_hash === pin;
});
var updatePasscode_createServerFn_handler = createServerRpc({
	id: "e16604c2f26b21bd79ac71367ca951db78c481dc2be6c57b6b6a9d08f03df3fb",
	name: "updatePasscode",
	filename: "src/lib/settings.functions.ts"
}, (opts) => updatePasscode.__executeServer(opts));
var updatePasscode = createServerFn({ method: "POST" }).validator((pin) => pin).handler(updatePasscode_createServerFn_handler, async ({ data: pin }) => {
	const authResult = await getAuthOrThrow();
	await prisma.profile.update({
		where: { id: authResult.userId },
		data: { passcode_hash: pin }
	});
	return true;
});
//#endregion
export { checkPasscode_createServerFn_handler, updatePasscode_createServerFn_handler, updateProfile_createServerFn_handler, verifyPasscode_createServerFn_handler };
