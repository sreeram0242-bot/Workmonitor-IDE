import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchTasksForAdmin,
  fetchTeam,
  getCachedAdminTasks,
  getCachedTeam,
  fetchReminders,
  addReminder,
  type TaskRow,
  type TeamMember,
  type ReminderRow,
} from "@/lib/tasks";
import { scheduleOneSignalNotification } from "@/lib/notify";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useRealtimeSubscription } from "@/hooks/use-realtime";

export const Route = createFileRoute("/_authenticated/admin/calendar")({
  head: () => ({
    meta: [
      { title: "Task Calendar — C-Enterprises WorkMonitor" },
      {
        name: "description",
        content: "Monthly calendar view of team task deadlines and priorities.",
      },
      { property: "og:title", content: "Task Calendar — C-Enterprises WorkMonitor" },
      { property: "og:description", content: "Plan and monitor deadlines across the team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CalendarPage,
});

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function CalendarPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskRow[]>(() => getCachedAdminTasks() ?? []);
  const [team, setTeam] = useState<TeamMember[]>(() => getCachedTeam() ?? []);
  const [reminders, setReminders] = useState<ReminderRow[]>([]);
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  // Reminder Dialog State
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderTime, setReminderTime] = useState("09:00");
  const [addingReminder, setAddingReminder] = useState(false);

  useEffect(() => {
    function load() {
      fetchTasksForAdmin()
        .then(setTasks)
        .catch(() => {});
      fetchTeam()
        .then(setTeam)
        .catch(() => {});
      fetchReminders()
        .then(setReminders)
        .catch(() => {});
    }
    load();
  }, []);

  useRealtimeSubscription("tasks", "task-updates", () => {
    fetchTasksForAdmin()
      .then(setTasks)
      .catch(() => {});
  });

  async function handleAddReminder(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !user) return;
    try {
      setAddingReminder(true);
      const [hours, minutes] = reminderTime.split(":");
      const remindAt = new Date(selectedDate);
      remindAt.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      const r = await addReminder(reminderTitle, remindAt);
      if (r) setReminders((prev) => [...prev, r]);

      await scheduleOneSignalNotification(user.id, "WorkMonitor Reminder", reminderTitle, remindAt);

      toast.success("Reminder set!");
      setReminderDialogOpen(false);
      setReminderTitle("");
    } catch (err) {
      toast.error("Failed to add reminder");
    } finally {
      setAddingReminder(false);
    }
  }

  const nameOf = (id: string) => team.find((t) => t.id === id)?.full_name ?? "—";

  const cells = useMemo(() => {
    const first = startOfMonth(cursor);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++)
      arr.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [cursor]);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, TaskRow[]>();
    for (const t of tasks) {
      if (!t.deadline || (Array.isArray(t.tags) && t.tags.includes("reminder"))) continue;
      const d = new Date(t.deadline);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const arr = map.get(key) ?? [];
      arr.push(t);
      map.set(key, arr);
    }
    return map;
  }, [tasks]);

  const remindersByDay = useMemo(() => {
    const map = new Map<string, ReminderRow[]>();
    for (const r of reminders) {
      const d = new Date(r.remind_at);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const arr = map.get(key) ?? [];
      arr.push(r);
      map.set(key, arr);
    }
    return map;
  }, [reminders]);

  const priColor = (p: TaskRow["priority"]) =>
    p === "high" ? "bg-red-500" : p === "medium" ? "bg-amber-500" : "bg-emerald-500";
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
          <Button variant="outline" size="icon" onClick={() => setCursor(addMonths(cursor, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[10rem] text-center text-sm font-semibold">{monthLabel}</div>
          <Button variant="outline" size="icon" onClick={() => setCursor(addMonths(cursor, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(startOfMonth(new Date()))}>
            Today
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-muted/30 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="px-2 py-2 text-center">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const key = d ? `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` : `e${i}`;
            const items = d ? (tasksByDay.get(key) ?? []) : [];
            const isToday = d && sameDay(d, today);
            return (
              <div
                key={key}
                className={`min-h-[110px] border-b border-r p-1.5 text-xs ${d ? "" : "bg-muted/10"}`}
              >
                {d && (
                  <div className="flex items-center justify-between mb-1">
                    <div
                      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                    >
                      {d.getDate()}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(d);
                        setReminderDialogOpen(true);
                      }}
                      className="text-muted-foreground hover:text-primary p-0.5 rounded transition"
                      aria-label="Add reminder"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="space-y-1">
                  {items.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-1.5 truncate rounded-md border bg-white/70 px-1.5 py-1"
                    >
                      <span className={`h-2 w-2 shrink-0 rounded-full ${priColor(t.priority)}`} />
                      <span className="truncate font-medium">{t.title}</span>
                      <span className="ml-auto hidden truncate text-[10px] text-muted-foreground sm:inline">
                        {nameOf(t.assigned_to)}
                      </span>
                    </div>
                  ))}
                  {(remindersByDay.get(key) ?? []).map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center gap-1.5 truncate rounded-md border border-purple-200 bg-purple-50/50 px-1.5 py-1 text-purple-700"
                    >
                      <Bell className="h-2.5 w-2.5 shrink-0" />
                      <span className="truncate font-medium">{r.title}</span>
                      <span className="ml-auto text-[9px] font-mono">
                        {new Date(r.remind_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <div className="pl-1 text-[10px] text-muted-foreground">
                      +{items.length - 3} tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Reminder for {selectedDate?.toLocaleDateString()}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddReminder} className="space-y-4">
            <div className="space-y-2">
              <Label>Reminder Note</Label>
              <Input
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
                placeholder="Call the client..."
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setReminderDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addingReminder}>
                {addingReminder ? "Saving..." : "Set Reminder"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
