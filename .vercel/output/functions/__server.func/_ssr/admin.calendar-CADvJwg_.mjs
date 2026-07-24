import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
import { _ as fetchTeam, f as fetchReminders, h as fetchTasksForAdmin, t as addReminder, v as getCachedAdminTasks, y as getCachedTeam } from "./tasks-CQ010v_B.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { t as Card } from "./card-BvUNkJzB.mjs";
import { T as Plus, ft as Bell, it as ChevronLeft, rt as ChevronRight } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BFvnb9Z1.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as scheduleOneSignalNotification } from "./notify-B0135TIm.mjs";
import { t as useRealtimeSubscription } from "./use-realtime-DP3QdmcJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.calendar-CADvJwg_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function startOfMonth(d) {
	return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d, n) {
	return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function sameDay(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function CalendarPage() {
	const { user } = useAuth();
	const [tasks, setTasks] = (0, import_react.useState)(() => getCachedAdminTasks() ?? []);
	const [team, setTeam] = (0, import_react.useState)(() => getCachedTeam() ?? []);
	const [reminders, setReminders] = (0, import_react.useState)([]);
	const [cursor, setCursor] = (0, import_react.useState)(() => startOfMonth(/* @__PURE__ */ new Date()));
	const [reminderDialogOpen, setReminderDialogOpen] = (0, import_react.useState)(false);
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(null);
	const [reminderTitle, setReminderTitle] = (0, import_react.useState)("");
	const [reminderTime, setReminderTime] = (0, import_react.useState)("09:00");
	const [addingReminder, setAddingReminder] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		function load() {
			fetchTasksForAdmin().then(setTasks).catch(() => {});
			fetchTeam().then(setTeam).catch(() => {});
			fetchReminders().then(setReminders).catch(() => {});
		}
		load();
	}, []);
	useRealtimeSubscription("tasks", "task-updates", () => {
		fetchTasksForAdmin().then(setTasks).catch(() => {});
	});
	async function handleAddReminder(e) {
		e.preventDefault();
		if (!selectedDate || !user) return;
		try {
			setAddingReminder(true);
			const [hours, minutes] = reminderTime.split(":");
			const remindAt = new Date(selectedDate);
			remindAt.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
			const r = await addReminder(reminderTitle, remindAt);
			if (r) setReminders((prev) => [...prev, r]);
			await scheduleOneSignalNotification(user.id, "WorkMonitor Reminder", reminderTitle, remindAt);
			toast.success("Reminder set!");
			setReminderDialogOpen(false);
			setReminderTitle("");
		} catch (err) {
			toast.error("Failed to add reminder");
		} finally {
			setAddingReminder(false);
		}
	}
	const nameOf = (id) => team.find((t) => t.id === id)?.full_name ?? "—";
	const cells = (0, import_react.useMemo)(() => {
		const startWeekday = startOfMonth(cursor).getDay();
		const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
		const arr = [];
		for (let i = 0; i < startWeekday; i++) arr.push(null);
		for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
		while (arr.length % 7 !== 0) arr.push(null);
		return arr;
	}, [cursor]);
	const tasksByDay = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const t of tasks) {
			if (!t.deadline || Array.isArray(t.tags) && t.tags.includes("reminder")) continue;
			const d = new Date(t.deadline);
			const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
			const arr = map.get(key) ?? [];
			arr.push(t);
			map.set(key, arr);
		}
		return map;
	}, [tasks]);
	const remindersByDay = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const r of reminders) {
			const d = new Date(r.remind_at);
			const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
			const arr = map.get(key) ?? [];
			arr.push(r);
			map.set(key, arr);
		}
		return map;
	}, [reminders]);
	const priColor = (p) => p === "high" ? "bg-red-500" : p === "medium" ? "bg-amber-500" : "bg-emerald-500";
	const today = /* @__PURE__ */ new Date();
	const monthLabel = cursor.toLocaleDateString(void 0, {
		month: "long",
		year: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Calendar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Task deadlines across the team."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => setCursor(addMonths(cursor, -1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-[10rem] text-center text-sm font-semibold",
							children: monthLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => setCursor(addMonths(cursor, 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setCursor(startOfMonth(/* @__PURE__ */ new Date())),
							children: "Today"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 border-b bg-muted/30 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
					children: [
						"Sun",
						"Mon",
						"Tue",
						"Wed",
						"Thu",
						"Fri",
						"Sat"
					].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-2 py-2 text-center",
						children: d
					}, d))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7",
					children: cells.map((d, i) => {
						const key = d ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` : `e${i}`;
						const items = d ? tasksByDay.get(key) ?? [] : [];
						const isToday = d && sameDay(d, today);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `min-h-[110px] border-b border-r p-1.5 text-xs ${d ? "" : "bg-muted/10"}`,
							children: [d && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`,
									children: d.getDate()
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => {
										e.stopPropagation();
										setSelectedDate(d);
										setReminderDialogOpen(true);
									},
									className: "text-muted-foreground hover:text-primary p-0.5 rounded transition",
									"aria-label": "Add reminder",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									items.slice(0, 3).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 truncate rounded-md border bg-white/70 px-1.5 py-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 shrink-0 rounded-full ${priColor(t.priority)}` }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate font-medium",
												children: t.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-auto hidden truncate text-[10px] text-muted-foreground sm:inline",
												children: nameOf(t.assigned_to)
											})
										]
									}, t.id)),
									(remindersByDay.get(key) ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 truncate rounded-md border border-purple-200 bg-purple-50/50 px-1.5 py-1 text-purple-700",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-2.5 w-2.5 shrink-0" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate font-medium",
												children: r.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-auto text-[9px] font-mono",
												children: new Date(r.remind_at).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit"
												})
											})
										]
									}, r.id)),
									items.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pl-1 text-[10px] text-muted-foreground",
										children: [
											"+",
											items.length - 3,
											" tasks"
										]
									})
								]
							})]
						}, key);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: reminderDialogOpen,
				onOpenChange: setReminderDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Add Reminder for ", selectedDate?.toLocaleDateString()] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleAddReminder,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reminder Note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: reminderTitle,
								onChange: (e) => setReminderTitle(e.target.value),
								placeholder: "Call the client...",
								required: true,
								autoFocus: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Time" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "time",
								value: reminderTime,
								onChange: (e) => setReminderTime(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setReminderDialogOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: addingReminder,
							children: addingReminder ? "Saving..." : "Set Reminder"
						})] })
					]
				})] })
			})
		]
	});
}
//#endregion
export { CalendarPage as component };
