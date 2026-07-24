import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { a as dist_exports } from "./dist-CU7AhyVe.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BDx8PeYO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-BHcLpo1A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var getMyProfile = createServerFn({ method: "GET" }).handler(createSsrRpc("ecb43edc9942f5265a26ac2ab7ec9e5f6bb0b891a5cfd4cd3817af7f283a5b18"));
var AuthContext = (0, import_react.createContext)(null);
var emptyAuthState = {
	loading: true,
	session: null,
	user: null,
	role: null,
	profile: null
};
var cachedAuthState = emptyAuthState;
function useAuthState(initialState) {
	const { isLoaded, user } = (0, dist_exports.useUser)();
	const [state, setState] = (0, import_react.useState)(initialState || cachedAuthState);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		async function hydrate() {
			if (!isLoaded) return;
			if (!user) {
				const nextState = {
					...emptyAuthState,
					loading: false
				};
				cachedAuthState = nextState;
				if (mounted) setState(nextState);
				return;
			}
			try {
				const dbData = await getMyProfile();
				const nextState = {
					loading: false,
					session: { user: { id: user.id } },
					user: {
						id: user.id,
						email: user.primaryEmailAddress?.emailAddress
					},
					role: dbData?.role || "user",
					profile: dbData?.profile || {
						full_name: user.fullName || "New User",
						position: "",
						avatar_url: user.imageUrl
					}
				};
				cachedAuthState = nextState;
				if (mounted) setState(nextState);
			} catch (e) {
				console.error("Failed to fetch profile", e);
				const fallbackState = {
					loading: false,
					session: { user: { id: user.id } },
					user: {
						id: user.id,
						email: user.primaryEmailAddress?.emailAddress
					},
					role: "user",
					profile: {
						full_name: user.fullName || "New User",
						position: "",
						avatar_url: user.imageUrl
					}
				};
				cachedAuthState = fallbackState;
				if (mounted) setState(fallbackState);
			}
		}
		hydrate();
		return () => {
			mounted = false;
		};
	}, [isLoaded, user?.id]);
	return state;
}
function AuthProvider({ children, initialState }) {
	const state = useAuthState(initialState);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: state,
		children
	});
}
function useAuth() {
	const state = (0, import_react.useContext)(AuthContext);
	if (!state) throw new Error("useAuth must be used inside AuthProvider");
	return state;
}
//#endregion
export { useAuth as n, AuthProvider as t };
