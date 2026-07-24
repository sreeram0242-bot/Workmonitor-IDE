import { i as TSS_SERVER_FUNCTION } from "./createServerFn-C4XsUSXf.mjs";
import { t as getGlobalStartContext } from "./getGlobalStartContext-BLnWRZyM.mjs";
import { s as getAuthObjectForAcceptedToken } from "../_libs/clerk__backend+clerk__shared.mjs";
import { t as errorThrower } from "./utils-BuRZoexi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CLHUWdtF.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var createErrorMessage = (msg) => {
	return `🔒 Clerk: ${msg.trim()}

For more info, check out the docs: https://clerk.com/docs,
or come say hi in our discord server: https://clerk.com/discord

`;
};
createErrorMessage(`
  You're calling 'getAuth()' from a server function, without providing the request object.
  Example:

  export const someServerFunction = createServerFn({ method: 'GET' }).handler(async () => {
    const request = getWebRequest()
    const auth = getAuth(request);
    ...
  });
  `);
var clerkMiddlewareNotConfigured = createErrorMessage(`
It looks like you're trying to use Clerk without configuring the middleware.

To fix this, make sure you have the \`clerkMiddleware()\` configured in your \`createStart()\` function in your \`src/start.ts\` file.`);
var auth = (async (opts) => {
	const authObjectFn = getGlobalStartContext().auth;
	if (!authObjectFn) return errorThrower.throw(clerkMiddlewareNotConfigured);
	return getAuthObjectForAcceptedToken({
		authObject: await Promise.resolve(authObjectFn({ treatPendingAsSignedOut: opts?.treatPendingAsSignedOut })),
		acceptsToken: opts?.acceptsToken
	});
});
//#endregion
export { createServerRpc as n, auth as t };
