import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { toast } from "sonner";

type Search = { redirect?: string };

export const Route = createFileRoute("/lock")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  component: LockPage,
  head: () => ({ meta: [{ title: "Enter Passcode · WorkMonitor" }] }),
});

function LockPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/lock" });
  const [mode, setMode] = useState<"loading" | "unlock" | "setup" | "confirm">("loading");
  const [pin, setPin] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pressedKey, setPressedKey] = useState<number | null>(null);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      setUserId(data.session.user.id);
      const [{ data: prof }, { data: has }, { data: lock }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", data.session.user.id).maybeSingle(),
        supabase.rpc("has_passcode"),
        supabase.rpc("get_pin_lock_status"),
      ]);
      setDisplayName(prof?.full_name || data.session.user.email || "");
      setMode(has ? "unlock" : "setup");
      const until = (lock as any)?.locked_until ? new Date((lock as any).locked_until).getTime() : null;
      if (until && until > Date.now()) setLockUntil(until);
    })();
  }, [navigate]);

  useEffect(() => { inputRef.current?.focus(); }, [mode]);

  // Tick every 500ms while locked to update countdown
  useEffect(() => {
    if (!lockUntil) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= lockUntil) { setLockUntil(null); setAttemptsLeft(null); }
    }, 500);
    return () => clearInterval(id);
  }, [lockUntil]);

  const locked = !!(lockUntil && lockUntil > now);
  const secondsLeft = locked ? Math.ceil(((lockUntil ?? 0) - now) / 1000) : 0;

  // Global keyboard input for PIN entry
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (busy || locked || success) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        setPin((p) => {
          if (p.length >= 4) return p;
          const next = (p + e.key).slice(0, 4);
          if (next.length === 4) setTimeout(() => submit(next), 0);
          return next;
        });
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setPin((p) => p.slice(0, -1));
      } else if (e.key === "Escape") {
        e.preventDefault();
        setPin("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, locked, success, mode, firstPin]);


  function finish() {
    if (userId) sessionStorage.setItem(`wm_unlocked:${userId}`, "1");
    navigate({ to: redirect || "/", replace: true });
  }

  async function handleForgot() {
    if (!confirm("Reset your passcode? You will be signed out and asked to set a new PIN after signing in again.")) return;
    try {
      await supabase.rpc("clear_passcode");
    } catch {}
    if (userId) sessionStorage.removeItem(`wm_unlocked:${userId}`);
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }


  async function submit(value: string) {
    if (busy || locked) return;
    setBusy(true);
    try {
      if (mode === "unlock") {
        const { data: res, error } = await supabase.rpc("verify_passcode", { _pin: value });
        if (error) throw error;
        const r = res as { ok: boolean; reason?: string; attempts_left?: number; locked_until?: string } | null;
        if (!r?.ok) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          if (r?.reason === "locked" && r.locked_until) {
            const until = new Date(r.locked_until).getTime();
            setLockUntil(until);
            setAttemptsLeft(0);
            toast.error("Too many attempts. Locked for a moment.");
          } else {
            setAttemptsLeft(r?.attempts_left ?? null);
            toast.error(`Incorrect passcode${r?.attempts_left != null ? ` — ${r.attempts_left} tries left` : ""}`);
          }
          setTimeout(() => setPin(""), 260);
          return;
        }
        setSuccess(true);
        setTimeout(finish, 480);
      } else if (mode === "setup") {
        setFirstPin(value);
        setTimeout(() => { setPin(""); setMode("confirm"); }, 220);
      } else if (mode === "confirm") {
        if (value !== firstPin) {
          setShake(true);
          setTimeout(() => setShake(false), 500);
          toast.error("Passcodes don't match");
          setTimeout(() => { setPin(""); setFirstPin(""); setMode("setup"); }, 400);
          return;
        }
        const { error } = await supabase.rpc("set_passcode", { _pin: value });
        if (error) throw error;
        setSuccess(true);
        toast.success("Passcode set");
        setTimeout(finish, 480);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
      setPin("");
    } finally {
      setBusy(false);
    }
  }



  function onChange(v: string) {
    const clean = v.replace(/\D/g, "").slice(0, 4);
    setPin(clean);
    if (clean.length === 4) submit(clean);
  }

  const title =
    mode === "unlock" ? "Enter your passcode"
    : mode === "setup" ? "Create a 4-digit passcode"
    : mode === "confirm" ? "Confirm your passcode"
    : "";

  const subtitle =
    mode === "unlock" ? `Welcome back, ${displayName}`
    : mode === "setup" ? "You'll use this every time you sign in"
    : mode === "confirm" ? "Enter the same 4 digits again"
    : "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div
        className={`animate-pin-card-in relative w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_30px_80px_-20px_rgba(15,27,61,0.18)] ${
          shake ? "animate-pin-shake" : ""
        }`}
      >
        {/* subtle blue ambient glow */}
        <div className="pointer-events-none absolute inset-x-0 -top-16 h-40 bg-[radial-gradient(closest-side,rgba(59,130,246,0.18),transparent_70%)]" />

        <div className="relative mb-6 flex flex-col items-center gap-3">
          <Logo showText={false} className="h-14 w-14" />
          <div key={mode + (success ? "-ok" : "")} className="animate-pin-mode-swap text-center">
            <h1 className="font-display text-xl font-semibold text-slate-900">
              {success ? "Verified successfully" : title}
            </h1>
            {!success && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>

        {/* digit boxes morphing into success check */}
        <div className="relative mb-6 flex min-h-[68px] items-center justify-center">
          {/* Boxes layer */}
          <div
            className={`flex gap-3 transition-all duration-500 ease-[cubic-bezier(.2,.9,.3,1.2)] ${
              success
                ? "scale-75 opacity-0 blur-[2px]"
                : pin.length === 4
                  ? "animate-pin-boxes-sweep rounded-2xl"
                  : ""
            }`}
          >
            {[0, 1, 2, 3].map((i) => {
              const filled = pin.length > i;
              return (
                <div
                  key={i}
                  className={`relative flex h-14 w-12 items-center justify-center rounded-xl border text-xl font-semibold text-slate-900 transition-colors duration-200 ${
                    filled
                      ? "border-blue-500 bg-blue-50 animate-pin-box-glow"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  {filled && (
                    <span key={pin[i]} className="animate-pin-box-fill">
                      {pin[i]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Check layer — overlays and fades in smoothly */}
          <div
            className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(.2,.9,.3,1.4)] ${
              success ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500 bg-blue-50 shadow-[0_0_30px_-4px_rgba(59,130,246,0.55)]">
              <svg viewBox="0 0 24 24" className="h-9 w-9">
                <path
                  d="M5 12.5l4 4 10-10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={success ? "animate-pin-check-draw" : ""}
                />
              </svg>
            </div>
          </div>
        </div>

        <input
          ref={inputRef}
          value={pin}
          onChange={(e) => onChange(e.target.value)}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          disabled={busy || mode === "loading"}
          className="sr-only"
          aria-label="Passcode"
        />

        {locked && !success && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
            Too many attempts. Try again in <span className="font-semibold">{secondsLeft}s</span>.
          </div>
        )}
        {!locked && attemptsLeft != null && attemptsLeft > 0 && !success && (
          <div className="mb-3 text-center text-xs text-amber-600">
            {attemptsLeft} {attemptsLeft === 1 ? "try" : "tries"} left
          </div>
        )}

        {!success && (
          <div className={`animate-pin-fade-up grid grid-cols-3 gap-3 ${locked ? "pointer-events-none opacity-50" : ""}`}>
            {["1","2","3","4","5","6","7","8","9","reset","0","⌫"].map((k, idx) => (
              <button
                key={idx}
                type="button"
                disabled={!k || busy || locked}
                onClick={() => {
                  if (!k) return;
                  setPressedKey(idx);
                  setTimeout(() => setPressedKey((p) => (p === idx ? null : p)), 220);
                  if (k === "reset") {
                    setPin("");
                    if (mode === "confirm") { setFirstPin(""); setMode("setup"); }
                    return;
                  }
                  if (k === "⌫") { setPin((p) => p.slice(0, -1)); return; }
                  if (pin.length >= 4) return;
                  const next = (pin + k).slice(0, 4);
                  setPin(next);
                  if (next.length === 4) submit(next);
                }}
                className={`h-14 rounded-2xl font-medium transition-all duration-150 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 ${
                  k === "reset"
                    ? `text-xs uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 active:scale-90 ${
                        pressedKey === idx ? "animate-pin-key-press" : ""
                      }`
                    : k
                      ? `text-xl text-slate-900 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-400 active:scale-90 ${
                          pressedKey === idx ? "animate-pin-key-press" : ""
                        }`
                      : "invisible"
                }`}
              >
                {k === "reset" ? "Reset" : k}
              </button>
            ))}
          </div>
        )}

        {mode === "unlock" && !success && (
          <div className="relative mt-6 flex items-center justify-between text-xs">
            <button
              onClick={handleForgot}
              className="text-slate-500 hover:text-blue-600"
            >
              Forgot passcode?
            </button>
            <button
              onClick={async () => {
                if (userId) sessionStorage.removeItem(`wm_unlocked:${userId}`);
                await supabase.auth.signOut();
                navigate({ to: "/auth" });
              }}
              className="text-slate-500 hover:text-slate-900"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


