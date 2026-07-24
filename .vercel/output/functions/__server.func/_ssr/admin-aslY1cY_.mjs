import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { p as Outlet, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-aslY1cY_.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function AdminGate() {
	const { role } = useAuth();
	if (role && role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/app" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
}
//#endregion
export { AdminGate as component };
