import type { RiskModel, RiskAssessmentInput, RiskModelResult } from "./BaseRiskModel";
import { levelOf, clamp, norm } from "./BaseRiskModel";
import type { Zone } from "../types/risk";
import { RecommendationService } from "../services/RecommendationService";

export const DEFAULT_AIR_WEIGHTS = {
  pm25: 0.35,
  builtUp: 0.25,
  vegetation: 0.2,
  population: 0.2,
} as const;

export class AirQualityRiskModel implements RiskModel {
  id = "air";

  calculateRisk({ zone }: RiskAssessmentInput): RiskModelResult {
    const safeZone = {
      builtUpPct: zone.builtUpPct ?? 60,
      vegetationPct: zone.vegetationPct ?? 20,
      populationDensity: zone.populationDensity ?? 8000,
      landUse: zone.landUse ?? "mixed",
      name: zone.name ?? "Unknown Zone",
      historicalRiskFrequency: zone.historicalRiskFrequency ?? 0.5,
      // Calculate estimated PM2.5 based on land use and built-up density
      pm25: Math.round(
        35 +
          zone.builtUpPct * 0.8 +
          (zone.landUse === "industrial" ? 30 : zone.landUse === "commercial" ? 15 : 0) -
          zone.vegetationPct * 0.4,
      ),
    };

    const contributions = {
      pm25: norm(safeZone.pm25, 10, 150) * DEFAULT_AIR_WEIGHTS.pm25,
      builtUp: norm(safeZone.builtUpPct, 20, 95) * DEFAULT_AIR_WEIGHTS.builtUp,
      vegetation: norm(70 - safeZone.vegetationPct, 5, 65) * DEFAULT_AIR_WEIGHTS.vegetation,
      population: norm(safeZone.populationDensity, 2000, 24000) * DEFAULT_AIR_WEIGHTS.population,
    };

    const raw = Object.values(contributions).reduce((a, b) => a + b, 0);
    const score = clamp(Math.round(raw));
    const level = levelOf(score);
    const total = Object.values(contributions).reduce((a, b) => a + b, 0) || 1;

    const drivers = [
      {
        label: "PM2.5 / AQI Concentration",
        weightPct: Math.round((contributions.pm25 / total) * 100),
        value: `${safeZone.pm25} µg/m³`,
      },
      {
        label: "Industrial & Traffic Corridor",
        weightPct: Math.round((contributions.builtUp / total) * 100),
        value: `${Math.round(safeZone.builtUpPct)}% built`,
      },
      {
        label: "Vegetation Buffer Depletion",
        weightPct: Math.round((contributions.vegetation / total) * 100),
        value: `${Math.round(safeZone.vegetationPct)}% green`,
      },
      {
        label: "Population Exposure",
        weightPct: Math.round((contributions.population / total) * 100),
        value: `${Math.round(safeZone.populationDensity).toLocaleString()}/km²`,
      },
    ].sort((a, b) => b.weightPct - a.weightPct);

    return {
      score,
      level,
      drivers,
      recommendation: `Deploy air quality monitoring nodes and green buffer barriers along major transit corridors in ${safeZone.name}.`,
      actions: [
        "Issue localized air pollution advisory for sensitive groups",
        "Deploy mobile smog-suppression mist canons in high-AQI clusters",
        "Implement heavy vehicle transit restriction during peak stagnation hours",
        "Expand urban green belts along industrial perimeters",
      ],
    };
  }

  getPredictedScore(zone: Zone, currentScore: number): number {
    return clamp(Math.round(currentScore * 1.08));
  }
}
