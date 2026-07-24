import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { b as useNavigate, p as Outlet, u as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { a as dist_exports } from "./dist-CU7AhyVe.mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
import { _ as fetchTeam, h as fetchTasksForAdmin, v as getCachedAdminTasks, y as getCachedTeam } from "./tasks-CQ010v_B.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { B as Keyboard, L as ListChecks, M as MessageSquare, N as Menu, P as LogOut, T as Plus, _ as Settings, b as Search, ct as ChartColumn, d as Terminal, et as CircleCheck, ft as Bell, g as ShieldCheck, i as Users, m as Sparkles, mt as ArrowRight, n as X, o as User, s as UserPlus, st as CheckCheck, tt as CircleAlert, u as Trash2, ut as Calendar, z as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog-BFvnb9Z1.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { n as fetchNotifications, r as markNotificationsRead, t as clearNotifications } from "./notify.functions-D_BPJVUt.mjs";
import { t as useRealtimeSubscription } from "./use-realtime-DP3QdmcJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DropdownMenuTrigger, n as DropdownMenuContent, o as ScrollArea, t as DropdownMenu } from "./dropdown-menu-Druen1KK.mjs";
import { t as Logo } from "./Logo-DmGst9BR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BEGztGbp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function relTime(iso) {
	const then = new Date(iso).getTime();
	const diff = Math.max(0, Date.now() - then);
	const s = Math.floor(diff / 1e3);
	if (s < 45) return "just now";
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	if (d < 7) return `${d}d ago`;
	return new Date(iso).toLocaleDateString([], {
		month: "short",
		day: "numeric"
	});
}
function typeIcon(type) {
	const t = type.toLowerCase();
	if (t.includes("task")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-3.5 w-3.5 text-brand" });
	if (t.includes("message") || t.includes("chat") || t.includes("mention")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3.5 w-3.5 text-brand-accent" });
	if (t.includes("member") || t.includes("group") || t.includes("invite")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5 text-emerald-600" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 text-amber-600" });
}
function NotificationsBell() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [items, setItems] = (0, import_react.useState)([]);
	const [tab, setTab] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	async function reload() {
		if (!user) return;
		try {
			const data = await fetchNotifications();
			setItems(data);
		} catch (e) {
			console.error(e);
		}
	}
	(0, import_react.useEffect)(() => {
		if (!user) return;
		reload();
	}, [user?.id]);
	useRealtimeSubscription("notifications", `user-${user?.id}`, () => {
		reload();
	});
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const id = setInterval(() => setItems((prev) => [...prev]), 6e4);
		return () => clearInterval(id);
	}, [open]);
	const unread = items.filter((i) => !i.read).length;
	const visible = (0, import_react.useMemo)(() => tab === "unread" ? items.filter((i) => !i.read) : items, [items, tab]);
	async function markAllRead() {
		if (!user || unread === 0) return;
		setItems((prev) => prev.map((i) => ({
			...i,
			read: true
		})));
		try {
			await markNotificationsRead({});
		} catch (e) {
			console.error(e);
		}
	}
	async function clearAll() {
		if (!user || items.length === 0) return;
		setItems([]);
		try {
			await clearNotifications();
		} catch (e) {
			console.error(e);
		}
	}
	async function openItem(item) {
		if (!item.read) {
			setItems((prev) => prev.map((i) => i.id === item.id ? {
				...i,
				read: true
			} : i));
			try {
				await markNotificationsRead({ data: { id: item.id } });
			} catch (e) {
				console.error(e);
			}
		}
		if (item.link) {
			setOpen(false);
			navigate({ to: item.link });
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "icon",
				variant: "ghost",
				"aria-label": `Notifications${unread > 0 ? `, ${unread} unread` : ""}`,
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground",
					children: unread > 9 ? "9+" : unread
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
			align: "end",
			className: "w-[22rem] p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: "Notifications"
						}), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand",
							children: [unread, " new"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: markAllRead,
							className: "h-7 px-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "mr-1 h-3 w-3" }), " Read all"]
						}), items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: clearAll,
							className: "h-7 px-2 text-xs text-muted-foreground hover:text-destructive",
							"aria-label": "Clear all notifications",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 border-b border-border bg-muted/30 px-2 py-1.5",
					children: ["all", "unread"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(k),
						className: `rounded-md px-2.5 py-1 text-xs font-medium transition ${tab === k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
						children: k === "all" ? "All" : `Unread${unread > 0 ? ` · ${unread}` : ""}`
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "max-h-96",
					children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center gap-2 p-8 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-6 w-6 text-muted-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: tab === "unread" ? "You're all caught up." : "No notifications yet."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border",
						children: visible.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => openItem(n),
							className: `block w-full px-3 py-2.5 text-left text-sm transition hover:bg-accent ${!n.read ? "bg-brand/[0.04]" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted",
										children: typeIcon(n.type)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `text-sm leading-snug ${!n.read ? "font-medium text-foreground" : "text-foreground/80"}`,
											children: n.message
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												title: new Date(n.created_at).toLocaleString(),
												children: relTime(n.created_at)
											}), n.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-brand-accent",
												children: "· Open"
											})]
										})]
									}),
									!n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-accent",
										"aria-label": "Unread"
									})
								]
							})
						}, n.id))
					})
				}),
				items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-3 py-1.5 text-center text-[10px] text-muted-foreground",
					children: ["Showing latest ", items.length]
				})
			]
		})]
	});
}
function GlobalSearch() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [team, setTeam] = (0, import_react.useState)([]);
	const navigate = useNavigate();
	const { role } = useAuth();
	const clerk = (0, dist_exports.useClerk)();
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((v) => !v);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setTasks(getCachedAdminTasks() ?? []);
		setTeam(getCachedTeam() ?? []);
		if (role === "admin") fetchTasksForAdmin().then(setTasks).catch(() => {});
		fetchTeam().then(setTeam).catch(() => {});
	}, [open, role]);
	const query = q.trim().toLowerCase();
	const results = (0, import_react.useMemo)(() => {
		if (!query) return {
			tasks: [],
			people: []
		};
		return {
			tasks: tasks.filter((t) => t.title.toLowerCase().includes(query) || (t.description ?? "").toLowerCase().includes(query) || (t.tags ?? []).some((tag) => tag.toLowerCase().includes(query))).slice(0, 8),
			people: team.filter((p) => p.full_name.toLowerCase().includes(query) || p.position.toLowerCase().includes(query) || (p.badge ?? "").toLowerCase().includes(query)).slice(0, 6)
		};
	}, [
		query,
		tasks,
		team
	]);
	const go = (to) => {
		setOpen(false);
		setQ("");
		navigate({ to });
	};
	const isAdmin = role === "admin";
	const actions = (0, import_react.useMemo)(() => {
		const list = [];
		if (isAdmin) {
			list.push({
				id: "new-task",
				label: "New task",
				hint: "Assign to a teammate",
				icon: Plus,
				run: () => go("/admin/tasks?new=1")
			});
			list.push({
				id: "team",
				label: "Manage team",
				icon: Users,
				run: () => go("/admin/team")
			});
			list.push({
				id: "tasks",
				label: "Tasks",
				icon: CircleCheck,
				run: () => go("/admin/tasks")
			});
			list.push({
				id: "calendar",
				label: "Calendar",
				icon: Calendar,
				run: () => go("/admin/calendar")
			});
			list.push({
				id: "analytics",
				label: "Analytics",
				icon: ChartColumn,
				run: () => go("/admin/analytics")
			});
		} else list.push({
			id: "my-tasks",
			label: "My tasks",
			icon: ListChecks,
			run: () => go("/app")
		});
		list.push({
			id: "chat",
			label: "Open chat",
			icon: MessageSquare,
			run: () => go("/chat")
		});
		list.push({
			id: "settings",
			label: "Settings",
			icon: Settings,
			run: () => go("/settings")
		});
		list.push({
			id: "signout",
			label: "Sign out",
			icon: LogOut,
			run: async () => {
				setOpen(false);
				await clerk.signOut();
				navigate({ to: "/auth" });
			}
		});
		return list;
	}, [isAdmin]);
	const filteredActions = (0, import_react.useMemo)(() => {
		if (!query) return actions;
		return actions.filter((a) => a.label.toLowerCase().includes(query));
	}, [actions, query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen(true),
			className: "hidden items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-secondary sm:inline-flex",
			"aria-label": "Search",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search…" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
					className: "ml-2 rounded border bg-background px-1.5 py-0.5 text-[10px] font-mono",
					children: "⌘K"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setOpen(true),
			className: "rounded-lg p-2 hover:bg-muted sm:hidden",
			"aria-label": "Search",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-xl p-0 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						autoFocus: true,
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search tasks, people, tags…",
						className: "border-0 shadow-none focus-visible:ring-0"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[60vh] overflow-y-auto p-2 text-sm",
					children: [
						filteredActions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: query ? "Actions" : "Quick actions"
							}), filteredActions.map((a) => {
								const Icon = a.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: a.run,
									className: "group flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate font-medium",
												children: a.label
											}), a.hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-xs text-muted-foreground",
												children: a.hint
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-muted-foreground opacity-0 transition group-hover:opacity-100" })
									]
								}, a.id);
							})]
						}),
						query && results.tasks.length === 0 && results.people.length === 0 && filteredActions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-3 py-6 text-center text-xs text-muted-foreground",
							children: "No results."
						}),
						results.tasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Tasks"
							}), results.tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => go(role === "admin" ? "/admin/tasks" : "/app"),
								className: "flex w-full items-start gap-2 rounded-md px-2 py-2 text-left hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "mt-0.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate font-medium",
										children: t.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "truncate text-xs text-muted-foreground",
										children: [
											t.status,
											" · ",
											t.priority,
											t.deadline ? ` · ${new Date(t.deadline).toLocaleDateString()}` : ""
										]
									})]
								})]
							}, t.id))]
						}),
						results.people.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "People"
						}), results.people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => go(role === "admin" ? "/admin/team" : "/chat"),
							className: "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-[10px] font-semibold",
								children: p.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.avatar_url,
									alt: "",
									className: "h-full w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-medium",
									children: p.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate text-xs text-muted-foreground",
									children: [p.position, p.badge ? ` · ${p.badge}` : ""]
								})]
							})]
						}, p.id))] })
					]
				})]
			})
		})
	] });
}
function Keys({ keys }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-1",
		children: keys.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
			className: "rounded border border-border/80 bg-secondary/60 px-2 py-0.5 text-[11px] font-mono text-foreground shadow-sm",
			children: k
		}, i))
	});
}
function isTypingTarget(el) {
	const n = el;
	if (!n) return false;
	const tag = n.tagName;
	return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || n.isContentEditable === true;
}
function ShortcutsHelp() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const { role } = useAuth();
	const isAdmin = role === "admin";
	(0, import_react.useEffect)(() => {
		let awaitingG = false;
		let gTimer = null;
		function clearG() {
			awaitingG = false;
			if (gTimer) {
				clearTimeout(gTimer);
				gTimer = null;
			}
		}
		function onKey(e) {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			if (isTypingTarget(e.target)) return;
			if (e.key === "?" || e.shiftKey && e.key === "/") {
				e.preventDefault();
				setOpen((v) => !v);
				return;
			}
			if (awaitingG) {
				const k = e.key.toLowerCase();
				let to = null;
				if (k === "d") to = isAdmin ? "/admin" : "/app";
				else if (k === "t") to = isAdmin ? "/admin/tasks" : "/app";
				else if (k === "c") to = "/chat";
				else if (k === "s") to = "/settings";
				else if (k === "a" && isAdmin) to = "/admin/analytics";
				else if (k === "m" && isAdmin) to = "/admin/team";
				else if (k === "t" && isAdmin) to = "/admin/tasks";
				else if (k === "l" && isAdmin) to = "/admin/calendar";
				clearG();
				if (to) {
					e.preventDefault();
					navigate({ to });
				}
				return;
			}
			if (e.key.toLowerCase() === "g") {
				awaitingG = true;
				gTimer = setTimeout(clearG, 1200);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
			if (gTimer) clearTimeout(gTimer);
		};
	}, [isAdmin, navigate]);
	const general = [
		{
			keys: ["?"],
			label: "Show this help"
		},
		{
			keys: ["⌘", "K"],
			label: "Open global search"
		},
		{
			keys: ["Esc"],
			label: "Close dialog / cancel"
		}
	];
	const nav = [
		{
			keys: ["G", "D"],
			label: "Go to Dashboard"
		},
		{
			keys: ["G", "T"],
			label: isAdmin ? "Go to Tasks" : "Go to My Tasks"
		},
		{
			keys: ["G", "C"],
			label: "Go to Chat"
		},
		{
			keys: ["G", "S"],
			label: "Go to Settings"
		},
		...isAdmin ? [
			{
				keys: ["G", "M"],
				label: "Go to Team"
			},
			{
				keys: ["G", "T"],
				label: "Go to Tasks"
			},
			{
				keys: ["G", "L"],
				label: "Go to Calendar"
			},
			{
				keys: ["G", "A"],
				label: "Go to Analytics"
			}
		] : []
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => setOpen(true),
		className: "hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex",
		"aria-label": "Keyboard shortcuts",
		title: "Keyboard shortcuts (?)",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "h-4 w-4" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "h-4 w-4" }), " Keyboard shortcuts"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5 text-sm",
				children: [[
					{
						title: "General",
						items: general
					},
					{
						title: "Navigation",
						items: nav
					},
					{
						title: "Chat",
						items: [
							{
								keys: ["Enter"],
								label: "Send message"
							},
							{
								keys: ["Shift", "Enter"],
								label: "New line"
							},
							{
								keys: ["@"],
								label: "Mention teammate"
							}
						]
					}
				].map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: section.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border/60 overflow-hidden rounded-lg border border-border/60",
					children: section.items.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keys, { keys: s.keys })]
					}, i))
				})] }, section.title)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Tip: press",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "rounded border bg-secondary/60 px-1.5 py-0.5 text-[10px] font-mono",
							children: "G"
						}),
						" ",
						"then a letter to jump between pages."
					]
				})]
			})]
		})
	})] });
}
function AppShell({ children }) {
	const { role, profile, user } = useAuth();
	const clerk = (0, dist_exports.useClerk)();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (r) => r.location.pathname });
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user) import("./tasks-CQ010v_B.mjs").then((n) => n.E).then(({ fetchTeam, fetchTasksForAdmin, fetchTasksForUser }) => {
			fetchTeam().catch(() => {});
			if (role === "admin" || pathname.startsWith("/admin")) fetchTasksForAdmin().catch(() => {});
			else fetchTasksForUser(user.id).catch(() => {});
		});
	}, [
		user,
		role,
		pathname
	]);
	const isAdmin = role === "admin" || pathname.startsWith("/admin");
	const isDeveloper = profile?.badge === "Developer";
	const baseNav = isAdmin ? [
		{
			to: "/admin",
			label: "Overview",
			icon: LayoutDashboard,
			desc: "Dashboard & analytics"
		},
		{
			to: "/admin/tasks",
			label: "Tasks",
			icon: ListChecks,
			desc: "Assign & review"
		},
		{
			to: "/admin/calendar",
			label: "Calendar",
			icon: Calendar,
			desc: "Deadline view"
		},
		{
			to: "/admin/team",
			label: "Team",
			icon: Users,
			desc: "Members & roles"
		},
		{
			to: "/chat",
			label: "Chat",
			icon: MessageSquare,
			desc: "Messages & groups"
		},
		{
			to: "/settings",
			label: "Settings",
			icon: Settings,
			desc: "Profile photo"
		}
	] : [
		{
			to: "/overview",
			label: "Overview",
			icon: LayoutDashboard,
			desc: "Your snapshot"
		},
		{
			to: "/app",
			label: "My Tasks",
			icon: ListChecks,
			desc: "Today's checklist"
		},
		{
			to: "/chat",
			label: "Chat",
			icon: MessageSquare,
			desc: "Messages & groups"
		},
		{
			to: "/settings",
			label: "Settings",
			icon: Settings,
			desc: "Profile photo"
		}
	];
	const nav = isDeveloper ? [...baseNav, {
		to: "/dev",
		label: "Dev Console",
		icon: Terminal,
		desc: "Restricted zone"
	}] : baseNav;
	async function signOut() {
		await clerk.signOut();
		toast.success("Signed out");
		navigate({ to: "/auth" });
	}
	const initials = (profile?.full_name || user?.email || "?").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
	const SidebarInner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-full flex-col overflow-hidden bg-sidebar-mesh text-sidebar-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 sidebar-noise-overlay opacity-40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 right-0 w-px bg-border/70" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center justify-between px-5 pb-5 pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					onClick: () => setMobileOpen(false),
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
						showText: false,
						className: "h-10 w-10"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-base font-semibold tracking-wide",
							children: "C-Enterprises"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60",
							children: "WorkMonitor"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "rounded-md p-1 text-sidebar-foreground/70 hover:bg-black/5 md:hidden",
					onClick: () => setMobileOpen(false),
					"aria-label": "Close menu",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-5 mb-4 flex items-center gap-2 rounded-lg border border-black/5 bg-white/60 px-3 py-2 shadow-sm backdrop-blur",
				children: [isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-[oklch(0.28_0.09_265)]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-[oklch(0.5_0.16_260)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: isAdmin ? "Admin Portal" : "User Portal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-sidebar-foreground/60",
						children: "Real-time workspace"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative px-5 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/50",
				children: "Workspace"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "relative flex-1 space-y-1 overflow-hidden px-3",
				children: nav.map((item) => {
					const active = pathname === item.to || item.to !== "/admin" && pathname.startsWith(item.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						preload: "intent",
						onClick: () => setMobileOpen(false),
						className: `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${active ? "bg-white text-sidebar-foreground shadow-md shadow-black/5 ring-1 ring-black/5" : "text-sidebar-foreground/75 hover:bg-white/60 hover:text-sidebar-foreground"}`,
						children: [
							active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[oklch(0.28_0.09_265)]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `flex h-8 w-8 items-center justify-center rounded-lg transition ${active ? "bg-[oklch(0.28_0.09_265)] text-white" : "bg-black/5 text-sidebar-foreground/70 group-hover:bg-black/10 group-hover:text-sidebar-foreground"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex min-w-0 flex-col leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: item.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-[10px] text-sidebar-foreground/50",
									children: item.desc
								})]
							})
						]
					}, item.to);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative m-3 mt-4 rounded-xl border border-black/5 bg-white/70 p-3 shadow-sm backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)] text-xs font-semibold text-white",
							children: profile?.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: profile.avatar_url,
								alt: "",
								className: "h-full w-full object-cover"
							}) : initials
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-medium",
								children: profile?.full_name || user?.email
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-[10px] text-sidebar-foreground/60",
								children: profile?.position || (isAdmin ? "Admin" : "Employee")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: signOut,
							className: "rounded-md p-1.5 text-sidebar-foreground/70 transition hover:bg-black/5 hover:text-sidebar-foreground",
							"aria-label": "Sign out",
							title: "Sign out",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
						})
					]
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden w-72 flex-col md:flex",
				children: SidebarInner
			}),
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in",
					onClick: () => setMobileOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "absolute inset-y-0 left-0 flex w-72 flex-col shadow-2xl animate-slide-in-left",
					children: SidebarInner
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: `sticky top-0 z-30 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 bg-background/70 px-4 py-3 backdrop-blur-xl sm:px-6 ${pathname === "/chat" ? "grid md:hidden" : "grid"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMobileOpen(true),
								className: "rounded-lg p-2 hover:bg-muted md:hidden",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {
									showText: false,
									className: "h-8 w-8"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-sm font-semibold",
									children: profile?.full_name || user?.email
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden rounded-full border border-border/70 bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block",
									children: isAdmin ? "Admin" : "User"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-xs text-muted-foreground",
								children: profile?.position || (isAdmin ? "Administrator" : "Team member")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalSearch, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutsHelp, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsBell, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: signOut,
									className: "rounded-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 sm:mr-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Sign out"
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "relative min-w-0 flex-1 overflow-hidden bg-white",
					"aria-busy": !profile && !user,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: pathname === "/chat" ? "page-view relative h-full" : "page-view relative mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8",
						children
					}, pathname)
				})]
			})
		]
	});
}
function AuthenticatedLayout() {
	const { loading, user } = useAuth();
	(0, import_react.useEffect)(() => {
		if (!loading && !user) window.location.href = "/auth";
	}, [loading, user]);
	const userId = user?.id;
	(0, import_react.useEffect)(() => {
		if (!userId) return;
		const isMobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
		const markBackgrounded = () => {
			sessionStorage.setItem(`wm_bg_at:${userId}`, String(Date.now()));
			sessionStorage.removeItem(`wm_unlocked:${userId}`);
		};
		const relockNow = () => sessionStorage.removeItem(`wm_unlocked:${userId}`);
		if (isMobile) {
			const onVis = () => {
				if (document.visibilityState === "hidden") markBackgrounded();
			};
			document.addEventListener("visibilitychange", onVis);
			window.addEventListener("pagehide", markBackgrounded);
			return () => {
				document.removeEventListener("visibilitychange", onVis);
				window.removeEventListener("pagehide", markBackgrounded);
			};
		}
		const IDLE_MS = 900 * 1e3;
		let timer;
		const reset = () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				relockNow();
				window.location.reload();
			}, IDLE_MS);
		};
		const events = [
			"mousemove",
			"keydown",
			"mousedown",
			"touchstart",
			"scroll"
		];
		events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
		reset();
		return () => {
			clearTimeout(timer);
			events.forEach((e) => window.removeEventListener(e, reset));
		};
	}, [userId]);
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center",
		children: "Loading..."
	});
	const unlocked = typeof window !== "undefined" ? sessionStorage.getItem(`wm_unlocked:${userId}`) : null;
	const backgroundedAt = typeof window !== "undefined" ? Number(sessionStorage.getItem(`wm_bg_at:${userId}`) || "0") : 0;
	const withinGrace = backgroundedAt > 0 && Date.now() - backgroundedAt < 6e4;
	if (typeof window !== "undefined" && !unlocked && !withinGrace) {
		window.location.href = `/lock?redirect=${encodeURIComponent(window.location.pathname)}`;
		return null;
	}
	if (typeof window !== "undefined" && !unlocked && withinGrace) {
		sessionStorage.setItem(`wm_unlocked:${userId}`, "1");
		sessionStorage.removeItem(`wm_bg_at:${userId}`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
function RouteComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthenticatedLayout, {});
}
//#endregion
export { RouteComponent as component };
