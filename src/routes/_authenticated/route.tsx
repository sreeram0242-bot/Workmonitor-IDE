import { createFileRoute, Outlet, Navigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: RouteComponent,
});

function AuthenticatedLayout() {
  // Synchronous check before any hooks or loading states to avoid bounce race conditions
  const unlocked = typeof window !== "undefined" ? sessionStorage.getItem("wm_unlocked") : null;
  const backgroundedAt = typeof window !== "undefined" ? Number(localStorage.getItem("wm_bg_at") || "0") : 0;
  const withinGrace = backgroundedAt > 0 && Date.now() - backgroundedAt < 60_000;

  if (typeof window !== "undefined" && !unlocked && !withinGrace) {
    const currentPath = window.location.pathname;
    const redirectTarget = currentPath && currentPath !== "/lock" ? currentPath : "/app";
    return <Navigate to="/lock" search={{ redirect: redirectTarget }} replace />;
  }

  if (typeof window !== "undefined" && !unlocked && withinGrace) {
    sessionStorage.setItem("wm_unlocked", "1");
    localStorage.removeItem("wm_bg_at");
  }

  // We handle auth redirection inside the layout component itself because
  // useAuth depends on Clerk's useUser which is inside the ClerkProvider.
  const { loading, user } = useAuth();

  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const router = useRouter();
  const userId = user?.id;

  // Mobile: re-lock whenever the app is backgrounded
  // Desktop: 15-minute idle auto-lock.
  useEffect(() => {
    if (!userId) return;
    const isMobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    
    const markActivity = () => localStorage.setItem(`wm_last_active:${userId}`, String(Date.now()));
    const relockNow = () => sessionStorage.removeItem("wm_unlocked");

    if (isMobile) {
      const onVis = () => {
        if (document.visibilityState === "hidden") {
          relockNow();
          localStorage.setItem("wm_bg_at", String(Date.now()));
        } else {
          const bgAt = Number(localStorage.getItem("wm_bg_at") || "0");
          if (bgAt > 0 && Date.now() - bgAt < 60_000) {
            sessionStorage.setItem("wm_unlocked", "1");
            localStorage.removeItem("wm_bg_at");
          } else if (bgAt > 0) {
            router.navigate({ to: "/lock", search: { redirect: window.location.pathname }, replace: true });
          }
        }
      };
      document.addEventListener("visibilitychange", onVis);
      return () => {
        document.removeEventListener("visibilitychange", onVis);
      };
    }

    // Desktop idle lock: 15 minutes without input
    const IDLE_MS = 15 * 60 * 1000;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      markActivity();
      clearTimeout(timer);
      timer = setTimeout(() => {
        relockNow();
        router.navigate({ to: "/lock", search: { redirect: window.location.pathname }, replace: true });
      }, IDLE_MS);
    };
    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [userId]);

  // Don't block render with "Loading..." if the user is already truthy but loading profile is stuck
  if (loading && !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function RouteComponent() {
  return <AuthenticatedLayout />;
}
