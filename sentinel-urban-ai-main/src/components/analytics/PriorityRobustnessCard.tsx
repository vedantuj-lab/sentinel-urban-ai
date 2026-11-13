import { useMemo } from "react";
import type { ZoneAssessment } from "@/types/risk";
import { DifferentiatorsService } from "@/services/DifferentiatorsService";
import { DataProvider } from "@/services/provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, AlertCircle, Info, Sliders } from "lucide-react";

interface Props {
  assessments: ZoneAssessment[];
}

export function PriorityRobustnessCard({ assessments }: Props) {
  const robustness = useMemo(() => {
    const weights = DataProvider.getPriorityWeights();
    return DifferentiatorsService.checkPriorityRobustness(assessments, weights);
  }, [assessments]);

  const stableCount = robustness.filter((r) => r.rankStatus === "Rank stable").length;

  return (
    <Card className="border-none shadow-premium bg-white rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-8 pb-4 border-b border-border/20 bg-surface/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-600">
                Sensitivity Analysis
              </span>
              <CardTitle className="text-xl font-black uppercase tracking-wider editorial">
                Priority Robustness Check
              </CardTitle>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-700 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest shrink-0">
            ±10% Weight Perturbation
          </div>
        </div>
        <CardDescription className="text-xs font-semibold text-muted-foreground mt-2">
          Evaluates if city priority rankings remain stable when criteria weights undergo ±10%
          sensitivity perturbation.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        <div className="p-5 rounded-2xl bg-purple-900 text-white flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-200 block mb-1">
              Rank Stability Rating
            </span>
            <p className="text-2xl font-black font-mono">
              {stableCount} / {assessments.length} Zones Stable (
              {Math.round((stableCount / assessments.length) * 100)}%)
            </p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            Robust Model
          </span>
        </div>

        <div className="space-y-2">
          {robustness.slice(0, 5).map((r) => (
            <div
              key={r.zoneId}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm"
            >
              <div>
                <span className="text-xs font-black text-slate-900 block uppercase">
                  {r.zoneName}
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  Original Rank #{r.originalRank}
                </span>
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border ${
                  r.rankStatus === "Rank stable"
                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                }`}
              >
                {r.rankStatus}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-start gap-3">
          <Info className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-900 font-black uppercase">Sensitivity Note:</strong>{" "}
            Rank-stable zones preserve their priority order even if planners reweight risk severity
            vs vulnerability. Rank-sensitive zones warrant field validation before executing
            capital-intensive interventions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
