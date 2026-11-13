import { useState, useMemo } from "react";
import type { ZoneAssessment } from "@/types/risk";
import { DifferentiatorsService } from "@/services/DifferentiatorsService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

interface Props {
  assessments: ZoneAssessment[];
}

export function InterventionPlannerCard({ assessments }: Props) {
  const [numZones, setNumZones] = useState<number>(3);

  const plan = useMemo(() => {
    return DifferentiatorsService.planInterventions(assessments, numZones);
  }, [assessments, numZones]);

  return (
    <Card className="border-none shadow-premium bg-white rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-8 pb-4 border-b border-border/20 bg-surface/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600">
                Resource-Constrained Optimization
              </span>
              <CardTitle className="text-xl font-black uppercase tracking-wider editorial">
                Resource Intervention Planner
              </CardTitle>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-700 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest shrink-0">
            Greedy Impact Selection
          </div>
        </div>
        <CardDescription className="text-xs font-semibold text-muted-foreground mt-2">
          Select budget constraint (number of actionable zones) to greedily maximize total
          population exposure coverage.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        <div className="space-y-4 p-6 rounded-[2rem] bg-slate-50 border border-slate-200">
          <div className="flex justify-between items-center">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700">
              Resource Constraint:{" "}
              <span className="text-indigo-600 font-mono text-sm">{numZones} Zones</span>
            </label>
            <span className="text-xs font-bold text-slate-500">
              Max Available: {plan.availableZonesCount}
            </span>
          </div>
          <Slider
            value={[numZones]}
            min={1}
            max={Math.min(8, plan.availableZonesCount)}
            step={1}
            onValueChange={([v]) => setNumZones(v)}
          />
        </div>

        <div className="p-6 rounded-[2rem] bg-indigo-900 text-white flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Users className="h-6 w-6 text-indigo-300" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-200">
                Total Population Protected
              </span>
              <p className="text-3xl font-black font-mono tracking-tight">
                {plan.totalPopulationCovered.toLocaleString()} Residents
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            Optimised Allocation
          </span>
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Targeted Priority Sectors
          </span>
          <div className="space-y-2">
            {plan.selectedZones.map((z) => (
              <div
                key={z.zoneId}
                className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <div>
                    <span className="text-xs font-black text-slate-900 block uppercase">
                      {z.zoneName}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {z.selectionReason}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                    P#{z.priorityRank} (Score: {z.priorityScore})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
