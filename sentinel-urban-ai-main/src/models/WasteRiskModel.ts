import type { RiskModel, RiskAssessmentInput, RiskModelResult } from "./BaseRiskModel";
import { levelOf, clamp, norm } from "./BaseRiskModel";
import type { Zone } from "../types/risk";

export const DEFAULT_WASTE_WEIGHTS = {
  density: 0.35,
  landUse: 0.25,
  historical: 0.2,
  builtUp: 0.2,
} as const;

export class WasteRiskModel implements RiskModel {
  id = "waste";

  calculateRisk({ zone }: RiskAssessmentInput): RiskModelResult {
    const safeZone = {
      populationDensity: zone.populationDensity ?? 8000,
      builtUpPct: zone.builtUpPct ?? 60,
      historicalRiskFrequency: zone.historicalRiskFrequency ?? 0.4,
      landUse: zone.landUse ?? "mixed",
      name: zone.name ?? "Unknown Zone",
      dailyWasteTonnes: Number(((zone.population * 0.45) / 1000).toFixed(1)),
    };

    const landUseMultiplier =
      safeZone.landUse === "commercial"
        ? 1.2
        : safeZone.landUse === "dense-residential"
          ? 1.1
          : 0.8;

    const contributions = {
      density:
        norm(safeZone.populationDensity, 2000, 24000) *
        DEFAULT_WASTE_WEIGHTS.density *
        landUseMultiplier,
      landUse:
        (safeZone.landUse === "commercial" ? 85 : safeZone.landUse === "industrial" ? 70 : 50) *
        DEFAULT_WASTE_WEIGHTS.landUse,
      historical: safeZone.historicalRiskFrequency * 100 * DEFAULT_WASTE_WEIGHTS.historical,
      builtUp: norm(safeZone.builtUpPct, 20, 95) * DEFAULT_WASTE_WEIGHTS.builtUp,
    };

    const raw = Object.values(contributions).reduce((a, b) => a + b, 0);
    const score = clamp(Math.round(raw));
    const level = levelOf(score);
    const total = Object.values(contributions).reduce((a, b) => a + b, 0) || 1;

    const drivers = [
      {
        label: "Daily Waste Volume Generation",
        weightPct: Math.round((contributions.density / total) * 100),
        value: `${safeZone.dailyWasteTonnes} tonnes/day`,
      },
      {
        label: "Collection Route Bottleneck",
        weightPct: Math.round((contributions.landUse / total) * 100),
        value: `${safeZone.landUse.toUpperCase()} sector`,
      },
      {
        label: "Historical Overflow Frequency",
        weightPct: Math.round((contributions.historical / total) * 100),
        value: `${Math.round(safeZone.historicalRiskFrequency * 100)}% past reports`,
      },
      {
        label: "Built-up Collection Access",
        weightPct: Math.round((contributions.builtUp / total) * 100),
        value: `${Math.round(safeZone.builtUpPct)}% density`,
      },
    ].sort((a, b) => b.weightPct - a.weightPct);

    return {
      score,
      level,
      drivers,
      recommendation: `Optimize municipal collection frequency and establish smart bin monitoring in ${safeZone.name}.`,
      actions: [
        "Increase secondary collection vehicle frequency to twice daily",
        "Deploy fill-level ultrasonic sensors on commercial dumpsters",
        "Clear illegal dumping blackspots near drainage channels",
        "Initiate localized ward segregation awareness drive",
      ],
    };
  }

  getPredictedScore(zone: Zone, currentScore: number): number {
    return clamp(Math.round(currentScore * 1.05));
  }
}
