import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@clerk/react+[...].mjs";
import { r as UserProfile$1 } from "./dist-CU7AhyVe.mjs";
import { n as useAuth } from "./use-auth-BHcLpo1A.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-MHHI04mG.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BvUNkJzB.mjs";
import { F as Lock, I as LoaderCircle, J as Eye, ft as Bell, lt as Camera } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as verifyPasscode, n as updatePasscode, r as updateProfile, t as checkPasscode } from "./settings.functions-BjhY51yE.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-7gckwYC6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function SettingsPage() {
	const { user, profile, role } = useAuth();
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [avatarUrl, setAvatarUrl] = (0, import_react.useState)(profile?.avatar_url ?? null);
	const fileRef = (0, import_react.useRef)(null);
	const initials = (profile?.full_name || user?.email || "?").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
	async function handleFile(e) {
		const file = e.target.files?.[0];
		if (!file || !user) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please choose an image file");
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image must be under 5 MB");
			return;
		}
		setUploading(true);
		try {
			const ext = file.name.split(".").pop() || "jpg";
			`${user.id}${Date.now()}${ext}`;
			toast.info("Avatar changes should be done via Clerk Account settings below.");
		} catch (err) {
			toast.error(err.message ?? "Upload failed");
		} finally {
			setUploading(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold tracking-tight",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Update your profile photo. Other details are managed by admins."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), " Account Details"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-6 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)] text-2xl font-semibold text-white shadow-lg ring-4 ring-white",
							children: avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: avatarUrl,
								alt: "Avatar",
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: initials })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => fileRef.current?.click(),
							disabled: uploading,
							className: "absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[oklch(0.28_0.09_265)] text-white shadow-md ring-2 ring-white transition hover:scale-105 disabled:opacity-60",
							"aria-label": "Change photo",
							children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-2 text-center sm:text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "image/*",
								hidden: true,
								onChange: handleFile
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => fileRef.current?.click(),
								disabled: uploading,
								variant: "outline",
								children: uploading ? "Uploading…" : "Change photo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "JPG, PNG or GIF · Max 5 MB"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: profile?.full_name ?? "",
								disabled: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Position" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: profile?.position ?? "",
								disabled: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Badge" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: profile?.badge ?? "—",
								disabled: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: role ?? "",
								disabled: true,
								className: "capitalize"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: user?.email ?? "",
								disabled: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground sm:col-span-2",
							children: "Name, position, and badge can only be changed by an admin."
						})
					]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesCard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasscodeCard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-semibold tracking-tight mb-4",
					children: "Account Security"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserProfile$1, { routing: "hash" })]
			})
		]
	});
}
function PreferencesCard() {
	const { user, profile } = useAuth();
	const [notifyTasks, setNotifyTasks] = (0, import_react.useState)(profile?.notify_tasks ?? true);
	const [notifyMessages, setNotifyMessages] = (0, import_react.useState)(profile?.notify_messages ?? true);
	const [presenceHidden, setPresenceHidden] = (0, import_react.useState)(profile?.presence_hidden ?? false);
	const [saving, setSaving] = (0, import_react.useState)(null);
	async function update(key, value, setter) {
		if (!user) return;
		const prev = value;
		setter(value);
		setSaving(key);
		try {
			await updateProfile({ data: { [key]: value } });
			toast.success("Preference saved");
		} catch (error) {
			setter(!prev);
			toast.error(error.message);
		} finally {
			setSaving(null);
		}
	}
	const Row = ({ icon: Icon, title, desc, checked, onChange, k }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-card/50 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: desc
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked,
			onCheckedChange: (v) => onChange(v),
			disabled: saving === k
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), " Preferences"]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: Bell,
				k: "notify_tasks",
				title: "Task notifications",
				desc: "New assignments, approvals, revisions, and comments.",
				checked: notifyTasks,
				onChange: (v) => update("notify_tasks", v, setNotifyTasks)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: Bell,
				k: "notify_messages",
				title: "Chat notifications",
				desc: "New direct and group messages.",
				checked: notifyMessages,
				onChange: (v) => update("notify_messages", v, setNotifyMessages)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				icon: Eye,
				k: "presence_hidden",
				title: "Hide my online status",
				desc: "Teammates won't see when you're active.",
				checked: presenceHidden,
				onChange: (v) => update("presence_hidden", v, setPresenceHidden)
			})
		]
	})] });
}
function PasscodeCard() {
	const [hasPin, setHasPin] = (0, import_react.useState)(null);
	const [current, setCurrent] = (0, import_react.useState)("");
	const [next, setNext] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		checkPasscode().then(setHasPin);
	}, []);
	async function save() {
		if (!/^\d{4}$/.test(next)) {
			toast.error("Passcode must be 4 digits");
			return;
		}
		if (next !== confirm) {
			toast.error("Passcodes don't match");
			return;
		}
		setSaving(true);
		try {
			if (hasPin) {
				if (!await verifyPasscode({ data: current })) {
					toast.error("Current passcode is incorrect");
					setSaving(false);
					return;
				}
			}
			await updatePasscode({ data: next });
			toast.success(hasPin ? "Passcode updated" : "Passcode set");
			setCurrent("");
			setNext("");
			setConfirm("");
			setHasPin(true);
		} catch (e) {
			toast.error(e.message ?? "Failed to save passcode");
		} finally {
			setSaving(false);
		}
	}
	const pinInput = (val, set, id, label) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: id,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id,
			value: val,
			onChange: (e) => set(e.target.value.replace(/\D/g, "").slice(0, 4)),
			inputMode: "numeric",
			maxLength: 4,
			placeholder: "••••",
			className: "tracking-[0.5em] text-center text-lg font-semibold"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), " App Passcode"]
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: ["A 4-digit passcode is required every time you sign in.", hasPin === false && " You haven't set one yet."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					hasPin && pinInput(current, setCurrent, "cur-pin", "Current passcode"),
					pinInput(next, setNext, "new-pin", hasPin ? "New passcode" : "Passcode"),
					pinInput(confirm, setConfirm, "conf-pin", "Confirm")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: save,
				disabled: saving || hasPin === null,
				children: saving ? "Saving…" : hasPin ? "Update passcode" : "Set passcode"
			})
		]
	})] });
}
//#endregion
export { SettingsPage as component };
