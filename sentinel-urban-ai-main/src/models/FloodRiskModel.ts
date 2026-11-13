import type { RiskModel, RiskAssessmentInput, RiskModelResult } from "./BaseRiskModel";
import { levelOf, clamp, norm } from "./BaseRiskModel";
import type { Zone } from "../types/risk";
import { RecommendationService } from "../services/RecommendationService";

export const DEFAULT_FLOOD_WEIGHTS = {
  rainfall: 0.4,
  slope: 0.25,
  impervious: 0.15,
  drainage: 0.1,
  historical: 0.1,
} as const;

export class FloodRiskModel implements RiskModel {
  id = "flood";

  calculateRisk({ zone, weights = DEFAULT_FLOOD_WEIGHTS }: RiskAssessmentInput): RiskModelResult {
    // Input validation & safe fallbacks
    const safeZone = {
      rainfallMm: zone.rainfallMm ?? 0,
      builtUpPct: zone.builtUpPct ?? 50, // used as proxy for impervious surface
      historicalRiskFrequency: zone.historicalRiskFrequency ?? 0.5,
      name: zone.name ?? "Unknown Zone",
      slopeFactor: 0.5, // placeholder
    };

    const contributions = {
      rainfall:
        norm(safeZone.rainfallMm, 0, 150) * (weights.rainfall || DEFAULT_FLOOD_WEIGHTS.rainfall),
      slope: safeZone.slopeFactor * 100 * (weights.slope || DEFAULT_FLOOD_WEIGHTS.slope),
      impervious:
        norm(safeZone.builtUpPct, 0, 100) *
        (weights.impervious || DEFAULT_FLOOD_WEIGHTS.impervious),
      drainage: 40 * (weights.drainage || DEFAULT_FLOOD_WEIGHTS.drainage), // stub
      historical:
        safeZone.historicalRiskFrequency *
        100 *
        (weights.historical || DEFAULT_FLOOD_WEIGHTS.historical),
    };

    const raw = Object.values(contributions).reduce((a, b) => a + b, 0);
    const score = clamp(Math.round(raw));
    const level = levelOf(score);
    const total = Object.values(contributions).reduce((a, b) => a + b, 0) || 1;

    const drivers = [
      {
        label: "Rainfall Intensity",
        weightPct: Math.round((contributions.rainfall / total) * 100),
        value: `${safeZone.rainfallMm.toFixed(1)} mm`,
      },
      {
        label: "Surface Impermeability",
        weightPct: Math.round((contributions.impervious / total) * 100),
        value: `${Math.round(safeZone.builtUpPct)}% built`,
      },
      {
        label: "Terrain Slope",
        weightPct: Math.round((contributions.slope / total) * 100),
        value: `Moderate`,
      },
      {
        label: "Historical Flood Pattern",
        weightPct: Math.round((contributions.historical / total) * 100),
        value: `${Math.round(safeZone.historicalRiskFrequency * 100)}% risk`,
      },
    ].sort((a, b) => b.weightPct - a.weightPct);

    return {
      score,
      level,
      drivers,
      recommendation: `Monitor drainage capacity in ${zone.name} and clear critical culverts ahead of projected peak rainfall.`,
      actions: [
        "Inspect and clear primary drainage corridors",
        "Deploy temporary water sensors in low-lying pockets",
        "Issue flood alerts to riverside residents",
      ],
    };
  }

  getPredictedScore(zone: Zone, currentScore: number): number {
    return clamp(Math.round(currentScore * 1.15)); // Simplified prediction
  }
}
