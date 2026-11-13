import type { Zone, ZoneAssessment, RiskTypeId } from "../types/risk";
import { HeatRiskModel } from "../models/HeatRiskModel";
import { FloodRiskModel } from "../models/FloodRiskModel";
import { AirQualityRiskModel } from "../models/AirQualityRiskModel";
import { WasteRiskModel } from "../models/WasteRiskModel";
import { InfrastructureRiskModel } from "../models/InfrastructureRiskModel";
import { levelOf } from "../models/BaseRiskModel";
import { PriorityService, DEFAULT_PRIORITY_WEIGHTS, type PriorityWeights } from "./PriorityService";
import { RecommendationService } from "./RecommendationService";
import { DataValidationService } from "./DataValidationService";
import { RegionService } from "./RegionService";

export class RiskService {
  private static heatModel = new HeatRiskModel();
  private static floodModel = new FloodRiskModel();
  private static airModel = new AirQualityRiskModel();
  private static wasteModel = new WasteRiskModel();
  private static infraModel = new InfrastructureRiskModel();

  private static getModel(riskType: RiskTypeId) {
    switch (riskType) {
      case "flood":
        return this.floodModel;
      case "air":
        return this.airModel;
      case "waste":
        return this.wasteModel;
      case "infrastructure":
        return this.infraModel;
      case "heat":
      default:
        return this.heatModel;
    }
  }

  /**
   * Synchronous assessment for initial state seeding and simple UI components.
   * Implements Step 11, 12, 13, 15, 16, 18 (Prediction, Explainability, Confidence, Priority & Recommendations).
   */
  static assessZoneSync(
    zone: Zone,
    riskType: RiskTypeId = "heat",
    weights: PriorityWeights = DEFAULT_PRIORITY_WEIGHTS,
  ): ZoneAssessment {
    const model = this.getModel(riskType);
    const region = RegionService.getActiveRegion();

    // 1. OBSERVE & VALIDATE DATA (Steps 6, 7 & 8)
    const qualityReport = DataValidationService.validate(zone);
    const validatedZone = qualityReport.normalizedZone;

    // 2. PREDICT RISK (Step 11)
    const result = model.calculateRisk({ zone: validatedZone });

    // 3. PREDICTION CONFIDENCE (Step 13)
    // Derived from Data Quality Score + Model Certainty
    const baseConfidence = qualityReport.score;
    const modelCertainty = result.score > 85 || result.score < 15 ? 5 : 0;
    const confidence = Math.round(Math.max(30, Math.min(100, baseConfidence + modelCertainty)));

    let confidenceLevel: "Low" | "Moderate" | "High" = "High";
    if (confidence < 60) confidenceLevel = "Low";
    else if (confidence < 80) confidenceLevel = "Moderate";

    // 4. EXPLAIN RISK (Step 12)
    const topDrivers = result.drivers
      .slice(0, 3)
      .map((d) => d.label.toLowerCase())
      .join(", ");
    const explanation = `This zone has higher predicted ${riskType} risk primarily driven by ${topDrivers}. Prediction is ${confidence}% certain based on ${qualityReport.level.toLowerCase()} quality regional data for ${region.name}.`;

    // 5. PRIORITISE AREAS (Steps 15 & 16)
    const priorityScore = PriorityService.calculatePriority(
      result.score,
      validatedZone,
      confidence,
      weights,
    );
    const priorityLevel = PriorityService.getPriorityLevel(priorityScore);
    const priorityReasons = PriorityService.getPriorityReasons(
      result.score,
      validatedZone,
      confidence,
      qualityReport.score,
    );

    // 6. RECOMMEND ACTION & DECISION SUPPORT (Steps 18 & 19)
    const recommendation = RecommendationService.getRecommendations(
      result.level,
      validatedZone,
      result.drivers,
      qualityReport.score,
    );
    const actions = RecommendationService.getActionItems(
      result.level,
      validatedZone,
      result.drivers,
      qualityReport.score,
    );

    const predictedRiskScore = model.getPredictedScore(validatedZone, result.score);
    const populationExposure = PriorityService.getExposureBand(
      validatedZone.population,
      validatedZone.populationDensity,
    );

    const prev = validatedZone.riskHistory[validatedZone.riskHistory.length - 2] ?? result.score;
    const trendDelta = Number((result.score - prev).toFixed(1));

    return {
      zone: validatedZone,
      riskScore: result.score,
      predictedRiskScore,
      level: result.level,
      confidence,
      confidenceLevel,
      drivers: result.drivers,
      priorityScore,
      priorityRank: 0,
      priorityLevel,
      priorityReasons,
      populationExposure,
      dataQualityScore: qualityReport.score,
      dataQualityLevel: qualityReport.level,
      dataQualityWarning: qualityReport.warningMessage,
      validationSummary: {
        completeness: qualityReport.completeness,
        consistency: qualityReport.consistency,
        issues: qualityReport.issues,
      },
      recommendation,
      actions,
      expectedPeriod: result.level === "low" ? "No peak expected this week" : "Next 48–72 hours",
      trendDelta,
      explanation,
    };
  }

