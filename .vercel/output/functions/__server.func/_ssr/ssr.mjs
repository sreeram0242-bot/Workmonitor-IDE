//#region node_modules/.nitro/vite/services/ssr/index.js
var lastError = null;
if (typeof globalThis !== "undefined") {
	const g = globalThis;
	g.addEventListener?.("unhandledrejection", (e) => {
		const reason = e?.reason;
		if (reason) lastError = reason;
	});
	g.addEventListener?.("error", (e) => {
		const err = e?.error;
		if (err) lastError = err;
	});
}
function consumeLastCapturedError() {
	const err = lastError;
	lastError = null;
	return err;
}
function renderErrorPage(errorMsg) {
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Something went wrong</title>
<style>
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; font-family: -apple-system, system-ui, sans-serif; background:#0F1B3D; color:#fff; }
  .card { text-align:center; padding:2rem; max-width:420px; }
  h1 { font-size:1.5rem; margin:0 0 .5rem; }
  p { opacity:.75; margin:0 0 1.5rem; font-size:.95rem; }
  a { display:inline-block; padding:.6rem 1.2rem; background:#fff; color:#0F1B3D; border-radius:.5rem; text-decoration:none; font-weight:600; }
  .err-msg { font-family: monospace; font-size: 0.8rem; text-align: left; background: #000; padding: 1rem; border-radius: 4px; color: #ff6b6b; word-break: break-all; margin-bottom: 1.5rem; }
</style>
</head>
<body>
  <div class="card">
    <h1>Something went wrong</h1>
    <p>An unexpected error occurred.</p>
    <div class="err-msg">${errorMsg ? String(errorMsg) : "An unexpected error occurred. Please refresh or try again in a moment."}</div>
    <a href="/">Reload</a>
  </div>
</body>
</html>`;
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-snymb39h.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response, request) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	if (request.url.includes("_serverFn") || request.url.includes("api") || request.headers.get("accept")?.includes("json")) {
		const errorObj = consumeLastCapturedError();
		if (errorObj) return new Response(JSON.stringify({ error: errorObj.message || String(errorObj) }), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
		return response;
	}
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	const errorObj = consumeLastCapturedError();
	const errorMsg = errorObj ? errorObj.message || String(errorObj) : `h3 swallowed SSR error: ${body}`;
	console.error(errorObj ?? new Error(errorMsg));
	return new Response(renderErrorPage(errorMsg), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
var server_default = { async fetch(request, env, ctx) {
	try {
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx), request);
	} catch (error) {
		console.error(error);
		const isApi = request.url.includes("_server") || request.url.includes("api") || request.headers.get("accept")?.includes("json");
		const errString = error?.stack || error?.message || String(error) || "Internal Server Error";
		if (isApi) return new Response(JSON.stringify({ error: errString }), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
		return new Response(renderErrorPage(errString), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, renderErrorPage as t };
