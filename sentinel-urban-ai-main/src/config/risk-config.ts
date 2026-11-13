/**
 * Central Risk & Priority Configuration Parameters.
 * Centralizes magic numbers, threshold bands, and default weights.
 */

export const RISK_BANDS = {
  LOW: { min: 0, max: 39, label: "LOW", level: "low" as const },
  MODERATE: { min: 40, max: 59, label: "MODERATE", level: "medium" as const },
  HIGH: { min: 60, max: 79, label: "HIGH", level: "high" as const },
  CRITICAL: { min: 80, max: 100, label: "CRITICAL", level: "critical" as const },
};

export const DEFAULT_RISK_WEIGHTS = {
  temperatureThreshold: 34, // °C
  builtUpWeight: 0.25,
  vegetationWeight: 0.2,
  popExposureWeight: 0.2,
  humidityWeight: 0.15,
  historicalWeight: 0.1,
  vulnerabilityWeight: 0.1,
};

export const DEFAULT_PRIORITY_WEIGHTS = {
  severity: 0.3, // 30% Risk Severity
  exposure: 0.25, // 25% Population Exposure
  frequency: 0.15, // 15% Historical Frequency
  vulnerability: 0.2, // 20% Social/Economic Vulnerability
  reliability: 0.1, // 10% Reliability Multiplier
};

export const RELIABILITY_LIMITS = {
  MIN: 50,
  MAX: 95,
};
