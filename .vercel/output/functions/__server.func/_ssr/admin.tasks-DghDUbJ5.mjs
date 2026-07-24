import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
import { C as signedProofUrl, O as updateTask, _ as fetchTeam, a as bulkDeleteTasks, d as fetchProofsForTask, h as fetchTasksForAdmin, i as bulkApproveTasks, l as deleteTask, n as addSubtask, o as bulkReassignTasks, p as fetchSubtasks, s as createTask, v as getCachedAdminTasks, w as statusColor, x as priorityColor, y as getCachedTeam } from "./tasks-CQ010v_B.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { C as Repeat, I as LoaderCircle, J as Eye, O as Pencil, T as Plus, Z as Copy, b as Search, et as CircleCheck, l as TriangleAlert, n as X, u as Trash2, x as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-BFvnb9Z1.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { n as sendNotifications } from "./notify-B0135TIm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BHv1JhlL.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { n as TaskComments, t as SubtaskList } from "./TaskComments-Da3ec9ts.mjs";
import { i as TabsTrigger$1, n as TabsContent$1, r as TabsList$1, t as Tabs$1 } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.tasks-DghDUbJ5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var Tabs = Tabs$1;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList$1, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsList$1.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger$1, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsTrigger$1.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent$1, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsContent$1.displayName;
function TagInput({ value, onChange, placeholder }) {
	const [draft, setDraft] = (0, import_react.useState)("");
	function commit() {
		const t = draft.trim().replace(/,+$/, "");
		if (!t) return;
		if (value.includes(t)) {
			setDraft("");
			return;
		}
		onChange([...value, t]);
		setDraft("");
	}
	function onKey(e) {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			commit();
		} else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5",
		children: [value.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			variant: "secondary",
			className: "gap-1 pl-2 pr-1 text-xs",
			children: [
				"#",
				t,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange(value.filter((x) => x !== t)),
					className: "rounded-full p-0.5 hover:bg-muted-foreground/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
				})
			]
		}, t)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value: draft,
			onChange: (e) => setDraft(e.target.value),
			onKeyDown: onKey,
			onBlur: commit,
			placeholder: value.length ? "" : placeholder ?? "Add tag and press Enter",
			className: "h-7 flex-1 min-w-[120px] border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
		})]
	});
}
function isOverdue(t) {
	return !!t.deadline && new Date(t.deadline).getTime() < Date.now() && (t.status === "pending" || t.status === "revision");
}
function AdminTasks() {
	const { user } = useAuth();
	const [tasks, setTasks] = (0, import_react.useState)(() => getCachedAdminTasks() ?? []);
	const [team, setTeam] = (0, import_react.useState)(() => getCachedTeam() ?? []);
	const [loading, setLoading] = (0, import_react.useState)(() => !getCachedAdminTasks());
	const [search, setSearch] = (0, import_react.useState)("");
	const [assigneeFilter, setAssigneeFilter] = (0, import_react.useState)("all");
	const [priorityFilter, setPriorityFilter] = (0, import_react.useState)("all");
	const [tagFilter, setTagFilter] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [bulkBusy, setBulkBusy] = (0, import_react.useState)(false);
	const [reassignOpen, setReassignOpen] = (0, import_react.useState)(false);
	const [reassignTo, setReassignTo] = (0, import_react.useState)("");
	function toggleSel(id) {
		setSelected((prev) => {
			const n = new Set(prev);
			if (n.has(id)) n.delete(id);
			else n.add(id);
			return n;
		});
	}
	function clearSel() {
		setSelected(/* @__PURE__ */ new Set());
	}
	async function reloadTasks() {
		const t = await fetchTasksForAdmin();
		setTasks(t);
		setLoading(false);
	}
	async function reloadAll() {
		const [t, m] = await Promise.all([fetchTasksForAdmin(), fetchTeam()]);
		setTasks(t);
		setTeam(m);
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		reloadAll();
		return () => {};
	}, []);
	const nameFor = (0, import_react.useMemo)(() => {
		const map = new Map(team.map((m) => [m.id, m.full_name]));
		return (id) => map.get(id) ?? "—";
	}, [team]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		return tasks.filter((t) => {
			if (Array.isArray(t.tags) && t.tags.includes("reminder")) return false;
			if (assigneeFilter !== "all" && t.assigned_to !== assigneeFilter) return false;
			if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
			if (tagFilter && !(Array.isArray(t.tags) ? t.tags : []).includes(tagFilter)) return false;
			if (q && !`${t.title} ${t.description ?? ""} ${(Array.isArray(t.tags) ? t.tags : []).join(" ")}`.toLowerCase().includes(q)) return false;
			return true;
		});
	}, [
		tasks,
		search,
		assigneeFilter,
		priorityFilter,
		tagFilter
	]);
	const allTags = (0, import_react.useMemo)(() => {
		const s = /* @__PURE__ */ new Set();
		tasks.forEach((t) => {
			if (Array.isArray(t.tags) && t.tags.includes("reminder")) return;
			(Array.isArray(t.tags) ? t.tags : []).forEach((x) => s.add(x));
		});
		return Array.from(s).sort();
	}, [tasks]);
	const overdueCount = filtered.filter(isOverdue).length;
	const buckets = {
		pending: filtered.filter((t) => t.status === "pending"),
		completed: filtered.filter((t) => t.status === "completed"),
		approved: filtered.filter((t) => t.status === "approved"),
		revision: filtered.filter((t) => t.status === "revision")
	};
	const selectedIds = Array.from(selected);
	const selectedTasks = tasks.filter((t) => selected.has(t.id));
	const canBulkApprove = selectedTasks.length > 0 && selectedTasks.every((t) => t.status === "completed");
	async function bulkApprove() {
		if (!canBulkApprove) return;
		setBulkBusy(true);
		let error = null;
		try {
			await bulkApproveTasks(selectedIds);
		} catch (e) {
			error = e;
		}
		if (!error) await sendNotifications(selectedTasks.map((t) => ({
			user_id: t.assigned_to,
			type: "task_approved",
			message: `Approved: ${t.title}`,
			link: "/app"
		})));
		setBulkBusy(false);
		if (error) return toast.error(error.message);
		toast.success(`Approved ${selectedIds.length} task${selectedIds.length === 1 ? "" : "s"}`);
		clearSel();
		reloadTasks();
	}
	async function bulkDelete() {
		if (!confirm(`Delete ${selectedIds.length} selected task${selectedIds.length === 1 ? "" : "s"}? This cannot be undone.`)) return;
		setBulkBusy(true);
		let error = null;
		try {
			await bulkDeleteTasks(selectedIds);
		} catch (e) {
			error = e;
		}
		setBulkBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Tasks deleted");
		clearSel();
		reloadTasks();
	}
	async function bulkReassign() {
		if (!reassignTo) return toast.error("Pick an assignee");
		setBulkBusy(true);
		let error = null;
		try {
			await bulkReassignTasks(selectedIds, reassignTo);
		} catch (e) {
			error = e;
		}
		if (!error) await sendNotifications(selectedTasks.map((t) => ({
			user_id: reassignTo,
			type: "task_assigned",
			message: `Reassigned to you: ${t.title}`,
			link: "/app"
		})));
		setBulkBusy(false);
		if (error) return toast.error(error.message);
		toast.success(`Reassigned ${selectedIds.length} task${selectedIds.length === 1 ? "" : "s"}`);
		clearSel();
		setReassignOpen(false);
		setReassignTo("");
		reloadTasks();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-full p-4 sm:p-6 bg-sidebar-mesh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 sidebar-noise-overlay opacity-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)]",
						children: "Tasks"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-slate-600/80 mt-1",
						children: "Assign, review, and approve team work in real time."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssignTaskDialog, {
						team,
						adminId: user?.id ?? "",
						onCreated: reloadTasks
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 grid grid-cols-1 gap-3 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: search,
								onChange: (e) => setSearch(e.target.value),
								placeholder: "Search title or description…",
								className: "pl-9 h-10 rounded-xl border border-black/5 bg-white/60 backdrop-blur shadow-sm focus-visible:ring-brand-accent/50"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: assigneeFilter,
							onValueChange: setAssigneeFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-10 rounded-xl border border-black/5 bg-white/60 backdrop-blur shadow-sm focus:ring-brand-accent/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Assignee" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All assignees"
							}), team.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: m.id,
								children: m.full_name
							}, m.id))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: priorityFilter,
							onValueChange: setPriorityFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-10 rounded-xl border border-black/5 bg-white/60 backdrop-blur shadow-sm focus:ring-brand-accent/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Priority" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All priorities"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "low",
									children: "Low"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "medium",
									children: "Medium"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "high",
									children: "High"
								})
							] })]
						})
					]
				}),
				allTags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-slate-500 font-medium",
							children: "Tags:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setTagFilter(null),
							className: `rounded-md px-2.5 py-1 text-xs transition-all shadow-sm border ${tagFilter === null ? "border-[oklch(0.28_0.09_265)]/20 bg-[oklch(0.28_0.09_265)]/10 text-[oklch(0.28_0.09_265)] font-semibold" : "border-black/5 bg-white/60 hover:bg-white text-slate-600 backdrop-blur"}`,
							children: "All"
						}),
						allTags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setTagFilter(t),
							className: `rounded-md px-2.5 py-1 text-xs transition-all shadow-sm border ${tagFilter === t ? "border-[oklch(0.28_0.09_265)]/20 bg-[oklch(0.28_0.09_265)]/10 text-[oklch(0.28_0.09_265)] font-semibold" : "border-black/5 bg-white/60 hover:bg-white text-slate-600 backdrop-blur"}`,
							children: ["#", t]
						}, t))
					]
				}),
				overdueCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 shadow-sm backdrop-blur",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium",
							children: [
								overdueCount,
								" overdue task",
								overdueCount === 1 ? "" : "s",
								" need attention"
							]
						})
					]
				}),
				selectedIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky top-2 z-10 mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm shadow-sm backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium",
							children: [selectedIds.length, " selected"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: clearSel,
							children: "Clear"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								disabled: !canBulkApprove || bulkBusy,
								onClick: bulkApprove,
								title: canBulkApprove ? "" : "Only completed tasks can be approved in bulk",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1.5 h-4 w-4" }), " Approve"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: bulkBusy,
								onClick: () => setReassignOpen(true),
								children: "Reassign"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								disabled: bulkBusy,
								onClick: bulkDelete,
								className: "text-red-600 hover:text-red-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1.5 h-4 w-4" }), " Delete"]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: reassignOpen,
					onOpenChange: setReassignOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "max-w-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
								"Reassign ",
								selectedIds.length,
								" task",
								selectedIds.length === 1 ? "" : "s"
							] }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New assignee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: reassignTo,
									onValueChange: setReassignTo,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose member" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: team.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: m.id,
										children: m.full_name
									}, m.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setReassignOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: bulkReassign,
								disabled: bulkBusy || !reassignTo,
								children: [bulkBusy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Reassign"]
							})] })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "completed",
					className: "w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "flex w-full justify-start overflow-x-auto whitespace-nowrap rounded-xl bg-white/60 p-1 border border-black/5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "completed",
								children: [
									"Review (",
									buckets.completed.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "pending",
								children: [
									"Pending (",
									buckets.pending.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "revision",
								children: [
									"Revisions (",
									buckets.revision.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "approved",
								children: [
									"Approved (",
									buckets.approved.length,
									")"
								]
							})
						]
					}), [
						"completed",
						"pending",
						"revision",
						"approved"
					].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: k,
						className: "mt-4 space-y-3",
						children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-center py-10 text-slate-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" })
						}) : buckets[k].length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-black/5 bg-white/60 p-10 text-center text-sm text-slate-500 backdrop-blur shadow-sm",
							children: "Nothing here yet."
						}) : buckets[k].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskAdminRow, {
							task: t,
							team,
							assigneeName: nameFor(t.assigned_to),
							onChange: reloadTasks,
							selected: selected.has(t.id),
							onToggleSelect: () => toggleSel(t.id)
						}, t.id))
					}, k))]
				})
			]
		})]
	});
}
function AssignTaskDialog({ team, adminId, onCreated }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const params = new URLSearchParams(window.location.search);
		if (params.get("new") === "1") {
			setOpen(true);
			params.delete("new");
			const qs = params.toString();
			window.history.replaceState({}, "", window.location.pathname + (qs ? `?${qs}` : ""));
		}
	}, []);
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [assignedTo, setAssignedTo] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("medium");
	const [deadline, setDeadline] = (0, import_react.useState)("");
	const [recurrence, setRecurrence] = (0, import_react.useState)("none");
	const [tags, setTags] = (0, import_react.useState)([]);
	const [saving, setSaving] = (0, import_react.useState)(false);
	async function submit() {
		if (!title || !assignedTo) {
			toast.error("Title and assignee are required");
			return;
		}
		setSaving(true);
		let error = null;
		try {
			await createTask({
				title,
				description: description || null,
				assigned_to: assignedTo,
				assigned_by: adminId,
				priority,
				status: "pending",
				deadline: deadline ? new Date(deadline).toISOString() : null,
				recurrence,
				tags
			});
		} catch (e) {
			error = e;
		}
		if (!error) await sendNotifications([{
			user_id: assignedTo,
			type: "task_assigned",
			message: `New task: ${title}`,
			link: "/app"
		}]);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success("Task assigned");
		setTitle("");
		setDescription("");
		setAssignedTo("");
		setPriority("medium");
		setDeadline("");
		setRecurrence("none");
		setTags([]);
		setOpen(false);
		onCreated();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Assign task"] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Assign a task" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: "e.g. Ship landing page hero"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: description,
								onChange: (e) => setDescription(e.target.value),
								rows: 3
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assign to" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: assignedTo,
									onValueChange: setAssignedTo,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose member" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: team.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: m.id,
										children: [
											m.full_name,
											" · ",
											m.position
										]
									}, m.id)) })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: priority,
									onValueChange: (v) => setPriority(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "low",
											children: "Low"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "medium",
											children: "Medium"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "high",
											children: "High"
										})
									] })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Deadline (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "datetime-local",
								value: deadline,
								onChange: (e) => setDeadline(e.target.value),
								onClick: (e) => {
									const el = e.currentTarget;
									try {
										el.showPicker?.();
									} catch {}
								},
								onFocus: (e) => {
									const el = e.currentTarget;
									try {
										el.showPicker?.();
									} catch {}
								},
								className: "cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Recurrence" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: recurrence,
									onValueChange: (v) => setRecurrence(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "none",
											children: "One-off"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "daily",
											children: "Daily"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "weekly",
											children: "Weekly"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "monthly",
											children: "Monthly"
										})
									] })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tags" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagInput, {
									value: tags,
									onChange: setTags,
									placeholder: "design, urgent…"
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: submit,
					disabled: saving,
					children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Assign"]
				})] })
			]
		})]
	});
}
function EditTaskDialog({ open, onOpenChange, task, team, onDone }) {
	const [title, setTitle] = (0, import_react.useState)(task.title);
	const [description, setDescription] = (0, import_react.useState)(task.description ?? "");
	const [assignedTo, setAssignedTo] = (0, import_react.useState)(task.assigned_to);
	const [priority, setPriority] = (0, import_react.useState)(task.priority);
	const [deadline, setDeadline] = (0, import_react.useState)(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "");
	const [recurrence, setRecurrence] = (0, import_react.useState)(task.recurrence ?? "none");
	const [tags, setTags] = (0, import_react.useState)(task.tags ?? []);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setTitle(task.title);
		setDescription(task.description ?? "");
		setAssignedTo(task.assigned_to);
		setPriority(task.priority);
		setDeadline(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "");
		setRecurrence(task.recurrence ?? "none");
		setTags(task.tags ?? []);
	}, [open, task]);
	async function save() {
		if (!title.trim()) return toast.error("Title required");
		setBusy(true);
		let error = null;
		try {
			await updateTask(task.id, {
				title,
				description: description || null,
				assigned_to: assignedTo,
				priority,
				deadline: deadline ? new Date(deadline).toISOString() : null,
				recurrence,
				tags
			});
		} catch (e) {
			error = e;
		}
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Task updated");
		onOpenChange(false);
		onDone();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit task" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: title,
								onChange: (e) => setTitle(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: description,
								onChange: (e) => setDescription(e.target.value),
								rows: 3
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assign to" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: assignedTo,
									onValueChange: setAssignedTo,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: team.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: m.id,
										children: m.full_name
									}, m.id)) })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: priority,
									onValueChange: (v) => setPriority(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "low",
											children: "Low"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "medium",
											children: "Medium"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "high",
											children: "High"
										})
									] })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Deadline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "datetime-local",
									value: deadline,
									onChange: (e) => setDeadline(e.target.value)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Recurrence" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: recurrence,
									onValueChange: (v) => setRecurrence(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "none",
											children: "One-off"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "daily",
											children: "Daily"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "weekly",
											children: "Weekly"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "monthly",
											children: "Monthly"
										})
									] })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tags" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagInput, {
								value: tags,
								onChange: setTags,
								placeholder: "design, urgent…"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md border border-border bg-muted/20 p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubtaskList, {
								taskId: task.id,
								canEdit: true,
								canToggle: true
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: save,
					disabled: busy,
					children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Save"]
				})] })
			]
		})
	});
}
function TaskAdminRow({ task, team, assigneeName, onChange, selected, onToggleSelect }) {
	const [reviewOpen, setReviewOpen] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const overdue = isOverdue(task);
	async function del() {
		if (!confirm(`Delete task "${task.title}"? This cannot be undone.`)) return;
		let error = null;
		try {
			await deleteTask(task.id);
		} catch (e) {
			error = e;
		}
		if (error) return toast.error(error.message);
		toast.success("Task deleted");
		onChange();
	}
	async function duplicate() {
		let error = null;
		let data = null;
		try {
			data = await createTask({
				title: `${task.title} (copy)`,
				description: task.description,
				assigned_to: task.assigned_to,
				assigned_by: task.assigned_by,
				priority: task.priority,
				status: "pending",
				deadline: task.deadline,
				recurrence: task.recurrence ?? "none",
				tags: task.tags ?? []
			});
		} catch (e) {
			error = e;
		}
		if (error) return toast.error(error.message);
		try {
			const subs = await fetchSubtasks(task.id);
			if (subs.length && data) for (const s of subs) await addSubtask(data.id, s.title, s.position);
		} catch {}
		toast.success("Task duplicated");
		onChange();
	}
	const tags = task.tags ?? [];
	const recurring = (task.recurrence ?? "none") !== "none";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl border border-black/5 bg-white/60 shadow-sm transition-all hover:shadow-md hover:bg-white/80 ${overdue ? "border-red-300 bg-red-50/40" : ""} ${selected ? "ring-2 ring-[oklch(0.28_0.09_265)]/40" : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row items-start justify-between gap-4 p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: selected,
						onCheckedChange: onToggleSelect,
						"aria-label": "Select task"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: task.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: priorityColor(task.priority),
									children: task.priority
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: statusColor(task.status),
									children: task.status
								}),
								recurring && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "gap-1 border-[oklch(0.5_0.16_260)]/20 bg-[oklch(0.5_0.16_260)]/10 text-[oklch(0.5_0.16_260)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "h-3 w-3" }),
										" ",
										task.recurrence
									]
								}),
								overdue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "border-red-300 bg-red-100 text-red-700",
									children: "Overdue"
								})
							]
						}),
						task.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-sm text-slate-600",
							children: task.description
						}),
						tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1",
							children: tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-md border border-black/5 bg-black/5 px-2 py-0.5 text-[11px] text-slate-600",
								children: ["#", t]
							}, t))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-xs text-slate-500",
							children: [
								"Assigned to ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-slate-700",
									children: assigneeName
								}),
								task.deadline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · due ", new Date(task.deadline).toLocaleString()] })
							]
						}),
						task.revision_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 text-xs text-orange-600 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold uppercase tracking-wider",
									children: "Revision note:"
								}),
								" ",
								task.revision_note
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubtaskList, {
								taskId: task.id,
								canEdit: false,
								canToggle: false,
								compact: true
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-wrap gap-2",
					children: [
						(task.status === "completed" || task.status === "approved" || task.status === "revision") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "default",
							className: "bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)] text-white shadow hover:opacity-90 transition-opacity",
							onClick: () => setReviewOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), " Review"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							className: "border-black/5 bg-white/60 backdrop-blur hover:bg-white shadow-sm",
							onClick: () => setEditOpen(true),
							title: "Edit",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4 text-slate-600" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							className: "border-black/5 bg-white/60 backdrop-blur hover:bg-white shadow-sm",
							onClick: duplicate,
							title: "Duplicate",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4 text-slate-600" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: del,
							className: "border-red-500/10 bg-red-500/5 hover:bg-red-500/10 text-red-600 hover:text-red-700 shadow-sm",
							title: "Delete",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewDialog, {
					open: reviewOpen,
					onOpenChange: setReviewOpen,
					task,
					onChange
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditTaskDialog, {
					open: editOpen,
					onOpenChange: setEditOpen,
					task,
					team,
					onDone: onChange
				})
			]
		})
	});
}
function ReviewDialog({ open, onOpenChange, task, onChange }) {
	const [urls, setUrls] = (0, import_react.useState)([]);
	const [revisionNote, setRevisionNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		(async () => {
			const proofs = await fetchProofsForTask(task.id);
			const resolved = await Promise.all(proofs.map(async (p) => ({
				url: await signedProofUrl(p.image_url) ?? "",
				note: p.note
			})));
			setUrls(resolved.filter((r) => r.url));
		})();
	}, [open, task.id]);
	async function approve() {
		setBusy(true);
		let error = null;
		try {
			await updateTask(task.id, {
				status: "approved",
				revision_note: null
			});
		} catch (e) {
			error = e;
		}
		if (!error) {
			await sendNotifications([{
				user_id: task.assigned_to,
				type: "task_approved",
				message: `Approved: ${task.title}`,
				link: "/app"
			}]);
			const rec = task.recurrence ?? "none";
			if (rec !== "none") {
				const base = task.deadline ? new Date(task.deadline) : /* @__PURE__ */ new Date();
				const next = new Date(base);
				if (rec === "daily") next.setDate(next.getDate() + 1);
				else if (rec === "weekly") next.setDate(next.getDate() + 7);
				else if (rec === "monthly") next.setMonth(next.getMonth() + 1);
				let newTask = null;
				try {
					newTask = await createTask({
						title: task.title,
						description: task.description,
						assigned_to: task.assigned_to,
						assigned_by: task.assigned_by,
						priority: task.priority,
						status: "pending",
						deadline: next.toISOString(),
						recurrence: rec,
						tags: task.tags ?? []
					});
				} catch (e) {}
				try {
					const subs = await fetchSubtasks(task.id);
					if (subs.length && newTask) for (const s of subs) await addSubtask(newTask.id, s.title, s.position);
				} catch {}
				await sendNotifications([{
					user_id: task.assigned_to,
					type: "task_assigned",
					message: `Recurring task: ${task.title}`,
					link: "/app"
				}]);
			}
		}
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success(task.recurrence && task.recurrence !== "none" ? "Approved · next occurrence scheduled" : "Task approved");
		onOpenChange(false);
		onChange();
	}
	async function requestRevision() {
		if (!revisionNote.trim()) return toast.error("Add a revision note explaining what needs to change");
		setBusy(true);
		let error = null;
		try {
			await updateTask(task.id, {
				status: "revision",
				revision_note: revisionNote
			});
		} catch (e) {
			error = e;
		}
		if (!error) await sendNotifications([{
			user_id: task.assigned_to,
			type: "task_revision",
			message: `Revision requested: ${task.title}`,
			link: "/app"
		}]);
		setBusy(false);
		if (error) return toast.error(error.message);
		toast.success("Revision requested");
		setRevisionNote("");
		onOpenChange(false);
		onChange();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] max-w-2xl overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: task.title }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						urls.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "No proof uploaded."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-3",
							children: urls.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: u.url,
								target: "_blank",
								rel: "noreferrer",
								className: "block overflow-hidden rounded-lg border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: u.url,
									alt: "Proof",
									className: "h-40 w-full object-cover"
								}), u.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 text-xs text-muted-foreground",
									children: u.note
								})]
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Revision note (required to request changes)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: revisionNote,
								onChange: (e) => setRevisionNote(e.target.value),
								rows: 3,
								placeholder: "Explain clearly what needs to change so the employee knows how to fix it."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskComments, { taskId: task.id })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: requestRevision,
						disabled: busy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-2 h-4 w-4" }), " Request revision"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: approve,
						disabled: busy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-2 h-4 w-4" }), " Approve"]
					})]
				})
			]
		})
	});
}
//#endregion
export { AdminTasks as component };
