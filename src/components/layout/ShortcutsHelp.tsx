import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Keyboard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";

type Shortcut = { keys: string[]; label: string };

function Keys({ keys }: { keys: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((k, i) => (
        <kbd
          key={i}
          className="rounded border border-border/80 bg-secondary/60 px-2 py-0.5 text-[11px] font-mono text-foreground shadow-sm"
        >
          {k}
        </kbd>
      ))}
    </div>
  );
}

function isTypingTarget(el: EventTarget | null): boolean {
  const n = el as HTMLElement | null;
  if (!n) return false;
  const tag = n.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    n.isContentEditable === true
  );
}

export function ShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuth();
  const isAdmin = role === "admin";

  useEffect(() => {
    let awaitingG = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    function clearG() {
      awaitingG = false;
      if (gTimer) { clearTimeout(gTimer); gTimer = null; }
    }

    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      // "?" opens help
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      // g <letter> quick nav
      if (awaitingG) {
        const k = e.key.toLowerCase();
        let to: string | null = null;
        if (k === "d") to = isAdmin ? "/admin" : "/app";
        else if (k === "t") to = isAdmin ? "/admin/tasks" : "/app";
        else if (k === "c") to = "/chat";
        else if (k === "s") to = "/settings";
        else if (k === "a" && isAdmin) to = "/admin/analytics";
        else if (k === "m" && isAdmin) to = "/admin/team";
        else if (k === "t" && isAdmin) to = "/admin/tasks";
        else if (k === "l" && isAdmin) to = "/admin/calendar";
        clearG();
        if (to) {
          e.preventDefault();
          navigate({ to });
        }
        return;
      }

      if (e.key.toLowerCase() === "g") {
        awaitingG = true;
        gTimer = setTimeout(clearG, 1200);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (gTimer) clearTimeout(gTimer);
    };
  }, [isAdmin, navigate]);

  const general: Shortcut[] = [
    { keys: ["?"], label: "Show this help" },
    { keys: ["⌘", "K"], label: "Open global search" },
    { keys: ["Esc"], label: "Close dialog / cancel" },
  ];
  const nav: Shortcut[] = [
    { keys: ["G", "D"], label: "Go to Dashboard" },
    { keys: ["G", "T"], label: isAdmin ? "Go to Tasks" : "Go to My Tasks" },
    { keys: ["G", "C"], label: "Go to Chat" },
    { keys: ["G", "S"], label: "Go to Settings" },
    ...(isAdmin
      ? [
          { keys: ["G", "M"], label: "Go to Team" },
          { keys: ["G", "T"], label: "Go to Tasks" },
          { keys: ["G", "L"], label: "Go to Calendar" },
          { keys: ["G", "A"], label: "Go to Analytics" },
        ]
      : []),
  ];
  const chat: Shortcut[] = [
    { keys: ["Enter"], label: "Send message" },
    { keys: ["Shift", "Enter"], label: "New line" },
    { keys: ["@"], label: "Mention teammate" },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-4 w-4" /> Keyboard shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 text-sm">
            {[
              { title: "General", items: general },
              { title: "Navigation", items: nav },
              { title: "Chat", items: chat },
            ].map((section) => (
              <div key={section.title}>
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </div>
                <ul className="divide-y divide-border/60 overflow-hidden rounded-lg border border-border/60">
                  {section.items.map((s, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-3 py-2">
                      <span className="text-foreground">{s.label}</span>
                      <Keys keys={s.keys} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Tip: press <kbd className="rounded border bg-secondary/60 px-1.5 py-0.5 text-[10px] font-mono">G</kbd> then a letter to jump between pages.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
