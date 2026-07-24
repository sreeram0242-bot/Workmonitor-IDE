import { o as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { m as Sparkles } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BadgePill-CkoIACtc.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
/**
* Person silhouette icon. When `admin` is true, the same figure is drawn
* with a clear necktie under the collar.
*/
function PersonIcon({ admin, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "12",
				cy: "7",
				r: "4"
			}),
			admin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M9.7 14.8 11.2 16.1",
					strokeWidth: 1.45
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M14.3 14.8 12.8 16.1",
					strokeWidth: 1.45
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 14.2 13.1 15.25 12 16.25 10.9 15.25Z",
					fill: "currentColor",
					stroke: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 16.45 13.35 18.45 12 21 10.65 18.45Z",
					fill: "currentColor",
					stroke: "none"
				})
			] })
		]
	});
}
function BadgePill({ label, className, size = "sm" }) {
	if (!label) return null;
	const isDev = label.trim().toLowerCase() === "developer";
	const sizeCls = size === "xs" ? "gap-0.5 px-1.5 py-[1px] text-[9px]" : "gap-1 px-2 py-0.5 text-[10px]";
	const iconCls = size === "xs" ? "h-2.5 w-2.5" : "h-3 w-3";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("workmonitor-glass-badge relative inline-flex items-center rounded-full font-semibold backdrop-blur overflow-hidden", sizeCls, isDev && "badge-shine", className),
		children: [isDev && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: cn("relative z-10", iconCls) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "relative z-10",
			children: label
		})]
	});
}
//#endregion
export { PersonIcon as n, BadgePill as t };
