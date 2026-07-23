import { ReactNode, useState, useEffect } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, ListChecks, MessageSquare, Users, LogOut, ShieldCheck, Menu, X, Sparkles, Settings, Calendar, Kanban, Terminal } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { NotificationsBell } from "@/components/layout/NotificationsBell";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { ShortcutsHelp } from "@/components/layout/ShortcutsHelp";

export function AppShell({ children }: { children: ReactNode }) {
  const { role, profile, user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Aggressively preload all workspace data into local cache so switching pages is instant
    if (user) {
      import("@/lib/tasks").then(({ fetchTeam, fetchTasksForAdmin, fetchTasksForUser }) => {
        fetchTeam().catch(() => {});
        if (role === "admin" || pathname.startsWith("/admin")) {
          fetchTasksForAdmin().catch(() => {});
        } else {
          fetchTasksForUser(user.id).catch(() => {});
        }
      });
    }
  }, [user, role, pathname]);

  const isAdmin = role === "admin" || pathname.startsWith("/admin");
  const isDeveloper = profile?.badge === "Developer";
  const baseNav = isAdmin
    ? [
        { to: "/admin", label: "Overview", icon: LayoutDashboard, desc: "Dashboard & analytics" },
        { to: "/admin/tasks", label: "Tasks", icon: ListChecks, desc: "Assign & review" },
        { to: "/admin/calendar", label: "Calendar", icon: Calendar, desc: "Deadline view" },
        { to: "/admin/team", label: "Team", icon: Users, desc: "Members & roles" },
        { to: "/chat", label: "Chat", icon: MessageSquare, desc: "Messages & groups" },
        { to: "/settings", label: "Settings", icon: Settings, desc: "Profile photo" },
      ]
    : [
        { to: "/overview", label: "Overview", icon: LayoutDashboard, desc: "Your snapshot" },
        { to: "/app", label: "My Tasks", icon: ListChecks, desc: "Today's checklist" },
        { to: "/chat", label: "Chat", icon: MessageSquare, desc: "Messages & groups" },
        { to: "/settings", label: "Settings", icon: Settings, desc: "Profile photo" },
      ];
  const nav = isDeveloper
    ? [...baseNav, { to: "/dev", label: "Dev Console", icon: Terminal, desc: "Restricted zone" }]
    : baseNav;



  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  }

  const initials = (profile?.full_name || user?.email || "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const SidebarInner = (
    <div className="relative flex h-full flex-col overflow-hidden bg-sidebar-mesh text-sidebar-foreground">
      {/* subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 sidebar-noise-overlay opacity-40" />
      {/* right edge divider */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-border/70" />



      {/* Brand header */}
      <div className="relative flex items-center justify-between px-5 pb-5 pt-6">
        <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
          <Logo showText={false} className="h-10 w-10" />
          <div className="leading-tight">
            <div className="font-display text-base font-semibold tracking-wide">C-Enterprises</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/60">WorkMonitor</div>
          </div>
        </Link>
        <button
          className="rounded-md p-1 text-sidebar-foreground/70 hover:bg-black/5 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Role badge */}
      <div className="relative mx-5 mb-4 flex items-center gap-2 rounded-lg border border-black/5 bg-white/60 px-3 py-2 shadow-sm backdrop-blur">
        {isAdmin ? (
          <ShieldCheck className="h-4 w-4 text-[oklch(0.28_0.09_265)]" />
        ) : (
          <Sparkles className="h-4 w-4 text-[oklch(0.5_0.16_260)]" />
        )}
          <div className="text-xs">
            <div className="font-medium">{isAdmin ? "Admin Portal" : "User Portal"}</div>
          <div className="text-[10px] text-sidebar-foreground/60">Real-time workspace</div>
        </div>
      </div>

      {/* Nav section */}
      <div className="relative px-5 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/50">
        Workspace
      </div>
      <nav className="relative flex-1 space-y-1 overflow-hidden px-3">
        {nav.map((item) => {
          const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              preload="intent"
              onClick={() => setMobileOpen(false)}

              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                active
                  ? "bg-white text-sidebar-foreground shadow-md shadow-black/5 ring-1 ring-black/5"
                  : "text-sidebar-foreground/75 hover:bg-white/60 hover:text-sidebar-foreground"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[oklch(0.28_0.09_265)]" />
              )}
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  active
                    ? "bg-[oklch(0.28_0.09_265)] text-white"
                    : "bg-black/5 text-sidebar-foreground/70 group-hover:bg-black/10 group-hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="font-medium">{item.label}</span>
                <span className="truncate text-[10px] text-sidebar-foreground/50">{item.desc}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="relative m-3 mt-4 rounded-xl border border-black/5 bg-white/70 p-3 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)] text-xs font-semibold text-white">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{profile?.full_name || user?.email}</div>
            <div className="truncate text-[10px] text-sidebar-foreground/60">{profile?.position || (isAdmin ? "Admin" : "Employee")}</div>
          </div>
          <button
            onClick={signOut}
            className="rounded-md p-1.5 text-sidebar-foreground/70 transition hover:bg-black/5 hover:text-sidebar-foreground"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-72 flex-col md:flex">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col shadow-2xl animate-slide-in-left">
            {SidebarInner}
          </aside>
        </div>
      )}


      <div className="flex min-w-0 flex-1 flex-col">
        <header className={`sticky top-0 z-30 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 bg-background/70 px-4 py-3 backdrop-blur-xl sm:px-6 ${pathname === "/chat" ? "grid md:hidden" : "grid"}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 hover:bg-muted md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="md:hidden"><Logo showText={false} className="h-8 w-8" /></div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold">{profile?.full_name || user?.email}</span>
              <span className="hidden rounded-full border border-border/70 bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
                {isAdmin ? "Admin" : "User"}
              </span>
            </div>
            <div className="truncate text-xs text-muted-foreground">{profile?.position || (isAdmin ? "Administrator" : "Team member")}</div>

          </div>
          <div className="flex shrink-0 items-center gap-2">
            <GlobalSearch />
            <ShortcutsHelp />
            <NotificationsBell />
            <Button size="sm" variant="outline" onClick={signOut} className="rounded-full">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>
        <main className="relative min-w-0 flex-1 overflow-hidden bg-white" aria-busy={!profile && !user}>
          <div key={pathname} className={pathname === "/chat" ? "page-view relative h-full" : "page-view relative mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8"}>
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}
