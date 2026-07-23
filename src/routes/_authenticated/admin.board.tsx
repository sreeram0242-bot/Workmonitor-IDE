import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchTasksForAdmin, fetchTeam, getCachedAdminTasks, getCachedTeam, type TaskRow, type TaskStatus, type TeamMember } from "@/lib/tasks";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/board")({
  head: () => ({
    meta: [
      { title: "Task Board — C-Enterprises WorkMonitor" },
      { name: "description", content: "Kanban board for team tasks across pending, completed, revision, and approved lanes." },
      { property: "og:title", content: "Task Board — C-Enterprises WorkMonitor" },
      { property: "og:description", content: "Drag tasks between lanes to update status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BoardPage,
});

const LANES: { key: TaskStatus; label: string; tint: string }[] = [
  { key: "pending",   label: "Pending",   tint: "bg-amber-50 border-amber-200" },
  { key: "completed", label: "Completed", tint: "bg-blue-50 border-blue-200" },
  { key: "revision",  label: "Revision",  tint: "bg-rose-50 border-rose-200" },
  { key: "approved",  label: "Approved",  tint: "bg-emerald-50 border-emerald-200" },
];

function BoardPage() {
  const [tasks, setTasks] = useState<TaskRow[]>(() => getCachedAdminTasks() ?? []);
  const [team, setTeam] = useState<TeamMember[]>(() => getCachedTeam() ?? []);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasksForAdmin().then(setTasks).catch(() => {});
    fetchTeam().then(setTeam).catch(() => {});
    const ch = supabase.channel("board-tasks").on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => {
      fetchTasksForAdmin().then(setTasks).catch(() => {});
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const nameOf = (id: string) => team.find((t) => t.id === id)?.full_name ?? "—";
  const grouped = useMemo(() => {
    const m = new Map<TaskStatus, TaskRow[]>();
    LANES.forEach((l) => m.set(l.key, []));
    for (const t of tasks) m.get(t.status)?.push(t);
    return m;
  }, [tasks]);

  async function move(taskId: string, to: TaskStatus) {
    const t = tasks.find((x) => x.id === taskId);
    if (!t || t.status === to) return;
    setTasks((prev) => prev.map((x) => x.id === taskId ? { ...x, status: to } : x));
    const patch: Partial<TaskRow> = { status: to };
    if (to !== "revision") patch.revision_note = null;
    const { error } = await supabase.from("tasks").update(patch).eq("id", taskId);
    if (error) {
      toast.error("Failed to update task");
      fetchTasksForAdmin().then(setTasks).catch(() => {});
    } else {
      toast.success(`Moved to ${to}`);
    }
  }

  const priColor = (p: TaskRow["priority"]) => p === "high" ? "border-l-red-500" : p === "medium" ? "border-l-amber-500" : "border-l-emerald-500";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold">Board</h1>
        <p className="text-sm text-muted-foreground">Drag cards between lanes to change status.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {LANES.map((lane) => {
          const items = grouped.get(lane.key) ?? [];
          return (
            <div
              key={lane.key}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={() => { if (dragId) move(dragId, lane.key); setDragId(null); }}
              className={`rounded-xl border ${lane.tint} p-3 min-h-[300px] transition`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">{lane.label}</div>
                <Badge variant="secondary">{items.length}</Badge>
              </div>
              <div className="space-y-2">
                {items.map((t) => (
                  <Card
                    key={t.id}
                    draggable
                    onDragStart={() => setDragId(t.id)}
                    onDragEnd={() => setDragId(null)}
                    className={`cursor-grab border-l-4 ${priColor(t.priority)} p-3 shadow-sm transition active:cursor-grabbing ${dragId === t.id ? "opacity-50" : ""}`}
                  >
                    <div className="text-sm font-medium">{t.title}</div>
                    {t.description && <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{t.description}</div>}
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="truncate">{nameOf(t.assigned_to)}</span>
                      {t.deadline && <span>{new Date(t.deadline).toLocaleDateString()}</span>}
                    </div>
                    {t.tags?.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {t.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] text-muted-foreground">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
                {items.length === 0 && (
                  <div className="rounded-md border border-dashed py-6 text-center text-xs text-muted-foreground">Drop here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
