import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  cityAvgQuality: number;
  cityAvgCompleteness: number;
  cityAvgConsistency: number;
  totalIssues: number;
}

/**
 * Aligned with Step 7 & 8: Data Validation & Quality Score.
 */
export function DataValidationSummary({
  cityAvgQuality,
  cityAvgCompleteness,
  cityAvgConsistency,
  totalIssues,
}: Props) {
  const isHighQuality = cityAvgQuality >= 80;
  const isLowQuality = cityAvgQuality < 60;

  return (
    <Card className="shadow-premium border-none bg-white rounded-3xl overflow-hidden">
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black uppercase tracking-wider flex items-center gap-3">
              <ShieldCheck
                className={cn("h-6 w-6", isHighQuality ? "text-green-500" : "text-amber-500")}
              />
              Data_Validation_Report
            </CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] mt-2">
              Cross-sector analytical dataset health
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Overall_Quality
            </p>
            <p
              className={cn(
                "text-3xl font-black tabular-nums",
                isHighQuality ? "text-green-600" : "text-amber-600",
              )}
            >
              {cityAvgQuality}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Metric label="Completeness" value={cityAvgCompleteness} />
          <Metric label="Consistency" value={cityAvgConsistency} />
          <Metric label="Validity" value={cityAvgQuality} />
        </div>

        {totalIssues > 0 && (
          <div
            className={cn(
              "p-4 rounded-2xl flex items-start gap-4 border",
              isLowQuality
                ? "bg-red-50 border-red-100 text-red-700"
                : "bg-amber-50 border-amber-100 text-amber-700",
            )}
          >
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest">
                Active_Alert: Dataset_Degradation
              </p>
              <p className="text-sm font-medium mt-1">
                {totalIssues} potential issues detected across the urban sensor network.
                {isLowQuality &&
                  " Prediction reliability may be reduced because of insufficient or inconsistent data."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5 bg-surface" />
    </div>
  );
}
