import { N as getEnvVariable, t as createClerkClient } from "../_libs/clerk__backend+clerk__shared.mjs";
import { t as getPublicEnvVariables } from "./env-ChQqCZZi.mjs";
import { o as apiUrlFromPublishableKey } from "../_libs/clerk__shared.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clerkClient-CmX8gpIv.js
var commonEnvs = () => {
	const publicEnvs = getPublicEnvVariables();
	return {
		CLERK_JS_VERSION: publicEnvs.clerkJsVersion,
		CLERK_JS_URL: publicEnvs.clerkJsUrl,
		CLERK_UI_URL: publicEnvs.clerkUIUrl,
		CLERK_UI_VERSION: publicEnvs.clerkUIVersion,
		PREFETCH_UI: publicEnvs.prefetchUI,
		PUBLISHABLE_KEY: publicEnvs.publishableKey,
		DOMAIN: publicEnvs.domain,
		PROXY_URL: publicEnvs.proxyUrl,
		IS_SATELLITE: publicEnvs.isSatellite,
		SIGN_IN_URL: publicEnvs.signInUrl,
		SIGN_UP_URL: publicEnvs.signUpUrl,
		TELEMETRY_DISABLED: publicEnvs.telemetryDisabled,
		TELEMETRY_DEBUG: publicEnvs.telemetryDebug,
		API_VERSION: getEnvVariable("CLERK_API_VERSION") || "v1",
		SECRET_KEY: getEnvVariable("CLERK_SECRET_KEY"),
		MACHINE_SECRET_KEY: getEnvVariable("CLERK_MACHINE_SECRET_KEY"),
		ENCRYPTION_KEY: getEnvVariable("CLERK_ENCRYPTION_KEY"),
		CLERK_JWT_KEY: getEnvVariable("CLERK_JWT_KEY"),
		API_URL: getEnvVariable("CLERK_API_URL") || apiUrlFromPublishableKey(publicEnvs.publishableKey),
		SDK_METADATA: {
			name: "@clerk/tanstack-react-start",
			version: "1.4.22",
			environment: getEnvVariable("NODE_ENV")
		}
	};
};
var clerkClient = (options) => {
	const commonEnv = commonEnvs();
	return createClerkClient({
		secretKey: commonEnv.SECRET_KEY,
		machineSecretKey: commonEnv.MACHINE_SECRET_KEY,
		publishableKey: commonEnv.PUBLISHABLE_KEY,
		apiUrl: commonEnv.API_URL,
		apiVersion: commonEnv.API_VERSION,
		userAgent: `@clerk/tanstack-react-start@1.4.22`,
		proxyUrl: commonEnv.PROXY_URL,
		domain: commonEnv.DOMAIN,
		isSatellite: commonEnv.IS_SATELLITE,
		sdkMetadata: commonEnv.SDK_METADATA,
		telemetry: {
			disabled: commonEnv.TELEMETRY_DISABLED,
			debug: commonEnv.TELEMETRY_DEBUG
		},
		...options
	});
};
//#endregion
export { commonEnvs as n, clerkClient as t };
