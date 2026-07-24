import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
import { D as toggleSubtask, S as renameSubtask, _ as fetchTeam, c as deleteSubtask, m as fetchTaskComments, n as addSubtask, p as fetchSubtasks, r as addTaskComment, u as deleteTaskComment, y as getCachedTeam } from "./tasks-CQ010v_B.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { I as LoaderCircle, L as ListChecks, T as Plus, u as Trash2, y as Send } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { t as useRealtimeSubscription } from "./use-realtime-DP3QdmcJ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TaskComments-Da3ec9ts.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function SubtaskList({ taskId, canEdit, canToggle, compact }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [newTitle, setNewTitle] = (0, import_react.useState)("");
	const [adding, setAdding] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			try {
				const rows = await fetchSubtasks(taskId);
				if (alive) setItems(rows);
			} catch (e) {
				console.error(e);
			} finally {
				if (alive) setLoading(false);
			}
		})();
		return () => {
			alive = false;
		};
	}, [taskId]);
	async function onAdd() {
		const t = newTitle.trim();
		if (!t) return;
		setAdding(true);
		try {
			const row = await addSubtask(taskId, t, items.length ? Math.max(...items.map((s) => s.position)) + 1 : 0);
			setItems((prev) => [...prev, row]);
			setNewTitle("");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to add");
		} finally {
			setAdding(false);
		}
	}
	async function onToggle(id, v) {
		setItems((prev) => prev.map((s) => s.id === id ? {
			...s,
			is_done: v
		} : s));
		try {
			await toggleSubtask(id, v);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
			setItems((prev) => prev.map((s) => s.id === id ? {
				...s,
				is_done: !v
			} : s));
		}
	}
	async function onRename(id, title) {
		try {
			await renameSubtask(id, title);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		}
	}
	async function onDelete(id) {
		const prev = items;
		setItems((p) => p.filter((s) => s.id !== id));
		try {
			await deleteSubtask(id);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
			setItems(prev);
		}
	}
	const done = items.filter((s) => s.is_done).length;
	const total = items.length;
	const pct = total ? Math.round(done / total * 100) : 0;
	if (compact) {
		if (loading || total === 0) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center gap-2 text-[11px] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						done,
						"/",
						total,
						" subtasks"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-auto",
						children: [pct, "%"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1 w-full overflow-hidden rounded-full bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-brand-accent transition-all",
					style: { width: `${pct}%` }
				})
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-3.5 w-3.5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Checklist" }),
					total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-auto",
						children: [
							done,
							"/",
							total,
							" · ",
							pct,
							"%"
						]
					})
				]
			}),
			total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1 w-full overflow-hidden rounded-full bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-brand-accent transition-all",
					style: { width: `${pct}%` }
				})
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-3 text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1.5",
				children: items.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2 rounded-md border border-border bg-background/60 px-2 py-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: s.is_done,
							disabled: !canToggle && !canEdit,
							onCheckedChange: (v) => onToggle(s.id, !!v)
						}),
						canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: `flex-1 bg-transparent text-sm outline-none ${s.is_done ? "text-muted-foreground line-through" : ""}`,
							defaultValue: s.title,
							onBlur: (e) => {
								const v = e.target.value.trim();
								if (v && v !== s.title) onRename(s.id, v);
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `flex-1 text-sm ${s.is_done ? "text-muted-foreground line-through" : ""}`,
							children: s.title
						}),
						canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => onDelete(s.id),
							className: "h-7 w-7 p-0 text-red-600 hover:text-red-700",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})
					]
				}, s.id))
			}),
			canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: newTitle,
					onChange: (e) => setNewTitle(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							onAdd();
						}
					},
					placeholder: "Add a subtask…",
					className: "h-8 text-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: onAdd,
					disabled: adding || !newTitle.trim(),
					children: adding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
				})]
			})
		]
	});
}
function formatWhen(iso) {
	const d = new Date(iso);
	const diff = (Date.now() - d.getTime()) / 1e3;
	if (diff < 60) return "just now";
	if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
	return d.toLocaleString();
}
function TaskComments({ taskId }) {
	const { user } = useAuth();
	const [items, setItems] = (0, import_react.useState)([]);
	const [names, setNames] = (0, import_react.useState)({});
	const [body, setBody] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [sending, setSending] = (0, import_react.useState)(false);
	const bottomRef = (0, import_react.useRef)(null);
	async function load() {
		try {
			const rows = await fetchTaskComments(taskId);
			setItems(rows);
			let team = getCachedTeam();
			if (!team || team.length === 0) team = await fetchTeam();
			const next = { ...names };
			for (const m of team) next[m.id] = m.full_name;
			setNames(next);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
			setTimeout(() => bottomRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "end"
			}), 50);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [taskId]);
	useRealtimeSubscription("tasks", `comments-${taskId}`, () => {
		load();
	});
	async function send() {
		if (!user || !body.trim()) return;
		setSending(true);
		const text = body.trim();
		setBody("");
		try {
			await addTaskComment(taskId, text);
		} catch (error) {
			toast.error(error.message);
			setBody(text);
		} finally {
			setSending(false);
		}
	}
	async function remove(id) {
		try {
			await deleteTaskComment(id);
		} catch (error) {
			toast.error(error.message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-muted/20 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 text-xs font-medium text-muted-foreground",
				children: "Discussion"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-56 space-y-2 overflow-y-auto pr-1",
				children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 py-4 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " Loading…"]
				}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-3 text-xs text-muted-foreground",
					children: "No comments yet. Start the conversation."
				}) : items.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group flex items-start gap-2 rounded-md bg-background/60 p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: names[c.author_id] ?? "Member"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								title: new Date(c.created_at).toLocaleString(),
								children: formatWhen(c.created_at)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 whitespace-pre-wrap break-words text-sm",
							children: c.body
						})]
					}), c.author_id === user?.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => remove(c.id),
						className: "opacity-0 transition group-hover:opacity-100",
						title: "Delete",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-muted-foreground hover:text-red-600" })
					})]
				}, c.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					rows: 2,
					placeholder: "Write a comment…",
					onKeyDown: (e) => {
						if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
							e.preventDefault();
							send();
						}
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: send,
					disabled: sending || !body.trim(),
					children: sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
				})]
			})
		]
	});
}
//#endregion
export { TaskComments as n, SubtaskList as t };
