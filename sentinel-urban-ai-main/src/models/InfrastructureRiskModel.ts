import type { RiskModel, RiskAssessmentInput, RiskModelResult } from "./BaseRiskModel";
import { levelOf, clamp, norm } from "./BaseRiskModel";
import type { Zone } from "../types/risk";

export const DEFAULT_INFRA_WEIGHTS = {
  vulnerability: 0.35,
  builtUp: 0.3,
  population: 0.2,
  historical: 0.15,
} as const;

export class InfrastructureRiskModel implements RiskModel {
  id = "infrastructure";

  calculateRisk({ zone }: RiskAssessmentInput): RiskModelResult {
    const safeZone = {
      vulnerabilityIndex: zone.vulnerabilityIndex ?? 0.5,
      builtUpPct: zone.builtUpPct ?? 60,
      populationDensity: zone.populationDensity ?? 8000,
      historicalRiskFrequency: zone.historicalRiskFrequency ?? 0.4,
      name: zone.name ?? "Unknown Zone",
      assetAgeYears: Math.round(15 + zone.vulnerabilityIndex * 35),
    };

    const contributions = {
      vulnerability: safeZone.vulnerabilityIndex * 100 * DEFAULT_INFRA_WEIGHTS.vulnerability,
      builtUp: norm(safeZone.builtUpPct, 20, 95) * DEFAULT_INFRA_WEIGHTS.builtUp,
      population: norm(safeZone.populationDensity, 2000, 24000) * DEFAULT_INFRA_WEIGHTS.population,
      historical: safeZone.historicalRiskFrequency * 100 * DEFAULT_INFRA_WEIGHTS.historical,
    };

    const raw = Object.values(contributions).reduce((a, b) => a + b, 0);
    const score = clamp(Math.round(raw));
    const level = levelOf(score);
    const total = Object.values(contributions).reduce((a, b) => a + b, 0) || 1;

    const drivers = [
      {
        label: "Asset Age & Structural Vulnerability",
        weightPct: Math.round((contributions.vulnerability / total) * 100),
        value: `~${safeZone.assetAgeYears} yrs avg`,
      },
      {
        label: "Utility Grid Load Stress",
        weightPct: Math.round((contributions.builtUp / total) * 100),
        value: `${Math.round(safeZone.builtUpPct)}% built load`,
      },
      {
        label: "Population Load Density",
        weightPct: Math.round((contributions.population / total) * 100),
        value: `${Math.round(safeZone.populationDensity).toLocaleString()}/km²`,
      },
      {
        label: "Historical Failure Frequency",
        weightPct: Math.round((contributions.historical / total) * 100),
        value: `${Math.round(safeZone.historicalRiskFrequency * 100)}% incidents`,
      },
    ].sort((a, b) => b.weightPct - a.weightPct);

    return {
      score,
      level,
      drivers,
      recommendation: `Schedule preventive structural audit and utility grid load balancing in ${safeZone.name}.`,
      actions: [
        "Conduct thermal imaging scan of primary electrical sub-stations",
        "Inspect underground water main pressure joints",
        "Prioritize reinforcement of high-stress utility nodes",
        "Deploy IoT vibration and load monitors on key bridges/overpasses",
      ],
    };
  }

  getPredictedScore(zone: Zone, currentScore: number): number {
    return clamp(Math.round(currentScore * 1.1));
  }
}
