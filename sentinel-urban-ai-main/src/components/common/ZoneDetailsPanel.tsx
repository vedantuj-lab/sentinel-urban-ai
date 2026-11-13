import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Thermometer,
  Users,
  Building,
  Trees,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Layers,
  Clock,
} from "lucide-react";
import { RiskBadge, ScoreMeter } from "@/components/common/risk-ui";
import type { ZoneAssessment } from "@/types/risk";

interface ZoneDetailsPanelProps {
  assessment: ZoneAssessment | null;
  className?: string;
}

export function ZoneDetailsPanel({ assessment, className }: ZoneDetailsPanelProps) {
  if (!assessment) {
    return (
      <Card
        className={`border border-border/60 shadow-sm rounded-3xl p-6 bg-card ${className || ""}`}
      >
        <CardContent className="py-12 text-center text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-xs font-semibold">
            Select a zone on the map or search list to inspect thermal metrics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { zone, riskScore, level, confidence, priorityRank, recommendation, explanation, actions } =
    assessment;

  return (
    <Card
      className={`border border-border/60 shadow-panel rounded-3xl bg-card overflow-hidden ${className || ""}`}
    >
      <CardHeader className="bg-surface/40 p-6 border-b border-border/60">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Selected Zone Intelligence
          </span>
          <RiskBadge level={level} />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-foreground flex items-center justify-between">
          <span>{zone.name}</span>
          <span className="text-xs font-mono font-bold text-muted-foreground bg-surface px-2.5 py-1 rounded-lg border border-border">
            {zone.ward} ({zone.id})
          </span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground font-medium mt-1">
          Land Use: {zone.landUse} · Priority Rank: #{priorityRank}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Risk Score Meter */}
        <div>
          <ScoreMeter score={riskScore} level={level} />
          <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
            <span>Model Confidence: {confidence}%</span>
            <span>Priority Rank: #{priorityRank}</span>
          </div>
        </div>

        {/* Environmental Indicators Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-surface/60 border border-border/60">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
              <Thermometer className="h-3.5 w-3.5 text-primary" />
              Surface Temp
            </div>
            <p className="text-lg font-black text-foreground mt-1 tabular-nums">
              {zone.temperatureC ? `${zone.temperatureC}°C` : "Data unavailable"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface/60 border border-border/60">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
              <Users className="h-3.5 w-3.5 text-primary" />
              Population Exposure
            </div>
            <p className="text-lg font-black text-foreground mt-1 tabular-nums">
              {zone.population ? zone.population.toLocaleString() : "Data unavailable"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface/60 border border-border/60">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
              <Building className="h-3.5 w-3.5 text-primary" />
              Built-Up Density
            </div>
            <p className="text-lg font-black text-foreground mt-1 tabular-nums">
              {zone.builtUpPct != null ? `${zone.builtUpPct}%` : "Data unavailable"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface/60 border border-border/60">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
              <Trees className="h-3.5 w-3.5 text-primary" />
              Canopy Cover
            </div>
            <p className="text-lg font-black text-foreground mt-1 tabular-nums">
              {zone.vegetationPct != null ? `${zone.vegetationPct}%` : "Data unavailable"}
            </p>
          </div>
        </div>

        {/* Top Contributing Factors */}
        {explanation && (
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Primary Risk Drivers
            </div>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
              "{explanation}"
            </p>
          </div>
        )}

        {/* Recommended Intervention */}
        {recommendation && (
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Targeted Action Directive
            </div>
            <p className="text-xs text-foreground font-semibold leading-relaxed">
              {recommendation}
            </p>
            {actions && actions.length > 0 && (
              <ul className="mt-2 space-y-1 pl-4 list-disc text-[11px] font-medium text-muted-foreground">
                {actions.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Data Source & Freshness Metadata */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1">
            <Layers className="h-3 w-3" /> Source: Sentinel-3 SLSTR & Landsat-9 LST
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Live Feed
          </span>
        </div>

        {/* Link to Full Zone Analysis */}
        <div className="pt-2">
          <a
            href={`/analyst/analysis?zoneId=${zone.id}`}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-wider flex items-center justify-center transition-all shadow-sm"
          >
            Full Zone Analysis →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
