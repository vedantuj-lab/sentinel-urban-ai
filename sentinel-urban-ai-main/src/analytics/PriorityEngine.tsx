import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Calculator, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  priorityScore: number;
  rank: number;
  factors: { label: string; value: number; weight: number }[];
  reasons?: string[];
  className?: string;
}

/**
 * Steps 15 & 16: Priority Engine & Transparent Priority Explanation.
 */
export function PriorityEngine({ priorityScore, rank, factors, reasons = [], className }: Props) {
  const getLevelBadge = () => {
    if (priorityScore >= 80)
      return { label: "Critical Priority", color: "bg-red-50 text-red-700 border-red-200" };
    if (priorityScore >= 60)
      return { label: "High Priority", color: "bg-amber-50 text-amber-700 border-amber-200" };
    if (priorityScore >= 40)
      return {
        label: "Moderate Priority",
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      };
    return { label: "Low Priority", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  };

  const badge = getLevelBadge();

  return (
    <Card
      className={cn(
        "shadow-premium border-none bg-white rounded-[2rem] overflow-hidden",
        className,
      )}
    >
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base font-black uppercase tracking-wider">
              Priority Engine
            </CardTitle>
          </div>
          <div
            className={cn(
              "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border",
              badge.color,
            )}
          >
            {badge.label}
          </div>
        </div>
        <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">
          Transparent operational priority ranking & reasoning
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-4 space-y-6">
        <div className="flex flex-col items-center justify-center p-6 bg-surface rounded-[2rem] border border-border/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Zap className="h-16 w-16 text-amber-500" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Composite Priority Score
          </span>
          <span className="text-5xl font-black text-foreground tabular-nums tracking-tighter">
            {priorityScore}
          </span>
          <div className="mt-3 flex gap-2">
            <div className="px-3 py-1 rounded-xl bg-amber-500/10 text-[9px] font-black text-amber-700 border border-amber-500/20 uppercase tracking-wider">
              City Rank #{rank}
            </div>
            <div className="px-3 py-1 rounded-xl bg-primary/10 text-[9px] font-black text-primary border border-primary/20 uppercase tracking-wider">
              0–100 Scale
            </div>
          </div>
        </div>

        {/* Step 16: Transparent Priority Explanation */}
        {reasons.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Info className="h-3.5 w-3.5 text-primary" />
              Priority Determination Factors
            </div>
            <div className="flex flex-wrap gap-2">
              {reasons.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border/60 text-[10px] font-bold text-foreground"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Calculator className="h-3.5 w-3.5 text-slate-500" />
            Formula Decomposition
          </div>
          <div className="space-y-2">
            {factors.map((f) => (
              <div key={f.label} className="flex items-center justify-between text-xs">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">{f.label}</span>
                  <span className="text-[9px] text-muted-foreground">
                    Value: {f.value} · Weight: {f.weight}x
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-primary tabular-nums">
                    +{Math.round(f.value * f.weight)}
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-border flex justify-between items-center text-xs font-black">
              <span>Total Priority Score</span>
              <span className="text-primary text-sm tabular-nums">{priorityScore}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
