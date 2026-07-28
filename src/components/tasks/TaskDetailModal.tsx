import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  RotateCcw,
  Calendar,
  User,
  Shield,
  Clock,
  Repeat,
  Image as ImageIcon,
  Loader2,
  CheckSquare,
  FileText,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import {
  type TaskRow,
  type TeamMember,
  priorityColor,
  statusColor,
  fetchProofsForTask,
  signedProofUrl,
  updateTask,
} from "@/lib/tasks";
import { SubtaskList } from "@/components/tasks/SubtaskList";
import { TaskComments } from "@/components/tasks/TaskComments";
import { sendNotifications } from "@/lib/notify";

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskRow | null;
  team: TeamMember[];
  currentUserId?: string;
  isAdmin?: boolean;
  onDone?: () => void;
  onOpenSubmitFinished?: () => void;
}

export function TaskDetailModal({
  open,
  onOpenChange,
  task,
  team,
  currentUserId,
  isAdmin,
  onDone,
  onOpenSubmitFinished,
}: TaskDetailModalProps) {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loadingProofs, setLoadingProofs] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [busy, setBusy] = useState(false);
  const [extendedDeadline, setExtendedDeadline] = useState("");
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [newDeadline, setNewDeadline] = useState("");

  useEffect(() => {
    if (!open || !task) {
      setProofs([]);
      setShowRevisionInput(false);
      setRevisionNote("");
      setShowExtendModal(false);
      setExtendedDeadline("");
      setNewDeadline("");
      return;
    }

    setLoadingProofs(true);
    fetchProofsForTask(task.id)
      .then(async (list) => {
        const enriched = await Promise.all(
          list.map(async (p: any) => ({
            ...p,
            signedUrl: p.image_url ? await signedProofUrl(p.image_url) : null,
          })),
        );
        setProofs(enriched);
      })
      .catch(() => setProofs([]))
      .finally(() => setLoadingProofs(false));
  }, [open, task?.id]);

  if (!task) return null;

  const assignee = team.find((m) => m.id === task.assigned_to);
  const assigner = team.find((m) => m.id === task.assigned_by);

  const assigneeName = assignee?.full_name || "Unassigned";
  const assignerName = assigner?.full_name || "Administrator";

  const isOverdue =
    !!task.deadline &&
    new Date(task.deadline).getTime() < Date.now() &&
    (task.status === "pending" || task.status === "revision");

  const canSubmitFinished =
    (task.status === "pending" || task.status === "revision") &&
    (task.assigned_to === currentUserId || !isAdmin);

  async function handleApprove() {
    if (!task) return;
    setBusy(true);
    try {
      await updateTask(task.id, { status: "approved" });
      await sendNotifications([
        {
          user_id: task.assigned_to,
          type: "task_approved",
          message: `Task approved: ${task.title}`,
          link: "/app",
        },
      ]);
      toast.success("Task approved");
      onOpenChange(false);
      onDone?.();
    } catch (e: any) {
      toast.error(e.message || "Failed to approve task");
    } finally {
      setBusy(false);
    }
  }

  async function handleExtendDeadline() {
    if (!task || !newDeadline) return;
    const isoDeadline = new Date(newDeadline).toISOString();
    
    // 0ms Instant Optimistic UI Update
    toast.success("Deadline extended successfully!");
    setShowExtendModal(false);
    task.deadline = isoDeadline;
    onDone?.();

    try {
      await updateTask(task.id, { deadline: isoDeadline });
      sendNotifications([
        {
          user_id: task.assigned_to,
          type: "task_extended",
          message: `Deadline extended for: ${task.title}`,
          link: "/app",
        },
      ]).catch(() => {});
    } catch (e: any) {
      console.error("Failed to persist extended deadline:", e);
      toast.error(e.message || "Failed to persist extended deadline");
    }
  }

  async function handleRequestRevision() {
    if (!task) return;
    if (!revisionNote.trim()) {
      toast.error("Please enter a note explaining what needs revision");
      return;
    }
    setBusy(true);
    try {
      const updates: any = { status: "revision", revision_note: revisionNote.trim() };
      if (extendedDeadline) {
        updates.deadline = new Date(extendedDeadline).toISOString();
      } else if (task.deadline) {
        // Auto extend deadline by 48 hours for revision if no date picked
        const base = new Date(task.deadline > new Date().toISOString() ? task.deadline : new Date().toISOString());
        base.setDate(base.getDate() + 2);
        updates.deadline = base.toISOString();
      }

      await updateTask(task.id, updates);
      await sendNotifications([
        {
          user_id: task.assigned_to,
          type: "task_revision",
          message: `Revision requested (deadline updated) for: ${task.title}`,
          link: "/app",
        },
      ]);
      toast.success("Revision requested with extended deadline");
      setShowRevisionInput(false);
      onOpenChange(false);
      onDone?.();
    } catch (e: any) {
      toast.error(e.message || "Failed to request revision");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="space-y-3 pb-2 border-b border-border/60">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={priorityColor(task.priority)}>
              {task.priority} priority
            </Badge>
            <Badge variant="outline" className={statusColor(task.status)}>
              {task.status}
            </Badge>
            {task.recurrence && task.recurrence !== "none" && (
              <Badge variant="outline" className="gap-1 border-purple-200 bg-purple-50 text-purple-700">
                <Repeat className="h-3 w-3" /> {task.recurrence}
              </Badge>
            )}
            {isOverdue && (
              <Badge variant="outline" className="border-red-300 bg-red-100 text-red-700">
                Overdue
              </Badge>
            )}
          </div>

          <DialogTitle className="font-display text-xl font-bold text-foreground">
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-black/5 bg-slate-50/70 p-4 text-xs">
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-500">Assigned to: </span>
                <span className="font-semibold text-slate-800">{assigneeName}</span>
                {assignee?.position && (
                  <span className="text-slate-400 font-normal"> ({assignee.position})</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Shield className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-500">Assigned by: </span>
                <span className="font-semibold text-slate-800">{assignerName}</span>
              </div>
            </div>

            {task.deadline && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-slate-500">Deadline: </span>
                    <span className={`font-semibold ${isOverdue ? "text-red-600 font-bold" : "text-slate-800"}`}>
                      {new Date(task.deadline).toLocaleString()}
                    </span>
                  </div>
                </div>
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-[11px] text-blue-600 hover:bg-blue-50 font-bold"
                    onClick={() => {
                      setNewDeadline(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "");
                      setShowExtendModal((prev) => !prev);
                    }}
                  >
                    Extend Deadline
                  </Button>
                )}
              </div>
            )}

            {showExtendModal && isAdmin && (
              <div className="col-span-full space-y-2 rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                <Label className="text-xs font-semibold text-blue-900">
                  Select New Extended Deadline
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="datetime-local"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="h-8 flex-1 rounded-md border border-slate-300 bg-white px-2 text-xs"
                  />
                  <Button
                    size="sm"
                    onClick={handleExtendDeadline}
                    disabled={busy || !newDeadline}
                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                  >
                    {busy && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />} Save Extension
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-500">Created: </span>
                <span className="font-medium text-slate-700">
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Description sent by user/admin */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <FileText className="h-3.5 w-3.5" /> Description
            </div>
            <div className="rounded-xl border border-black/5 bg-white p-4 text-sm text-slate-700 leading-relaxed min-h-[60px] whitespace-pre-wrap shadow-sm">
              {task.description || <span className="italic text-slate-400">No description provided.</span>}
            </div>
          </div>

          {/* Revision Note Warning */}
          {task.revision_note && (
            <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 text-xs text-orange-800 space-y-1">
              <div className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <RotateCcw className="h-3.5 w-3.5 text-orange-600" /> Revision Requested
              </div>
              <p className="text-sm">{task.revision_note}</p>
            </div>
          )}

          {/* Tags */}
          {Array.isArray(task.tags) && task.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium mr-1">Tags:</span>
              {task.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-black/5 bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Subtasks */}
          <div className="space-y-2 border-t border-border/50 pt-4">
            <SubtaskList taskId={task.id} canEdit={!!isAdmin} canToggle={canSubmitFinished} />
          </div>

          {/* Proof Submissions */}
          <div className="space-y-3 border-t border-border/50 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <ImageIcon className="h-3.5 w-3.5" /> Proof & Attachments ({proofs.length})
              </div>
            </div>

            {loadingProofs ? (
              <div className="flex items-center gap-2 py-4 text-xs text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading proofs…
              </div>
            ) : proofs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 p-4 text-center text-xs text-slate-400">
                No proof images uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {proofs.map((p) => (
                  <div
                    key={p.id}
                    className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                  >
                    {p.signedUrl ? (
                      <a href={p.signedUrl} target="_blank" rel="noreferrer" className="block">
                        <img
                          src={p.signedUrl}
                          alt="Proof"
                          className="h-36 w-full object-cover transition hover:opacity-90"
                        />
                      </a>
                    ) : null}
                    {p.note && (
                      <div className="p-2.5 text-xs text-slate-600 border-t border-border/50">
                        <span className="font-medium text-slate-700">Note: </span>
                        {p.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="space-y-3 border-t border-border/50 pt-4">
            <TaskComments taskId={task.id} />
          </div>

          {/* Revision Input Box for Admin */}
          {showRevisionInput && (
            <div className="space-y-3 rounded-xl border border-orange-200 bg-orange-50/60 p-4">
              <Label className="text-xs font-semibold text-orange-900">
                Revision Details / Note for Employee
              </Label>
              <Textarea
                rows={3}
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                placeholder="Explain what needs to be changed or improved…"
                className="bg-white text-sm"
              />
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-orange-900">
                  Extended Deadline for Revision (Optional / Defaults to +48h)
                </Label>
                <input
                  type="datetime-local"
                  value={extendedDeadline}
                  onChange={(e) => setExtendedDeadline(e.target.value)}
                  className="h-8 w-full rounded-md border border-orange-300 bg-white px-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button size="sm" variant="ghost" onClick={() => setShowRevisionInput(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="bg-orange-600 text-white hover:bg-orange-700"
                  onClick={handleRequestRevision}
                  disabled={busy}
                >
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit Revision Request
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-border/60 flex flex-wrap gap-2 justify-between items-center">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          <div className="flex flex-wrap gap-2">
            {canSubmitFinished && (
              <Button
                className="bg-gradient-to-br from-[oklch(0.28_0.09_265)] to-[oklch(0.5_0.16_260)] text-white shadow hover:opacity-90 transition-opacity"
                onClick={() => {
                  onOpenChange(false);
                  onOpenSubmitFinished?.();
                }}
              >
                <CheckSquare className="mr-2 h-4 w-4" /> Submit as Finished
              </Button>
            )}

            {isAdmin && task.status === "completed" && (
              <>
                <Button
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  onClick={() => setShowRevisionInput((prev) => !prev)}
                >
                  <RotateCcw className="mr-1.5 h-4 w-4" /> Request Revision
                </Button>
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={handleApprove}
                  disabled={busy}
                >
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
