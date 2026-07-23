export function Logo({ className = "h-9 w-9", showText = true, invert = false }: { className?: string; showText?: boolean; invert?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${className} rounded-full overflow-hidden bg-white flex items-center justify-center ring-1 ring-border shrink-0`}>
        <img
          src="/clogo.png"
          alt="C-Enterprises"
          className={"h-[80%] w-[80%] object-contain" + (invert ? " invert brightness-0" : "")}
        />
      </div>
      {showText && (
        <div className="leading-tight">
          <div className="font-display text-lg font-bold tracking-tight">C-Enterprises</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">WorkMonitor</div>
        </div>
      )}
    </div>
  );
}
