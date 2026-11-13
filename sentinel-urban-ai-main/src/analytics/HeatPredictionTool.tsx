import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import {
  LineChart,
  Thermometer,
  Droplets,
  Leaf,
  Building2,
  Users,
  BrainCircuit,
} from "lucide-react";
import { HeatRiskModel, DEFAULT_HEAT_WEIGHTS } from "@/models/HeatRiskModel";
import { RiskBadge, ScoreMeter } from "@/components/common/risk-ui";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function HeatPredictionTool() {
  const [params, setParams] = useState({
    temp: 38,
    humidity: 40,
    rainfall: 1,
    vegetation: 20,
    builtUp: 80,
    population: 15000,
    historical: 0.6,
  });

  const { score, drivers } = useMemo(() => {
    const model = new HeatRiskModel();
    // Simplified simulation for the tool
    const zone = {
      temperatureC: params.temp,
      rainfallMm: params.rainfall,
      humidityPct: params.humidity,
      vegetationPct: params.vegetation,
      builtUpPct: params.builtUp,
      populationDensity: params.population,
      historicalRiskFrequency: params.historical,
      landUse: "mixed" as const,
      // other fields don't impact heat model currently or have defaults
    } as any;

    return model.calculateRisk({ zone });
  }, [params]);

  const level = score >= 80 ? "critical" : score >= 65 ? "high" : score >= 45 ? "medium" : "low";

  const handleSaveScenario = () => {
    toast.success("Simulation scenario saved to your analysis history.");
  };

  return (
    <Card className="border-border shadow-panel overflow-hidden">
      <CardHeader className="bg-surface/30 border-b border-border">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <CardTitle>Heat Risk Simulator</CardTitle>
        </div>
        <CardDescription>Adjust urban parameters to simulate risk outcomes.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Controls */}
          <div className="p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-border">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                  <Thermometer className="h-3.5 w-3.5" /> Temperature (°C)
                </Label>
                <span className="text-sm font-bold">{params.temp}°</span>
              </div>
              <Slider
                value={[params.temp]}
                min={25}
                max={50}
                step={1}
                onValueChange={([v]) => setParams((p) => ({ ...p, temp: v }))}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                  <Leaf className="h-3.5 w-3.5" /> Vegetation (%)
                </Label>
                <span className="text-sm font-bold">{params.vegetation}%</span>
              </div>
              <Slider
                value={[params.vegetation]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => setParams((p) => ({ ...p, vegetation: v }))}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" /> Built-up Density (%)
                </Label>
                <span className="text-sm font-bold">{params.builtUp}%</span>
              </div>
              <Slider
                value={[params.builtUp]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => setParams((p) => ({ ...p, builtUp: v }))}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> Pop. Density
                </Label>
                <span className="text-sm font-bold">{params.population.toLocaleString()}</span>
              </div>
              <Slider
                value={[params.population]}
                min={1000}
                max={30000}
                step={1000}
                onValueChange={([v]) => setParams((p) => ({ ...p, population: v }))}
              />
            </div>
          </div>

          {/* Prediction Output */}
          <div className="p-8 bg-surface/10 flex flex-col justify-center">
            <div className="text-center space-y-2 mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Simulated Risk Score
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-6xl font-black">{score}</span>
                <RiskBadge level={level} className="h-fit" />
              </div>
            </div>

            <div className="space-y-6">
              <ScoreMeter score={score} level={level} />

              <div className="grid grid-cols-2 gap-4">
                {drivers.slice(0, 4).map((d) => (
                  <div key={d.label} className="p-3 rounded-lg border border-border bg-card">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground truncate">
                        {d.label.split(" ")[0]}
                      </span>
                      <span className="text-[10px] font-bold text-primary">{d.weightPct}%</span>
                    </div>
                    <div className="h-1 w-full bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-primary/40" style={{ width: `${d.weightPct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4" variant="outline" onClick={handleSaveScenario}>
                Save Scenario Analysis
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
