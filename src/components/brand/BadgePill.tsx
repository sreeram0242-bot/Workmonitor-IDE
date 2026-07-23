import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function BadgePill({
  label,
  className,
  size = "sm",
}: {
  label: string | null | undefined;
  className?: string;
  size?: "xs" | "sm";
}) {
  if (!label) return null;
  const isDev = label.trim().toLowerCase() === "developer";
  const sizeCls =
    size === "xs"
      ? "gap-0.5 px-1.5 py-[1px] text-[9px]"
      : "gap-1 px-2 py-0.5 text-[10px]";
  const iconCls = size === "xs" ? "h-2.5 w-2.5" : "h-3 w-3";

  // Same visual recipe as the Developer Console badge.
  return (
    <span
      className={cn(
        "workmonitor-glass-badge relative inline-flex items-center rounded-full font-semibold backdrop-blur overflow-hidden",
        sizeCls,
        isDev && "badge-shine",
        className,
      )}
    >
      {isDev && <Sparkles className={cn("relative z-10", iconCls)} />}
      <span className="relative z-10">{label}</span>
    </span>
  );
}
