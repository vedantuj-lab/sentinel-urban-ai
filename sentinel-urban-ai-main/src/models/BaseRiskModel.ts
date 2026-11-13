import type { Zone, RiskLevel, RiskDriver } from "../types/risk";

export interface RiskAssessmentInput {
  zone: Zone;
  weights?: Record<string, number>;
}

export interface RiskModelResult {
  score: number;
  level: RiskLevel;
  drivers: RiskDriver[];
  recommendation: string;
  actions: string[];
}

/**
 * Generic interface for urban risk models.
 */
export interface RiskModel {
  id: string;
  calculateRisk(input: RiskAssessmentInput): RiskModelResult;
  getPredictedScore(zone: Zone, currentScore: number): number;
}

export function levelOf(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));
export const norm = (v: number, min: number, max: number) => clamp(((v - min) / (max - min)) * 100);
