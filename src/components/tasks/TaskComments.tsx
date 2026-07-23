import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Comment = {
  id: string;
  task_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

function formatWhen(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleString();
}

export function TaskComments({ taskId }: { taskId: string }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Comment[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load() {
    const { data, error } = await supabase
      .from("task_comments" as any)
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: true });
    if (error) {
      setLoading(false);
      return;
    }
    const rows = (data ?? []) as unknown as Comment[];
    setItems(rows);
    const missing = Array.from(new Set(rows.map((r) => r.author_id))).filter((id) => !names[id]);
    if (missing.length) {
      const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", missing);
      const next = { ...names };
      (profs ?? []).forEach((p: any) => { next[p.id] = p.full_name ?? "Member"; });
      setNames(next);
    }
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`task-comments-${taskId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "task_comments", filter: `task_id=eq.${taskId}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  async function send() {
    if (!user || !body.trim()) return;
    setSending(true);
    const text = body.trim();
    setBody("");
    const { error } = await supabase.from("task_comments" as any).insert({
      task_id: taskId,
      author_id: user.id,
      body: text,
    } as any);
    setSending(false);
    if (error) { toast.error(error.message); setBody(text); return; }
  }

  async function remove(id: string) {
    const { error } = await supabase.from("task_comments" as any).delete().eq("id", id);
    if (error) toast.error(error.message);
  }

  return (
    <div className="rounded-md border border-border bg-muted/20 p-3">
      <div className="mb-2 text-xs font-medium text-muted-foreground">Discussion</div>
      <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex items-center gap-2 py-4 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Loading…</div>
        ) : items.length === 0 ? (
          <div className="py-3 text-xs text-muted-foreground">No comments yet. Start the conversation.</div>
        ) : (
          items.map((c) => (
            <div key={c.id} className="group flex items-start gap-2 rounded-md bg-background/60 p-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-foreground">{names[c.author_id] ?? "Member"}</span>
                  <span className="text-muted-foreground" title={new Date(c.created_at).toLocaleString()}>{formatWhen(c.created_at)}</span>
                </div>
                <div className="mt-0.5 whitespace-pre-wrap break-words text-sm">{c.body}</div>
              </div>
              {c.author_id === user?.id && (
                <button
                  onClick={() => remove(c.id)}
                  className="opacity-0 transition group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-600" />
                </button>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <div className="mt-2 flex items-end gap-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          placeholder="Write a comment…"
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }}
        />
        <Button size="sm" onClick={send} disabled={sending || !body.trim()}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
