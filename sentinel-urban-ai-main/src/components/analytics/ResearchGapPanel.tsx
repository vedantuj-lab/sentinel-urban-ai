import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, FlaskConical, ArrowUpRight } from "lucide-react";

/**
 * Step 21: Research-Gap Validation Panel.
 * Directly addresses the research paper by Shahfahad et al. (2026).
 */
export function ResearchGapPanel() {
  const gaps = [
    {
      label: "Explainable Risk Prediction",
      desc: "Retains ML prediction + Spatial Explainability",
    },
    { label: "Data Quality Awareness", desc: "Calculates completeness, validity & quality score" },
    {
      label: "Regional Adaptation Engine",
      desc: "Calibrates thresholds for Mumbai, Delhi, Pune, etc.",
    },
    { label: "Prediction Confidence", desc: "Displays confidence level & reliability warnings" },
    { label: "Hotspot Identification", desc: "Interactive GIS risk map classification" },
    { label: "Transparent Priority Ranking", desc: "Formula decomposition & reason explanation" },
    {
      label: "City-Level Priority Ranking",
      desc: "Multi-parameter sortable city priority ranking",
    },
    { label: "Intervention Recommendations", desc: "Context-aware decision support rules" },
  ];

  return (
    <Card className="shadow-premium border-none bg-sidebar text-white rounded-[2.5rem] overflow-hidden relative">
      <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />
      <CardHeader className="p-8 pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
              <FlaskConical className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-widest editorial">
                Research_Gap_Coverage
              </CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mt-1">
                Shahfahad et al. (2026) Alignment & Extension Matrix
              </CardDescription>
            </div>
          </div>
          <div className="px-3 py-1 rounded-xl bg-white/10 text-[9px] font-black uppercase tracking-widest text-primary border border-primary/30">
            Validated Future Scope
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {gaps.map((gap) => (
            <div
              key={gap.label}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 group hover:bg-white/10 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-white">
                  {gap.label}
                </p>
                <p className="text-[9px] font-medium text-white/50 leading-tight mt-0.5">
                  {gap.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-[10px] font-medium leading-relaxed text-white/60 italic max-w-2xl">
            “UrbanSense AI extends Shahfahad et al. (2026) by converting explainable heat risk
            predictions into data-quality-aware, confidence-aware hotspot identification,
            transparent city-level priority ranking and actionable intervention recommendations.”
          </p>
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-primary shrink-0">
            <span>Future Scope Implemented</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