  static assessAllSync(
    zones: Zone[],
    riskType: RiskTypeId = "heat",
    weights: PriorityWeights = DEFAULT_PRIORITY_WEIGHTS,
  ): ZoneAssessment[] {
    return zones
      .map((z) => this.assessZoneSync(z, riskType, weights))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .map((a, i) => ({ ...a, priorityRank: i + 1 }));
  }

  static async assessZone(
    zone: Zone,
    riskType: RiskTypeId = "heat",
    weights: PriorityWeights = DEFAULT_PRIORITY_WEIGHTS,
  ): Promise<ZoneAssessment> {
    return this.assessZoneSync(zone, riskType, weights);
  }

  static async assessAll(
    zones: Zone[],
    riskType: RiskTypeId = "heat",
    weights: PriorityWeights = DEFAULT_PRIORITY_WEIGHTS,
  ): Promise<ZoneAssessment[]> {
    try {
      const res = await fetch("/api/risks");
      if (!res.ok) throw new Error("Failed to fetch risk assessments");
      return await res.json();
    } catch (e) {
      console.error(e);
      return this.assessAllSync(zones, riskType, weights);
    }
  }

  static getCityStats(assessments: ZoneAssessment[]) {
    const n = assessments.length || 1;
    const overall = Math.round(assessments.reduce((s, a) => s + a.riskScore, 0) / n);
    const dist = { low: 0, medium: 0, high: 0, critical: 0 };
    assessments.forEach((a) => (dist[a.level as keyof typeof dist] += 1));

    const exposed = assessments
      .filter((a) => a.level === "high" || a.level === "critical")
      .reduce((s, a) => s + a.zone.population, 0);

    return {
      overall,
      level: levelOf(overall),
      dist,
      highRiskZones: dist.high + dist.critical,
      activePredictions: assessments.length,
      priorityInterventions: assessments.filter((a) => a.priorityRank <= 4).length,
      areasMonitored: assessments.length,
      alertsGenerated: assessments.filter((a) => a.riskScore >= 65).length * 3 + 4,
      exposedPopulation: exposed,
      avgConfidence: Math.round(assessments.reduce((s, a) => s + a.confidence, 0) / n),
      avgQuality: Math.round(assessments.reduce((s, a) => s + a.dataQualityScore, 0) / n),
      avgCompleteness: Math.round(
        assessments.reduce((s, a) => s + a.validationSummary.completeness, 0) / n,
      ),
      avgConsistency: Math.round(
        assessments.reduce((s, a) => s + a.validationSummary.consistency, 0) / n,
      ),
      totalIssues: assessments.reduce((s, a) => s + a.validationSummary.issues.length, 0),
    };
  }

  static cityTrend(assessments: ZoneAssessment[]) {
    if (assessments.length === 0) return [];
    const days = 14;
    return Array.from({ length: days }, (_, i) => {
      const temp =
        assessments.reduce((s, a) => s + (a.zone.temperatureHistory[i] ?? 0), 0) /
        assessments.length;
      const risk =
        assessments.reduce((s, a) => s + (a.zone.riskHistory[i] ?? 0), 0) / assessments.length;
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      return {
        day: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        temperature: Number(temp.toFixed(1)),
        risk: Number(risk.toFixed(1)),
      };
    });
  }

  static resourceAllocation(assessments: ZoneAssessment[]) {
    if (assessments.length === 0) return [];
    const top = [...assessments].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 6);
    const total = top.reduce((s, a) => s + a.priorityScore, 0) || 1;
    return top.map((a) => ({
      zone: a.zone.name,
      zoneId: a.zone.id,
      level: a.level,
      share: Math.round((a.priorityScore / total) * 100),
      directive:
        a.level === "critical" || a.level === "high"
          ? "Allocate crews & mitigation budget"
          : a.level === "medium"
            ? "Stage resources, weekly review"
            : "Monitor only",
    }));
  }
}
