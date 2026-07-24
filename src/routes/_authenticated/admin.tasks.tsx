import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
// Import removed
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Plus,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Eye,
  Pencil,
  Trash2,
  Search,
  AlertTriangle,
  Copy,
  Repeat,
} from "lucide-react";
import { toast } from "sonner";
import { sendNotifications } from "@/lib/notify";
import {
  fetchTasksForAdmin,
  fetchTeam,
  fetchSubtasks,
  fetchProofsForTask,
  signedProofUrl,
  priorityColor,
  statusColor,
  getCachedAdminTasks,
  getCachedTeam,
  bulkApproveTasks,
  bulkDeleteTasks,
  bulkReassignTasks,
  createTask,
  updateTask,
  deleteTask,
  addSubtask,
  type TaskRow,
  type TeamMember,
  type TaskPriority,
  type TaskRecurrence,
} from "@/lib/tasks";
import { SubtaskList } from "@/components/tasks/SubtaskList";
import { TagInput } from "@/components/tasks/TagInput";
import { TaskComments } from "@/components/tasks/TaskComments";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/_authenticated/admin/tasks")({
  head: () => ({
    meta: [
      { title: "Task Management — C-Enterprises WorkMonitor" },
      {
        name: "description",
        content: "Assign, review, approve, and request revisions for C-Enterprises team tasks.",
      },
      { property: "og:title", content: "Task Management — C-Enterprises WorkMonitor" },
      {
        property: "og:description",
        content: "Admin task workflow for assignments, deadlines, proof review, and approvals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminTasks,
});

function isOverdue(t: TaskRow) {
  return (
    !!t.deadline &&
    new Date(t.deadline).getTime() < Date.now() &&
    (t.status === "pending" || t.status === "revision")
  );
}

function AdminTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskRow[]>(() => getCachedAdminTasks() ?? []);
  const [team, setTeam] = useState<TeamMember[]>(() => getCachedTeam() ?? []);
  const [loading, setLoading] = useState(() => !getCachedAdminTasks());
  const [search, setSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignTo, setReassignTo] = useState("");

  function toggleSel(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }
  function clearSel() {
    setSelected(new Set());
  }

  async function reloadTasks() {
    const t = await fetchTasksForAdmin();
    setTasks(t);
    setLoading(false);
  }
  async function reloadAll() {
    const [t, m] = await Promise.all([fetchTasksForAdmin(), fetchTeam()]);
    setTasks(t);
    setTeam(m);
    setLoading(false);
  }

  useEffect(() => {
    reloadAll();
    let pending = false;
    const debounced = () => {
      if (pending) return;
      pending = true;
      setTimeout(() => {
        pending = false;
        reloadTasks();
      }, 400);
    };
    // Realtime polling will be implemented in Stage 5
    return () => {};
  }, []);

  const nameFor = useMemo(() => {
    const map = new Map(team.map((m) => [m.id, m.full_name]));
    return (id: string) => map.get(id) ?? "—";
  }, [team]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (Array.isArray(t.tags) && t.tags.includes("reminder")) return false;
      if (assigneeFilter !== "all" && t.assigned_to !== assigneeFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (tagFilter && !(Array.isArray(t.tags) ? t.tags : []).includes(tagFilter)) return false;
      if (
        q &&
        !`${t.title} ${t.description ?? ""} ${(Array.isArray(t.tags) ? t.tags : []).join(" ")}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [tasks, search, assigneeFilter, priorityFilter, tagFilter]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    tasks.forEach((t) => {
      if (Array.isArray(t.tags) && t.tags.includes("reminder")) return;
      (Array.isArray(t.tags) ? t.tags : []).forEach((x) => s.add(x));
    });
    return Array.from(s).sort();
  }, [tasks]);

  const overdueCount = filtered.filter(isOverdue).length;

  const buckets = {
    pending: filtered.filter((t) => t.status === "pending"),
    completed: filtered.filter((t) => t.status === "completed"),
    approved: filtered.filter((t) => t.status === "approved"),
    revision: filtered.filter((t) => t.status === "revision"),
  };

  const selectedIds = Array.from(selected);
  const selectedTasks = tasks.filter((t) => selected.has(t.id));
  const canBulkApprove =
    selectedTasks.length > 0 && selectedTasks.every((t) => t.status === "completed");

  async function bulkApprove() {
    if (!canBulkApprove) return;
    setBulkBusy(true);
    let error: any = null;
    try {
      await bulkApproveTasks(selectedIds);
    } catch (e: any) {
      error = e;
    }
    if (!error) {
      await sendNotifications(
        selectedTasks.map((t) => ({
          user_id: t.assigned_to,
          type: "task_approved",
          message: `Approved: ${t.title}`,
          link: "/app",
        })),
      );
    }
    setBulkBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Approved ${selectedIds.length} task${selectedIds.length === 1 ? "" : "s"}`);
    clearSel();
    reloadTasks();
  }
  async function bulkDelete() {
    if (
      !confirm(
        `Delete ${selectedIds.length} selected task${selectedIds.length === 1 ? "" : "s"}? This cannot be undone.`,
      )
    )
      return;
    setBulkBusy(true);
    let error: any = null;
    try {
      await bulkDeleteTasks(selectedIds);
    } catch (e: any) {
      error = e;
    }
    setBulkBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Tasks deleted");
    clearSel();
    reloadTasks();
  }
  async function bulkReassign() {
    if (!reassignTo) return toast.error("Pick an assignee");
    setBulkBusy(true);
    let error: any = null;
    try {
      await bulkReassignTasks(selectedIds, reassignTo);
    } catch (e: any) {
      error = e;
    }
    if (!error) {
      await sendNotifications(
        selectedTasks.map((t) => ({
          user_id: reassignTo,
          type: "task_assigned",
          message: `Reassigned to you: ${t.title}`,
          link: "/app",
        })),
      );
    }
    setBulkBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Reassigned ${selectedIds.length} task${selectedIds.length === 1 ? "" : "s"}`);
    clearSel();
    setReassignOpen(false);
    setReassignTo("");
    reloadTasks();
  }

  return (
    <div className="relative min-h-full p-4 sm:p-6 bg-sidebar-mesh">
      <div className="pointer-events-none absolute inset-0 sidebar-noise-overlay opacity-20" />

      <div className="relative z-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)]">
              Tasks
            </h1>
            <p className="text-sm text-slate-600/80 mt-1">
              Assign, review, and approve team work in real time.
            </p>
          </div>
          <AssignTaskDialog team={team} adminId={user?.id ?? ""} onCreated={reloadTasks} />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or description…"
              className="pl-9 h-10 rounded-xl border border-black/5 bg-white/60 backdrop-blur shadow-sm focus-visible:ring-brand-accent/50"
            />
          </div>
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="h-10 rounded-xl border border-black/5 bg-white/60 backdrop-blur shadow-sm focus:ring-brand-accent/50">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              {team.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-10 rounded-xl border border-black/5 bg-white/60 backdrop-blur shadow-sm focus:ring-brand-accent/50">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {allTags.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Tags:</span>
            <button
              onClick={() => setTagFilter(null)}
              className={`rounded-md px-2.5 py-1 text-xs transition-all shadow-sm border ${tagFilter === null ? "border-[oklch(0.28_0.09_265)]/20 bg-[oklch(0.28_0.09_265)]/10 text-[oklch(0.28_0.09_265)] font-semibold" : "border-black/5 bg-white/60 hover:bg-white text-slate-600 backdrop-blur"}`}
            >
              All
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setTagFilter(t)}
                className={`rounded-md px-2.5 py-1 text-xs transition-all shadow-sm border ${tagFilter === t ? "border-[oklch(0.28_0.09_265)]/20 bg-[oklch(0.28_0.09_265)]/10 text-[oklch(0.28_0.09_265)] font-semibold" : "border-black/5 bg-white/60 hover:bg-white text-slate-600 backdrop-blur"}`}
              >
                #{t}
              </button>
            ))}
          </div>
        )}

        {overdueCount > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 shadow-sm backdrop-blur">
            <AlertTriangle className="h-4 w-4" />{" "}
            <span className="font-medium">
              {overdueCount} overdue task{overdueCount === 1 ? "" : "s"} need attention
            </span>
          </div>
        )}

        {selectedIds.length > 0 && (
          <div className="sticky top-2 z-10 mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm shadow-sm backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedIds.length} selected</span>
              <Button size="sm" variant="ghost" onClick={clearSel}>
                Clear
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!canBulkApprove || bulkBusy}
                onClick={bulkApprove}
                title={canBulkApprove ? "" : "Only completed tasks can be approved in bulk"}
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={bulkBusy}
                onClick={() => setReassignOpen(true)}
              >
                Reassign
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={bulkBusy}
                onClick={bulkDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-1.5 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        )}

        <Dialog open={reassignOpen} onOpenChange={setReassignOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>
                Reassign {selectedIds.length} task{selectedIds.length === 1 ? "" : "s"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label>New assignee</Label>
              <Select value={reassignTo} onValueChange={setReassignTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose member" />
                </SelectTrigger>
                <SelectContent>
                  {team.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReassignOpen(false)}>
                Cancel
              </Button>
              <Button onClick={bulkReassign} disabled={bulkBusy || !reassignTo}>
                {bulkBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Reassign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="completed" className="w-full">
          <TabsList className="flex w-full justify-start overflow-x-auto whitespace-nowrap rounded-xl bg-white/60 p-1 border border-black/5">
            <TabsTrigger value="completed">Review ({buckets.completed.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({buckets.pending.length})</TabsTrigger>
            <TabsTrigger value="revision">Revisions ({buckets.revision.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({buckets.approved.length})</TabsTrigger>
          </TabsList>

          {(["completed", "pending", "revision", "approved"] as const).map((k) => (
            <TabsContent key={k} value={k} className="mt-4 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-10 text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : buckets[k].length === 0 ? (
                <div className="rounded-2xl border border-black/5 bg-white/60 p-10 text-center text-sm text-slate-500 backdrop-blur shadow-sm">
                  Nothing here yet.
                </div>
              ) : (
                buckets[k].map((t) => (
                  <TaskAdminRow
                    key={t.id}
                    task={t}
                    team={team}
                    assigneeName={nameFor(t.assigned_to)}
                    onChange={reloadTasks}
                    selected={selected.has(t.id)}
                    onToggleSelect={() => toggleSel(t.id)}
                  />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function AssignTaskDialog({
  team,
  adminId,
  onCreated,
}: {
  team: TeamMember[];
  adminId: string;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "1") {
      setOpen(true);
      params.delete("new");
      const qs = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (qs ? `?${qs}` : ""));
    }
  }, []);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [deadline, setDeadline] = useState("");
  const [recurrence, setRecurrence] = useState<TaskRecurrence>("none");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!title || !assignedTo) {
      toast.error("Title and assignee are required");
      return;
    }
    setSaving(true);
    let error: any = null;
    try {
      await createTask({
        title,
        description: description || null,
        assigned_to: assignedTo,
        assigned_by: adminId,
        priority,
        status: "pending",
        deadline: deadline ? new Date(deadline).toISOString() : null,
        recurrence,
        tags,
      });
    } catch (e: any) {
      error = e;
    }
    if (!error) {
      await sendNotifications([
        {
          user_id: assignedTo,
          type: "task_assigned",
          message: `New task: ${title}`,
          link: "/app",
        },
      ]);
    }
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Task assigned");
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setPriority("medium");
    setDeadline("");
    setRecurrence("none");
    setTags([]);
    setOpen(false);
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Assign task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign a task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ship landing page hero"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Assign to</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose member" />
                </SelectTrigger>
                <SelectContent>
                  {team.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.full_name} · {m.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Deadline (optional)</Label>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              onClick={(e) => {
                const el = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                try {
                  el.showPicker?.();
                } catch {
                  /* unsupported */
                }
              }}
              onFocus={(e) => {
                const el = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                try {
                  el.showPicker?.();
                } catch {
                  /* unsupported */
                }
              }}
              className="cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Recurrence</Label>
              <Select value={recurrence} onValueChange={(v) => setRecurrence(v as TaskRecurrence)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">One-off</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <TagInput value={tags} onChange={setTags} placeholder="design, urgent…" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditTaskDialog({
  open,
  onOpenChange,
  task,
  team,
  onDone,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  task: TaskRow;
  team: TeamMember[];
  onDone: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [assignedTo, setAssignedTo] = useState(task.assigned_to);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [deadline, setDeadline] = useState(
    task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "",
  );
  const [recurrence, setRecurrence] = useState<TaskRecurrence>(task.recurrence ?? "none");
  const [tags, setTags] = useState<string[]>(task.tags ?? []);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(task.title);
    setDescription(task.description ?? "");
    setAssignedTo(task.assigned_to);
    setPriority(task.priority);
    setDeadline(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "");
    setRecurrence(task.recurrence ?? "none");
    setTags(task.tags ?? []);
  }, [open, task]);

  async function save() {
    if (!title.trim()) return toast.error("Title required");
    setBusy(true);
    let error: any = null;
    try {
      await updateTask(task.id, {
        title,
        description: description || null,
        assigned_to: assignedTo,
        priority,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        recurrence,
        tags,
      });
    } catch (e: any) {
      error = e;
    }
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Task updated");
    onOpenChange(false);
    onDone();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Assign to</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {team.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Recurrence</Label>
              <Select value={recurrence} onValueChange={(v) => setRecurrence(v as TaskRecurrence)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">One-off</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput value={tags} onChange={setTags} placeholder="design, urgent…" />
          </div>
          <div className="rounded-md border border-border bg-muted/20 p-3">
            <SubtaskList taskId={task.id} canEdit canToggle />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TaskAdminRow({
  task,
  team,
  assigneeName,
  onChange,
  selected,
  onToggleSelect,
}: {
  task: TaskRow;
  team: TeamMember[];
  assigneeName: string;
  onChange: () => void;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const overdue = isOverdue(task);

  async function del() {
    if (!confirm(`Delete task "${task.title}"? This cannot be undone.`)) return;
    let error: any = null;
    try {
      await deleteTask(task.id);
    } catch (e: any) {
      error = e;
    }
    if (error) return toast.error(error.message);
    toast.success("Task deleted");
    onChange();
  }

  async function duplicate() {
    let error: any = null;
    let data: any = null;
    try {
      data = await createTask({
        title: `${task.title} (copy)`,
        description: task.description,
        assigned_to: task.assigned_to,
        assigned_by: task.assigned_by,
        priority: task.priority,
        status: "pending",
        deadline: task.deadline,
        recurrence: task.recurrence ?? "none",
        tags: task.tags ?? [],
      });
    } catch (e: any) {
      error = e;
    }
    if (error) return toast.error(error.message);
    // Copy subtasks
    try {
      const subs = await fetchSubtasks(task.id);
      if (subs.length && data) {
        for (const s of subs) {
          await addSubtask(data.id, s.title, s.position);
        }
      }
    } catch {
      /* ignore */
    }
    toast.success("Task duplicated");
    onChange();
  }

  const tags = task.tags ?? [];
  const recurring = (task.recurrence ?? "none") !== "none";

  return (
    <div
      className={`rounded-2xl border border-black/5 bg-white/60 shadow-sm transition-all hover:shadow-md hover:bg-white/80 ${overdue ? "border-red-300 bg-red-50/40" : ""} ${selected ? "ring-2 ring-[oklch(0.28_0.09_265)]/40" : ""}`}
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-4 sm:p-5">
        <div className="pt-1">
          <Checkbox checked={selected} onCheckedChange={onToggleSelect} aria-label="Select task" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium">{task.title}</div>
            <Badge variant="outline" className={priorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className={statusColor(task.status)}>
              {task.status}
            </Badge>
            {recurring && (
              <Badge
                variant="outline"
                className="gap-1 border-[oklch(0.5_0.16_260)]/20 bg-[oklch(0.5_0.16_260)]/10 text-[oklch(0.5_0.16_260)]"
              >
                <Repeat className="h-3 w-3" /> {task.recurrence}
              </Badge>
            )}
            {overdue && (
              <Badge variant="outline" className="border-red-300 bg-red-100 text-red-700">
                Overdue
              </Badge>
            )}
          </div>
          {task.description && (
            <div className="mt-1 text-sm text-slate-600">{task.description}</div>
          )}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-black/5 bg-black/5 px-2 py-0.5 text-[11px] text-slate-600"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
          <div className="mt-2 text-xs text-slate-500">
            Assigned to <span className="font-medium text-slate-700">{assigneeName}</span>
            {task.deadline && <> · due {new Date(task.deadline).toLocaleString()}</>}
          </div>
          {task.revision_note && (
            <div className="mt-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 text-xs text-orange-600 shadow-sm">
              <span className="font-semibold uppercase tracking-wider">Revision note:</span>{" "}
              {task.revision_note}
            </div>
          )}
          <div className="mt-4">
            <SubtaskList taskId={task.id} canEdit={false} canToggle={false} compact />
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {(task.status === "completed" ||
            task.status === "approved" ||
            task.status === "revision") && (
            <Button
              size="sm"
              variant="default"
              className="bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)] text-white shadow hover:opacity-90 transition-opacity"
              onClick={() => setReviewOpen(true)}
            >
              <Eye className="mr-2 h-4 w-4" /> Review
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="border-black/5 bg-white/60 backdrop-blur hover:bg-white shadow-sm"
            onClick={() => setEditOpen(true)}
            title="Edit"
          >
            <Pencil className="h-4 w-4 text-slate-600" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-black/5 bg-white/60 backdrop-blur hover:bg-white shadow-sm"
            onClick={duplicate}
            title="Duplicate"
          >
            <Copy className="h-4 w-4 text-slate-600" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={del}
            className="border-red-500/10 bg-red-500/5 hover:bg-red-500/10 text-red-600 hover:text-red-700 shadow-sm"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <ReviewDialog
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          task={task}
          onChange={onChange}
        />
        <EditTaskDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          task={task}
          team={team}
          onDone={onChange}
        />
      </div>
    </div>
  );
}

function ReviewDialog({
  open,
  onOpenChange,
  task,
  onChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  task: TaskRow;
  onChange: () => void;
}) {
  const [urls, setUrls] = useState<{ url: string; note: string | null }[]>([]);
  const [revisionNote, setRevisionNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const proofs = await fetchProofsForTask(task.id);
      const resolved = await Promise.all(
        proofs.map(async (p) => ({ url: (await signedProofUrl(p.image_url)) ?? "", note: p.note })),
      );
      setUrls(resolved.filter((r) => r.url));
    })();
  }, [open, task.id]);

  async function approve() {
    setBusy(true);
    let error: any = null;
    try {
      await updateTask(task.id, { status: "approved", revision_note: null });
    } catch (e: any) {
      error = e;
    }
    if (!error) {
      await sendNotifications([
        {
          user_id: task.assigned_to,
          type: "task_approved",
          message: `Approved: ${task.title}`,
          link: "/app",
        },
      ]);
      // Recurrence: auto-create next occurrence
      const rec = task.recurrence ?? "none";
      if (rec !== "none") {
        const base = task.deadline ? new Date(task.deadline) : new Date();
        const next = new Date(base);
        if (rec === "daily") next.setDate(next.getDate() + 1);
        else if (rec === "weekly") next.setDate(next.getDate() + 7);
        else if (rec === "monthly") next.setMonth(next.getMonth() + 1);
        let newTask: any = null;
        try {
          newTask = await createTask({
            title: task.title,
            description: task.description,
            assigned_to: task.assigned_to,
            assigned_by: task.assigned_by,
            priority: task.priority,
            status: "pending",
            deadline: next.toISOString(),
            recurrence: rec,
            tags: task.tags ?? [],
          });
        } catch (e: any) {
          /* ignore */
        }
        try {
          const subs = await fetchSubtasks(task.id);
          if (subs.length && newTask) {
            for (const s of subs) {
              await addSubtask(newTask.id, s.title, s.position);
            }
          }
        } catch {
          /* ignore */
        }
        await sendNotifications([
          {
            user_id: task.assigned_to,
            type: "task_assigned",
            message: `Recurring task: ${task.title}`,
            link: "/app",
          },
        ]);
      }
    }
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(
      task.recurrence && task.recurrence !== "none"
        ? "Approved · next occurrence scheduled"
        : "Task approved",
    );
    onOpenChange(false);
    onChange();
  }
  async function requestRevision() {
    if (!revisionNote.trim())
      return toast.error("Add a revision note explaining what needs to change");
    setBusy(true);
    let error: any = null;
    try {
      await updateTask(task.id, { status: "revision", revision_note: revisionNote });
    } catch (e: any) {
      error = e;
    }
    if (!error) {
      await sendNotifications([
        {
          user_id: task.assigned_to,
          type: "task_revision",
          message: `Revision requested: ${task.title}`,
          link: "/app",
        },
      ]);
    }
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Revision requested");
    setRevisionNote("");
    onOpenChange(false);
    onChange();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {urls.length === 0 ? (
            <div className="text-sm text-muted-foreground">No proof uploaded.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {urls.map((u, i) => (
                <a
                  key={i}
                  href={u.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-lg border border-border"
                >
                  <img src={u.url} alt="Proof" className="h-40 w-full object-cover" />
                  {u.note && <div className="p-2 text-xs text-muted-foreground">{u.note}</div>}
                </a>
              ))}
            </div>
          )}
          <div className="space-y-2">
            <Label>Revision note (required to request changes)</Label>
            <Textarea
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              rows={3}
              placeholder="Explain clearly what needs to change so the employee knows how to fix it."
            />
          </div>
          <TaskComments taskId={task.id} />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={requestRevision} disabled={busy}>
            <RotateCcw className="mr-2 h-4 w-4" /> Request revision
          </Button>
          <Button onClick={approve} disabled={busy}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
