import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster, toast } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "../integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/clogo.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=DM+Serif+Display&family=Fira+Sans:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  // Global broadcast listener + app-wide presence beacon
  useEffect(() => {
    let cancelled = false;
    let ch: ReturnType<typeof supabase.channel> | null = null;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled || !user) return;
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      const fullName = (profile as any)?.full_name || user.email || "Someone";

      ch = supabase.channel("app-presence", { config: { presence: { key: user.id } } });
      ch.on("broadcast", { event: "toast" }, ({ payload }) => {
        const msg = payload?.message ?? "";
        const from = payload?.from ?? "Developer";
        toast(msg, { description: `From ${from}`, duration: 6000 });
      });
      ch.on("broadcast", { event: "confetti" }, () => {
        launchConfetti();
      });
      ch.on("presence", { event: "sync" }, () => {
        const state = ch?.presenceState() ?? {};
        const flat = Object.values(state).flat();
        (window as any).__workmonitorPresence = flat;
        window.dispatchEvent(new CustomEvent("workmonitor-presence", { detail: flat }));
      });

      const track = () => {
        if (document.documentElement.classList.contains("dev-ghost-mode")) return;
        ch?.track({ user_id: user.id, full_name: fullName, page: window.location.pathname, at: Date.now() });
      };
      ch.subscribe((status) => {
        if (status === "SUBSCRIBED") track();
      });
      const onNav = () => track();
      window.addEventListener("popstate", onNav);
      const intv = setInterval(track, 30000);

      (window as any).__cleanupPresence = () => {
        window.removeEventListener("popstate", onNav);
        clearInterval(intv);
      };
    })();

    return () => {
      cancelled = true;
      (window as any).__cleanupPresence?.();
      if (ch) supabase.removeChannel(ch);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}

function launchConfetti() {
  const root = document.createElement("div");
  root.className = "confetti-root";
  document.body.appendChild(root);
  const colors = ["#0F1B3D", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
  for (let i = 0; i < 90; i++) {
    const p = document.createElement("i");
    p.className = "confetti-piece";
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * 0.4 + "s";
    p.style.animationDuration = (2 + Math.random() * 1.8) + "s";
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    root.appendChild(p);
  }
  setTimeout(() => root.remove(), 4200);
}

