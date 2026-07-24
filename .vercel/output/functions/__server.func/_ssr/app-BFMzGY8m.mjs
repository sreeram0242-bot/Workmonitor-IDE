import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
import { T as submitTaskProof, b as getCachedUserTasks, g as fetchTasksForUser, w as statusColor, x as priorityColor } from "./tasks-CQ010v_B.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { n as CardContent, t as Card } from "./card-BvUNkJzB.mjs";
import { I as LoaderCircle, U as ImagePlus, c as Upload, et as CircleCheck, x as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-BFvnb9Z1.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { n as sendNotifications } from "./notify-B0135TIm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { n as TaskComments, t as SubtaskList } from "./TaskComments-Da3ec9ts.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-BFMzGY8m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function EmployeeHome() {
	const { loading, role, user } = useAuth();
	const cached = user ? getCachedUserTasks(user.id) : null;
	const [tasks, setTasks] = (0, import_react.useState)(cached ?? []);
	const [initial, setInitial] = (0, import_react.useState)(!cached);
	const [search, setSearch] = (0, import_react.useState)("");
	const [priorityFilter, setPriorityFilter] = (0, import_react.useState)("all");
	async function reload() {
		if (!user) return;
		const t = await fetchTasksForUser(user.id);
		setTasks(t);
		setInitial(false);
	}
	(0, import_react.useEffect)(() => {
		if (!user) return;
		reload();
		return () => {};
	}, [user?.id]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[45vh] items-center justify-center text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin text-brand-accent" }), "Loading workspace…"]
	});
	if (role === "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/admin" });
	const q = search.trim().toLowerCase();
	const visible = tasks.filter((t) => {
		if (Array.isArray(t.tags) && t.tags.includes("reminder")) return false;
		if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
		if (q && !`${t.title} ${t.description ?? ""}`.toLowerCase().includes(q)) return false;
		return true;
	});
	const active = visible.filter((t) => t.status === "pending" || t.status === "revision");
	const submitted = visible.filter((t) => t.status === "completed");
	const done = visible.filter((t) => t.status === "approved");
	const now = /* @__PURE__ */ new Date();
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	const endOfToday = startOfToday + 1440 * 60 * 1e3;
	const openTasks = tasks.filter((t) => !(Array.isArray(t.tags) && t.tags.includes("reminder")) && (t.status === "pending" || t.status === "revision"));
	const overdueCount = openTasks.filter((t) => t.deadline && new Date(t.deadline).getTime() < now.getTime()).length;
	const dueTodayCount = openTasks.filter((t) => {
		if (!t.deadline) return false;
		const d = new Date(t.deadline).getTime();
		return d >= now.getTime() && d < endOfToday;
	}).length;
	const upcomingCount = openTasks.filter((t) => {
		if (!t.deadline) return false;
		return new Date(t.deadline).getTime() >= endOfToday;
	}).length;
	const approvedToday = tasks.filter((t) => t.status === "approved" && t.updated_at && new Date(t.updated_at).getTime() >= startOfToday && new Date(t.updated_at).getTime() < endOfToday).length;
	const firstName = (user?.user_metadata?.full_name)?.split(" ")[0] ?? "there";
	const hour = now.getHours();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-full p-4 sm:p-6 bg-sidebar-mesh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 sidebar-noise-overlay opacity-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)]",
						children: [
							hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening",
							", ",
							firstName
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-slate-600/80 mt-1",
						children: "Here's your day at a glance."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
							label: "Overdue",
							value: overdueCount,
							tone: overdueCount > 0 ? "danger" : "muted"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
							label: "Due today",
							value: dueTodayCount,
							tone: dueTodayCount > 0 ? "warn" : "muted"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
							label: "Upcoming",
							value: upcomingCount,
							tone: "brand"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatChip, {
							label: "Approved today",
							value: approvedToday,
							tone: approvedToday > 0 ? "success" : "muted"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search tasks…",
						className: "h-10 min-w-[220px] flex-1 rounded-xl border border-black/5 bg-white/60 px-4 text-sm outline-none backdrop-blur shadow-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/50 transition-all placeholder:text-slate-400"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: priorityFilter,
						onChange: (e) => setPriorityFilter(e.target.value),
						className: "h-10 rounded-xl border border-black/5 bg-white/60 px-3 text-sm backdrop-blur shadow-sm outline-none focus:border-brand-accent transition-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All priorities"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "high",
								children: "High"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "medium",
								children: "Medium"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "low",
								children: "Low"
							})
						]
					})]
				}),
				initial ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center py-10 text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" })
				}) : tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: "No tasks assigned yet."
				}) }) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: "No tasks match your filters."
				}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "To do",
							items: active,
							onChange: reload
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Awaiting review",
							items: submitted,
							onChange: reload,
							muted: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Approved",
							items: done,
							onChange: reload,
							muted: true
						})
					]
				})
			]
		})]
	});
}
function StatChip({ label, value, tone }) {
	const toneClass = {
		danger: "border-red-500/20 bg-red-500/5 text-red-600",
		warn: "border-amber-500/20 bg-amber-500/5 text-amber-600",
		brand: "border-[oklch(0.28_0.09_265)]/20 bg-[oklch(0.28_0.09_265)]/5 text-[oklch(0.28_0.09_265)]",
		success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-600",
		muted: "border-black/5 bg-white/60 text-slate-600"
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl border px-4 py-3 shadow-sm transition-all hover:scale-[1.02] ${toneClass}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-semibold uppercase tracking-wider opacity-80",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 font-display text-2xl font-bold tabular-nums",
			children: value
		})]
	});
}
function Section({ title, items, onChange, muted }) {
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: items.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskChecklistItem, {
			task: t,
			onChange,
			muted
		}, t.id))
	})] });
}
function isOverdue(t) {
	return !!t.deadline && new Date(t.deadline).getTime() < Date.now() && (t.status === "pending" || t.status === "revision");
}
function TaskChecklistItem({ task, onChange, muted }) {
	const [uploadOpen, setUploadOpen] = (0, import_react.useState)(false);
	const canComplete = task.status === "pending" || task.status === "revision";
	const overdue = isOverdue(task);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl border border-black/5 bg-white/80 shadow-sm transition-all hover:shadow-md hover:bg-white/95 ${muted ? "opacity-90" : ""} ${overdue ? "border-red-300 bg-red-50/40" : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					checked: !canComplete,
					disabled: !canComplete,
					onCheckedChange: (v) => v && setUploadOpen(true),
					className: "mt-1"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `font-medium ${!canComplete ? "line-through text-muted-foreground" : ""}`,
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
								overdue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "border-red-300 bg-red-100 text-red-700",
									children: "Overdue"
								}),
								task.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }),
								task.status === "revision" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 text-orange-500" })
							]
						}),
						task.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-sm text-slate-600",
							children: task.description
						}),
						Array.isArray(task.tags) && task.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1",
							children: task.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-md border border-black/5 bg-black/5 px-2 py-0.5 text-[11px] text-slate-600",
								children: ["#", t]
							}, t))
						}),
						task.deadline && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `mt-2 text-xs ${overdue ? "text-red-600 font-medium" : "text-slate-500"}`,
							children: ["Due ", new Date(task.deadline).toLocaleString()]
						}),
						task.revision_note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 text-xs text-orange-600 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold uppercase tracking-wider",
									children: "Revision requested:"
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
								canToggle: canComplete
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskComments, { taskId: task.id })
						})
					]
				}),
				canComplete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "default",
					className: "bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)] text-white shadow hover:opacity-90 transition-opacity",
					onClick: () => setUploadOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "mr-2 h-4 w-4" }), " Complete"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadProofDialog, {
					open: uploadOpen,
					onOpenChange: setUploadOpen,
					task,
					onDone: onChange
				})
			]
		})
	});
}
function UploadProofDialog({ open, onOpenChange, task, onDone }) {
	const { user } = useAuth();
	const [files, setFiles] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	async function submit() {
		if (files.length === 0 || !user) return toast.error("Please choose at least one image");
		setBusy(true);
		try {
			for (const file of files) {
				const buffer = await file.arrayBuffer();
				const base64 = Buffer.from(buffer).toString("base64");
				await submitTaskProof(task.id, base64, file.name, note || null);
			}
			await sendNotifications([{
				user_id: task.assigned_by,
				type: "task_submitted",
				message: `Proof submitted: ${task.title}`,
				link: "/admin/tasks"
			}]);
			toast.success("Submitted for review");
			setFiles([]);
			setNote("");
			onOpenChange(false);
			onDone();
		} catch (err) {
			toast.error(err.message ?? "Upload failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
				"Upload proof for \"",
				task.title,
				"\""
			] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "button",
						tabIndex: 0,
						onClick: () => inputRef.current?.click(),
						onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click(),
						className: "cursor-pointer rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center hover:bg-muted/50",
						children: [files.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [
								files.length,
								" file",
								files.length === 1 ? "" : "s",
								" selected — tap to add more"
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6" }), " Tap to choose one or more images"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							type: "file",
							accept: "image/*",
							multiple: true,
							className: "hidden",
							onChange: (e) => setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])
						})]
					}),
					files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: files.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "max-w-[140px] truncate",
								children: f.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-muted-foreground hover:text-red-600",
								onClick: () => setFiles((prev) => prev.filter((_, idx) => idx !== i)),
								children: "×"
							})]
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Note (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: note,
							onChange: (e) => setNote(e.target.value)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => onOpenChange(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: submit,
				disabled: busy || files.length === 0,
				children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Submit"]
			})] })
		] })
	});
}
//#endregion
export { EmployeeHome as component };
