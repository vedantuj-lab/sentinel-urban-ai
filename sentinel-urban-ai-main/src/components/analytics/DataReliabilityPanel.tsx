import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Clock, AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import type { ZoneAssessment } from "@/types/risk";

interface Props {
  assessment: ZoneAssessment;
  lastUpdate?: string;
  dataSource?: string;
}

export function DataReliabilityPanel({ assessment, lastUpdate, dataSource }: Props) {
  const { dataQualityScore, dataQualityLevel, validationSummary, zone } = assessment;

  const completeness = validationSummary.completeness;
  const consistency = validationSummary.consistency;
  const issues = validationSummary.issues;

  const dataSourceLabel = dataSource || "Demo/Static Dataset";
  const lastUpdateLabel = lastUpdate || "Not available (using demo data)";

  return (
    <Card className="border border-border shadow-sm bg-card rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Database className="h-5 w-5 text-teal-600" />
          Data Reliability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Data Quality */}
        <div className="p-4 rounded-xl bg-surface/50 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Data Quality Score</span>
            <span className="text-xl font-black font-mono">{dataQualityScore}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Quality Level:</span>
            <span className="text-xs font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
              {dataQualityLevel}
            </span>
          </div>
        </div>

        {/* Completeness and Consistency */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-surface/30 border border-border">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
              Completeness
            </span>
            <span className="text-lg font-black font-mono">{completeness}%</span>
          </div>
          <div className="p-3 rounded-lg bg-surface/30 border border-border">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
              Consistency
            </span>
            <span className="text-lg font-black font-mono">{consistency}%</span>
          </div>
        </div>

        {/* Dataset Source */}
        <div className="p-3 rounded-lg bg-surface/30 border border-border space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span className="font-semibold">Dataset Source:</span>
          </div>
          <span className="text-sm font-bold text-foreground">{dataSourceLabel}</span>
        </div>

        {/* Last Successful Update */}
        <div className="p-3 rounded-lg bg-surface/30 border border-border space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-semibold">Last Successful Update:</span>
          </div>
          <span className="text-sm font-bold text-foreground">{lastUpdateLabel}</span>
        </div>

        {/* Missing/Invalid Fields */}
        {issues.length > 0 ? (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Missing or Invalid Fields ({issues.length})</span>
            </div>
            <div className="space-y-1">
              {issues.slice(0, 3).map((issue, idx) => (
                <div key={idx} className="text-xs text-amber-800">
                  • {issue}
                </div>
              ))}
              {issues.length > 3 && (
                <div className="text-xs text-amber-800">... and {issues.length - 3} more</div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-900">
              All required fields are present and valid
            </span>
          </div>
        )}

        {/* Analysis Status */}
        <div className="p-3 rounded-lg bg-surface/30 border border-border">
          <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
            Analysis Status
          </span>
          <span className="text-sm font-bold text-foreground">
            {dataQualityScore >= 90 ? "Complete" : dataQualityScore >= 70 ? "Partial" : "Limited"}
          </span>
          {dataQualityScore < 90 && (
            <p className="text-xs text-muted-foreground mt-1">
              Some risk factors may be affected by missing or incomplete data.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
