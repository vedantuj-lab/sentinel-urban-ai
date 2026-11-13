import { useMemo } from "react";
import type { Zone } from "@/types/risk";
import { DifferentiatorsService } from "@/services/DifferentiatorsService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingDown, Leaf, Building2, Info, ArrowRight } from "lucide-react";

interface Props {
  zone: Zone;
  currentScore: number;
  currentLevel: string;
}

export function PathToLowerRiskCard({ zone, currentScore, currentLevel }: Props) {
  const path = useMemo(() => {
    return DifferentiatorsService.computePathToLowerRisk(zone, currentScore, currentLevel);
  }, [zone, currentScore, currentLevel]);

  return (
    <Card className="border-none shadow-premium bg-white rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-8 pb-4 border-b border-border/20 bg-surface/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600">
              Counterfactual Analysis
            </span>
            <CardTitle className="text-xl font-black uppercase tracking-wider editorial">
              Path to Lower Risk
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-xs font-semibold text-muted-foreground mt-2">
          Minimum environmental parameter modifications required to transition {zone.name} into a
          lower risk band.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">
              Current Score
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {path.currentScore}/100
            </span>
            <span className="text-[10px] font-bold text-rose-600 uppercase block mt-1">
              {path.currentLevel}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 block mb-1">
              Target Score
            </span>
            <span className="text-2xl font-black text-emerald-700 font-mono">
              {path.targetScore}/100
            </span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase block mt-1">
              {path.targetLevel}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Required Parameter Adjustments
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
              <Leaf className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  +{path.requiredVegetationGainPct}% Green Cover
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  Urban canopy expansion
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-center gap-3">
              <Building2 className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  -{path.requiredBuiltUpReductionPct}% Built-up Density
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  Cool-roof surface retrofitting
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs font-semibold text-amber-900 flex items-start gap-3">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="leading-relaxed">{path.summary}</p>
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-700 bg-amber-200/50 px-2 py-0.5 rounded inline-block mt-1">
              Projected, not guaranteed
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
