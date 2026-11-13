import { useMemo } from "react";
import type { ZoneAssessment } from "@/types/risk";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Thermometer, ArrowRight, Zap, Info } from "lucide-react";

interface Props {
  assessments: ZoneAssessment[];
  onSelect?: (id: string) => void;
}

export function PriorityComparisonTable({ assessments, onSelect }: Props) {
  // 1. Ranked by Temperature Only
  const tempRanked = useMemo(() => {
    return [...assessments].sort((a, b) => b.zone.temperatureC - a.zone.temperatureC);
  }, [assessments]);

  // 2. Ranked by UrbanSense Multi-Factor Priority
  const priorityRanked = useMemo(() => {
    return [...assessments].sort((a, b) => b.priorityScore - a.priorityScore);
  }, [assessments]);

  return (
    <Card className="border-none shadow-premium bg-white rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-8 pb-4 border-b border-border/20 bg-surface/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#7C3AED]">
              Comparative Prioritisation
            </span>
            <CardTitle className="text-xl font-black uppercase tracking-wider editorial mt-1">
              Temperature-Only vs. UrbanSense Priority Ranking
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-muted-foreground mt-1">
              Demonstrates why multi-criteria risk scoring outperforms single-variable temperature
              sorting for city interventions.
            </CardDescription>
          </div>
          <div className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-700 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest shrink-0">
            Multi-Criteria Framework
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Temperature Only Column */}
          <div className="space-y-4 p-6 rounded-[2rem] bg-amber-500/[0.03] border border-amber-500/20">
            <div className="flex items-center gap-3 pb-3 border-b border-amber-500/20">
              <Thermometer className="h-5 w-5 text-amber-600" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Ranked by Temperature Only
                </h4>
                <p className="text-[10px] text-amber-700 font-semibold">
                  Sorted purely by ambient °C reading
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {tempRanked.slice(0, 5).map((a, idx) => (
                <div
                  key={a.zone.id}
                  onClick={() => onSelect?.(a.zone.id)}
                  className="p-3.5 rounded-xl bg-white border border-amber-500/10 flex justify-between items-center cursor-pointer hover:border-amber-500/40 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-lg bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center font-mono">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-black text-slate-900 block uppercase">
                        {a.zone.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {a.zone.ward}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {a.zone.temperatureC.toFixed(1)} °C
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* UrbanSense Priority Column */}
          <div className="space-y-4 p-6 rounded-[2rem] bg-indigo-500/[0.03] border border-indigo-500/20">
            <div className="flex items-center gap-3 pb-3 border-b border-indigo-500/20">
              <Zap className="h-5 w-5 text-indigo-600" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900">
                  Ranked by UrbanSense Priority
                </h4>
                <p className="text-[10px] text-indigo-700 font-semibold">
                  Severity + Exposure + Frequency + Vulnerability + Reliability
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {priorityRanked.slice(0, 5).map((a, idx) => (
                <div
                  key={a.zone.id}
                  onClick={() => onSelect?.(a.zone.id)}
                  className="p-3.5 rounded-xl bg-white border border-indigo-500/20 flex justify-between items-center cursor-pointer hover:border-indigo-500/50 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center font-mono shadow-sm">
                      #{idx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-black text-slate-900 block uppercase">
                        {a.zone.name}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-600">
                        {a.priorityLevel} Priority
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 block">
                      Score: {a.priorityScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Explanation Note */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-start gap-3">
          <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-900 font-black uppercase">Why rankings differ:</strong>{" "}
            Temperature-only sorting ignores human vulnerability and population density. UrbanSense
            AI evaluates risk severity alongside population load (
            {priorityRanked[0]?.zone.population.toLocaleString()} residents in P1), historical heat
            frequency, vulnerability indices, and reliability ratings to direct emergency resources
            where human impact is highest.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
