import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, CheckCheck, Trash2, ListChecks, MessageSquare, UserPlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface NotificationRow {
  id: string;
  type: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

function relTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const s = Math.floor(diff / 1000);
  if (s < 45) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric" });
}

function typeIcon(type: string) {
  const t = type.toLowerCase();
  if (t.includes("task")) return <ListChecks className="h-3.5 w-3.5 text-brand" />;
  if (t.includes("message") || t.includes("chat") || t.includes("mention")) return <MessageSquare className="h-3.5 w-3.5 text-brand-accent" />;
  if (t.includes("member") || t.includes("group") || t.includes("invite")) return <UserPlus className="h-3.5 w-3.5 text-emerald-600" />;
  return <AlertCircle className="h-3.5 w-3.5 text-amber-600" />;
}

export function NotificationsBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [open, setOpen] = useState(false);

  async function reload() {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setItems((data ?? []) as NotificationRow[]);
  }

  useEffect(() => {
    if (!user) return;
    reload();
    const ch = supabase
      .channel(`notif-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => reload(),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Re-render relative timestamps every 60s while dropdown is open
  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setItems((prev) => [...prev]), 60_000);
    return () => clearInterval(id);
  }, [open]);

  const unread = items.filter((i) => !i.read).length;
  const visible = useMemo(() => tab === "unread" ? items.filter((i) => !i.read) : items, [items, tab]);

  async function markAllRead() {
    if (!user || unread === 0) return;
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
  }

  async function clearAll() {
    if (!user || items.length === 0) return;
    setItems([]);
    await supabase.from("notifications").delete().eq("user_id", user.id);
  }

  async function openItem(item: NotificationRow) {
    if (!item.read) {
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, read: true } : i));
      await supabase.from("notifications").update({ read: true }).eq("id", item.id);
    }
    if (item.link) {
      setOpen(false);
      navigate({ to: item.link as any });
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`} className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[22rem] p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">Notifications</div>
            {unread > 0 && (
              <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand">{unread} new</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unread > 0 && (
              <Button size="sm" variant="ghost" onClick={markAllRead} className="h-7 px-2 text-xs">
                <CheckCheck className="mr-1 h-3 w-3" /> Read all
              </Button>
            )}
            {items.length > 0 && (
              <Button size="sm" variant="ghost" onClick={clearAll} className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive" aria-label="Clear all notifications">
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-2 py-1.5">
          {(["all", "unread"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${tab === k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {k === "all" ? "All" : `Unread${unread > 0 ? ` · ${unread}` : ""}`}
            </button>
          ))}
        </div>
        <ScrollArea className="max-h-96">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
              <Bell className="h-6 w-6 text-muted-foreground/40" />
              <div className="text-xs text-muted-foreground">
                {tab === "unread" ? "You're all caught up." : "No notifications yet."}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {visible.map((n) => (
                <button
                  key={n.id}
                  onClick={() => openItem(n)}
                  className={`block w-full px-3 py-2.5 text-left text-sm transition hover:bg-accent ${!n.read ? "bg-brand/[0.04]" : ""}`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                      {typeIcon(n.type)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm leading-snug ${!n.read ? "font-medium text-foreground" : "text-foreground/80"}`}>
                        {n.message}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span title={new Date(n.created_at).toLocaleString()}>{relTime(n.created_at)}</span>
                        {n.link && <span className="text-brand-accent">· Open</span>}
                      </div>
                    </div>
                    {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-accent" aria-label="Unread" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
        {items.length > 0 && (
          <div className="border-t border-border px-3 py-1.5 text-center text-[10px] text-muted-foreground">
            Showing latest {items.length}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
