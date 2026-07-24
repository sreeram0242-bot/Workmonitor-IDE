import { o as __toESM } from "../_runtime.mjs";
import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { n as createServerRpc, t as auth } from "./auth-CLHUWdtF.mjs";
import { t as require_ably_node } from "../_libs/ably.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ably.functions-Bv2_NvQQ.js
var import_ably_node = /* @__PURE__ */ __toESM(require_ably_node());
var _ablyRest = null;
function getAblyRest() {
	if (!_ablyRest) {
		const key = typeof process !== "undefined" ? process.env.ABLY_API_KEY : void 0;
		_ablyRest = new import_ably_node.Rest({ key: key || "dummy:key" });
	}
	return _ablyRest;
}
var getAblyToken_createServerFn_handler = createServerRpc({
	id: "040eb6b4bca7b4e2986db5b69ac831f843ad229f03dfa4bb06afbeee270e214a",
	name: "getAblyToken",
	filename: "src/lib/ably.functions.ts"
}, (opts) => getAblyToken.__executeServer(opts));
var getAblyToken = createServerFn({ method: "POST" }).handler(getAblyToken_createServerFn_handler, async () => {
	const authResult = await auth();
	if (!authResult.userId) throw new Error("Unauthorized");
	try {
		return await getAblyRest().auth.createTokenRequest({ clientId: authResult.userId });
	} catch (e) {
		console.error("Failed to generate Ably token:", e);
		throw new Error("Failed to generate real-time token");
	}
});
//#endregion
export { getAblyToken_createServerFn_handler };
