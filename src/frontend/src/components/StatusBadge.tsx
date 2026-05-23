import { cn } from "@/lib/utils";

export type StatusVariant =
  | "live"
  | "icp-required"
  | "user-required"
  | "unavailable"
  | "pending"
  | "ok"
  | "error"
  | "untested";

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  className?: string;
}

const VARIANT_STYLES: Record<
  StatusVariant,
  { dot: string; badge: string; defaultLabel: string }
> = {
  live: {
    dot: "bg-emerald-400 shadow-[0_0_6px_oklch(0.75_0.19_150)]",
    badge: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
    defaultLabel: "Live",
  },
  "icp-required": {
    dot: "bg-orange-400 shadow-[0_0_6px_oklch(0.75_0.19_60)]",
    badge: "bg-orange-950/60 text-orange-300 border-orange-800/60",
    defaultLabel: "ICP Required",
  },
  "user-required": {
    dot: "bg-sky-400 shadow-[0_0_6px_oklch(0.75_0.19_220)]",
    badge: "bg-sky-950/60 text-sky-300 border-sky-800/60",
    defaultLabel: "User Required",
  },
  unavailable: {
    dot: "bg-red-400 shadow-[0_0_6px_oklch(0.65_0.22_25)]",
    badge: "bg-red-950/60 text-red-300 border-red-800/60",
    defaultLabel: "Unavailable",
  },
  pending: {
    dot: "bg-muted-foreground",
    badge: "bg-muted/60 text-muted-foreground border-border",
    defaultLabel: "Pending",
  },
  ok: {
    dot: "bg-emerald-400 shadow-[0_0_6px_oklch(0.75_0.19_150)]",
    badge: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
    defaultLabel: "OK",
  },
  error: {
    dot: "bg-red-400 shadow-[0_0_6px_oklch(0.65_0.22_25)]",
    badge: "bg-red-950/60 text-red-300 border-red-800/60",
    defaultLabel: "Error",
  },
  untested: {
    dot: "bg-muted-foreground",
    badge: "bg-muted/60 text-muted-foreground border-border",
    defaultLabel: "Untested",
  },
};

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const styles = VARIANT_STYLES[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium font-mono",
        styles.badge,
        className,
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", styles.dot)}
      />
      {label ?? styles.defaultLabel}
    </span>
  );
}
