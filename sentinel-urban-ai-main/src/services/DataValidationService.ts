import type { Zone } from "../types/risk";

export interface DataQualityReport {
  score: number;
  level: "Low" | "Moderate" | "High";
  completeness: number;
  consistency: number;
  validity: number;
  availability: number;
  missingDataPct: number;
  issues: string[];
  warningMessage?: string;
  normalizedZone: Zone;
  status: "VALID" | "DEGRADED" | "CRITICAL";
}

export class DataValidationService {
  /**
   * Validates and normalizes zone data, providing a quality score from 0 to 100.
   * Directly implements Step 7 (Data Validation) & Step 8 (Data Quality Score).
   */
  static validate(zone: Zone): DataQualityReport {
    const issues: string[] = [];
    let missingPoints = 0;
    let invalidPoints = 0;
    let inconsistentPoints = 0;
    const totalFields = 8; // Key metrics for heat risk observation

    // 1. Completeness & Availability check
    const checkValue = (val: any, name: string) => {
      if (val === undefined || val === null || Number.isNaN(val)) {
        issues.push(`Missing or null parameter: ${name}`);
        missingPoints++;
        return false;
      }
      return true;
    };

    checkValue(zone.temperatureC, "Temperature");
    checkValue(zone.humidityPct, "Humidity");
    checkValue(zone.vegetationPct, "Vegetation Coverage");
    checkValue(zone.builtUpPct, "Built-up Density");
    checkValue(zone.population, "Population Exposure");
    checkValue(zone.populationDensity, "Population Density");
    checkValue(zone.historicalRiskFrequency, "Historical Heat Events");
    checkValue(zone.vulnerabilityIndex, "Vulnerability Score");

    // 2. Validity & Outlier checks
    if (zone.temperatureC !== undefined && zone.temperatureC !== null) {
      if (zone.temperatureC > 60 || zone.temperatureC < -10) {
        issues.push(`Outlier detected in Temperature: ${zone.temperatureC}°C`);
        invalidPoints++;
      }
    }
    if (zone.humidityPct !== undefined && zone.humidityPct !== null) {
      if (zone.humidityPct > 100 || zone.humidityPct < 0) {
        issues.push(`Invalid Humidity range: ${zone.humidityPct}%`);
        invalidPoints++;
      }
    }
    if (zone.vegetationPct !== undefined && zone.vegetationPct !== null) {
      if (zone.vegetationPct > 100 || zone.vegetationPct < 0) {
        issues.push(`Invalid Vegetation percentage: ${zone.vegetationPct}%`);
        invalidPoints++;
      }
    }
    if (zone.builtUpPct !== undefined && zone.builtUpPct !== null) {
      if (zone.builtUpPct > 100 || zone.builtUpPct < 0) {
        issues.push(`Invalid Built-up percentage: ${zone.builtUpPct}%`);
        invalidPoints++;
      }
    }

    // 3. Consistency checks
    if (
      zone.vegetationPct !== undefined &&
      zone.builtUpPct !== undefined &&
      zone.vegetationPct + zone.builtUpPct > 110
    ) {
      issues.push(
        `Inconsistent land-use coverage sum: Vegetation (${zone.vegetationPct}%) + Built-up (${zone.builtUpPct}%) exceeds expected limits`,
      );
      inconsistentPoints++;
    }

    const completeness = Math.max(
      0,
      Math.round(((totalFields - missingPoints) / totalFields) * 100),
    );
    const validity = Math.max(0, Math.round(((totalFields - invalidPoints) / totalFields) * 100));
    const consistency = Math.max(
      0,
      Math.round(((totalFields - inconsistentPoints) / totalFields) * 100),
    );
    const availability = completeness >= 80 ? 95 : completeness >= 50 ? 70 : 40;
    const missingDataPct = Math.round((missingPoints / totalFields) * 100);

    // Weighted Quality Score Formula (Step 8)
    const rawScore = completeness * 0.35 + validity * 0.3 + consistency * 0.2 + availability * 0.15;

    const score = Math.max(0, Math.min(100, Math.round(rawScore)));

    // Classification:
    // 80–100 = High Quality
    // 60–79 = Moderate Quality
    // 0–59 = Low Quality
    let level: "Low" | "Moderate" | "High" = "High";
    let status: "VALID" | "DEGRADED" | "CRITICAL" = "VALID";

    if (score < 60) {
      level = "Low";
      status = "CRITICAL";
    } else if (score < 80) {
      level = "Moderate";
      status = "DEGRADED";
    }

    let warningMessage: string | undefined = undefined;
    if (score < 60 || issues.length > 0) {
      warningMessage =
        "Prediction reliability may be reduced because of insufficient or inconsistent data.";
    }

    // Normalise input parameters transparently (Step 9)
    const normalizedZone = this.normalize(zone);

    return {
      score,
      level,
      completeness,
      consistency,
      validity,
      availability,
      missingDataPct,
      issues,
      warningMessage,
      normalizedZone,
      status,
    };
  }

  /**
   * Step 9: Data Normalisation
   * Normalises raw zone values into standard operational bounds.
   */
  static normalize(zone: Zone): Zone {
    return {
      ...zone,
      temperatureC: this.clamp(zone.temperatureC ?? 32, 10, 55),
      humidityPct: this.clamp(zone.humidityPct ?? 45, 0, 100),
      rainfallMm: Math.max(0, zone.rainfallMm ?? 0),
      vegetationPct: this.clamp(zone.vegetationPct ?? 20, 0, 100),
      builtUpPct: this.clamp(zone.builtUpPct ?? 50, 0, 100),
      populationDensity: Math.max(100, zone.populationDensity ?? 5000),
      population: Math.max(500, zone.population ?? 10000),
      historicalRiskFrequency: this.clamp(zone.historicalRiskFrequency ?? 0.5, 0, 1),
      vulnerabilityIndex: this.clamp(zone.vulnerabilityIndex ?? 0.5, 0, 1),
    };
  }

  private static clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
  }
}
