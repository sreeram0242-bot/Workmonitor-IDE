let lastError: unknown = null;

if (typeof globalThis !== "undefined") {
  const g = globalThis as { addEventListener?: (t: string, cb: (e: unknown) => void) => void };
  g.addEventListener?.("unhandledrejection", (e: unknown) => {
    const reason = (e as { reason?: unknown })?.reason;
    if (reason) lastError = reason;
  });
  g.addEventListener?.("error", (e: unknown) => {
    const err = (e as { error?: unknown })?.error;
    if (err) lastError = err;
  });
}

export function consumeLastCapturedError(): unknown {
  const err = lastError;
  lastError = null;
  return err;
}
