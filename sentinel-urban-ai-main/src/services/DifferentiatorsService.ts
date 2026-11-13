import type { Zone, ZoneAssessment } from "@/types/risk";
import { PriorityService, type PriorityWeights } from "./PriorityService";

export interface PathToLowerRiskResult {
  currentScore: number;
  currentLevel: string;
  targetLevel: string;
  targetScore: number;
  requiredVegetationGainPct: number;
  requiredBuiltUpReductionPct: number;
  projectedScore: number;
  isProjectedOnly: true;
  summary: string;
}

export interface InterventionPlanResult {
  selectedZones: {
    zoneId: string;
    zoneName: string;
    priorityRank: number;
    priorityScore: number;
    population: number;
    level: string;
    selectionReason: string;
  }[];
  totalPopulationCovered: number;
  availableZonesCount: number;
}

export interface RobustnessCheckResult {
  zoneId: string;
  zoneName: string;
  originalRank: number;
  rankStatus: "Rank stable" | "Rank sensitive to weights";
  rankDelta: number;
}

export interface HeatActionWindowResult {
  zoneId: string;
  criticalDays: { day: string; predictedTemp: number; isActionRequired: boolean }[];
  alertLevel: "Normal" | "Elevated" | "High Action Needed";
}

export class DifferentiatorsService {
  /**
   * A. Path to Lower Risk
   * Computes minimum vegetation gain or built-up reduction required to drop a zone one risk band.
   */
  static computePathToLowerRisk(
    zone: Zone,
    currentScore: number,
    currentLevel: string,
  ): PathToLowerRiskResult {
    let targetScore = 59; // Target for High (60+) to drop to Moderate (<60)
    let targetLevel = "MODERATE";

    if (currentLevel === "critical") {
      targetScore = 79; // Target for Critical (80+) to drop to High (<80)
      targetLevel = "HIGH";
    } else if (currentLevel === "medium" || currentLevel === "moderate") {
      targetScore = 39; // Target for Moderate to drop to Low (<40)
      targetLevel = "LOW";
    } else if (currentLevel === "low") {
      targetScore = Math.max(15, currentScore - 10);
      targetLevel = "LOW (Optimised)";
    }

    const pointsToDrop = Math.max(1, currentScore - targetScore);

    // Heuristic: 1% vegetation gain reduces risk score by ~0.8 pts, 1% built-up reduction reduces by ~0.7 pts
    const requiredVegetationGainPct = Math.min(40, Math.ceil(pointsToDrop / 0.8));
    const requiredBuiltUpReductionPct = Math.min(30, Math.ceil(pointsToDrop / 0.7));

    const projectedScore = Math.max(0, currentScore - pointsToDrop);

    return {
      currentScore,
      currentLevel: currentLevel.toUpperCase(),
      targetLevel,
      targetScore,
      requiredVegetationGainPct,
      requiredBuiltUpReductionPct,
      projectedScore,
      isProjectedOnly: true,
      summary: `A +${requiredVegetationGainPct}% increase in urban green canopy or a -${requiredBuiltUpReductionPct}% reduction in impermeable built-up surface is projected to drop ${zone.name} into the ${targetLevel} risk band (${projectedScore}/100).`,
    };
  }

  /**
   * B. Intervention Planner
   * Selects top N zones greedily based on Priority Score × Population Exposure.
   */
  static planInterventions(
    assessments: ZoneAssessment[],
    numZones: number,
  ): InterventionPlanResult {
    const k = Math.max(1, Math.min(numZones, assessments.length));

    // Sort by greedy impact index = priorityScore * (population / 10000)
    const ranked = [...assessments].sort((a, b) => {
      const impactA = a.priorityScore * (a.zone.population / 10000);
      const impactB = b.priorityScore * (b.zone.population / 10000);
      return impactB - impactA;
    });

    const selected = ranked.slice(0, k);
    const totalPopulationCovered = selected.reduce((sum, a) => sum + a.zone.population, 0);

    return {
      selectedZones: selected.map((a) => ({
        zoneId: a.zone.id,
        zoneName: a.zone.name,
        priorityRank: a.priorityRank,
        priorityScore: a.priorityScore,
        population: a.zone.population,
        level: a.level,
        selectionReason: `High Priority (${a.priorityScore}) combined with large population exposure (${a.zone.population.toLocaleString()} residents).`,
      })),
      totalPopulationCovered,
      availableZonesCount: assessments.length,
    };
  }

  /**
   * C. Priority Robustness Check
   * Perturbs priority weights ±10% to test if zone rankings remain stable or are sensitive.
   */
  static checkPriorityRobustness(
    assessments: ZoneAssessment[],
    weights: PriorityWeights,
  ): RobustnessCheckResult[] {
    // Perturb weights by +10% severity, -10% vulnerability
    const perturbedWeights: PriorityWeights = {
      severity: Math.min(0.5, weights.severity * 1.1),
      exposure: weights.exposure,
      frequency: weights.frequency,
      vulnerability: Math.max(0.05, weights.vulnerability * 0.9),
      confidence: weights.confidence,
    };

    // Re-assess with perturbed weights
    const perturbedRanked = [...assessments]
      .map((a) => {
        const pScore = PriorityService.calculatePriority(
          a.riskScore,
          a.zone,
          a.confidence,
          perturbedWeights,
        );
        return { zoneId: a.zone.id, pScore };
      })
      .sort((a, b) => b.pScore - a.pScore);

    return assessments.map((a) => {
      const origRank = a.priorityRank;
      const newRank = perturbedRanked.findIndex((p) => p.zoneId === a.zone.id) + 1;
      const rankDelta = Math.abs(newRank - origRank);

      return {
        zoneId: a.zone.id,
        zoneName: a.zone.name,
        originalRank: origRank,
        rankDelta,
        rankStatus: rankDelta <= 1 ? "Rank stable" : "Rank sensitive to weights",
      };
    });
  }

  /**
   * D. Heat Action Window
   * Checks upcoming forecast days for heat action threshold triggers (>37°C).
   */
  static computeHeatActionWindow(
    zone: Zone,
    forecastDays?: { day: string; tempMax: number }[],
  ): HeatActionWindowResult {
    const days = forecastDays || [
      { day: "Mon", tempMax: zone.temperatureC },
      { day: "Tue", tempMax: zone.temperatureC + 1.2 },
      { day: "Wed", tempMax: zone.temperatureC + 0.8 },
      { day: "Thu", tempMax: zone.temperatureC - 1.0 },
      { day: "Fri", tempMax: zone.temperatureC - 2.0 },
    ];

    const criticalDays = days.map((d) => ({
      day: d.day,
      predictedTemp: Number(d.tempMax.toFixed(1)),
      isActionRequired: d.tempMax >= 37.5,
    }));

    const actionDaysCount = criticalDays.filter((d) => d.isActionRequired).length;

    let alertLevel: HeatActionWindowResult["alertLevel"] = "Normal";
    if (actionDaysCount >= 3) alertLevel = "High Action Needed";
    else if (actionDaysCount >= 1) alertLevel = "Elevated";

    return {
      zoneId: zone.id,
      criticalDays,
      alertLevel,
    };
  }
}
