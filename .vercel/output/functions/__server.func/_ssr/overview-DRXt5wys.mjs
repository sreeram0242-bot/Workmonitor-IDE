import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
import { b as getCachedUserTasks, g as fetchTasksForUser, w as statusColor, x as priorityColor } from "./tasks-CQ010v_B.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BvUNkJzB.mjs";
import { L as ListChecks, Q as Clock, et as CircleCheck, l as TriangleAlert, mt as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as Cell, l as ResponsiveContainer, s as Pie, t as PieChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/overview-DRXt5wys.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function UserOverview() {
	const { user, role, profile, loading } = useAuth();
	const [tasks, setTasks] = (0, import_react.useState)((user ? getCachedUserTasks(user.id) : null) ?? []);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		fetchTasksForUser(user.id).then(setTasks);
	}, [user?.id]);
	const now = Date.now();
	const endOfToday = new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)).getTime() + 1440 * 60 * 1e3;
	const open = tasks.filter((t) => t.status === "pending" || t.status === "revision");
	const overdue = open.filter((t) => t.deadline && new Date(t.deadline).getTime() < now).length;
	const dueToday = open.filter((t) => {
		if (!t.deadline) return false;
		const d = new Date(t.deadline).getTime();
		return d >= now && d < endOfToday;
	}).length;
	const inReview = tasks.filter((t) => t.status === "completed").length;
	const approvedTotal = tasks.filter((t) => t.status === "approved").length;
	const stats = [
		{
			label: "Overdue",
			value: overdue,
			icon: TriangleAlert,
			tone: overdue > 0 ? "text-red-600" : "text-muted-foreground"
		},
		{
			label: "Due today",
			value: dueToday,
			icon: Clock,
			tone: dueToday > 0 ? "text-amber-600" : "text-muted-foreground"
		},
		{
			label: "Awaiting review",
			value: inReview,
			icon: ListChecks,
			tone: "text-brand-accent"
		},
		{
			label: "Approved",
			value: approvedTotal,
			icon: CircleCheck,
			tone: "text-emerald-600"
		}
	];
	const statusData = (0, import_react.useMemo)(() => [
		{
			name: "Pending",
			value: tasks.filter((t) => t.status === "pending").length,
			color: "#94a3b8"
		},
		{
			name: "In review",
			value: tasks.filter((t) => t.status === "completed").length,
			color: "#3b82f6"
		},
		{
			name: "Approved",
			value: approvedTotal,
			color: "#10b981"
		},
		{
			name: "Revision",
			value: tasks.filter((t) => t.status === "revision").length,
			color: "#f97316"
		}
	], [tasks, approvedTotal]);
	const upcoming = [...open].filter((t) => t.deadline).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 5);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-16 text-center text-sm text-muted-foreground",
		children: "Loading…"
	});
	if (role === "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/admin" });
	const firstName = profile?.full_name?.split(" ")[0] || "there";
	const hour = (/* @__PURE__ */ new Date()).getHours();
	const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
	const total = tasks.length;
	const completionRate = total > 0 ? Math.round(approvedTotal / total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-3xl font-bold",
					children: [
						greet,
						", ",
						firstName
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Your personal workspace snapshot."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/app",
					className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-muted",
					children: ["Open my tasks ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-4",
				children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "transition hover:-translate-y-0.5 hover:shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between space-y-0 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-xs font-medium text-muted-foreground",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: `h-4 w-4 ${s.tone}` })]
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Upcoming deadlines"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-2",
						children: upcoming.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-8 text-center text-sm text-muted-foreground",
							children: "Nothing scheduled — nice work."
						}) : upcoming.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/app",
							className: "flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2 transition hover:border-brand-accent/40 hover:bg-muted/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: t.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										"Due",
										" ",
										new Date(t.deadline).toLocaleDateString(void 0, {
											month: "short",
											day: "numeric"
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: priorityColor(t.priority),
									children: t.priority
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: statusColor(t.status),
									children: t.status
								})]
							})]
						}, t.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "My status"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex h-64 flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: statusData,
								dataKey: "value",
								nameKey: "name",
								innerRadius: 40,
								outerRadius: 68,
								paddingAngle: 2,
								stroke: "none",
								children: statusData.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: s.color }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "hsl(var(--card))",
								border: "1px solid hsl(var(--border))",
								fontSize: 12,
								borderRadius: 8
							} })] })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center text-xs text-muted-foreground",
						children: [
							"Completion rate:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground",
								children: [completionRate, "%"]
							})
						]
					})]
				})] })]
			})
		]
	});
}
//#endregion
export { UserOverview as component };
