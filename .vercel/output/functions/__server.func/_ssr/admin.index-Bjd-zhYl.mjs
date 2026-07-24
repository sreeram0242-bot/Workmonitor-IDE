import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { _ as fetchTeam, h as fetchTasksForAdmin, v as getCachedAdminTasks, w as statusColor, x as priorityColor, y as getCachedTeam } from "./tasks-CQ010v_B.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BvUNkJzB.mjs";
import { L as ListChecks, Q as Clock, X as Download, dt as CalendarRange, et as CircleCheck, i as Users } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog-BFvnb9Z1.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { t as useRealtimeSubscription } from "./use-realtime-DP3QdmcJ.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BHv1JhlL.mjs";
import { a as CartesianGrid, c as Cell, i as XAxis, l as ResponsiveContainer, n as BarChart, o as Bar, r as YAxis, s as Pie, t as PieChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-Bjd-zhYl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function rangeStart(key, customFrom) {
	const now = /* @__PURE__ */ new Date();
	if (key === "all") return null;
	if (key === "custom") return customFrom ? new Date(customFrom) : null;
	const days = key === "7d" ? 7 : key === "30d" ? 30 : 90;
	const d = new Date(now);
	d.setDate(d.getDate() - days);
	d.setHours(0, 0, 0, 0);
	return d;
}
function toCSV(rows) {
	if (rows.length === 0) return "";
	const headers = Object.keys(rows[0]);
	const esc = (v) => {
		const s = v == null ? "" : String(v);
		return /[",\n]/.test(s) ? `"${s.replace(/"/g, "\"\"")}"` : s;
	};
	return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}
function downloadCSV(name, csv) {
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	a.click();
	URL.revokeObjectURL(url);
}
function AdminOverview() {
	const [tasks, setTasks] = (0, import_react.useState)(() => getCachedAdminTasks() ?? []);
	const [team, setTeam] = (0, import_react.useState)(() => getCachedTeam() ?? []);
	const [range, setRange] = (0, import_react.useState)("30d");
	const [customFrom, setCustomFrom] = (0, import_react.useState)("");
	const [customTo, setCustomTo] = (0, import_react.useState)("");
	const [drill, setDrill] = (0, import_react.useState)(null);
	async function reloadTasks() {
		const t = await fetchTasksForAdmin();
		setTasks(t);
	}
	async function reloadAll() {
		const [t, m] = await Promise.all([fetchTasksForAdmin(), fetchTeam()]);
		setTasks(t);
		setTeam(m);
	}
	(0, import_react.useEffect)(() => {
		reloadAll();
	}, []);
	useRealtimeSubscription("tasks", "task-updates", () => {
		reloadTasks();
	});
	const from = rangeStart(range, customFrom);
	const to = range === "custom" && customTo ? new Date(new Date(customTo).setHours(23, 59, 59, 999)) : null;
	const filtered = (0, import_react.useMemo)(() => tasks.filter((t) => {
		const created = new Date(t.created_at);
		if (from && created < from) return false;
		if (to && created > to) return false;
		return true;
	}), [
		tasks,
		from,
		to
	]);
	const approvedInRange = filtered.filter((t) => t.status === "approved").length;
	const nameFor = new Map(team.map((m) => [m.id, m.full_name]));
	const stats = [
		{
			label: "Team members",
			value: team.length,
			icon: Users
		},
		{
			label: "Pending",
			value: filtered.filter((t) => t.status === "pending").length,
			icon: Clock
		},
		{
			label: "Awaiting review",
			value: filtered.filter((t) => t.status === "completed").length,
			icon: ListChecks
		},
		{
			label: "Approved in range",
			value: approvedInRange,
			icon: CircleCheck
		}
	];
	const recent = filtered.slice(0, 6);
	const perMember = (0, import_react.useMemo)(() => team.map((m) => {
		const mine = filtered.filter((t) => t.assigned_to === m.id);
		return {
			id: m.id,
			name: m.full_name.split(" ")[0] || m.full_name,
			pending: mine.filter((t) => t.status === "pending").length,
			completed: mine.filter((t) => t.status === "completed").length,
			approved: mine.filter((t) => t.status === "approved").length,
			revision: mine.filter((t) => t.status === "revision").length
		};
	}), [team, filtered]);
	const statusData = [
		{
			name: "Pending",
			value: filtered.filter((t) => t.status === "pending").length,
			color: "#94a3b8"
		},
		{
			name: "In review",
			value: filtered.filter((t) => t.status === "completed").length,
			color: "#3b82f6"
		},
		{
			name: "Approved",
			value: filtered.filter((t) => t.status === "approved").length,
			color: "#10b981"
		},
		{
			name: "Revision",
			value: filtered.filter((t) => t.status === "revision").length,
			color: "#f97316"
		}
	];
	function exportCSV() {
		const rows = filtered.map((t) => ({
			id: t.id,
			title: t.title,
			assignee: nameFor.get(t.assigned_to) ?? "",
			priority: t.priority,
			status: t.status,
			deadline: t.deadline ?? "",
			created_at: t.created_at,
			updated_at: t.updated_at,
			revision_note: t.revision_note ?? ""
		}));
		downloadCSV(`tasks-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, toCSV(rows));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "Team Overview"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Real-time snapshot of task completion and team performance."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { className: "h-4 w-4 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: range,
						onValueChange: (v) => setRange(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-[140px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "7d",
								children: "Last 7 days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "30d",
								children: "Last 30 days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "90d",
								children: "Last 90 days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "custom",
								children: "Custom…"
							})
						] })]
					}),
					range === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: customFrom,
							onChange: (e) => setCustomFrom(e.target.value),
							className: "h-9 w-[150px]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "to"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: customTo,
							onChange: (e) => setCustomTo(e.target.value),
							className: "h-9 w-[150px]"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: exportCSV,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), " Export CSV"]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 md:grid-cols-4",
			children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row items-center justify-between space-y-0 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-xs font-medium text-muted-foreground",
					children: s.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-4 w-4 text-brand-accent" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-3xl font-bold",
				children: s.value
			}) })] }, s.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Tasks per team member"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Click a bar to drill down"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: perMember,
							margin: {
								top: 8,
								right: 12,
								left: -12,
								bottom: 24
							},
							onClick: (e) => {
								const id = e?.activePayload?.[0]?.payload?.id;
								const m = team.find((t) => t.id === id);
								if (m) setDrill(m);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									opacity: .2
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									fontSize: 11,
									interval: 0,
									angle: -20,
									textAnchor: "end",
									height: 50,
									tickMargin: 6
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									fontSize: 11,
									allowDecimals: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: "rgba(15, 27, 61, 0.06)" },
									wrapperStyle: { outline: "none" },
									contentStyle: {
										background: "rgba(255,255,255,0.75)",
										backdropFilter: "blur(14px)",
										WebkitBackdropFilter: "blur(14px)",
										border: "1px solid rgba(255,255,255,0.6)",
										fontSize: 12,
										borderRadius: 12,
										padding: "10px 12px",
										boxShadow: "0 12px 32px -12px rgba(15,27,61,0.25)",
										color: "#0f172a"
									},
									labelStyle: {
										fontWeight: 600,
										marginBottom: 6,
										color: "#0f172a"
									},
									itemStyle: {
										padding: "1px 0",
										display: "flex",
										justifyContent: "space-between",
										gap: 16,
										color: "#0f172a"
									},
									formatter: (value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)],
									separator: "  "
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "approved",
									stackId: "a",
									fill: "#10b981",
									radius: [
										0,
										0,
										0,
										0
									],
									className: "cursor-pointer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "completed",
									stackId: "a",
									fill: "#3b82f6",
									className: "cursor-pointer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "pending",
									stackId: "a",
									fill: "#94a3b8",
									className: "cursor-pointer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "revision",
									stackId: "a",
									fill: "#f97316",
									radius: [
										4,
										4,
										0,
										0
									],
									className: "cursor-pointer"
								})
							]
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Status breakdown"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex h-72 flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: statusData,
							dataKey: "value",
							nameKey: "name",
							innerRadius: 42,
							outerRadius: 72,
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs",
					children: statusData.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 rounded-md bg-muted/50 px-2 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex min-w-0 items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-2 w-2 shrink-0 rounded-full",
								style: { background: s.color }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-muted-foreground",
								children: s.name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 font-semibold tabular-nums",
							children: s.value
						})]
					}, s.name))
				})]
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Recent tasks"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-2",
				children: recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "No tasks in this range."
				}) : recent.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 border-b border-border/50 py-2 last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: t.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: nameFor.get(t.assigned_to) ?? "—"
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
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!drill,
			onOpenChange: (o) => !o && setDrill(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [drill?.full_name, " — tasks in range"] }) }), drill && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberDrill, { tasks: filtered.filter((t) => t.assigned_to === drill.id) })]
			})
		})
	] });
}
function MemberDrill({ tasks }) {
	if (tasks.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-6 text-center text-sm text-muted-foreground",
		children: "No tasks in this range."
	});
	const counts = {
		pending: tasks.filter((t) => t.status === "pending").length,
		completed: tasks.filter((t) => t.status === "completed").length,
		approved: tasks.filter((t) => t.status === "approved").length,
		revision: tasks.filter((t) => t.status === "revision").length
	};
	const completion = tasks.length > 0 ? Math.round(counts.approved / tasks.length * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-2 text-center",
				children: Object.keys(counts).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-muted/50 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg font-semibold",
						children: counts[k]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] uppercase tracking-wide text-muted-foreground",
						children: k
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted-foreground",
				children: ["Approval rate: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold text-foreground",
					children: [completion, "%"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-80 space-y-1.5 overflow-y-auto pr-1",
				children: tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 rounded-md border border-border/60 px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 truncate",
						children: t.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 gap-1.5",
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
			})
		]
	});
}
//#endregion
export { AdminOverview as component };
