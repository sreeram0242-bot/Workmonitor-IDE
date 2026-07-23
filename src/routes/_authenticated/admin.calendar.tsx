import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchTasksForAdmin, fetchTeam, getCachedAdminTasks, getCachedTeam, type TaskRow, type TeamMember } from "@/lib/tasks";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/calendar")({
  head: () => ({
    meta: [
      { title: "Task Calendar — C-Enterprises WorkMonitor" },
      { name: "description", content: "Monthly calendar view of team task deadlines and priorities." },
      { property: "og:title", content: "Task Calendar — C-Enterprises WorkMonitor" },
      { property: "og:description", content: "Plan and monitor deadlines across the team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CalendarPage,
});

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function addMonths(d: Date, n: number) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function sameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

function CalendarPage() {
  const [tasks, setTasks] = useState<TaskRow[]>(() => getCachedAdminTasks() ?? []);
  const [team, setTeam] = useState<TeamMember[]>(() => getCachedTeam() ?? []);
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  useEffect(() => {
    fetchTasksForAdmin().then(setTasks).catch(() => {});
    fetchTeam().then(setTeam).catch(() => {});
    const ch = supabase.channel("cal-tasks").on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => {
      fetchTasksForAdmin().then(setTasks).catch(() => {});
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const nameOf = (id: string) => team.find((t) => t.id === id)?.full_name ?? "—";

  const cells = useMemo(() => {
    const first = startOfMonth(cursor);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [cursor]);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, TaskRow[]>();
    for (const t of tasks) {
      if (!t.deadline) continue;
      const d = new Date(t.deadline);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const arr = map.get(key) ?? [];
      arr.push(t);
      map.set(key, arr);
    }
    return map;
  }, [tasks]);

  const priColor = (p: TaskRow["priority"]) => p === "high" ? "bg-red-500" : p === "medium" ? "bg-amber-500" : "bg-emerald-500";
  const today = new Date();
  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Calendar</h1>
          <p className="text-sm text-muted-foreground">Task deadlines across the team.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCursor(addMonths(cursor, -1))}><ChevronLeft className="h-4 w-4" /></Button>
          <div className="min-w-[10rem] text-center text-sm font-semibold">{monthLabel}</div>
          <Button variant="outline" size="icon" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(startOfMonth(new Date()))}>Today</Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-muted/30 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="px-2 py-2 text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const key = d ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` : `e${i}`;
            const items = d ? tasksByDay.get(key) ?? [] : [];
            const isToday = d && sameDay(d, today);
            return (
              <div key={key} className={`min-h-[110px] border-b border-r p-1.5 text-xs ${d ? "" : "bg-muted/10"}`}>
                {d && (
                  <div className={`mb-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                    {d.getDate()}
                  </div>
                )}
                <div className="space-y-1">
                  {items.slice(0, 3).map((t) => (
                    <div key={t.id} className="flex items-center gap-1.5 truncate rounded-md border bg-white/70 px-1.5 py-1">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${priColor(t.priority)}`} />
                      <span className="truncate font-medium">{t.title}</span>
                      <span className="ml-auto hidden truncate text-[10px] text-muted-foreground sm:inline">{nameOf(t.assigned_to)}</span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="pl-1 text-[10px] text-muted-foreground">+{items.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
