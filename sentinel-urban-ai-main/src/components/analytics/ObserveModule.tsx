import React from "react";
import { Zone } from "@/types/risk";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Thermometer,
  Droplets,
  CloudRain,
  Trees,
  Building2,
  Users,
  History,
  ShieldAlert,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  zone: Zone;
  className?: string;
}

/**
 * Step 6: Observe Module
 * Displays the 8 core environmental input variables clearly with status and units.
 */
export const ObserveModule: React.FC<Props> = ({ zone, className }) => {
  const metrics = [
    {
      label: "Ambient Temperature",
      value: `${zone.temperatureC.toFixed(1)} °C`,
      sub: "Thermal Telemetry",
      icon: Thermometer,
      status: zone.temperatureC > 38 ? "High" : zone.temperatureC > 35 ? "Moderate" : "Normal",
      color: zone.temperatureC > 38 ? "text-red-500 bg-red-50" : "text-amber-500 bg-amber-50",
    },
    {
      label: "Relative Humidity",
      value: `${zone.humidityPct}%`,
      sub: "Atmospheric Moisture",
      icon: Droplets,
      status: zone.humidityPct < 35 ? "Low" : "Normal",
      color: "text-blue-500 bg-blue-50",
    },
    {
      label: "Precipitation / Rainfall",
      value: `${zone.rainfallMm} mm`,
      sub: "24h Rainfall",
      icon: CloudRain,
      status: zone.rainfallMm < 1 ? "Dry" : "Wet",
      color: "text-cyan-500 bg-cyan-50",
    },
    {
      label: "Vegetation Coverage",
      value: `${zone.vegetationPct}%`,
      sub: "Canopy & Green Space",
      icon: Trees,
      status: zone.vegetationPct < 15 ? "Deficient" : "Adequate",
      color:
        zone.vegetationPct < 15 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Built-up Density",
      value: `${zone.builtUpPct}%`,
      sub: "Impervious Structure",
      icon: Building2,
      status: zone.builtUpPct > 75 ? "Dense" : "Moderate",
      color: zone.builtUpPct > 75 ? "text-purple-600 bg-purple-50" : "text-slate-600 bg-slate-50",
    },
    {
      label: "Population Exposure",
      value: `${zone.population.toLocaleString()} residents`,
      sub: `${zone.populationDensity.toLocaleString()}/km²`,
      icon: Users,
      status: zone.population > 80000 ? "High Load" : "Standard",
      color: zone.population > 80000 ? "text-rose-600 bg-rose-50" : "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Historical Heat Events",
      value: `${Math.round(zone.historicalRiskFrequency * 100)}%`,
      sub: "Past Days Flagged",
      icon: History,
      status: zone.historicalRiskFrequency > 0.6 ? "Frequent" : "Low Frequency",
      color:
        zone.historicalRiskFrequency > 0.6
          ? "text-orange-600 bg-orange-50"
          : "text-slate-600 bg-slate-50",
    },
    {
      label: "Vulnerability Score",
      value: `${(zone.vulnerabilityIndex * 100).toFixed(0)} / 100`,
      sub: "Socio-Economic Index",
      icon: ShieldAlert,
      status: zone.vulnerabilityIndex > 0.7 ? "High Vulnerability" : "Low Vulnerability",
      color:
        zone.vulnerabilityIndex > 0.7 ? "text-red-600 bg-red-50" : "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <Card
      className={cn(
        "shadow-premium border-none bg-white rounded-[2.5rem] overflow-hidden",
        className,
      )}
    >
      <CardHeader className="p-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-widest editorial">
                Observe_Module
              </CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1">
                Raw Environmental Telemetry Telemetry · {zone.name} ({zone.ward})
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-[9px] font-black uppercase tracking-widest bg-surface border-border/60 text-foreground px-3 py-1.5 rounded-xl w-fit"
          >
            Land Use: {zone.landUse.replace("-", "_")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-5 rounded-2xl border border-border/50 bg-surface/30 hover:bg-surface/80 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  {m.label}
                </span>
                <div className={cn("p-2 rounded-xl shrink-0", m.color)}>
                  <m.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-foreground tabular-nums tracking-tight">
                {m.value}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                <span className="text-[9px] font-bold text-muted-foreground/70">{m.sub}</span>
                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-white border border-border/40 text-foreground">
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
