import type { Zone } from "../types/risk";

export interface PriorityWeights {
  severity: number;
  exposure: number;
  frequency: number;
  vulnerability: number;
  confidence: number;
}

/**
 * Transparent Priority Engine (Steps 15 & 16).
 * Directly addresses "Operational prioritisation can remain limited" research gap.
 */
export const DEFAULT_PRIORITY_WEIGHTS: PriorityWeights = {
  severity: 0.35, // Risk Severity Weight
  exposure: 0.2, // Population Exposure Weight
  frequency: 0.15, // Historical Frequency Weight
  vulnerability: 0.2, // Social/Economic Vulnerability Weight
  confidence: 0.1, // Prediction Confidence Weight
};

export class PriorityService {
  /**
   * Calculates Priority Score (0–100) using the 5 conceptual components.
   */
  static calculatePriority(
    riskScore: number,
    zone: Zone,
    confidence: number,
    weights: PriorityWeights = DEFAULT_PRIORITY_WEIGHTS,
  ): number {
    const exposure = this.getExposureScore(zone.population, zone.populationDensity);
    const frequency = zone.historicalRiskFrequency * 100;
    const vulnerability = zone.vulnerabilityIndex * 100;

    const rawPriority =
      riskScore * weights.severity +
      exposure * weights.exposure +
      frequency * weights.frequency +
      vulnerability * weights.vulnerability +
      confidence * weights.confidence;

    return Number(Math.max(0, Math.min(100, rawPriority)).toFixed(1));
  }

  /**
   * Priority Levels:
   * 80–100 = CRITICAL PRIORITY
   * 60–79 = HIGH PRIORITY
   * 40–59 = MODERATE PRIORITY
   * 0–39 = LOW PRIORITY
   */
  static getPriorityLevel(score: number): "Low" | "Moderate" | "High" | "Critical" {
    if (score >= 80) return "Critical";
    if (score >= 60) return "High";
    if (score >= 40) return "Moderate";
    return "Low";
  }

  /**
   * Step 16: Transparent Priority Explanation
   * Returns explicit reasons explaining WHY a zone received its priority rank.
   */
  static getPriorityReasons(
    riskScore: number,
    zone: Zone,
    confidence: number,
    dataQualityScore?: number,
  ): string[] {
    const reasons: string[] = [];
    const exposure = this.getExposureScore(zone.population, zone.populationDensity);

    if (riskScore >= 75) {
      reasons.push("High Risk Severity");
    } else if (riskScore >= 50) {
      reasons.push("Moderate Risk Severity");
    }

    if (exposure >= 70 || zone.population > 80000) {
      reasons.push("High Population Exposure");
    } else if (exposure >= 40) {
      reasons.push("Moderate Population Exposure");
    }

    if (zone.historicalRiskFrequency >= 0.6) {
      reasons.push("Frequent Historical Heat Events");
    }

    if (zone.vulnerabilityIndex >= 0.6) {
      reasons.push("High Vulnerability");
    }

    if (confidence >= 80) {
      reasons.push("High Prediction Confidence");
    } else if (confidence < 60) {
      reasons.push("Low Prediction Confidence");
    }

    if (dataQualityScore !== undefined && dataQualityScore < 60) {
      reasons.push("Data Quality Warnings Active");
    }

    if (reasons.length === 0) {
      reasons.push("Standard Environmental Monitoring Profile");
    }

    return reasons;
  }

  /**
   * Translates raw population and density metrics into exposure index (0–100)
   */
  static getExposureScore(population: number, density: number): number {
    const combinedIdx = (population / 100000) * 50 + (density / 20000) * 50;
    return Math.min(100, Math.max(0, combinedIdx));
  }

  static getExposureBand(
    population: number,
    density: number,
  ): "Low" | "Moderate" | "High" | "Very High" {
    const score = this.getExposureScore(population, density);
    if (score > 80) return "Very High";
    if (score > 60) return "High";
    if (score > 40) return "Moderate";
    return "Low";
  }
}
