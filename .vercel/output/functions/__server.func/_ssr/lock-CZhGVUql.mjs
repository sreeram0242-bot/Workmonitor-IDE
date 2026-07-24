import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { b as useNavigate, x as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { a as dist_exports } from "./dist-CU7AhyVe.mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Logo } from "./Logo-DmGst9BR.mjs";
import { i as verifyPasscode, n as updatePasscode, t as checkPasscode } from "./settings.functions-BjhY51yE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lock-CZhGVUql.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function LockPage() {
	const navigate = useNavigate();
	const { redirect } = useSearch({ from: "/lock" });
	const { user, profile, loading } = useAuth();
	const clerk = (0, dist_exports.useClerk)();
	const [mode, setMode] = (0, import_react.useState)("loading");
	const [pin, setPin] = (0, import_react.useState)("");
	const [firstPin, setFirstPin] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [shake, setShake] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [pressedKey, setPressedKey] = (0, import_react.useState)(null);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!user) {
			navigate({ to: "/auth" });
			return;
		}
		(async () => {
			try {
				const has = await checkPasscode();
				setMode(has ? "unlock" : "setup");
			} catch (e) {
				console.error(e);
				toast.error("Failed to connect to server. Please try refreshing.");
				setMode("unlock");
			}
		})();
	}, [
		user,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		inputRef.current?.focus();
	}, [mode]);
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			if (busy || success) return;
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			if (e.key >= "0" && e.key <= "9") {
				e.preventDefault();
				setPin((p) => {
					if (p.length >= 4) return p;
					const next = (p + e.key).slice(0, 4);
					if (next.length === 4) setTimeout(() => submit(next), 0);
					return next;
				});
			} else if (e.key === "Backspace") {
				e.preventDefault();
				setPin((p) => p.slice(0, -1));
			} else if (e.key === "Escape") {
				e.preventDefault();
				setPin("");
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		busy,
		success,
		mode,
		firstPin
	]);
	function finish() {
		if (user) sessionStorage.setItem(`wm_unlocked:${user.id}`, "1");
		navigate({
			to: redirect || "/",
			replace: true
		});
	}
	async function handleForgot() {
		if (!confirm("Reset your passcode? You will be signed out and asked to set a new PIN after signing in again.")) return;
		try {
			await updatePasscode({ data: "" });
		} catch {}
		if (user) sessionStorage.removeItem(`wm_unlocked:${user.id}`);
		await clerk.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	}
	async function submit(value) {
		if (busy) return;
		setBusy(true);
		try {
			if (mode === "unlock") {
				if (!await verifyPasscode({ data: value })) {
					setShake(true);
					setTimeout(() => setShake(false), 500);
					toast.error(`Incorrect passcode`);
					setTimeout(() => setPin(""), 260);
					return;
				}
				setSuccess(true);
				setTimeout(finish, 480);
			} else if (mode === "setup") {
				setFirstPin(value);
				setTimeout(() => {
					setPin("");
					setMode("confirm");
				}, 220);
			} else if (mode === "confirm") {
				if (value !== firstPin) {
					setShake(true);
					setTimeout(() => setShake(false), 500);
					toast.error("Passcodes don't match");
					setTimeout(() => {
						setPin("");
						setFirstPin("");
						setMode("setup");
					}, 400);
					return;
				}
				await updatePasscode({ data: value });
				setSuccess(true);
				toast.success("Passcode set");
				setTimeout(finish, 480);
			}
		} catch (err) {
			toast.error(err.message ?? "Something went wrong");
			setPin("");
		} finally {
			setBusy(false);
		}
	}
	function onChange(v) {
		const clean = v.replace(/\D/g, "").slice(0, 4);
		setPin(clean);
		if (clean.length === 4) submit(clean);
	}
	const title = mode === "unlock" ? "Enter your passcode" : mode === "setup" ? "Create a 4-digit passcode" : mode === "confirm" ? "Confirm your passcode" : "";
	const displayName = profile?.full_name || user?.email || "";
	const subtitle = mode === "unlock" ? `Welcome back, ${displayName}` : mode === "setup" ? "You'll use this every time you sign in" : mode === "confirm" ? "Enter the same 4 digits again" : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-white p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `animate-pin-card-in relative w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_30px_80px_-20px_rgba(15,27,61,0.18)] ${shake ? "animate-pin-shake" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-x-0 -top-16 h-40 bg-[radial-gradient(closest-side,rgba(59,130,246,0.18),transparent_70%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mb-6 flex flex-col items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
						showText: false,
						className: "h-14 w-14"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-pin-mode-swap text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-xl font-semibold text-slate-900",
							children: success ? "Verified successfully" : title
						}), !success && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-slate-500",
							children: subtitle
						})]
					}, mode + (success ? "-ok" : ""))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mb-6 flex min-h-[68px] items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `flex gap-3 transition-all duration-500 ease-[cubic-bezier(.2,.9,.3,1.2)] ${success ? "scale-75 opacity-0 blur-[2px]" : pin.length === 4 ? "animate-pin-boxes-sweep rounded-2xl" : ""}`,
						children: [
							0,
							1,
							2,
							3
						].map((i) => {
							const filled = pin.length > i;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `relative flex h-14 w-12 items-center justify-center rounded-xl border text-xl font-semibold text-slate-900 transition-colors duration-200 ${filled ? "border-blue-500 bg-blue-50 animate-pin-box-glow" : "border-slate-200 bg-slate-50"}`,
								children: filled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "animate-pin-box-fill",
									children: pin[i]
								}, pin[i])
							}, i);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(.2,.9,.3,1.4)] ${success ? "scale-100 opacity-100" : "scale-50 opacity-0"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500 bg-blue-50 shadow-[0_0_30px_-4px_rgba(59,130,246,0.55)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 24 24",
								className: "h-9 w-9",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M5 12.5l4 4 10-10",
									fill: "none",
									stroke: "#3b82f6",
									strokeWidth: "2.5",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									className: success ? "animate-pin-check-draw" : ""
								})
							})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					value: pin,
					onChange: (e) => onChange(e.target.value),
					inputMode: "none",
					readOnly: true,
					pattern: "[0-9]*",
					autoComplete: "one-time-code",
					disabled: busy || mode === "loading",
					className: "sr-only",
					"aria-label": "Passcode"
				}),
				!success && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `animate-pin-fade-up grid grid-cols-3 gap-3`,
					children: [
						"1",
						"2",
						"3",
						"4",
						"5",
						"6",
						"7",
						"8",
						"9",
						"reset",
						"0",
						"⌫"
					].map((k, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !k || busy,
						onClick: () => {
							if (!k) return;
							setPressedKey(idx);
							setTimeout(() => setPressedKey((p) => p === idx ? null : p), 220);
							if (k === "reset") {
								setPin("");
								if (mode === "confirm") {
									setFirstPin("");
									setMode("setup");
								}
								return;
							}
							if (k === "⌫") {
								setPin((p) => p.slice(0, -1));
								return;
							}
							if (pin.length >= 4) return;
							const next = (pin + k).slice(0, 4);
							setPin(next);
							if (next.length === 4) submit(next);
						},
						className: `h-14 rounded-2xl font-medium transition-all duration-150 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 ${k === "reset" ? `text-xs uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 active:scale-90 ${pressedKey === idx ? "animate-pin-key-press" : ""}` : k ? `text-xl text-slate-900 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-400 active:scale-90 ${pressedKey === idx ? "animate-pin-key-press" : ""}` : "invisible"}`,
						children: k === "reset" ? "Reset" : k
					}, idx))
				}),
				mode === "unlock" && !success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-6 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleForgot,
						className: "text-slate-500 hover:text-blue-600",
						children: "Forgot passcode?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: async () => {
							if (user) sessionStorage.removeItem(`wm_unlocked:${user.id}`);
							await clerk.signOut();
							navigate({ to: "/auth" });
						},
						className: "text-slate-500 hover:text-slate-900",
						children: "Sign out"
					})]
				})
			]
		})
	});
}
//#endregion
export { LockPage as component };
