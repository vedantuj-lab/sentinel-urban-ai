import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ArrowRight, Trees, Building2, Sun, GitCompare } from "lucide-react";
import type { ZoneAssessment } from "@/types/risk";

interface Props {
  assessments: ZoneAssessment[];
}

interface Scenario {
  id: string;
  name: string;
  treePlanting: number;
  coolRoofs: number;
  greenSpaces: number;
  projectedRisk: number;
  estimatedCost: number;
}

export function ScenarioComparison({ assessments }: Props) {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(assessments[0]?.zone.id || "");
  const [treePlanting, setTreePlanting] = useState(50);
  const [coolRoofs, setCoolRoofs] = useState(30);
  const [greenSpaces, setGreenSpaces] = useState(20);

  const selectedAssessment = assessments.find((a) => a.zone.id === selectedZoneId);

  // Calculate projected risk based on interventions
  // This is a simplified projection based on documented intervention assumptions
  const calculateProjectedRisk = (
    baseline: number,
    trees: number,
    roofs: number,
    green: number,
  ) => {
    // Each intervention reduces risk by a documented percentage
    const treeReduction = (trees / 100) * 0.15; // 15% max reduction from trees
    const roofReduction = (roofs / 100) * 0.12; // 12% max reduction from cool roofs
    const greenReduction = (green / 100) * 0.1; // 10% max reduction from green spaces
    const totalReduction = (treeReduction + roofReduction + greenReduction) * baseline;
    return Math.max(0, Math.round(baseline - totalReduction));
  };

  const baselineRisk = selectedAssessment?.riskScore || 0;
  const projectedRisk = calculateProjectedRisk(baselineRisk, treePlanting, coolRoofs, greenSpaces);
  const riskReduction = baselineRisk - projectedRisk;
  const reductionPercent = ((riskReduction / baselineRisk) * 100).toFixed(1);

  const estimatedCost = treePlanting * 5000 + coolRoofs * 3000 + greenSpaces * 8000;

  return (
    <Card className="border border-border shadow-sm bg-card rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-indigo-600" />
          Intervention Impact Comparison
        </CardTitle>
        <CardDescription className="text-sm">
          Compare baseline risk with projected outcomes from mitigation interventions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zone Selection */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Select Zone
          </Label>
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="w-full h-10 rounded-lg border border-border bg-surface/50 px-3 text-sm"
          >
            {assessments.map((a) => (
              <option key={a.zone.id} value={a.zone.id}>
                {a.zone.name} ({a.zone.ward})
              </option>
            ))}
          </select>
        </div>

        {/* Intervention Configuration */}
        <div className="space-y-4 p-4 rounded-xl bg-surface/50 border border-border">
          <h4 className="text-sm font-bold text-foreground mb-4">Configure Interventions</h4>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Trees className="h-3.5 w-3.5 text-emerald-600" />
                  Tree Planting Coverage
                </Label>
                <span className="text-xs font-mono text-muted-foreground">{treePlanting}%</span>
              </div>
              <Slider
                value={[treePlanting]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => setTreePlanting(v)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-blue-600" />
                  Cool Roofs Coverage
                </Label>
                <span className="text-xs font-mono text-muted-foreground">{coolRoofs}%</span>
              </div>
              <Slider
                value={[coolRoofs]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => setCoolRoofs(v)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold text-foreground flex items-center gap-2">
                  <Sun className="h-3.5 w-3.5 text-amber-600" />
                  Green Spaces Coverage
                </Label>
                <span className="text-xs font-mono text-muted-foreground">{greenSpaces}%</span>
              </div>
              <Slider
                value={[greenSpaces]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => setGreenSpaces(v)}
              />
            </div>
          </div>
        </div>

        {/* Comparison Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Baseline */}
          <div className="p-4 rounded-xl bg-surface/30 border border-border space-y-3">
            <h4 className="text-sm font-bold text-foreground">Baseline (Current)</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Risk Score</span>
                <span className="text-lg font-black font-mono">{baselineRisk}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <span className="text-xs font-bold uppercase bg-rose-100 text-rose-700 px-2 py-0.5 rounded">
                  {selectedAssessment?.level || "High"}
                </span>
              </div>
            </div>
          </div>

          {/* Projected */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
            <h4 className="text-sm font-bold text-emerald-900">Projected Scenario</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-emerald-700">Risk Score</span>
                <span className="text-lg font-black font-mono text-emerald-900">
                  {projectedRisk}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-emerald-700">Risk Reduction</span>
                <span className="text-sm font-bold text-emerald-900">
                  -{riskReduction} points ({reductionPercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Cost */}
        <div className="p-4 rounded-xl bg-surface/30 border border-border space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-foreground">Estimated Implementation Cost</span>
            <span className="text-lg font-black font-mono">${estimatedCost.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on standard unit costs: Trees ($5k), Cool Roofs ($3k), Green Spaces ($8k)
          </p>
        </div>

        {/* Assumptions Note */}
        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
          <p className="text-xs text-indigo-800 leading-relaxed">
            <strong>Projection Assumptions:</strong> Risk reduction estimates based on documented
            intervention effectiveness from urban heat mitigation literature. Actual results may
            vary based on local conditions, implementation quality, and environmental factors.
          </p>
        </div>

        {/* Save Scenario Button */}
        <Button className="w-full h-12 rounded-xl font-bold text-sm uppercase tracking-widest bg-primary text-primary-foreground">
          <ArrowRight className="h-4 w-4 mr-2" />
          Save Scenario for Comparison
        </Button>
      </CardContent>
    </Card>
  );
}
