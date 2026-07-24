import { c as __toESM } from "./async-local-storage-C5fJChCT.mjs";
import { C as useRouter, I as redirect, _ as createRootRouteWithContext, c as HeadContent, f as createRouter, g as createFileRoute, h as lazyRouteComponent, p as Outlet, s as Scripts, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as require_jsx_runtime, u as QueryClient } from "../_libs/@clerk/react+[...].mjs";
import { t as ClerkProvider } from "./dist-CU7AhyVe.mjs";
import { t as AuthProvider } from "./use-auth-BHcLpo1A.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-ZfgbmeKX.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var styles_default = "/assets/styles-Crp9Q-nb.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [{ charSet: "utf-8" }, {
			name: "viewport",
			content: "width=device-width, initial-scale=1"
		}],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/clogo.png",
				type: "image/png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: ""
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=DM+Serif+Display&family=Fira+Sans:wght@400;500;600&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClerkProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	}) });
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "top-right",
			richColors: true,
			closeButton: true
		})] })
	});
}
var $$splitComponentImporter$13 = () => import("./routes-DTEZEvkE.mjs");
var Route$13 = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/app" });
	},
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./route-BEGztGbp.mjs");
var Route$12 = createFileRoute("/_authenticated")({
	ssr: false,
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./auth-C_xsr3Mn.mjs");
var Route$11 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — C-Enterprises WorkMonitor" },
		{
			name: "description",
			content: "Sign in to the C-Enterprises WorkMonitor team portal."
		},
		{
			property: "og:title",
			content: "Sign in — C-Enterprises WorkMonitor"
		},
		{
			property: "og:description",
			content: "Team portal sign-in."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
/** An eye that tracks the cursor. `max` is max pupil offset in px. */
var $$splitComponentImporter$10 = () => import("./lock-CZhGVUql.mjs");
var Route$10 = createFileRoute("/lock")({
	validateSearch: (s) => ({ redirect: typeof s.redirect === "string" ? s.redirect : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component"),
	head: () => ({ meta: [{ title: "Enter Passcode · WorkMonitor" }] })
});
var $$splitComponentImporter$9 = () => import("./admin-aslY1cY_.mjs");
var Route$9 = createFileRoute("/_authenticated/admin")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./app-BFMzGY8m.mjs");
var Route$8 = createFileRoute("/_authenticated/app")({
	head: () => ({ meta: [
		{ title: "My Tasks — C-Enterprises WorkMonitor" },
		{
			name: "description",
			content: "Employee task checklist for C-Enterprises WorkMonitor with proof upload and review status."
		},
		{
			property: "og:title",
			content: "My Tasks — C-Enterprises WorkMonitor"
		},
		{
			property: "og:description",
			content: "View assigned work, submit completion proof, and track review status."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./chat-ztLB-0ff.mjs");
var Route$7 = createFileRoute("/_authenticated/chat")({
	head: () => ({ meta: [
		{ title: "Team Chat — C-Enterprises WorkMonitor" },
		{
			name: "description",
			content: "Real-time direct messages, group chat, and file sharing for the C-Enterprises team."
		},
		{
			property: "og:title",
			content: "Team Chat — C-Enterprises WorkMonitor"
		},
		{
			property: "og:description",
			content: "Collaborate with real-time messages, groups, photos, videos, and files."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./dev-CFk32mSr.mjs");
var Route$6 = createFileRoute("/_authenticated/dev")({
	head: () => ({ meta: [
		{ title: "Developer Console — C-Enterprises WorkMonitor" },
		{
			name: "description",
			content: "Restricted developer-only console."
		},
		{
			property: "og:title",
			content: "Developer Console — C-Enterprises WorkMonitor"
		},
		{
			property: "og:description",
			content: "Restricted developer-only console."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex,nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./overview-DRXt5wys.mjs");
var Route$5 = createFileRoute("/_authenticated/overview")({
	head: () => ({ meta: [
		{ title: "Overview — C-Enterprises WorkMonitor" },
		{
			name: "description",
			content: "Your personal workspace overview with task stats and recent activity."
		},
		{
			property: "og:title",
			content: "Overview — C-Enterprises WorkMonitor"
		},
		{
			property: "og:description",
			content: "Personal task overview and productivity snapshot."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./settings-7gckwYC6.mjs");
var Route$4 = createFileRoute("/_authenticated/settings")({
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "Settings · C-Enterprises WorkMonitor" }, {
		name: "description",
		content: "Manage your profile photo and account preferences."
	}] })
});
var $$splitComponentImporter$3 = () => import("./admin.index-Bjd-zhYl.mjs");
var Route$3 = createFileRoute("/_authenticated/admin/")({
	head: () => ({ meta: [
		{ title: "Admin Overview — C-Enterprises WorkMonitor" },
		{
			name: "description",
			content: "Admin dashboard for team performance, task status, and real-time productivity overview."
		},
		{
			property: "og:title",
			content: "Admin Overview — C-Enterprises WorkMonitor"
		},
		{
			property: "og:description",
			content: "Monitor team tasks, approvals, and productivity across C-Enterprises."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.calendar-CADvJwg_.mjs");
var Route$2 = createFileRoute("/_authenticated/admin/calendar")({
	head: () => ({ meta: [
		{ title: "Task Calendar — C-Enterprises WorkMonitor" },
		{
			name: "description",
			content: "Monthly calendar view of team task deadlines and priorities."
		},
		{
			property: "og:title",
			content: "Task Calendar — C-Enterprises WorkMonitor"
		},
		{
			property: "og:description",
			content: "Plan and monitor deadlines across the team."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.tasks-DghDUbJ5.mjs");
var Route$1 = createFileRoute("/_authenticated/admin/tasks")({
	head: () => ({ meta: [
		{ title: "Task Management — C-Enterprises WorkMonitor" },
		{
			name: "description",
			content: "Assign, review, approve, and request revisions for C-Enterprises team tasks."
		},
		{
			property: "og:title",
			content: "Task Management — C-Enterprises WorkMonitor"
		},
		{
			property: "og:description",
			content: "Admin task workflow for assignments, deadlines, proof review, and approvals."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.team-DxgjfdF0.mjs");
var Route = createFileRoute("/_authenticated/admin/team")({
	head: () => ({ meta: [
		{ title: "Team Management — C-Enterprises WorkMonitor" },
		{
			name: "description",
			content: "Create employee accounts, manage team members, positions, and portal roles."
		},
		{
			property: "og:title",
			content: "Team Management — C-Enterprises WorkMonitor"
		},
		{
			property: "og:description",
			content: "Manage the C-Enterprises WorkMonitor team directory and roles."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var AuthenticatedRouteRoute = Route$12.update({
	id: "/_authenticated",
	getParentRoute: () => Route$14
});
var AuthRoute = Route$11.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$14
});
var LockRoute = Route$10.update({
	id: "/lock",
	path: "/lock",
	getParentRoute: () => Route$14
});
var AuthenticatedAdminRoute = Route$9.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppRoute = Route$8.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedChatRoute = Route$7.update({
	id: "/chat",
	path: "/chat",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDevRoute = Route$6.update({
	id: "/dev",
	path: "/dev",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedOverviewRoute = Route$5.update({
	id: "/overview",
	path: "/overview",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSettingsRoute = Route$4.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminRoute
});
var AuthenticatedAdminRouteChildren = {
	AuthenticatedAdminCalendarRoute: Route$2.update({
		id: "/calendar",
		path: "/calendar",
		getParentRoute: () => AuthenticatedAdminRoute
	}),
	AuthenticatedAdminTasksRoute: Route$1.update({
		id: "/tasks",
		path: "/tasks",
		getParentRoute: () => AuthenticatedAdminRoute
	}),
	AuthenticatedAdminTeamRoute: Route.update({
		id: "/team",
		path: "/team",
		getParentRoute: () => AuthenticatedAdminRoute
	}),
	AuthenticatedAdminIndexRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute: AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren),
	AuthenticatedAppRoute,
	AuthenticatedChatRoute,
	AuthenticatedDevRoute,
	AuthenticatedOverviewRoute,
	AuthenticatedSettingsRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	LockRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadDelay: 40,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
