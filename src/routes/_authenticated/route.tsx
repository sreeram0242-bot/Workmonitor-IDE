import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider, type AppRole, type AuthState } from "@/hooks/use-auth";

type CachedAuth = {
  loading: false;
  session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"];
  user: NonNullable<Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"]>;
  role: AppRole;
  profile: NonNullable<AuthState["profile"]>;
};

let cachedAuth: CachedAuth | null = null;

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      cachedAuth = null;
      throw redirect({ to: "/auth" });
    }

    // Passcode gate. Mobile has a 60s grace period so quick app switches
    // (checking WhatsApp, notifications, file pickers) don't force re-lock.
    if (typeof window !== "undefined") {
      const uid = session.user.id;
      const unlocked = sessionStorage.getItem(`wm_unlocked:${uid}`);
      const backgroundedAt = Number(sessionStorage.getItem(`wm_bg_at:${uid}`) || "0");
      const withinGrace = backgroundedAt > 0 && Date.now() - backgroundedAt < 60_000;
      if (!unlocked && !withinGrace) {
        throw redirect({ to: "/lock", search: { redirect: location.href } });
      }
      // Coming back within grace: restore unlocked flag & clear grace timer
      if (!unlocked && withinGrace) {
        sessionStorage.setItem(`wm_unlocked:${uid}`, "1");
        sessionStorage.removeItem(`wm_bg_at:${uid}`);
      }
    }

    if (cachedAuth && cachedAuth.user.id === session.user.id && "badge" in cachedAuth.profile) {
      cachedAuth = { ...cachedAuth, session };
      return { initialAuthState: cachedAuth };
    }

    const [{ data: roleRow }, { data: profile }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", session.user.id).maybeSingle(),
      supabase
        .from("profiles")
        .select("full_name, position, avatar_url, badge, notify_tasks, notify_messages, presence_hidden")
        .eq("id", session.user.id)
        .maybeSingle(),
    ]);

    cachedAuth = {
      loading: false,
      session,
      user: session.user,
      role: (roleRow?.role as AppRole | undefined) ?? "user",
      profile: profile ?? { full_name: "", position: "", avatar_url: null },
    };

    return { initialAuthState: cachedAuth };
  },
  component: AuthenticatedLayout,
});

// Invalidate cache on sign-out so a new user re-fetches their role/profile.
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT" || event === "USER_UPDATED") {
    cachedAuth = null;
    if (typeof window !== "undefined" && session?.user?.id) {
      sessionStorage.removeItem(`wm_unlocked:${session.user.id}`);
    }
  }
});

function AuthenticatedLayout() {
  const { initialAuthState } = Route.useRouteContext();
  const userId = initialAuthState?.user?.id;

  // Mobile: re-lock whenever the app is backgrounded (not on `blur` — that
  // fires for the address bar, file pickers, etc. and would re-lock mid-task).
  // Desktop: 15-minute idle auto-lock.
  useEffect(() => {
    if (!userId) return;
    const isMobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    // Mobile: mark backgrounded time instead of hard-relocking. beforeLoad
    // will keep the tab unlocked if they come back within 60s.
    const markBackgrounded = () => {
      sessionStorage.setItem(`wm_bg_at:${userId}`, String(Date.now()));
      sessionStorage.removeItem(`wm_unlocked:${userId}`);
    };
    const relockNow = () => sessionStorage.removeItem(`wm_unlocked:${userId}`);

    if (isMobile) {
      const onVis = () => { if (document.visibilityState === "hidden") markBackgrounded(); };
      document.addEventListener("visibilitychange", onVis);
      window.addEventListener("pagehide", markBackgrounded);
      return () => {
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pagehide", markBackgrounded);
      };
    }

    // Desktop idle lock: 15 minutes without input
    const IDLE_MS = 15 * 60 * 1000;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        relockNow();
        window.location.reload();
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

  return (
    <AuthProvider initialState={initialAuthState}>
      <AppShell>
        <Outlet />
      </AppShell>
    </AuthProvider>
  );
}
