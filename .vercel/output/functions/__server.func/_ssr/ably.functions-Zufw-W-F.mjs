import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { t as require_ably_node } from "../_libs/ably.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BDx8PeYO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ably.functions-Zufw-W-F.js
var import_ably_node = /* @__PURE__ */ __toESM(require_ably_node());
var _ablyRest = null;
function getAblyRest() {
	if (!_ablyRest) {
		const key = typeof process !== "undefined" ? process.env.ABLY_API_KEY : void 0;
		_ablyRest = new import_ably_node.Rest({ key: key || "dummy:key" });
	}
	return _ablyRest;
}
var getAblyToken = createServerFn({ method: "POST" }).handler(createSsrRpc("040eb6b4bca7b4e2986db5b69ac831f843ad229f03dfa4bb06afbeee270e214a"));
async function broadcast(channelName, eventName, data) {
	if (typeof process === "undefined" || !process.env.ABLY_API_KEY) {
		console.warn("ABLY_API_KEY not set. Skipping broadcast:", channelName, eventName);
		return;
	}
	try {
		await getAblyRest().channels.get(channelName).publish(eventName, data);
	} catch (e) {
		console.error("Ably broadcast error:", e);
	}
}
//#endregion
export { getAblyToken as n, broadcast as t };
