import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  suffix,
  delta,
  icon: Icon,
  hint,
  accent,
  className,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  delta?: number;
  icon?: LucideIcon;
  hint?: string;
  accent?: string;
  className?: string;
}) {
  const Trend = delta === undefined ? Minus : delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownRight : Minus;
  return (
    <Card className={cn("gap-0 p-4 shadow-panel", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        {Icon ? (
          <span
            className="grid size-8 place-items-center rounded-md bg-surface-strong"
            style={accent ? { color: accent } : undefined}
          >
            <Icon className="size-4" />
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span
          className="font-display text-3xl font-semibold tabular-nums"
          style={accent ? { color: accent } : undefined}
        >
          {value}
        </span>
        {suffix ? <span className="text-sm text-muted-foreground">{suffix}</span> : null}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        {delta !== undefined ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              delta > 0 ? "text-risk-high" : delta < 0 ? "text-risk-low" : "",
            )}
          >
            <Trend className="size-3.5" />
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
        ) : null}
        <span>{hint}</span>
      </div>
    </Card>
  );
}
