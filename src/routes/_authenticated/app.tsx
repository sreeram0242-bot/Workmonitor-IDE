import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, ImagePlus, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { fetchTasksForUser, getCachedUserTasks, priorityColor, statusColor, type TaskRow } from "@/lib/tasks";
import { SubtaskList } from "@/components/tasks/SubtaskList";
import { TaskComments } from "@/components/tasks/TaskComments";
import { sendNotifications } from "@/lib/notify";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "My Tasks — C-Enterprises WorkMonitor" },
      { name: "description", content: "Employee task checklist for C-Enterprises WorkMonitor with proof upload and review status." },
      { property: "og:title", content: "My Tasks — C-Enterprises WorkMonitor" },
      { property: "og:description", content: "View assigned work, submit completion proof, and track review status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EmployeeHome,
});

function EmployeeHome() {
  const { loading, role, user } = useAuth();
  const cached = user ? getCachedUserTasks(user.id) : null;
  const [tasks, setTasks] = useState<TaskRow[]>(cached ?? []);
  const [initial, setInitial] = useState(!cached);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all");

  async function reload() {
    if (!user) return;
    const t = await fetchTasksForUser(user.id);
    setTasks(t);
    setInitial(false);
  }

  useEffect(() => {
    if (!user) return;
    reload();
    const ch = supabase
      .channel(`tasks-user-${user.id}-${Math.random().toString(36).slice(2, 8)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          const newRow = (payload.new ?? {}) as Partial<TaskRow>;
          const oldRow = (payload.old ?? {}) as Partial<TaskRow>;
          if (newRow.assigned_to === user.id || oldRow.assigned_to === user.id) reload();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex min-h-[45vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-brand-accent" />
        Loading workspace…
      </div>
    );
  }
  if (role === "admin") return <Navigate to="/admin" />;

  const q = search.trim().toLowerCase();
  const visible = tasks.filter((t) => {
    if (Array.isArray(t.tags) && t.tags.includes("reminder")) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (q && !(`${t.title} ${t.description ?? ""}`.toLowerCase().includes(q))) return false;
    return true;
  });
  const active = visible.filter((t) => t.status === "pending" || t.status === "revision");
  const submitted = visible.filter((t) => t.status === "completed");
  const done = visible.filter((t) => t.status === "approved");

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = startOfToday + 24 * 60 * 60 * 1000;
  const openTasks = tasks.filter((t) => !(Array.isArray(t.tags) && t.tags.includes("reminder")) && (t.status === "pending" || t.status === "revision"));
  const overdueCount = openTasks.filter((t) => t.deadline && new Date(t.deadline).getTime() < now.getTime()).length;
  const dueTodayCount = openTasks.filter((t) => {
    if (!t.deadline) return false;
    const d = new Date(t.deadline).getTime();
    return d >= now.getTime() && d < endOfToday;
  }).length;
  const upcomingCount = openTasks.filter((t) => {
    if (!t.deadline) return false;
    return new Date(t.deadline).getTime() >= endOfToday;
  }).length;
  const approvedToday = tasks.filter((t) => t.status === "approved" && t.updated_at && new Date(t.updated_at).getTime() >= startOfToday && new Date(t.updated_at).getTime() < endOfToday).length;

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "there";
  const hour = now.getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative min-h-full p-4 sm:p-6 bg-sidebar-mesh">
      <div className="pointer-events-none absolute inset-0 sidebar-noise-overlay opacity-20" />
      
      <div className="relative z-10">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)]">
            {greet}, {firstName}
          </h1>
          <p className="text-sm text-slate-600/80 mt-1">Here's your day at a glance.</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatChip label="Overdue" value={overdueCount} tone={overdueCount > 0 ? "danger" : "muted"} />
          <StatChip label="Due today" value={dueTodayCount} tone={dueTodayCount > 0 ? "warn" : "muted"} />
          <StatChip label="Upcoming" value={upcomingCount} tone="brand" />
          <StatChip label="Approved today" value={approvedToday} tone={approvedToday > 0 ? "success" : "muted"} />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="h-10 min-w-[220px] flex-1 rounded-xl border border-black/5 bg-white/60 px-4 text-sm outline-none backdrop-blur shadow-sm focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/50 transition-all placeholder:text-slate-400"
          />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}
            className="h-10 rounded-xl border border-black/5 bg-white/60 px-3 text-sm backdrop-blur shadow-sm outline-none focus:border-brand-accent transition-all"
          >
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

      {initial ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No tasks assigned yet.</CardContent></Card>
      ) : visible.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No tasks match your filters.</CardContent></Card>
      ) : (
        <div className="space-y-6">
          <Section title="To do" items={active} onChange={reload} />
          <Section title="Awaiting review" items={submitted} onChange={reload} muted />
          <Section title="Approved" items={done} onChange={reload} muted />
        </div>
      )}
      </div>
    </div>
  );
}

function StatChip({ label, value, tone }: { label: string; value: number; tone: "danger" | "warn" | "brand" | "success" | "muted" }) {
  const toneClass = {
    danger: "border-red-500/20 bg-red-500/5 text-red-600",
    warn: "border-amber-500/20 bg-amber-500/5 text-amber-600",
    brand: "border-[oklch(0.28_0.09_265)]/20 bg-[oklch(0.28_0.09_265)]/5 text-[oklch(0.28_0.09_265)]",
    success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-600",
    muted: "border-black/5 bg-white/60 text-slate-600",
  }[tone];
  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-sm transition-all hover:scale-[1.02] ${toneClass}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-0.5 font-display text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function Section({ title, items, onChange, muted }: { title: string; items: TaskRow[]; onChange: () => void; muted?: boolean }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</div>
      <div className="space-y-2">
        {items.map((t) => <TaskChecklistItem key={t.id} task={t} onChange={onChange} muted={muted} />)}
      </div>
    </div>
  );
}

function isOverdue(t: TaskRow) {
  return !!t.deadline && new Date(t.deadline).getTime() < Date.now() &&
    (t.status === "pending" || t.status === "revision");
}

function TaskChecklistItem({ task, onChange, muted }: { task: TaskRow; onChange: () => void; muted?: boolean }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const canComplete = task.status === "pending" || task.status === "revision";
  const overdue = isOverdue(task);

  return (
    <div className={`rounded-2xl border border-black/5 bg-white/80 shadow-sm transition-all hover:shadow-md hover:bg-white/95 ${muted ? "opacity-90" : ""} ${overdue ? "border-red-300 bg-red-50/40" : ""}`}>
      <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5">
        <Checkbox
          checked={!canComplete}
          disabled={!canComplete}
          onCheckedChange={(v) => v && setUploadOpen(true)}
          className="mt-1"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`font-medium ${!canComplete ? "line-through text-muted-foreground" : ""}`}>{task.title}</div>
            <Badge variant="outline" className={priorityColor(task.priority)}>{task.priority}</Badge>
            <Badge variant="outline" className={statusColor(task.status)}>{task.status}</Badge>
            {overdue && <Badge variant="outline" className="border-red-300 bg-red-100 text-red-700">Overdue</Badge>}
            {task.status === "approved" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            {task.status === "revision" && <RotateCcw className="h-4 w-4 text-orange-500" />}
          </div>
          {task.description && <div className="mt-1 text-sm text-slate-600">{task.description}</div>}
          {(task.tags?.length ?? 0) > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {task.tags!.map((t) => (
                <span key={t} className="rounded-md border border-black/5 bg-black/5 px-2 py-0.5 text-[11px] text-slate-600">#{t}</span>
              ))}
            </div>
          )}
          {task.deadline && (
            <div className={`mt-2 text-xs ${overdue ? "text-red-600 font-medium" : "text-slate-500"}`}>
              Due {new Date(task.deadline).toLocaleString()}
            </div>
          )}
          {task.revision_note && (
            <div className="mt-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 text-xs text-orange-600 shadow-sm">
              <span className="font-semibold uppercase tracking-wider">Revision requested:</span> {task.revision_note}
            </div>
          )}
          <div className="mt-4">
            <SubtaskList taskId={task.id} canEdit={false} canToggle={canComplete} />
          </div>
          <div className="mt-4">
            <TaskComments taskId={task.id} />
          </div>
        </div>
        {canComplete && (
          <Button size="sm" variant="default" className="bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)] text-white shadow hover:opacity-90 transition-opacity" onClick={() => setUploadOpen(true)}>
            <ImagePlus className="mr-2 h-4 w-4" /> Complete
          </Button>
        )}
        <UploadProofDialog open={uploadOpen} onOpenChange={setUploadOpen} task={task} onDone={onChange} />
      </div>
    </div>
  );
}

function UploadProofDialog({ open, onOpenChange, task, onDone }: { open: boolean; onOpenChange: (o: boolean) => void; task: TaskRow; onDone: () => void }) {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit() {
    if (files.length === 0 || !user) return toast.error("Please choose at least one image");
    setBusy(true);
    try {
      for (const file of files) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${task.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("task-proofs").upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        const { error: insErr } = await supabase.from("task_proofs").insert({
          task_id: task.id,
          uploaded_by: user.id,
          image_url: path,
          note: note || null,
        });
        if (insErr) throw insErr;
      }
      const { error: updErr } = await supabase.from("tasks").update({ status: "completed", revision_note: null }).eq("id", task.id);
      if (updErr) throw updErr;
      await sendNotifications([{
        user_id: task.assigned_by,
        type: "task_submitted",
        message: `Proof submitted: ${task.title}`,
        link: "/admin/tasks",
      }]);
      toast.success("Submitted for review");
      setFiles([]); setNote("");
      onOpenChange(false);
      onDone();
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Upload proof for "{task.title}"</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            className="cursor-pointer rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center hover:bg-muted/50"
          >
            {files.length > 0 ? (
              <div className="text-sm">{files.length} file{files.length === 1 ? "" : "s"} selected — tap to add more</div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-6 w-6" /> Tap to choose one or more images
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])}
            />
          </div>
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs">
                  <span className="max-w-[140px] truncate">{f.name}</span>
                  <button type="button" className="text-muted-foreground hover:text-red-600" onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}>×</button>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy || files.length === 0}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

