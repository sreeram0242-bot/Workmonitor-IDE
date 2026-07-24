import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { t as require_ably_node } from "../_libs/ably.mjs";
import { p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
import { n as getAblyToken } from "./ably.functions-Zufw-W-F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-realtime-DP3QdmcJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_ably_node = /* @__PURE__ */ __toESM(require_ably_node());
var globalAblyClient = null;
function useRealtimeClient() {
	const { user } = useAuth();
	const [client, setClient] = (0, import_react.useState)(globalAblyClient);
	(0, import_react.useEffect)(() => {
		if (!user) {
			if (globalAblyClient) {
				globalAblyClient.close();
				globalAblyClient = null;
				setClient(null);
			}
			return;
		}
		if (!globalAblyClient) {
			globalAblyClient = new import_ably_node.Realtime({ authCallback: async (tokenParams, callback) => {
				try {
					callback(null, await getAblyToken());
				} catch (e) {
					callback(e, null);
				}
			} });
			setClient(globalAblyClient);
		}
	}, [user]);
	return client;
}
function useRealtimeSubscription(channelName, eventName, onMessage) {
	const client = useRealtimeClient();
	const onMessageRef = (0, import_react.useRef)(onMessage);
	(0, import_react.useEffect)(() => {
		onMessageRef.current = onMessage;
	});
	(0, import_react.useEffect)(() => {
		if (!client || !channelName || !eventName) return;
		const channel = client.channels.get(channelName);
		const listener = (msg) => {
			onMessageRef.current(msg.data);
		};
		channel.subscribe(eventName, listener);
		return () => {
			channel.unsubscribe(eventName, listener);
		};
	}, [
		client,
		channelName,
		eventName
	]);
}
//#endregion
export { useRealtimeSubscription as t };
