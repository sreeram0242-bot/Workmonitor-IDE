import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ListChecks, Loader2 } from "lucide-react";
import {
  fetchSubtasks,
  addSubtask,
  toggleSubtask,
  renameSubtask,
  deleteSubtask,
  type SubtaskRow,
} from "@/lib/tasks";
import { toast } from "sonner";

interface Props {
  taskId: string;
  canEdit: boolean;   // admin can add/rename/delete
  canToggle: boolean; // assignee or admin can tick
  compact?: boolean;  // read-only progress summary on cards
}

export function SubtaskList({ taskId, canEdit, canToggle, compact }: Props) {
  const [items, setItems] = useState<SubtaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await fetchSubtasks(taskId);
        if (alive) setItems(rows);
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [taskId]);

  async function onAdd() {
    const t = newTitle.trim();
    if (!t) return;
    setAdding(true);
    try {
      const nextPos = items.length ? Math.max(...items.map((s) => s.position)) + 1 : 0;
      const row = await addSubtask(taskId, t, nextPos);
      setItems((prev) => [...prev, row]);
      setNewTitle("");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to add");
    } finally {
      setAdding(false);
    }
  }

  async function onToggle(id: string, v: boolean) {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, is_done: v } : s)));
    try { await toggleSubtask(id, v); } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
      setItems((prev) => prev.map((s) => (s.id === id ? { ...s, is_done: !v } : s)));
    }
  }

  async function onRename(id: string, title: string) {
    try { await renameSubtask(id, title); } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function onDelete(id: string) {
    const prev = items;
    setItems((p) => p.filter((s) => s.id !== id));
    try { await deleteSubtask(id); } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
      setItems(prev);
    }
  }

  const done = items.filter((s) => s.is_done).length;
  const total = items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  if (compact) {
    if (loading || total === 0) return null;
    return (
      <div className="mt-2">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
          <ListChecks className="h-3 w-3" />
          <span>{done}/{total} subtasks</span>
          <span className="ml-auto">{pct}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-brand-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ListChecks className="h-3.5 w-3.5" />
        <span>Checklist</span>
        {total > 0 && <span className="ml-auto">{done}/{total} · {pct}%</span>}
      </div>
      {total > 0 && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-brand-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-3 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((s) => (
            <li key={s.id} className="flex items-center gap-2 rounded-md border border-border bg-background/60 px-2 py-1.5">
              <Checkbox
                checked={s.is_done}
                disabled={!canToggle && !canEdit}
                onCheckedChange={(v) => onToggle(s.id, !!v)}
              />
              {canEdit ? (
                <input
                  className={`flex-1 bg-transparent text-sm outline-none ${s.is_done ? "text-muted-foreground line-through" : ""}`}
                  defaultValue={s.title}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v && v !== s.title) onRename(s.id, v);
                  }}
                />
              ) : (
                <span className={`flex-1 text-sm ${s.is_done ? "text-muted-foreground line-through" : ""}`}>{s.title}</span>
              )}
              {canEdit && (
                <Button size="sm" variant="ghost" onClick={() => onDelete(s.id)} className="h-7 w-7 p-0 text-red-600 hover:text-red-700">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
      {canEdit && (
        <div className="flex gap-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }}
            placeholder="Add a subtask…"
            className="h-8 text-sm"
          />
          <Button size="sm" onClick={onAdd} disabled={adding || !newTitle.trim()}>
            {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          </Button>
        </div>
      )}
    </div>
  );
}
