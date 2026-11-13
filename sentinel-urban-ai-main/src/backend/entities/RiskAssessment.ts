import { RiskLevel, RiskDriver } from "@/types/risk";

export interface RiskAssessmentEntity {
  id: string;
  zoneId: string;
  riskType: string;
  score: number;
  level: RiskLevel;
  drivers: RiskDriver[];
  confidence: number;
  priorityScore: number;
  timestamp: string;
}

export interface RiskPredictionEntity extends RiskAssessmentEntity {
  targetTimestamp: string; // The time we are predicting for
}
