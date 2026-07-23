import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Radio, Zap, Terminal, Users2, ListChecks, MessageSquare, PartyPopper, Ghost, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dev")({
  head: () => ({
    meta: [
      { title: "Developer Console — C-Enterprises WorkMonitor" },
      { name: "description", content: "Restricted developer-only console." },
      { property: "og:title", content: "Developer Console — C-Enterprises WorkMonitor" },
      { property: "og:description", content: "Restricted developer-only console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DevConsole,
});

type Presence = { user_id: string; full_name: string; page: string; at: number };

function DevConsole() {
  const { profile, user, loading } = useAuth();
  const [stats, setStats] = useState({ users: 0, tasks: 0, messages: 0, approved: 0 });
  const [online, setOnline] = useState<Presence[]>([]);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [ghost, setGhost] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const isDev = profile?.badge === "Developer";

  useEffect(() => {
    if (!isDev || !user) return;
    (async () => {
      const [u, t, m, a] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("tasks").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("tasks").select("id", { count: "exact", head: true }).eq("status", "approved"),
      ]);
      setStats({ users: u.count ?? 0, tasks: t.count ?? 0, messages: m.count ?? 0, approved: a.count ?? 0 });
    })();

    const syncPresence = (rows: Presence[]) => {
      setOnline(rows.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || "")));
    };
    syncPresence(((window as any).__workmonitorPresence ?? []) as Presence[]);
    const onPresence = (event: Event) => syncPresence(((event as CustomEvent<Presence[]>).detail ?? []) as Presence[]);
    window.addEventListener("workmonitor-presence", onPresence);
    pushLog("Live presence stream connected");
    return () => window.removeEventListener("workmonitor-presence", onPresence);

  }, [isDev, user?.id]);

  function pushLog(line: string) {
    setLog((l) => [`[${new Date().toLocaleTimeString()}] ${line}`, ...l].slice(0, 40));
  }

  async function sendBroadcast(kind: "toast" | "confetti") {
    if (kind === "toast" && !broadcastMsg.trim()) return;
    setSending(true);
    // Root listener subscribes on channel "app-presence" for broadcast events.
    const ch = supabase.channel("app-presence");
    await new Promise<void>((resolve) => {
      ch.subscribe((s) => { if (s === "SUBSCRIBED") resolve(); });
    });
    const payload = kind === "toast"
      ? { message: broadcastMsg.trim(), from: profile?.full_name ?? "Developer" }
      : { from: profile?.full_name ?? "Developer" };
    await ch.send({ type: "broadcast", event: kind, payload });
    supabase.removeChannel(ch);
    pushLog(kind === "toast" ? `Broadcast toast: "${broadcastMsg.trim()}"` : "Confetti storm launched");
    if (kind === "toast") setBroadcastMsg("");
    setSending(false);
    toast.success(kind === "toast" ? "Broadcast sent to everyone" : "Confetti launched everywhere");
  }



  function toggleGhost() {
    const next = !ghost;
    setGhost(next);
    if (next) {
      document.documentElement.classList.add("dev-ghost-mode");
      toast.success("Ghost mode ON — presence hidden");
    } else {
      document.documentElement.classList.remove("dev-ghost-mode");
      toast.message("Ghost mode OFF");
    }
  }

  const uptime = useMemo(() => new Date().toLocaleString(), []);

  if (loading) return <div className="py-16 text-center text-sm text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin" /></div>;
  if (!isDev) return <Navigate to="/" />;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-br from-[oklch(0.18_0.08_265)] via-[oklch(0.24_0.1_265)] to-[oklch(0.32_0.14_260)] p-6 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[oklch(0.7_0.2_260)]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[oklch(0.65_0.22_290)]/30 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70">
              <Terminal className="h-3.5 w-3.5" /> Developer Console
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold">Welcome, {profile?.full_name?.split(" ")[0]}</h1>
            <p className="mt-1 text-sm text-white/80">Restricted zone. Session opened {uptime}.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="workmonitor-glass-badge badge-shine inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Developer
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Users", value: stats.users, icon: Users2 },
          { label: "Tasks", value: stats.tasks, icon: ListChecks },
          { label: "Messages", value: stats.messages, icon: MessageSquare },
          { label: "Approved", value: stats.approved, icon: Sparkles },
        ].map((s) => (
          <Card key={s.label} className="transition hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-brand-accent" />
            </CardHeader>
            <CardContent><div className="font-display text-3xl font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Broadcast */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Radio className="h-4 w-4 text-brand-accent" /> Global broadcast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              placeholder="Announce something to every open screen…"
              rows={3}
              maxLength={240}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => sendBroadcast("toast")} disabled={sending || !broadcastMsg.trim()}>
                <Zap className="mr-2 h-4 w-4" /> Send to everyone
              </Button>
              <Button variant="outline" onClick={() => sendBroadcast("confetti")} disabled={sending}>
                <PartyPopper className="mr-2 h-4 w-4" /> Confetti storm
              </Button>
              <Button variant="ghost" onClick={toggleGhost} className={ghost ? "text-brand-accent" : ""}>
                <Ghost className="mr-2 h-4 w-4" /> Ghost mode {ghost ? "on" : "off"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Broadcasts appear as toasts on every open browser tab in real time.</p>
          </CardContent>
        </Card>

        {/* Presence */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Live presence</CardTitle>
          </CardHeader>
          <CardContent>
            {online.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No one else here.</div>
            ) : (
              <ul className="space-y-2">
                {online.map((p) => (
                  <li key={p.user_id + p.at} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      {p.full_name}
                    </span>
                    <span className="truncate text-[10px] text-muted-foreground">{p.page}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Log */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Terminal className="h-4 w-4" /> Console log</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="max-h-64 overflow-auto rounded-md bg-[oklch(0.15_0.02_265)] p-3 font-mono text-[11px] leading-relaxed text-emerald-300">
{log.length === 0 ? "// idle" : log.join("\n")}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
