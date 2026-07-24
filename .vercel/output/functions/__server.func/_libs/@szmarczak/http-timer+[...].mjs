import { i as __require, t as __commonJSMin } from "../../_runtime.mjs";
//#region node_modules/defer-to-connect/dist/source/index.js
var require_source$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function isTLSSocket(socket) {
		return socket.encrypted;
	}
	var deferToConnect = (socket, fn) => {
		let listeners;
		if (typeof fn === "function") listeners = { connect: fn };
		else listeners = fn;
		const hasConnectListener = typeof listeners.connect === "function";
		const hasSecureConnectListener = typeof listeners.secureConnect === "function";
		const hasCloseListener = typeof listeners.close === "function";
		const onConnect = () => {
			if (hasConnectListener) listeners.connect();
			if (isTLSSocket(socket) && hasSecureConnectListener) {
				if (socket.authorized) listeners.secureConnect();
				else if (!socket.authorizationError) socket.once("secureConnect", listeners.secureConnect);
			}
			if (hasCloseListener) socket.once("close", listeners.close);
		};
		if (socket.writable && !socket.connecting) onConnect();
		else if (socket.connecting) socket.once("connect", onConnect);
		else if (socket.destroyed && hasCloseListener) listeners.close(socket._hadError);
	};
	exports.default = deferToConnect;
	module.exports = deferToConnect;
	module.exports.default = deferToConnect;
}));
//#endregion
//#region node_modules/@szmarczak/http-timer/dist/source/index.js
var require_source = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var defer_to_connect_1 = require_source$1();
	var util_1 = __require("util");
	var nodejsMajorVersion = Number(process.versions.node.split(".")[0]);
	var timer = (request) => {
		if (request.timings) return request.timings;
		const timings = {
			start: Date.now(),
			socket: void 0,
			lookup: void 0,
			connect: void 0,
			secureConnect: void 0,
			upload: void 0,
			response: void 0,
			end: void 0,
			error: void 0,
			abort: void 0,
			phases: {
				wait: void 0,
				dns: void 0,
				tcp: void 0,
				tls: void 0,
				request: void 0,
				firstByte: void 0,
				download: void 0,
				total: void 0
			}
		};
		request.timings = timings;
		const handleError = (origin) => {
			const emit = origin.emit.bind(origin);
			origin.emit = (event, ...args) => {
				if (event === "error") {
					timings.error = Date.now();
					timings.phases.total = timings.error - timings.start;
					origin.emit = emit;
				}
				return emit(event, ...args);
			};
		};
		handleError(request);
		const onAbort = () => {
			timings.abort = Date.now();
			if (!timings.response || nodejsMajorVersion >= 13) timings.phases.total = Date.now() - timings.start;
		};
		request.prependOnceListener("abort", onAbort);
		const onSocket = (socket) => {
			timings.socket = Date.now();
			timings.phases.wait = timings.socket - timings.start;
			if (util_1.types.isProxy(socket)) return;
			const lookupListener = () => {
				timings.lookup = Date.now();
				timings.phases.dns = timings.lookup - timings.socket;
			};
			socket.prependOnceListener("lookup", lookupListener);
			defer_to_connect_1.default(socket, {
				connect: () => {
					timings.connect = Date.now();
					if (timings.lookup === void 0) {
						socket.removeListener("lookup", lookupListener);
						timings.lookup = timings.connect;
						timings.phases.dns = timings.lookup - timings.socket;
					}
					timings.phases.tcp = timings.connect - timings.lookup;
				},
				secureConnect: () => {
					timings.secureConnect = Date.now();
					timings.phases.tls = timings.secureConnect - timings.connect;
				}
			});
		};
		if (request.socket) onSocket(request.socket);
		else request.prependOnceListener("socket", onSocket);
		const onUpload = () => {
			var _a;
			timings.upload = Date.now();
			timings.phases.request = timings.upload - ((_a = timings.secureConnect) !== null && _a !== void 0 ? _a : timings.connect);
		};
		const writableFinished = () => {
			if (typeof request.writableFinished === "boolean") return request.writableFinished;
			return request.finished && request.outputSize === 0 && (!request.socket || request.socket.writableLength === 0);
		};
		if (writableFinished()) onUpload();
		else request.prependOnceListener("finish", onUpload);
		request.prependOnceListener("response", (response) => {
			timings.response = Date.now();
			timings.phases.firstByte = timings.response - timings.upload;
			response.timings = timings;
			handleError(response);
			response.prependOnceListener("end", () => {
				timings.end = Date.now();
				timings.phases.download = timings.end - timings.response;
				timings.phases.total = timings.end - timings.start;
			});
			response.prependOnceListener("aborted", onAbort);
		});
		return timings;
	};
	exports.default = timer;
	module.exports = timer;
	module.exports.default = timer;
}));
//#endregion
export { require_source as t };
