import { M as isDevelopmentEnvironment, N as getEnvVariable, S as isDevelopmentFromSecretKey, _ as isTruthy, a as createClerkRequest, i as constants, j as isAutomatedEnvironment, m as isProxyUrlRelative, o as debugRequestState, p as isHttpOrHttps, r as AuthStatus } from "../_libs/clerk__backend+clerk__shared.mjs";
import { t as errorThrower } from "./utils-BuRZoexi.mjs";
import { a as resolveKeysWithKeylessFallback, i as createNodeFileStorage, n as handleNetlifyCacheInDevInstance, o as apiUrlFromPublishableKey, r as createKeylessService, t as patchRequest } from "../_libs/clerk__shared.mjs";
import { n as commonEnvs, t as clerkClient } from "./clerkClient-CmX8gpIv.mjs";
import { t as createMiddleware } from "./createMiddleware-B_4t7rW1.mjs";
import { t as renderErrorPage } from "./ssr.mjs";
import * as fs from "node:fs";
import * as path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/start-D0hTQS4o.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
var createStart = (getOptions) => {
	return {
		getOptions: async () => {
			const options = await getOptions();
			if (options.serializationAdapters) {
				const deduped = /* @__PURE__ */ new Set();
				dedupeSerializationAdapters(deduped, options.serializationAdapters);
				options.serializationAdapters = Array.from(deduped);
			}
			return options;
		},
		createMiddleware
	};
};
var KEYLESS_DISABLED = isTruthy(getEnvVariable("VITE_CLERK_KEYLESS_DISABLED")) || isTruthy(getEnvVariable("CLERK_KEYLESS_DISABLED")) || false;
/**
* Whether keyless mode can be used in the current environment.
* Keyless mode is only available in development, when not explicitly disabled,
* and when not running in an automated/CI environment.
*
* To disable keyless mode, set either:
* - `VITE_CLERK_KEYLESS_DISABLED=1` (for Vite-based projects)
* - `CLERK_KEYLESS_DISABLED=1` (generic)
*/
var canUseKeyless = isDevelopmentEnvironment() && !isAutomatedEnvironment() && !KEYLESS_DISABLED;
function createFileStorage(options = {}) {
	const { cwd = () => process.cwd() } = options;
	return createNodeFileStorage(fs, path, {
		cwd,
		frameworkPackageName: "@clerk/tanstack-react-start"
	});
}
var keylessServiceInstance = null;
function keyless() {
	if (!keylessServiceInstance) keylessServiceInstance = createKeylessService({
		storage: createFileStorage(),
		api: {
			async createAccountlessApplication(requestHeaders, source) {
				try {
					return await clerkClient().__experimental_accountlessApplications.createAccountlessApplication({
						requestHeaders,
						source
					});
				} catch {
					return null;
				}
			},
			async completeOnboarding(requestHeaders, source) {
				try {
					return await clerkClient().__experimental_accountlessApplications.completeAccountlessApplicationOnboarding({
						requestHeaders,
						source
					});
				} catch {
					return null;
				}
			}
		},
		framework: "tanstack-react-start"
	});
	return keylessServiceInstance;
}
/**
* Resolves Clerk keys, falling back to keyless mode in development if configured keys are missing.
*
* @param configuredPublishableKey - The publishable key from options or environment
* @param configuredSecretKey - The secret key from options or environment
* @returns The resolved keys (either configured or from keyless mode)
*/
function resolveKeysWithKeylessFallback$1(configuredPublishableKey, configuredSecretKey) {
	return resolveKeysWithKeylessFallback(configuredPublishableKey, configuredSecretKey, keyless(), canUseKeyless);
}
var loadOptions = (request, overrides = {}) => {
	const commonEnv = commonEnvs();
	const secretKey = overrides.secretKey || commonEnv.SECRET_KEY;
	const machineSecretKey = overrides.machineSecretKey || commonEnv.MACHINE_SECRET_KEY;
	const publishableKey = overrides.publishableKey || commonEnv.PUBLISHABLE_KEY;
	const jwtKey = overrides.jwtKey || commonEnv.CLERK_JWT_KEY;
	const apiUrl = getEnvVariable("CLERK_API_URL") || apiUrlFromPublishableKey(publishableKey);
	const domain = overrides.domain || commonEnv.DOMAIN;
	const isSatellite = overrides.isSatellite || commonEnv.IS_SATELLITE;
	const relativeOrAbsoluteProxyUrl = overrides.proxyUrl || commonEnv.PROXY_URL;
	const signInUrl = overrides.signInUrl || commonEnv.SIGN_IN_URL;
	const signUpUrl = overrides.signUpUrl || commonEnv.SIGN_UP_URL;
	const satelliteAutoSync = overrides.satelliteAutoSync;
	let proxyUrl;
	if (!!relativeOrAbsoluteProxyUrl && isProxyUrlRelative(relativeOrAbsoluteProxyUrl)) proxyUrl = new URL(relativeOrAbsoluteProxyUrl, request.clerkUrl).toString();
	else proxyUrl = relativeOrAbsoluteProxyUrl;
	if (!secretKey && !canUseKeyless) throw errorThrower.throw("Clerk: no secret key provided");
	if (isSatellite && !proxyUrl && !domain) throw errorThrower.throw("Clerk: satellite mode requires a proxy URL or domain");
	if (isSatellite && secretKey && !isHttpOrHttps(signInUrl) && isDevelopmentFromSecretKey(secretKey)) throw errorThrower.throw("Clerk: satellite mode requires a sign-in URL in production");
	return {
		...overrides,
		secretKey,
		machineSecretKey,
		publishableKey,
		jwtKey,
		apiUrl,
		domain,
		isSatellite,
		proxyUrl,
		signInUrl,
		signUpUrl,
		satelliteAutoSync
	};
};
/**
* Wraps obscured clerk internals with a readable `clerkState` key.
* This is intended to be passed into <ClerkProvider>
*
* @internal
*/
var wrapWithClerkState = (data) => {
	return { __internal_clerk_state: { ...data } };
};
/**
* Returns the prefetchUI config from environment variables.
*
* @internal
*/
function getPrefetchUIFromEnv() {
	if (getEnvVariable("CLERK_PREFETCH_UI") === "false") return false;
}
function getUnsafeDisableDevelopmentModeConsoleWarningFromEnv() {
	const value = getEnvVariable("VITE_CLERK_UNSAFE_DISABLE_DEVELOPMENT_MODE_CONSOLE_WARNING") || getEnvVariable("CLERK_UNSAFE_DISABLE_DEVELOPMENT_MODE_CONSOLE_WARNING");
	return value ? isTruthy(value) : void 0;
}
function getResponseClerkState(requestState, additionalStateOptions = {}) {
	const { reason, message, isSignedIn, ...rest } = requestState;
	return wrapWithClerkState({
		__clerk_ssr_state: rest.toAuth(),
		__publishableKey: requestState.publishableKey,
		__proxyUrl: requestState.proxyUrl,
		__domain: requestState.domain,
		__isSatellite: requestState.isSatellite,
		__signInUrl: requestState.signInUrl,
		__signUpUrl: requestState.signUpUrl,
		__afterSignInUrl: requestState.afterSignInUrl,
		__afterSignUpUrl: requestState.afterSignUpUrl,
		__clerk_debug: debugRequestState(requestState),
		__clerkJSUrl: getEnvVariable("CLERK_JS") || getEnvVariable("CLERK_JS_URL"),
		__clerkJSVersion: getEnvVariable("CLERK_JS_VERSION"),
		__clerkUIUrl: getEnvVariable("CLERK_UI_URL"),
		__clerkUIVersion: getEnvVariable("CLERK_UI_VERSION"),
		__prefetchUI: getPrefetchUIFromEnv(),
		__telemetryDisabled: isTruthy(getEnvVariable("CLERK_TELEMETRY_DISABLED")),
		__telemetryDebug: isTruthy(getEnvVariable("CLERK_TELEMETRY_DEBUG")),
		__unsafeDisableDevelopmentModeConsoleWarning: getUnsafeDisableDevelopmentModeConsoleWarningFromEnv(),
		__signInForceRedirectUrl: additionalStateOptions.signInForceRedirectUrl || getEnvVariable("CLERK_SIGN_IN_FORCE_REDIRECT_URL") || "",
		__signUpForceRedirectUrl: additionalStateOptions.signUpForceRedirectUrl || getEnvVariable("CLERK_SIGN_UP_FORCE_REDIRECT_URL") || "",
		__signInFallbackRedirectUrl: additionalStateOptions.signInFallbackRedirectUrl || getEnvVariable("CLERK_SIGN_IN_FALLBACK_REDIRECT_URL") || "",
		__signUpFallbackRedirectUrl: additionalStateOptions.signUpFallbackRedirectUrl || getEnvVariable("CLERK_SIGN_UP_FALLBACK_REDIRECT_URL") || ""
	});
}
var clerkMiddleware = (options) => {
	return createMiddleware().server(async ({ request, next }) => {
		const clerkRequest = createClerkRequest(patchRequest(request));
		const resolvedOptions = typeof options === "function" ? await options({ url: clerkRequest.clerkUrl }) : options;
		const loadedOptions = loadOptions(clerkRequest, {
			...resolvedOptions,
			publishableKey: resolvedOptions?.publishableKey,
			secretKey: resolvedOptions?.secretKey
		});
		const { publishableKey, secretKey, claimUrl: keylessClaimUrl, apiKeysUrl: keylessApiKeysUrl } = await resolveKeysWithKeylessFallback$1(loadedOptions.publishableKey, loadedOptions.secretKey);
		if (publishableKey) loadedOptions.publishableKey = publishableKey;
		if (secretKey) loadedOptions.secretKey = secretKey;
		const requestState = await clerkClient().authenticateRequest(clerkRequest, {
			...loadedOptions,
			acceptsToken: "any"
		});
		const locationHeader = requestState.headers.get(constants.Headers.Location);
		if (locationHeader) {
			handleNetlifyCacheInDevInstance({
				locationHeader,
				requestStateHeaders: requestState.headers,
				publishableKey: requestState.publishableKey
			});
			throw new Response(null, {
				status: 307,
				headers: requestState.headers
			});
		}
		if (requestState.status === AuthStatus.Handshake) throw new Error("Clerk: handshake status without redirect");
		const clerkInitialState = getResponseClerkState(requestState, loadedOptions);
		if (canUseKeyless && keylessClaimUrl) clerkInitialState.__internal_clerk_state = {
			...clerkInitialState.__internal_clerk_state,
			__keylessClaimUrl: keylessClaimUrl,
			__keylessApiKeysUrl: keylessApiKeysUrl
		};
		const result = await next({ context: {
			clerkInitialState,
			auth: (opts) => requestState.toAuth(opts)
		} });
		if (requestState.headers) requestState.headers.forEach((value, key) => {
			result.response.headers.append(key, value);
		});
		return result;
	});
};
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		const errString = error?.stack || error?.message || String(error) || "Internal Server Error";
		console.error("Server function error:", errString);
		return new Response(renderErrorPage(errString), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var startInstance = createStart(() => ({ requestMiddleware: [errorMiddleware, clerkMiddleware({
	allowedClockSkewInMs: 12e4,
	clockSkewInMs: 12e4
})] }));
//#endregion
export { startInstance };
