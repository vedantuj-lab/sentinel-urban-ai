import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RiskDriver } from "@/types/risk";
import { BrainCircuit, Info, Sliders, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  drivers: RiskDriver[];
  confidence: number;
  explanation?: string;
  className?: string;
}

export function ExplainableAI({ drivers, confidence, explanation, className }: Props) {
  const [vegBoost, setVegBoost] = useState(0);

  // Calculate simulated reduction
  const simulatedReduction = vegBoost * 0.45;

  return (
    <Card className={cn("shadow-panel border-border", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Explainable AI Insights</CardTitle>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
            {confidence}% Confidence
          </div>
        </div>
        <CardDescription>
          AI model feature contribution and intervention sensitivity simulator.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        {explanation && (
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 mb-4">
            <p className="text-xs text-muted-foreground leading-relaxed italic">"{explanation}"</p>
          </div>
        )}

        <div className="space-y-4">
          {drivers.map((driver) => {
            const isVeg =
              driver.label.toLowerCase().includes("vegetation") ||
              driver.label.toLowerCase().includes("green");
            const adjustedWeight =
              isVeg && vegBoost > 0
                ? Math.max(2, driver.weightPct - Math.round(vegBoost * 0.3))
                : driver.weightPct;

            return (
              <div key={driver.label} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {driver.label}
                  </span>
                  <span className="font-bold text-muted-foreground">{adjustedWeight}% Impact</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface">
                  <div
                    className={cn(
                      "h-full transition-all duration-700",
                      isVeg && vegBoost > 0
                        ? "bg-emerald-500"
                        : "bg-primary/60 group-hover:bg-primary",
                    )}
                    style={{ width: `${adjustedWeight}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  <span>Value: {driver.value}</span>
                  <span>Driver Contribution</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Sensitivity Simulator */}
        <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-foreground">
                Green Canopy Intervention Simulator
              </span>
            </div>
            {vegBoost > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3" /> -{simulatedReduction.toFixed(1)} Pts Risk Drop
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {[0, 10, 25, 40].map((pct) => (
              <button
                key={pct}
                onClick={() => setVegBoost(pct)}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border",
                  vegBoost === pct
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-muted-foreground border-border hover:border-emerald-500/40",
                )}
              >
                {pct === 0 ? "Baseline" : `+${pct}% Green`}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-surface p-3 flex gap-3 border border-border/60">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our model identifies{" "}
            <span className="text-foreground font-semibold">{drivers[0]?.label}</span> as the
            primary risk driver, followed by{" "}
            <span className="text-foreground font-semibold">{drivers[1]?.label}</span>.
            {vegBoost > 0
              ? " Simulated green cover expansion reduces overall microclimate vulnerability score."
              : " Mitigation should focus on these factors first."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
