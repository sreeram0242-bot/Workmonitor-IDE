import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ListChecks,
  User,
  Plus,
  MessageSquare,
  Settings as SettingsIcon,
  BarChart3,
  Users,
  LayoutGrid,
  Calendar,
  LogOut,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  fetchTasksForAdmin,
  fetchTeam,
  getCachedAdminTasks,
  getCachedTeam,
  type TaskRow,
  type TeamMember,
} from "@/lib/tasks";
import { useAuth } from "@/hooks/use-auth";

type QuickAction = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const navigate = useNavigate();
  const { role, signOut } = useAuth();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    setTasks(getCachedAdminTasks() ?? []);
    setTeam(getCachedTeam() ?? []);
    if (role === "admin")
      fetchTasksForAdmin()
        .then(setTasks)
        .catch(() => {});
    fetchTeam()
      .then(setTeam)
      .catch(() => {});
  }, [open, role]);

  const query = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!query) return { tasks: [] as TaskRow[], people: [] as TeamMember[] };
    return {
      tasks: tasks
        .filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            (t.description ?? "").toLowerCase().includes(query) ||
            (t.tags ?? []).some((tag) => tag.toLowerCase().includes(query)),
        )
        .slice(0, 8),
      people: team
        .filter(
          (p) =>
            p.full_name.toLowerCase().includes(query) ||
            p.position.toLowerCase().includes(query) ||
            (p.badge ?? "").toLowerCase().includes(query),
        )
        .slice(0, 6),
    };
  }, [query, tasks, team]);

  const go = (to: string) => {
    setOpen(false);
    setQ("");
    navigate({ to });
  };

  const isAdmin = role === "admin";
  const actions: QuickAction[] = useMemo(() => {
    const list: QuickAction[] = [];
    if (isAdmin) {
      list.push({
        id: "new-task",
        label: "New task",
        hint: "Assign to a teammate",
        icon: Plus,
        run: () => go("/admin/tasks?new=1"),
      });
      list.push({ id: "team", label: "Manage team", icon: Users, run: () => go("/admin/team") });
      list.push({ id: "tasks", label: "Tasks", icon: CheckCircle2, run: () => go("/admin/tasks") });
      list.push({
        id: "calendar",
        label: "Calendar",
        icon: Calendar,
        run: () => go("/admin/calendar"),
      });
      list.push({
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        run: () => go("/admin/analytics"),
      });
    } else {
      list.push({ id: "my-tasks", label: "My tasks", icon: ListChecks, run: () => go("/app") });
    }
    list.push({ id: "chat", label: "Open chat", icon: MessageSquare, run: () => go("/chat") });
    list.push({
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      run: () => go("/settings"),
    });
    list.push({
      id: "signout",
      label: "Sign out",
      icon: LogOut,
      run: async () => {
        setOpen(false);
        await signOut();
      },
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const filteredActions = useMemo(() => {
    if (!query) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(query));
  }, [actions, query]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-secondary sm:inline-flex"
        aria-label="Search"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search…</span>
        <kbd className="ml-2 rounded border bg-background px-1.5 py-0.5 text-[10px] font-mono">
          ⌘K
        </kbd>
      </button>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 hover:bg-muted sm:hidden"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tasks, people, tags…"
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2 text-sm">
            {filteredActions.length > 0 && (
              <div className="mb-2">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {query ? "Actions" : "Quick actions"}
                </div>
                {filteredActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.id}
                      onClick={a.run}
                      className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-muted"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{a.label}</div>
                        {a.hint && (
                          <div className="truncate text-xs text-muted-foreground">{a.hint}</div>
                        )}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                    </button>
                  );
                })}
              </div>
            )}
            {query &&
              results.tasks.length === 0 &&
              results.people.length === 0 &&
              filteredActions.length === 0 && (
                <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No results.
                </div>
              )}
            {results.tasks.length > 0 && (
              <div className="mb-2">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Tasks
                </div>
                {results.tasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => go(role === "admin" ? "/admin/tasks" : "/app")}
                    className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left hover:bg-muted"
                  >
                    <ListChecks className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{t.title}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {t.status} · {t.priority}
                        {t.deadline ? ` · ${new Date(t.deadline).toLocaleDateString()}` : ""}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {results.people.length > 0 && (
              <div>
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  People
                </div>
                {results.people.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => go(role === "admin" ? "/admin/team" : "/chat")}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-muted"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-[10px] font-semibold">
                      {p.avatar_url ? (
                        <img src={p.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{p.full_name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {p.position}
                        {p.badge ? ` · ${p.badge}` : ""}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
