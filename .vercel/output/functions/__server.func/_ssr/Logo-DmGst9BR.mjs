import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { f as require_jsx_runtime } from "../_libs/@clerk/react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Logo-DmGst9BR.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function Logo({ className = "h-9 w-9", showText = true, invert = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `${className} rounded-full overflow-hidden bg-white flex items-center justify-center ring-1 ring-border shrink-0`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/clogo.png",
				alt: "C-Enterprises",
				className: "h-[80%] w-[80%] object-contain" + (invert ? " invert brightness-0" : "")
			})
		}), showText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-lg font-bold tracking-tight",
				children: "C-Enterprises"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
				children: "WorkMonitor"
			})]
		})]
	});
}
//#endregion
export { Logo as t };
