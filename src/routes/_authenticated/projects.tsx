import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Plus,
  Workflow,
  Search,
  Loader2,
  Trash2,
  Edit3,
  Layers,
  Sparkles,
  ChevronRight,
  FolderKanban,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchProjects,
  getCachedProjects,
  createProject,
  updateProject,
  deleteProject,
  setCurrentStage,
  addProjectStage,
  updateProjectStage,
  deleteProjectStage,
  reorderProjectStages,
  type ProjectRow,
  type ProjectStageRow,
} from "@/lib/projects";
import { ProjectFlowTimeline } from "@/components/projects/ProjectFlowTimeline";
import { useRealtimeSubscription } from "@/hooks/use-realtime";

export const Route = createFileRoute("/_authenticated/projects")({
  head: () => ({
    meta: [
      { title: "Project Flow Tracker — C-Enterprises WorkMonitor" },
      {
        name: "description",
        content: "Track live project stages, flow animations, and milestone status updates.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { role, user } = useAuth();
  const isAdmin = role === "admin";
  const [projects, setProjects] = useState<ProjectRow[]>(() => getCachedProjects() ?? []);
  const [loading, setLoading] = useState(() => !getCachedProjects());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editProjectTask, setEditProjectTask] = useState<ProjectRow | null>(null);
  const [editStageTask, setEditStageTask] = useState<{ project: ProjectRow; stage: ProjectStageRow } | null>(null);
  const [addStageProjectId, setAddStageProjectId] = useState<string | null>(null);

  async function reload() {
    const list = await fetchProjects();
    setProjects(list);
    setLoading(false);
    if (!selectedId && list.length > 0) {
      setSelectedId(list[0].id);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  useRealtimeSubscription("projects", "project-updates", () => {
    reload();
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter === "in_progress" && p.status === "completed") return false;
      if (filter === "completed" && p.status !== "completed") return false;
      if (q && !`${p.name} ${p.description ?? ""} ${p.client_name ?? ""}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [projects, search, filter]);

  const activeProject = useMemo(() => {
    if (selectedId) {
      const found = projects.find((p) => p.id === selectedId);
      if (found) return found;
    }
    return filtered[0] ?? projects[0] ?? null;
  }, [projects, selectedId, filtered]);

  async function handleSetStage(projectId: string, stageIndex: number) {
    // 0ms Instant Optimistic UI Update
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const stages = p.stages || [];
        const newStages = stages.map((s, idx) => ({
          ...s,
          is_completed: idx <= stageIndex,
          completed_at: idx <= stageIndex ? s.completed_at || new Date() : null,
        }));
        return {
          ...p,
          current_stage_index: stageIndex,
          status: stageIndex >= newStages.length - 1 ? "completed" : "in_progress",
          stages: newStages,
        };
      }),
    );
    toast.success("Stage updated!");

    try {
      await setCurrentStage(projectId, stageIndex);
    } catch (e: any) {
      toast.error(e.message || "Failed to update stage on server");
      reload();
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      toast.success("Project deleted");
      if (selectedId === id) setSelectedId(null);
      reload();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete project");
    }
  }

  async function handleDeleteStage(stageId: string) {
    if (!confirm("Delete this stage?")) return;
    try {
      await deleteProjectStage(stageId);
      toast.success("Stage removed");
      reload();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete stage");
    }
  }

  async function handleReorderStage(projectId: string, fromIdx: number, toIdx: number) {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj || !proj.stages || toIdx < 0 || toIdx >= proj.stages.length) return;
    const newStages = [...proj.stages];
    const [moved] = newStages.splice(fromIdx, 1);
    newStages.splice(toIdx, 0, moved);

    // Smooth optimistic local state update
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, stages: newStages } : p)),
    );
    try {
      await reorderProjectStages(projectId, newStages.map((s) => s.id));
      toast.success("Stage reordered");
    } catch (e: any) {
      toast.error(e.message || "Failed to reorder stage");
      reload();
    }
  }

  return (
    <div className="relative min-h-full p-4 sm:p-6 bg-sidebar-mesh">
      <div className="pointer-events-none absolute inset-0 sidebar-noise-overlay opacity-20" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Workflow className="h-6 w-6 text-[oklch(0.28_0.09_265)]" />
              <h1 className="font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)]">
                Projects Flow Tracker
              </h1>
            </div>
            <p className="text-sm text-slate-600/80 mt-1">
              Live Amazon-style stage progress, updates, and milestone tracking.
            </p>
          </div>

          {isAdmin && (
            <Button
              className="bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)] text-white shadow hover:opacity-90 transition-opacity"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by name or client…"
              className="pl-9 h-10 rounded-xl border border-black/5 bg-white/60 backdrop-blur shadow-sm"
            />
          </div>

          <Tabs value={filter} onValueChange={setFilter} className="w-auto">
            <TabsList className="rounded-xl bg-white/60 p-1 border border-black/5">
              <TabsTrigger value="all">All Projects ({projects.length})</TabsTrigger>
              <TabsTrigger value="in_progress">
                In Progress ({projects.filter((p) => p.status !== "completed").length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({projects.filter((p) => p.status === "completed").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content Layout */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-[oklch(0.28_0.09_265)]" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="rounded-2xl border border-black/5 bg-white/60 p-12 text-center backdrop-blur shadow-sm">
            <CardContent className="space-y-3">
              <FolderKanban className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="font-display text-lg font-bold text-slate-800">No Projects Found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                {isAdmin
                  ? "Get started by creating your first project with custom stage flow animation."
                  : "No projects have been added yet."}
              </p>
              {isAdmin && (
                <Button onClick={() => setCreateOpen(true)} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Create First Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar: Project List Cards */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                Select Project ({filtered.length})
              </div>

              {filtered.map((p) => {
                const isSelected = activeProject?.id === p.id;
                const stagesCount = p.stages?.length || 0;
                const progressPct =
                  stagesCount > 0
                    ? Math.round(((p.current_stage_index + 1) / stagesCount) * 100)
                    : 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 shadow-sm ${
                      isSelected
                        ? "border-[oklch(0.28_0.09_265)]/50 bg-white ring-2 ring-[oklch(0.28_0.09_265)]/20 shadow-md"
                        : "border-black/5 bg-white/60 hover:bg-white/90 hover:shadow"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 truncate text-base">{p.name}</h3>
                        {p.client_name && (
                          <div className="text-xs text-slate-500 font-medium">
                            Client: {p.client_name}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          p.status === "completed"
                            ? "border-blue-500/30 bg-blue-500/10 text-blue-700 font-semibold"
                            : "border-blue-500/30 bg-blue-500/10 text-blue-700 font-semibold"
                        }
                      >
                        {p.status === "completed" ? "Done" : "In Progress"}
                      </Badge>
                    </div>

                    {p.description && (
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2">{p.description}</p>
                    )}

                    {/* Stage Progress Bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                        <span>
                          Stage {Math.min(p.current_stage_index + 1, stagesCount)} / {stagesCount}
                        </span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Pane: Visual Flow Timeline */}
            <div className="lg:col-span-8">
              {activeProject ? (
                <Card className="rounded-3xl border border-black/5 bg-white/80 backdrop-blur shadow-md p-6">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display text-2xl font-bold text-slate-900">
                          {activeProject.name}
                        </h2>
                        {activeProject.client_name && (
                          <Badge variant="outline" className="text-slate-600 bg-slate-50">
                            {activeProject.client_name}
                          </Badge>
                        )}
                      </div>
                      {activeProject.description && (
                        <p className="mt-1 text-sm text-slate-600 max-w-xl">
                          {activeProject.description}
                        </p>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditProjectTask(activeProject)}
                        >
                          <Edit3 className="mr-1.5 h-4 w-4" /> Edit Details
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteProject(activeProject.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Flow Stepper Component */}
                  <ProjectFlowTimeline
                    project={activeProject}
                    isAdmin={isAdmin}
                    onSetCurrentStage={handleSetStage}
                    onEditStage={(stage) =>
                      setEditStageTask({ project: activeProject, stage })
                    }
                    onDeleteStage={handleDeleteStage}
                    onAddStage={(projectId) => setAddStageProjectId(projectId)}
                    onReorderStage={handleReorderStage}
                  />
                </Card>
              ) : (
                <Card className="rounded-3xl border border-black/5 bg-white/50 p-12 text-center text-slate-400">
                  Select a project from the left list to view its visual flow timeline.
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Dialogs */}
        <CreateProjectDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onDone={reload}
        />

        {editProjectTask && (
          <EditProjectDialog
            open={!!editProjectTask}
            onOpenChange={(o) => !o && setEditProjectTask(null)}
            project={editProjectTask}
            onDone={reload}
          />
        )}

        {editStageTask && (
          <EditStageDialog
            open={!!editStageTask}
            onOpenChange={(o) => !o && setEditStageTask(null)}
            stage={editStageTask.stage}
            onDone={reload}
          />
        )}

        {addStageProjectId && (
          <AddStageDialog
            open={!!addStageProjectId}
            onOpenChange={(o) => !o && setAddStageProjectId(null)}
            projectId={addStageProjectId}
            onDone={reload}
          />
        )}
      </div>
    </div>
  );
}

function CreateProjectDialog({
  open,
  onOpenChange,
  onDone,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!name.trim()) return toast.error("Project name is required");
    setBusy(true);
    try {
      await createProject({
        name,
        description: description || null,
        client_name: clientName || null,
      });
      toast.success("Project created with flow timeline!");
      setName("");
      setDescription("");
      setClientName("");
      onOpenChange(false);
      onDone();
    } catch (e: any) {
      toast.error(e.message || "Failed to create project");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website Redesign & Delivery"
            />
          </div>
          <div className="space-y-2">
            <Label>Client / Stakeholder (optional)</Label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of project goals and flow…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditProjectDialog({
  open,
  onOpenChange,
  project,
  onDone,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  project: ProjectRow;
  onDone: () => void;
}) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [clientName, setClientName] = useState(project.client_name ?? "");
  const [status, setStatus] = useState(project.status);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(project.name);
    setDescription(project.description ?? "");
    setClientName(project.client_name ?? "");
    setStatus(project.status);
  }, [project]);

  async function save() {
    if (!name.trim()) return toast.error("Name required");
    setBusy(true);
    try {
      await updateProject(project.id, {
        name,
        description: description || null,
        client_name: clientName || null,
        status,
      });
      toast.success("Project updated");
      onOpenChange(false);
      onDone();
    } catch (e: any) {
      toast.error(e.message || "Failed to update project");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Client Name</Label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function toDatetimeLocal(iso: string | Date | null | undefined): string {
  if (!iso) return new Date().toISOString().slice(0, 16);
  const d = new Date(iso);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 16);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function EditStageDialog({
  open,
  onOpenChange,
  stage,
  onDone,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  stage: ProjectStageRow;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(stage.title);
  const [subtitle, setSubtitle] = useState(stage.subtitle ?? "");
  const [description, setDescription] = useState(stage.description ?? "");
  const [statusNote, setStatusNote] = useState(stage.status_note ?? "");
  const [dateMode, setDateMode] = useState<"automatic" | "manual">("automatic");
  const [manualDateTime, setManualDateTime] = useState<string>(() => toDatetimeLocal(stage.completed_at));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setTitle(stage.title);
    setSubtitle(stage.subtitle ?? "");
    setDescription(stage.description ?? "");
    setStatusNote(stage.status_note ?? "");
    setManualDateTime(toDatetimeLocal(stage.completed_at));
    setDateMode("automatic");
  }, [stage]);

  async function save() {
    if (!title.trim()) return toast.error("Title required");
    setBusy(true);
    try {
      const finalCompletedAt =
        dateMode === "manual" && manualDateTime
          ? new Date(manualDateTime).toISOString()
          : stage.completed_at || new Date().toISOString();

      await updateProjectStage(stage.id, {
        title,
        subtitle: subtitle || null,
        description: description || null,
        status_note: statusNote || null,
        completed_at: finalCompletedAt,
      });
      toast.success("Stage text and timestamp updated!");
      onOpenChange(false);
      onDone();
    } catch (e: any) {
      toast.error(e.message || "Failed to update stage");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Stage Text</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Stage Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Out for delivery"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle / Timestamp Note</Label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Arriving today by 8PM"
            />
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details about this stage…"
            />
          </div>
          <div className="space-y-2">
            <Label>Live Update / Note (optional)</Label>
            <Textarea
              rows={2}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Package has reached the local delivery hub"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Stage Date & Time Entry
            </Label>
            <Select value={dateMode} onValueChange={(v) => setDateMode(v as "automatic" | "manual")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic (Current Date & Time)</SelectItem>
                <SelectItem value="manual">Manual Entry (Custom Date & Time)</SelectItem>
              </SelectContent>
            </Select>

            {dateMode === "manual" && (
              <div className="mt-2 space-y-1.5 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <Label className="text-xs text-blue-900 font-semibold">Select Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={manualDateTime}
                  onChange={(e) => setManualDateTime(e.target.value)}
                  className="bg-white"
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={busy} className="bg-blue-600 hover:bg-blue-700 text-white">
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Stage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddStageDialog({
  open,
  onOpenChange,
  projectId,
  onDone,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  projectId: string;
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!title.trim()) return toast.error("Stage title is required");
    setBusy(true);
    try {
      await addProjectStage({
        projectId,
        title,
        subtitle: subtitle || null,
        description: description || null,
        status_note: statusNote || null,
      });
      toast.success("Stage added to flow");
      setTitle("");
      setSubtitle("");
      setDescription("");
      setStatusNote("");
      onOpenChange(false);
      onDone();
    } catch (e: any) {
      toast.error(e.message || "Failed to add stage");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Flow Stage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Stage Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Shipped / Out for delivery / Delivered"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle (optional)</Label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Wednesday, May 23"
            />
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              rows= {2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add Stage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
