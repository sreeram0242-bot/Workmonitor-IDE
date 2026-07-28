import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, ListChecks, Users, Download, CalendarRange } from "lucide-react";
import {
  fetchTasksForAdmin,
  fetchTeam,
  getCachedAdminTasks,
  getCachedTeam,
  priorityColor,
  statusColor,
  sortByPriority,
  type TaskRow,
  type TeamMember,
} from "@/lib/tasks";
import { useRealtimeSubscription } from "@/hooks/use-realtime";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview — C-Enterprises WorkMonitor" },
      {
        name: "description",
        content:
          "Admin dashboard for team performance, task status, and real-time productivity overview.",
      },
      { property: "og:title", content: "Admin Overview — C-Enterprises WorkMonitor" },
      {
        property: "og:description",
        content: "Monitor team tasks, approvals, and productivity across C-Enterprises.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminOverview,
});

type RangeKey = "7d" | "30d" | "90d" | "all" | "custom";

function rangeStart(key: RangeKey, customFrom: string): Date | null {
  const now = new Date();
  if (key === "all") return null;
  if (key === "custom") return customFrom ? new Date(customFrom) : null;
  const days = key === "7d" ? 7 : key === "30d" ? 30 : 90;
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toCSV(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join(
    "\n",
  );
}

function downloadCSV(name: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function AdminOverview() {
  const [tasks, setTasks] = useState<TaskRow[]>(() => getCachedAdminTasks() ?? []);
  const [team, setTeam] = useState<TeamMember[]>(() => getCachedTeam() ?? []);
  const [range, setRange] = useState<RangeKey>("30d");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");
  const [drill, setDrill] = useState<TeamMember | null>(null);

  async function reloadTasks() {
    const t = await fetchTasksForAdmin();
    setTasks(t);
  }
  async function reloadAll() {
    const [t, m] = await Promise.all([fetchTasksForAdmin(), fetchTeam()]);
    setTasks(t);
    setTeam(m);
  }

  useEffect(() => {
    reloadAll();
  }, []);

  useRealtimeSubscription("tasks", "task-updates", () => {
    reloadTasks();
  });

  const from = rangeStart(range, customFrom);
  const to =
    range === "custom" && customTo ? new Date(new Date(customTo).setHours(23, 59, 59, 999)) : null;

  const filtered = useMemo(
    () =>
      sortByPriority(
        tasks.filter((t) => {
          const created = new Date(t.created_at);
          if (from && created < from) return false;
          if (to && created > to) return false;
          return true;
        }),
      ),
    [tasks, from, to],
  );

  const approvedInRange = filtered.filter((t) => t.status === "approved").length;
  const nameFor = new Map(team.map((m) => [m.id, m.full_name]));

  const stats = [
    { label: "Team members", value: team.length, icon: Users, to: "/admin/team" },
    {
      label: "Pending",
      value: filtered.filter((t) => t.status === "pending").length,
      icon: Clock,
      to: "/admin/tasks?status=pending",
    },
    {
      label: "Awaiting review",
      value: filtered.filter((t) => t.status === "completed").length,
      icon: ListChecks,
      to: "/admin/tasks?status=completed",
    },
    {
      label: "Approved in range",
      value: approvedInRange,
      icon: CheckCircle2,
      to: "/admin/tasks?status=approved",
    },
  ];

  const recent = filtered.slice(0, 6);

  const perMember = useMemo(
    () =>
      team.map((m) => {
        const mine = filtered.filter((t) => t.assigned_to === m.id);
        return {
          id: m.id,
          name: m.full_name.split(" ")[0] || m.full_name,
          pending: mine.filter((t) => t.status === "pending").length,
          completed: mine.filter((t) => t.status === "completed").length,
          approved: mine.filter((t) => t.status === "approved").length,
          revision: mine.filter((t) => t.status === "revision").length,
        };
      }),
    [team, filtered],
  );

  const statusData: { name: string; value: number; color: string }[] = [
    {
      name: "Pending",
      value: filtered.filter((t) => t.status === "pending").length,
      color: "#94a3b8",
    },
    {
      name: "In review",
      value: filtered.filter((t) => t.status === "completed").length,
      color: "#3b82f6",
    },
    {
      name: "Approved",
      value: filtered.filter((t) => t.status === "approved").length,
      color: "#10b981",
    },
    {
      name: "Revision",
      value: filtered.filter((t) => t.status === "revision").length,
      color: "#f97316",
    },
  ];

  function exportCSV() {
    const rows = filtered.map((t) => ({
      id: t.id,
      title: t.title,
      assignee: nameFor.get(t.assigned_to) ?? "",
      priority: t.priority,
      status: t.status,
      deadline: t.deadline ?? "",
      created_at: t.created_at,
      updated_at: t.updated_at,
      revision_note: t.revision_note ?? "",
    }));
    downloadCSV(`tasks-${new Date().toISOString().slice(0, 10)}.csv`, toCSV(rows));
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Team Overview</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time snapshot of task completion and team performance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <CalendarRange className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
              <SelectTrigger className="h-9 w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="custom">Custom…</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {range === "custom" && (
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="h-9 flex-1 sm:w-[140px]"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <Input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="h-9 flex-1 sm:w-[140px]"
              />
            </div>
          )}
          <Button size="sm" variant="outline" onClick={exportCSV} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to as any} className="block group">
            <Card className="p-3 sm:p-4 transition-all duration-200 group-hover:border-blue-500/40 group-hover:shadow-md group-hover:scale-[1.02] cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-1.5">
                <CardTitle className="text-[11px] sm:text-xs font-medium text-muted-foreground group-hover:text-blue-600 transition-colors">
                  {s.label}
                </CardTitle>
                <s.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-accent group-hover:text-blue-600 transition-colors" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="font-display text-2xl sm:text-3xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2 sm:pb-4">
            <CardTitle className="text-sm sm:text-base font-bold">Tasks per team member</CardTitle>
            <span className="text-[11px] sm:text-xs text-muted-foreground">Click a bar to drill down</span>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 h-56 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={perMember}
                margin={{ top: 8, right: 12, left: -12, bottom: 24 }}
                onClick={(e: any) => {
                  const id = e?.activePayload?.[0]?.payload?.id;
                  const m = team.find((t) => t.id === id);
                  if (m) setDrill(m);
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="name"
                  fontSize={11}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                  tickMargin={6}
                />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(15, 27, 61, 0.06)" }}
                  wrapperStyle={{ outline: "none" }}
                  contentStyle={{
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    fontSize: 12,
                    borderRadius: 12,
                    padding: "10px 12px",
                    boxShadow: "0 12px 32px -12px rgba(15,27,61,0.25)",
                    color: "#0f172a",
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: 6, color: "#0f172a" }}
                  itemStyle={{
                    padding: "1px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    color: "#0f172a",
                  }}
                  formatter={(value: number, name: string) => [
                    value,
                    name.charAt(0).toUpperCase() + name.slice(1),
                  ]}
                  separator="  "
                />
                <Bar
                  dataKey="approved"
                  stackId="a"
                  fill="#10b981"
                  radius={[0, 0, 0, 0]}
                  className="cursor-pointer"
                />
                <Bar dataKey="completed" stackId="a" fill="#3b82f6" className="cursor-pointer" />
                <Bar dataKey="pending" stackId="a" fill="#94a3b8" className="cursor-pointer" />
                <Bar
                  dataKey="revision"
                  stackId="a"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                  className="cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
            <CardTitle className="text-sm sm:text-base font-bold">Status breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 flex h-48 sm:h-72 flex-col gap-2">
            <div className="min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={36}
                    outerRadius={60}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {statusData.map((s, i) => (
                      <Cell key={i} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      fontSize: 12,
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
              {statusData.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-2 py-1"
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="truncate text-muted-foreground">{s.name}</span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Recent tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recent.length === 0 ? (
            <div className="text-sm text-muted-foreground">No tasks in this range.</div>
          ) : (
            recent.map((t) => (
              <div
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 py-2 last:border-0"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {nameFor.get(t.assigned_to) ?? "—"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className={priorityColor(t.priority)}>
                    {t.priority}
                  </Badge>
                  <Badge variant="outline" className={statusColor(t.status)}>
                    {t.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={!!drill} onOpenChange={(o) => !o && setDrill(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{drill?.full_name} — tasks in range</DialogTitle>
          </DialogHeader>
          {drill && <MemberDrill tasks={filtered.filter((t) => t.assigned_to === drill.id)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MemberDrill({ tasks }: { tasks: TaskRow[] }) {
  if (tasks.length === 0)
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">No tasks in this range.</div>
    );
  const sortedTasks = sortByPriority(tasks);
  const counts = {
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    approved: tasks.filter((t) => t.status === "approved").length,
    revision: tasks.filter((t) => t.status === "revision").length,
  };
  const completion = tasks.length > 0 ? Math.round((counts.approved / tasks.length) * 100) : 0;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2 text-center">
        {(Object.keys(counts) as (keyof typeof counts)[]).map((k) => (
          <div key={k} className="rounded-md bg-muted/50 py-2">
            <div className="text-lg font-semibold">{counts[k]}</div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{k}</div>
          </div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground">
        Approval rate: <span className="font-semibold text-foreground">{completion}%</span>
      </div>
      <div className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
        {sortedTasks.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-2 rounded-md border border-border/60 px-3 py-2 text-sm"
          >
            <div className="min-w-0 truncate">{t.title}</div>
            <div className="flex shrink-0 gap-1.5">
              <Badge variant="outline" className={priorityColor(t.priority)}>
                {t.priority}
              </Badge>
              <Badge variant="outline" className={statusColor(t.status)}>
                {t.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
