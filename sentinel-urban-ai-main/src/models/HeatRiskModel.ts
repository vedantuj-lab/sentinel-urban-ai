import type { RiskModel, RiskAssessmentInput, RiskModelResult } from "./BaseRiskModel";
import { levelOf, clamp } from "./BaseRiskModel";
import type { Zone } from "../types/risk";
import { RecommendationService } from "../services/RecommendationService";
import { RegionProfile, RegionService } from "../services/RegionService";
import { DEFAULT_RISK_WEIGHTS } from "../config/risk-config";

export const DEFAULT_HEAT_WEIGHTS = DEFAULT_RISK_WEIGHTS;

const LAND_USE_FACTOR: Record<Zone["landUse"], number> = {
  industrial: 1.0,
  "dense-residential": 0.88,
  commercial: 0.74,
  mixed: 0.66,
  "green-belt": 0.24,
};

/**
 * Calculates NWS Rothfusz Heat Index (°C equivalent)
 */
export function calculateHeatIndexC(tempC: number, rh: number): number {
  if (tempC < 27) return tempC; // Heat index is relevant for temp >= 27°C (80°F)

  const T = (tempC * 9) / 5 + 32; // Convert C to F
  const RH = rh;

  let HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * RH -
    0.22475541 * T * RH -
    0.00683783 * T * T -
    0.05481717 * RH * RH +
    0.00122874 * T * T * RH +
    0.00085282 * T * RH * RH -
    0.00000199 * T * T * RH * RH;

  // Adjustments
  if (RH < 13 && T >= 80 && T <= 112) {
    const adj = ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
    HI -= adj;
  } else if (RH > 85 && T >= 80 && T <= 87) {
    const adj = ((RH - 85) / 10) * ((87 - T) / 5);
    HI += adj;
  }

  const heatIndexC = ((HI - 32) * 5) / 9; // Convert F to C
  return Number(heatIndexC.toFixed(1));
}

export class HeatRiskModel implements RiskModel {
  id = "heat";

  calculateRisk({ zone }: RiskAssessmentInput & { region?: RegionProfile }): RiskModelResult {
    const region = RegionService.getActiveRegion();

    const safeZone = {
      temperatureC: zone.temperatureC ?? 34,
      humidityPct: zone.humidityPct ?? 45,
      builtUpPct: zone.builtUpPct ?? 50,
      vegetationPct: zone.vegetationPct ?? 20,
      populationDensity: zone.populationDensity ?? 5000,
      historicalRiskFrequency: zone.historicalRiskFrequency ?? 0.5,
      rainfallMm: zone.rainfallMm ?? 0,
      landUse: zone.landUse ?? "mixed",
      name: zone.name ?? "Unknown Zone",
      vulnerabilityIndex: zone.vulnerabilityIndex ?? 0.5,
    };

    // 1. Calculate Rothfusz Heat Index
    const heatIndexC = calculateHeatIndexC(safeZone.temperatureC, safeZone.humidityPct);

    // 2. Fixed Physical Normalisation Bounds
    // Temperature/Heat Index norm (20°C to 50°C)
    const heatIndexNorm = Math.min(1, Math.max(0, (heatIndexC - 20) / 30));
    const builtUpNorm = Math.min(1, Math.max(0, safeZone.builtUpPct / 100));
    const vegetationInverseNorm = Math.min(1, Math.max(0, (100 - safeZone.vegetationPct) / 100));
    const popExposureNorm = Math.min(1, Math.max(0, safeZone.populationDensity / 30000));
    const historicalNorm = Math.min(1, Math.max(0, safeZone.historicalRiskFrequency));
    const vulnerabilityNorm = Math.min(1, Math.max(0, safeZone.vulnerabilityIndex));

    const contributions = {
      heatIndex: heatIndexNorm * 100 * DEFAULT_RISK_WEIGHTS.builtUpWeight,
      builtUp: builtUpNorm * 100 * DEFAULT_RISK_WEIGHTS.builtUpWeight,
      vegetation: vegetationInverseNorm * 100 * DEFAULT_RISK_WEIGHTS.vegetationWeight,
      population: popExposureNorm * 100 * DEFAULT_RISK_WEIGHTS.popExposureWeight,
      historical: historicalNorm * 100 * DEFAULT_RISK_WEIGHTS.historicalWeight,
      vulnerability: vulnerabilityNorm * 100 * DEFAULT_RISK_WEIGHTS.vulnerabilityWeight,
    };

    const raw = Object.values(contributions).reduce((a, b) => a + b, 0);
    const landUseFactor = LAND_USE_FACTOR[safeZone.landUse as keyof typeof LAND_USE_FACTOR] ?? 0.66;
    const rainfallRelief = Math.min(10, safeZone.rainfallMm * 1.2);

    const score = clamp(Math.round(raw * (0.85 + 0.2 * landUseFactor) - rainfallRelief));
    const level = levelOf(score);
    const total = Object.values(contributions).reduce((a, b) => a + b, 0) || 1;

    const drivers = [
      {
        label: "Heat Index (Rothfusz)",
        weightPct: Math.round((contributions.heatIndex / total) * 100),
        value: `${heatIndexC}°C apparent (${safeZone.temperatureC}°C air)`,
      },
      {
        label: "Built-up Density",
        weightPct: Math.round((contributions.builtUp / total) * 100),
        value: `${Math.round(safeZone.builtUpPct)}%`,
      },
      {
        label: "Low Vegetation Cover",
        weightPct: Math.round((contributions.vegetation / total) * 100),
        value: `${Math.round(safeZone.vegetationPct)}% green`,
      },
      {
        label: "Population Exposure",
        weightPct: Math.round((contributions.population / total) * 100),
        value: `${Math.round(safeZone.populationDensity).toLocaleString()}/km²`,
      },
      {
        label: "Historical Heat Frequency",
        weightPct: Math.round((contributions.historical / total) * 100),
        value: `${Math.round(safeZone.historicalRiskFrequency * 100)}% past days`,
      },
      {
        label: "Vulnerability Index",
        weightPct: Math.round((contributions.vulnerability / total) * 100),
        value: `${(safeZone.vulnerabilityIndex * 100).toFixed(0)}/100`,
      },
    ].sort((a, b) => b.weightPct - a.weightPct);

    const finalZone = { ...zone, ...safeZone };

    return {
      score,
      level,
      drivers,
      recommendation: RecommendationService.getRecommendations(level, finalZone as any, drivers),
      actions: RecommendationService.getActionItems(level, finalZone as any, drivers),
    };
  }

  getPredictedScore(zone: Zone, currentScore: number): number {
    if (!zone.temperatureHistory || zone.temperatureHistory.length === 0) {
      return currentScore;
    }
    const historicalAvgC =
      zone.temperatureHistory.reduce((a, b) => a + b, 0) / zone.temperatureHistory.length;
    const momentum = zone.temperatureC - historicalAvgC;
    return clamp(Math.round(currentScore + momentum * 1.8));
  }
}
