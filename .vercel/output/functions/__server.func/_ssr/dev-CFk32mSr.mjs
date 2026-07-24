import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BvUNkJzB.mjs";
import { I as LoaderCircle, L as ListChecks, M as MessageSquare, W as Ghost, a as UsersRound, d as Terminal, k as PartyPopper, m as Sparkles, t as Zap, w as Radio } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { r as fetchDevStats } from "./admin.functions-B2jusfrQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dev-CFk32mSr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function DevConsole() {
	const { profile, user, loading } = useAuth();
	const [stats, setStats] = (0, import_react.useState)({
		users: 0,
		tasks: 0,
		messages: 0,
		approved: 0
	});
	const [online, setOnline] = (0, import_react.useState)([]);
	const [broadcastMsg, setBroadcastMsg] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const [ghost, setGhost] = (0, import_react.useState)(false);
	const [log, setLog] = (0, import_react.useState)([]);
	const isDev = profile?.badge === "Developer";
	(0, import_react.useEffect)(() => {
		if (!isDev || !user) return;
		(async () => {
			try {
				const data = await fetchDevStats();
				setStats(data);
			} catch (e) {
				console.error(e);
			}
		})();
		const syncPresence = (rows) => {
			setOnline(rows.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || "")));
		};
		syncPresence(window.__workmonitorPresence ?? []);
		const onPresence = (event) => syncPresence(event.detail ?? []);
		window.addEventListener("workmonitor-presence", onPresence);
		pushLog("Live presence stream connected");
		return () => window.removeEventListener("workmonitor-presence", onPresence);
	}, [isDev, user?.id]);
	function pushLog(line) {
		setLog((l) => [`[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] ${line}`, ...l].slice(0, 40));
	}
	async function sendBroadcast(kind) {
		if (kind === "toast" && !broadcastMsg.trim()) return;
		setSending(true);
		setTimeout(() => {
			pushLog(kind === "toast" ? `Broadcast toast: "${broadcastMsg.trim()}" (disabled)` : "Confetti storm launched (disabled)");
			if (kind === "toast") setBroadcastMsg("");
			setSending(false);
			toast.success(kind === "toast" ? "Broadcast sent (mock)" : "Confetti launched (mock)");
		}, 500);
	}
	function toggleGhost() {
		const next = !ghost;
		setGhost(next);
		if (next) {
			document.documentElement.classList.add("dev-ghost-mode");
			toast.success("Ghost mode ON — presence hidden");
		} else {
			document.documentElement.classList.remove("dev-ghost-mode");
			toast.message("Ghost mode OFF");
		}
	}
	const uptime = (0, import_react.useMemo)(() => (/* @__PURE__ */ new Date()).toLocaleString(), []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-16 text-center text-sm text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "inline h-4 w-4 animate-spin" })
	});
	if (!isDev) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-6 overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-br from-[oklch(0.18_0.08_265)] via-[oklch(0.24_0.1_265)] to-[oklch(0.32_0.14_260)] p-6 text-white shadow-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[oklch(0.7_0.2_260)]/30 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[oklch(0.65_0.22_290)]/30 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "h-3.5 w-3.5" }), " Developer Console"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-2 font-display text-3xl font-bold",
								children: ["Welcome, ", profile?.full_name?.split(" ")[0]]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-white/80",
								children: [
									"Restricted zone. Session opened ",
									uptime,
									"."
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "workmonitor-glass-badge badge-shine inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Developer"]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-4",
				children: [
					{
						label: "Users",
						value: stats.users,
						icon: UsersRound
					},
					{
						label: "Tasks",
						value: stats.tasks,
						icon: ListChecks
					},
					{
						label: "Messages",
						value: stats.messages,
						icon: MessageSquare
					},
					{
						label: "Approved",
						value: stats.approved,
						icon: Sparkles
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "transition hover:-translate-y-0.5 hover:shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-xs font-medium text-muted-foreground",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-4 w-4 text-brand-accent" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-3xl font-bold",
						children: s.value
					}) })]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-4 w-4 text-brand-accent" }), " Global broadcast"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: broadcastMsg,
								onChange: (e) => setBroadcastMsg(e.target.value),
								placeholder: "Announce something to every open screen…",
								rows: 3,
								maxLength: 240
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => sendBroadcast("toast"),
										disabled: sending || !broadcastMsg.trim(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "mr-2 h-4 w-4" }), " Send to everyone"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => sendBroadcast("confetti"),
										disabled: sending,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartyPopper, { className: "mr-2 h-4 w-4" }), " Confetti storm"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										onClick: toggleGhost,
										className: ghost ? "text-brand-accent" : "",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ghost, { className: "mr-2 h-4 w-4" }),
											" Ghost mode ",
											ghost ? "on" : "off"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Broadcasts appear as toasts on every open browser tab in real time."
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Live presence"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: online.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-6 text-center text-sm text-muted-foreground",
					children: "No one else here."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: online.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative flex h-2 w-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-emerald-500" })]
							}), p.full_name]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-[10px] text-muted-foreground",
							children: p.page
						})]
					}, p.user_id + p.at))
				}) })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "h-4 w-4" }), " Console log"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-64 overflow-auto rounded-md bg-[oklch(0.15_0.02_265)] p-3 font-mono text-[11px] leading-relaxed text-emerald-300",
					children: log.length === 0 ? "// idle" : log.join("\n")
				}) })]
			})
		]
	});
}
//#endregion
export { DevConsole as component };
