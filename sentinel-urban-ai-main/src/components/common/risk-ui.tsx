import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/risk";
import { LEVEL_LABEL } from "@/types/risk";
import { AlertCircle, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

export const LEVEL_BG: Record<RiskLevel, string> = {
  low: "bg-risk-low",
  medium: "bg-risk-medium",
  high: "bg-risk-high",
  critical: "bg-risk-critical",
};

export const LEVEL_TEXT: Record<RiskLevel, string> = {
  low: "text-risk-low",
  medium: "text-risk-medium",
  high: "text-risk-high",
  critical: "text-risk-critical",
};

export const LEVEL_HEX: Record<RiskLevel, string> = {
  low: "var(--risk-low)",
  medium: "var(--risk-medium)",
  high: "var(--risk-high)",
  critical: "var(--risk-critical)",
};

const LEVEL_ICON = {
  low: ShieldCheck,
  medium: AlertTriangle,
  high: AlertTriangle,
  critical: Zap,
};

export function RiskBadge({
  level,
  className,
  label,
}: {
  level: RiskLevel;
  className?: string;
  label?: string;
}) {
  const Icon = LEVEL_ICON[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm",
        className,
      )}
      style={{
        borderColor: LEVEL_HEX[level],
        color: LEVEL_HEX[level],
        backgroundColor: `color-mix(in oklab, ${LEVEL_HEX[level]} 12%, transparent)`,
      }}
    >
      <Icon className="h-3 w-3" style={{ color: LEVEL_HEX[level] }} />
      {label ?? LEVEL_LABEL[level]}
    </span>
  );
}

export function ScoreMeter({ score, level }: { score: number; level: RiskLevel }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-strong neo-border border-none">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out relative"
        style={{ width: `${score}%`, backgroundColor: LEVEL_HEX[level] }}
      >
        <div className="absolute inset-0 bg-white/30 animate-sweep" />
      </div>
    </div>
  );
}

export function StatusDot({ status }: { status: string }) {
  const color =
    status === "Completed"
      ? "var(--risk-low)"
      : status === "In Progress"
        ? "var(--risk-medium)"
        : status === "Verification"
          ? "var(--primary)"
          : status === "Assigned"
            ? "var(--risk-high)"
            : "var(--muted-foreground)";
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {status}
    </span>
  );
}
