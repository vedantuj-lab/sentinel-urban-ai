import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ZoneAssessment } from "@/types/risk";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  assessment: ZoneAssessment;
}

export function ExplainableRiskAnalysis({ assessment }: Props) {
  const { zone, riskScore, drivers, level, dataQualityScore, dataQualityLevel } = assessment;

  return (
    <Card className="border border-border shadow-sm bg-card rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Info className="h-5 w-5 text-indigo-600" />
          Why is this zone at risk?
        </CardTitle>
        <CardDescription className="text-sm">
          Analysis of contributing factors to the heat-risk score of {riskScore}/100
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Score Summary */}
        <div className="p-4 rounded-xl bg-surface/50 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-foreground">Current Heat-Risk Score</span>
            <span className="text-2xl font-black font-mono">{riskScore}/100</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Risk Level:
            </span>
            <span className="text-xs font-bold uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded">
              {level}
            </span>
          </div>
        </div>

        {/* Contributing Factors Table */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Contributing Factors
          </h4>
          <div className="space-y-2">
            {drivers.slice(0, 3).map((driver, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-surface/30 border border-border flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-foreground">{driver.label}</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      ({driver.weightPct}% contribution)
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{driver.value}</span>
                </div>
                <div className="ml-4">
                  {idx === 0 ? (
                    <TrendingUp className="h-4 w-4 text-rose-600" />
                  ) : idx === 1 ? (
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                  ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Quality */}
        <div className="p-4 rounded-xl bg-surface/50 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Data Quality Score</span>
            <span className="text-lg font-black font-mono">{dataQualityScore}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Quality Level:</span>
            <span className="text-xs font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
              {dataQualityLevel}
            </span>
          </div>
        </div>

        {/* Key Environmental Indicators */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Key Environmental Indicators
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-surface/30 border border-border">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                Land Surface Temp
              </span>
              <span className="text-sm font-black font-mono">{zone.temperatureC}°C</span>
            </div>
            <div className="p-3 rounded-lg bg-surface/30 border border-border">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                Vegetation Cover
              </span>
              <span className="text-sm font-black font-mono">{zone.vegetationPct}%</span>
            </div>
            <div className="p-3 rounded-lg bg-surface/30 border border-border">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                Built-up Density
              </span>
              <span className="text-sm font-black font-mono">{zone.builtUpPct}%</span>
            </div>
            <div className="p-3 rounded-lg bg-surface/30 border border-border">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                Population Exposure
              </span>
              <span className="text-sm font-black font-mono">
                {zone.populationDensity.toLocaleString()}/km²
              </span>
            </div>
          </div>
        </div>

        {/* Risk Interpretation */}
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
          <h4 className="text-sm font-bold text-indigo-900">Risk Interpretation</h4>
          <p className="text-xs text-indigo-800 leading-relaxed">
            This zone's {level} heat-risk score is primarily driven by{" "}
            <strong>{drivers[0]?.label.toLowerCase()}</strong> ({drivers[0]?.weightPct}%
            contribution)
            {" and "}
            <strong>{drivers[1]?.label.toLowerCase()}</strong> ({drivers[1]?.weightPct}%
            contribution). The analysis uses the Rothfusz Heat Index formula and considers land-use
            characteristics, historical patterns, and vulnerability indices.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
