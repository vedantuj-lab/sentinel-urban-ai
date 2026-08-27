import { useMemo } from "react";
import type { ZoneAssessment } from "@/lib/risk/types";
import { LEVEL_HEX } from "@/components/common/risk-ui";
import { cn } from "@/lib/utils";

interface Props {
  assessments: ZoneAssessment[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  compact?: boolean;
}

/**
 * Schematic city risk map. Renders zones on a normalised city grid with
 * risk-coloured hotspots — no external map SDK required for the demo build.
 */
export function RiskMap({ assessments, selectedId, onSelect, className, compact }: Props) {
  const roads = useMemo(
    () => [
      "M0,34 C20,30 40,42 62,38 S88,30 100,33",
      "M0,62 C24,58 44,70 68,64 S92,58 100,60",
      "M28,0 C32,22 24,44 30,66 S34,88 32,100",
      "M66,0 C70,20 62,40 68,62 S72,84 70,100",
    ],
    [],
  );

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg border border-border bg-surface map-grid",
        compact ? "aspect-[4/3] sm:aspect-[16/9]" : "aspect-[4/5] sm:aspect-[16/10]",
        className,
      )}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        <path
          d="M0,14 C18,20 30,8 48,16 C66,24 80,12 100,18 L100,26 C80,20 66,32 48,24 C30,16 18,28 0,22 Z"
          fill="url(#water)"
        />
        <path
          d="M4,78 C18,74 26,88 42,86 C58,84 66,94 82,90 L96,94 L96,100 L4,100 Z"
          fill="var(--risk-low)"
          opacity="0.12"
        />
        {roads.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--border)"
            strokeWidth={i < 2 ? 1.1 : 0.8}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-primary/5 to-transparent" />

      {assessments.map((a) => {
        const color = LEVEL_HEX[a.level];
        const selected = selectedId === a.zone.id;
        const size = 12 + (a.riskScore / 100) * 16;
        return (
          <button
            key={a.zone.id}
            type="button"
            onClick={() => onSelect?.(a.zone.id)}
            aria-label={`${a.zone.name}, risk ${a.riskScore} of 100`}
            className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            style={{ left: `${a.zone.mx}%`, top: `${a.zone.my}%` }}
          >
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: size * 2.6,
                height: size * 2.6,
                background: `radial-gradient(circle, color-mix(in oklab, ${color} 38%, transparent) 0%, transparent 70%)`,
              }}
            />
            {(a.level === "high" || a.level === "critical") && (
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-risk-pulse rounded-full border"
                style={{ width: size * 1.7, height: size * 1.7, borderColor: color }}
              />
            )}
            <span
              className={cn(
                "relative block rounded-full ring-2 ring-background transition-transform duration-200 group-hover:scale-125",
                selected && "scale-125",
              )}
              style={{
                width: size,
                height: size,
                backgroundColor: color,
                boxShadow: selected ? `0 0 0 4px color-mix(in oklab, ${color} 30%, transparent)` : undefined,
              }}
            />
            <span
              className={cn(
                "pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 rounded border border-border bg-card/95 px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap shadow-panel transition-opacity",
                selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
            >
              {a.zone.name} · {a.riskScore}
            </span>
          </button>
        );
      })}

      <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-border bg-card/90 px-2.5 py-1.5 text-[11px] backdrop-blur">
        {(["low", "medium", "high", "critical"] as const).map((l) => (
          <span key={l} className="inline-flex items-center gap-1.5 capitalize">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LEVEL_HEX[l] }} />
            {l}
          </span>
        ))}
      </div>
      <div className="absolute right-3 top-3 rounded-md border border-border bg-card/90 px-2.5 py-1.5 text-[11px] text-muted-foreground backdrop-blur">
        Schematic city grid · {assessments.length} zones
      </div>
    </div>
  );
}
