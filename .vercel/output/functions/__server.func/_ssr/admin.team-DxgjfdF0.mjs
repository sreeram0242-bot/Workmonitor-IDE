import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { C as useRouter, N as isRedirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-C4XsUSXf.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { t as createSsrRpc } from "./createSsrRpc-BDx8PeYO.mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
import { _ as fetchTeam, y as getCachedTeam } from "./tasks-CQ010v_B.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BvUNkJzB.mjs";
import { O as Pencil, T as Plus, V as KeyRound, u as Trash2 } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-BFvnb9Z1.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as objectType, r as stringType } from "../_libs/zod.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BHv1JhlL.mjs";
import { n as PersonIcon, t as BadgePill } from "./BadgePill-CkoIACtc.mjs";
import { i as resetUserPasscode, n as deleteTeamMember, t as createTeamMember } from "./admin.functions-B2jusfrQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.team-DxgjfdF0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var setMemberBadge = createServerFn({ method: "POST" }).validator((data) => objectType({
	user_id: stringType(),
	badge: stringType().trim().max(24).nullable()
}).parse(data)).handler(createSsrRpc("376fd73665b13b06400c3384ba76533dfef6e176d34de03ff056c9bf0236a061"));
function TeamPage() {
	const { user, role } = useAuth();
	const [team, setTeam] = (0, import_react.useState)(() => getCachedTeam() ?? []);
	const [open, setOpen] = (0, import_react.useState)(false);
	const createFn = useServerFn(createTeamMember);
	const deleteFn = useServerFn(deleteTeamMember);
	const resetFn = useServerFn(resetUserPasscode);
	const badgeFn = useServerFn(setMemberBadge);
	const [editingBadge, setEditingBadge] = (0, import_react.useState)(null);
	async function reload() {
		setTeam(await fetchTeam(true));
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	const isAdmin = role === "admin";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "Team"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Create accounts, assign positions and roles."
			})] }), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add member"] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewMemberDialog, { onCreate: async (input) => {
					try {
						await createFn({ data: input });
						await reload();
						setOpen(false);
						toast.success(`${input.full_name} added`);
					} catch (e) {
						toast.error(e?.message ?? "Failed to create user");
					}
				} })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "text-base",
			children: [
				"Members (",
				team.length,
				")"
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-2",
			children: [team.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ${m.role === "admin" ? "bg-brand-accent/10 text-brand-accent" : "bg-muted text-muted-foreground"}`,
						children: m.avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: m.avatar_url,
							alt: m.full_name,
							className: "h-full w-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonIcon, {
							admin: m.role === "admin",
							className: "h-5 w-5"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: m.full_name
						}), m.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgePill, { label: m.badge })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: m.position
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: m.role === "admin" ? "border-brand-accent/30 text-brand-accent" : "",
							children: m.role
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => setEditingBadge(m),
							title: "Set badge",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
						}),
						isAdmin && m.id !== user?.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							title: "Reset 4-digit passcode",
							onClick: async () => {
								if (!confirm(`Reset ${m.full_name}'s 4-digit passcode? They'll set a new one on their next sign-in.`)) return;
								try {
									await resetFn({ data: { targetUserId: m.id } });
									toast.success("Passcode reset");
								} catch (e) {
									toast.error(e?.message ?? "Failed to reset passcode");
								}
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-amber-600" })
						}),
						isAdmin && m.id !== user?.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: async () => {
								if (!confirm(`Delete ${m.full_name}? This removes their account permanently.`)) return;
								try {
									await deleteFn({ data: { user_id: m.id } });
									await reload();
									toast.success("Member removed");
								} catch (e) {
									toast.error(e?.message ?? "Failed to delete");
								}
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
						})
					]
				})]
			}, m.id)), team.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "No members yet."
			})]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!editingBadge,
			onOpenChange: (o) => !o && setEditingBadge(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Set badge for ", editingBadge?.full_name] }) }), editingBadge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeEditor, {
				current: editingBadge.badge ?? "",
				onSave: async (value) => {
					try {
						await badgeFn({ data: {
							user_id: editingBadge.id,
							badge: value || null
						} });
						await reload();
						setEditingBadge(null);
						toast.success("Badge updated");
					} catch (e) {
						toast.error(e?.message ?? "Failed to update badge");
					}
				}
			})] })
		})
	] });
}
function NewMemberDialog({ onCreate }) {
	const [form, setForm] = (0, import_react.useState)({
		email: "",
		password: "",
		full_name: "",
		position: "",
		role: "user"
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add team member" }) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.full_name,
						onChange: (e) => setForm({
							...form,
							full_name: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Position" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.position,
						onChange: (e) => setForm({
							...form,
							position: e.target.value
						}),
						placeholder: "e.g. Marketing Lead"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						value: form.email,
						onChange: (e) => setForm({
							...form,
							email: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Temporary password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "text",
						value: form.password,
						onChange: (e) => setForm({
							...form,
							password: e.target.value
						}),
						placeholder: "min 6 chars"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: form.role,
						onValueChange: (v) => setForm({
							...form,
							role: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "user",
							children: "User"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "admin",
							children: "Admin (Founder / CEO / Tech Head)"
						})] })]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			disabled: busy || !form.email || !form.password || !form.full_name || !form.position,
			onClick: async () => {
				setBusy(true);
				try {
					await onCreate(form);
				} finally {
					setBusy(false);
				}
			},
			children: "Create account"
		}) })
	] });
}
function BadgeEditor({ current, onSave }) {
	const [val, setVal] = (0, import_react.useState)(current);
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Badge label" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: val,
					onChange: (e) => setVal(e.target.value),
					placeholder: "e.g. Developer",
					maxLength: 24
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [[
					"Developer",
					"Founder",
					"CEO",
					"Content",
					"Designer",
					"Marketing"
				].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setVal(p),
					className: "rounded-full border border-border/60 px-3 py-1 text-xs hover:bg-muted",
					children: p
				}, p)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setVal(""),
					className: "rounded-full border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10",
					children: "Remove"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: busy,
				onClick: async () => {
					setBusy(true);
					try {
						await onSave(val.trim());
					} finally {
						setBusy(false);
					}
				},
				children: "Save badge"
			}) })
		]
	});
}
//#endregion
export { TeamPage as component };
