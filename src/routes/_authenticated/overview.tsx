import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, ListChecks, AlertTriangle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchTasksForUser,
  getCachedUserTasks,
  priorityColor,
  statusColor,
  type TaskRow,
} from "@/lib/tasks";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/overview")({
  head: () => ({
    meta: [
      { title: "Overview — C-Enterprises WorkMonitor" },
      {
        name: "description",
        content: "Your personal workspace overview with task stats and recent activity.",
      },
      { property: "og:title", content: "Overview — C-Enterprises WorkMonitor" },
      { property: "og:description", content: "Personal task overview and productivity snapshot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UserOverview,
});

function UserOverview() {
  const { user, role, profile, loading } = useAuth();
  const cached = user ? getCachedUserTasks(user.id) : null;
  const [tasks, setTasks] = useState<TaskRow[]>(cached ?? []);

  useEffect(() => {
    if (!user) return;
    fetchTasksForUser(user.id).then(setTasks);
    // Realtime polling will be implemented in Stage 5
  }, [user?.id]);

  const now = Date.now();
  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  const endOfToday = startOfToday + 24 * 60 * 60 * 1000;

  const open = tasks.filter((t) => t.status === "pending" || t.status === "revision");
  const overdue = open.filter((t) => t.deadline && new Date(t.deadline).getTime() < now).length;
  const dueToday = open.filter((t) => {
    if (!t.deadline) return false;
    const d = new Date(t.deadline).getTime();
    return d >= now && d < endOfToday;
  }).length;
  const inReview = tasks.filter((t) => t.status === "completed").length;
  const approvedTotal = tasks.filter((t) => t.status === "approved").length;

  const stats = [
    {
      label: "Overdue",
      value: overdue,
      icon: AlertTriangle,
      tone: overdue > 0 ? "text-red-600" : "text-muted-foreground",
    },
    {
      label: "Due today",
      value: dueToday,
      icon: Clock,
      tone: dueToday > 0 ? "text-amber-600" : "text-muted-foreground",
    },
    { label: "Awaiting review", value: inReview, icon: ListChecks, tone: "text-brand-accent" },
    { label: "Approved", value: approvedTotal, icon: CheckCircle2, tone: "text-emerald-600" },
  ];

  const statusData = useMemo(
    () => [
      {
        name: "Pending",
        value: tasks.filter((t) => t.status === "pending").length,
        color: "#94a3b8",
      },
      {
        name: "In review",
        value: tasks.filter((t) => t.status === "completed").length,
        color: "#3b82f6",
      },
      { name: "Approved", value: approvedTotal, color: "#10b981" },
      {
        name: "Revision",
        value: tasks.filter((t) => t.status === "revision").length,
        color: "#f97316",
      },
    ],
    [tasks, approvedTotal],
  );

  const upcoming = [...open]
    .filter((t) => t.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  if (loading)
    return <div className="py-16 text-center text-sm text-muted-foreground">Loading…</div>;
  if (role === "admin") return <Navigate to="/admin" />;

  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((approvedTotal / total) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">
            {greet}, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground">Your personal workspace snapshot.</p>
        </div>
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-muted"
        >
          Open my tasks <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="transition hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.tone}`} />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Upcoming deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Nothing scheduled — nice work.
              </div>
            ) : (
              upcoming.map((t) => (
                <Link
                  key={t.id}
                  to="/app"
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2 transition hover:border-brand-accent/40 hover:bg-muted/60"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Due{" "}
                      {new Date(t.deadline!).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
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
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">My status</CardTitle>
          </CardHeader>
          <CardContent className="flex h-64 flex-col gap-3">
            <div className="min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={68}
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
            <div className="text-center text-xs text-muted-foreground">
              Completion rate:{" "}
              <span className="font-semibold text-foreground">{completionRate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
