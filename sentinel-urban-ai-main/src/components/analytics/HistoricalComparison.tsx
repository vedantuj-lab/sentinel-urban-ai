import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ZoneAssessment } from "@/types/risk";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";

interface Props {
  assessment: ZoneAssessment;
}

export function HistoricalComparison({ assessment }: Props) {
  const { zone } = assessment;
  const riskHistory = zone.riskHistory ?? [];
  const temperatureHistory = zone.temperatureHistory ?? [];

  // Calculate averages
  const avgRisk = riskHistory.reduce((a, b) => a + b, 0) / riskHistory.length;
  const avgTemp = temperatureHistory.reduce((a, b) => a + b, 0) / temperatureHistory.length;

  // Current vs Average comparison
  const currentRisk = assessment.riskScore;
  const currentTemp = zone.temperatureC;

  const riskDelta = currentRisk - avgRisk;
  const tempDelta = currentTemp - avgTemp;

  const riskTrend = riskDelta > 2 ? "increased" : riskDelta < -2 ? "decreased" : "stable";
  const tempTrend = tempDelta > 1 ? "increased" : tempDelta < -1 ? "decreased" : "stable";

  return (
    <Card className="border border-border shadow-sm bg-card rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-600" />
          Historical Comparison (14-day)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Comparison */}
        <div className="p-4 rounded-xl bg-surface/50 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Heat-Risk Score</span>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-muted-foreground">14-day avg</span>
                <span className="text-lg font-black font-mono">{avgRisk.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">Current</span>
                <span className="text-lg font-black font-mono">{currentRisk}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {riskTrend === "increased" ? (
              <>
                <TrendingUp className="h-4 w-4 text-rose-600" />
                <span className="text-xs font-bold text-rose-700">
                  Risk increased by {Math.abs(riskDelta).toFixed(1)} points
                </span>
              </>
            ) : riskTrend === "decreased" ? (
              <>
                <TrendingDown className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700">
                  Risk decreased by {Math.abs(riskDelta).toFixed(1)} points
                </span>
              </>
            ) : (
              <>
                <Minus className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold text-muted-foreground">
                  Risk remained relatively stable
                </span>
              </>
            )}
          </div>
        </div>

        {/* Temperature Comparison */}
        <div className="p-4 rounded-xl bg-surface/50 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Land Surface Temperature</span>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-muted-foreground">14-day avg</span>
                <span className="text-lg font-black font-mono">{avgTemp.toFixed(1)}°C</span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">Current</span>
                <span className="text-lg font-black font-mono">{currentTemp}°C</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tempTrend === "increased" ? (
              <>
                <TrendingUp className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-700">
                  Temperature increased by {Math.abs(tempDelta).toFixed(1)}°C
                </span>
              </>
            ) : tempTrend === "decreased" ? (
              <>
                <TrendingDown className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700">
                  Temperature decreased by {Math.abs(tempDelta).toFixed(1)}°C
                </span>
              </>
            ) : (
              <>
                <Minus className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold text-muted-foreground">
                  Temperature remained relatively stable
                </span>
              </>
            )}
          </div>
        </div>

        {/* Data Source Note */}
        <div className="p-3 rounded-lg bg-surface/30 border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Data Source:</strong> Historical data based on 14-day observation period in the
            demonstration dataset. For production, this would reflect actual historical imports and
            observations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
