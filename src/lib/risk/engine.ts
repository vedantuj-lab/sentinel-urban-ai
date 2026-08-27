import type { RiskDriver, RiskLevel, Zone, ZoneAssessment } from "./types";
import { ZONES } from "./zones";

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));
const norm = (v: number, min: number, max: number) => clamp(((v - min) / (max - min)) * 100);

export interface HeatModelInput {
  temperatureC: number;
  historicalAvgC: number;
  rainfallMm: number;
  humidityPct: number;
  vegetationPct: number;
  builtUpPct: number;
  populationDensity: number;
  landUseFactor: number; // 0-1
}

const LAND_USE_FACTOR: Record<Zone["landUse"], number> = {
  industrial: 1,
  "dense-residential": 0.88,
  commercial: 0.74,
  mixed: 0.66,
  "green-belt": 0.24,
};

/** Weighted, explainable urban-heat risk model. Weights sum to 1. */
export const HEAT_WEIGHTS = {
  temperature: 0.32,
  builtUp: 0.25,
  vegetation: 0.18,
  population: 0.15,
  historical: 0.1,
} as const;

export function scoreHeatRisk(input: HeatModelInput & { historicalFrequency: number }) {
  const contributions = {
    temperature: norm(input.temperatureC, 28, 46) * HEAT_WEIGHTS.temperature,
    builtUp: norm(input.builtUpPct, 20, 95) * HEAT_WEIGHTS.builtUp,
    vegetation: norm(70 - input.vegetationPct, 5, 65) * HEAT_WEIGHTS.vegetation,
    population: norm(input.populationDensity, 2000, 24000) * HEAT_WEIGHTS.population,
    historical: input.historicalFrequency * 100 * HEAT_WEIGHTS.historical,
  };

  const raw = Object.values(contributions).reduce((a, b) => a + b, 0);
  // Cooling relief from rainfall & humidity, amplification from land use.
  const relief = Math.min(9, input.rainfallMm * 1.1 + Math.max(0, input.humidityPct - 45) * 0.14);
  const score = clamp(Math.round(raw * (0.82 + 0.24 * input.landUseFactor) - relief));

  const total = Object.values(contributions).reduce((a, b) => a + b, 0) || 1;
  const drivers: RiskDriver[] = [
    {
      label: "Ambient Temperature",
      weightPct: Math.round((contributions.temperature / total) * 100),
      value: `${input.temperatureC.toFixed(1)} °C`,
    },
    {
      label: "Built-up Density",
      weightPct: Math.round((contributions.builtUp / total) * 100),
      value: `${Math.round(input.builtUpPct)}%`,
    },
    {
      label: "Low Vegetation Cover",
      weightPct: Math.round((contributions.vegetation / total) * 100),
      value: `${Math.round(input.vegetationPct)}% green`,
    },
    {
      label: "Population Density",
      weightPct: Math.round((contributions.population / total) * 100),
      value: `${Math.round(input.populationDensity).toLocaleString()}/km²`,
    },
    {
      label: "Historical Heat Pattern",
      weightPct: Math.round((contributions.historical / total) * 100),
      value: `${Math.round(input.historicalFrequency * 100)}% of past days flagged`,
    },
  ].sort((a, b) => b.weightPct - a.weightPct);

  return { score, drivers };
}

export function levelOf(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 45) return "medium";
  return "low";
}

export const LEVEL_LABEL: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

function exposureBand(population: number, density: number) {
  const idx = population / 1000 + density / 1000;
  if (idx > 130) return "Very High" as const;
  if (idx > 95) return "High" as const;
  if (idx > 60) return "Moderate" as const;
  return "Low" as const;
}

function recommendationFor(level: RiskLevel, zone: Zone) {
  switch (level) {
    case "critical":
      return `Issue a localised heat advisory for ${zone.name} and prioritise emergency shading, hydration points and vulnerable-household outreach.`;
    case "high":
      return `Prioritise heat mitigation measures in ${zone.name} and schedule a field inspection within 48 hours.`;
    case "medium":
      return `Plan tree-cover expansion and cool-roof incentives for ${zone.name}; keep the zone under weekly monitoring.`;
    default:
      return `Maintain routine monitoring for ${zone.name}; no immediate intervention required.`;
  }
}

function actionsFor(level: RiskLevel, zone: Zone) {
  const base = [
    "Expand shaded public areas along main pedestrian routes",
    "Prioritise tree-cover planning in low-vegetation pockets",
  ];
  if (level === "medium") return [...base, "Schedule a monthly field inspection"];
  if (level === "high")
    return [
      ...base,
      "Issue heat alerts to residents and local health centres",
      "Schedule a field inspection within 48 hours",
      `Map vulnerable households (vulnerability index ${zone.vulnerabilityIndex.toFixed(2)})`,
    ];
  if (level === "critical")
    return [
      "Issue an immediate local heat advisory",
      "Deploy temporary shading and hydration points",
      "Prioritise outreach to vulnerable population clusters",
      ...base,
      "Escalate to the city command centre for resource reallocation",
    ];
  return ["Continue routine environmental monitoring", "Preserve existing vegetation cover"];
}

export interface PriorityWeights {
  severity: number;
  exposure: number;
  frequency: number;
  confidence: number;
  vulnerability: number;
}

export const DEFAULT_PRIORITY_WEIGHTS: PriorityWeights = {
  severity: 0.35,
  exposure: 0.2,
  frequency: 0.15,
  confidence: 0.1,
  vulnerability: 0.2,
};

export function assessZone(zone: Zone, weights: PriorityWeights = DEFAULT_PRIORITY_WEIGHTS) {
  const historicalAvgC =
    zone.temperatureHistory.reduce((a, b) => a + b, 0) / zone.temperatureHistory.length;

  const { score, drivers } = scoreHeatRisk({
    temperatureC: zone.temperatureC,
    historicalAvgC,
    rainfallMm: zone.rainfallMm,
    humidityPct: zone.humidityPct,
    vegetationPct: zone.vegetationPct,
    builtUpPct: zone.builtUpPct,
    populationDensity: zone.populationDensity,
    landUseFactor: LAND_USE_FACTOR[zone.landUse],
    historicalFrequency: zone.historicalRiskFrequency,
  });

  const momentum = zone.temperatureC - historicalAvgC;
  const predicted = clamp(Math.round(score + momentum * 2.1));
  const confidence = Math.round(
    clamp(62 + zone.historicalRiskFrequency * 22 + (zone.riskHistory.length / 14) * 12, 55, 96),
  );

  const level = levelOf(score);
  const exposure = exposureBand(zone.population, zone.populationDensity);
  const exposureValue = { Low: 25, Moderate: 55, High: 78, "Very High": 94 }[exposure];

  const priorityScore = Number(
    (
      score * weights.severity +
      exposureValue * weights.exposure +
      zone.historicalRiskFrequency * 100 * weights.frequency +
      confidence * weights.confidence +
      zone.vulnerabilityIndex * 100 * weights.vulnerability
    ).toFixed(1),
  );

  const prev = zone.riskHistory[zone.riskHistory.length - 2] ?? score;

  const assessment: Omit<ZoneAssessment, "priorityRank"> = {
    zone,
    riskScore: score,
    predictedRiskScore: predicted,
    level,
    confidence,
    drivers,
    priorityScore,
    populationExposure: exposure,
    recommendation: recommendationFor(level, zone),
    actions: actionsFor(level, zone),
    expectedPeriod: level === "low" ? "No peak expected this week" : "Next 48–72 hours, 12:00–17:00",
    trendDelta: Number((score - prev).toFixed(1)),
  };
  return assessment;
}

export function assessAll(
  zones: Zone[] = ZONES,
  weights: PriorityWeights = DEFAULT_PRIORITY_WEIGHTS,
): ZoneAssessment[] {
  return zones
    .map((z) => assessZone(z, weights))
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map((a, i) => ({ ...a, priorityRank: i + 1 }));
}

export function cityStats(assessments: ZoneAssessment[]) {
  const n = assessments.length || 1;
  const overall = Math.round(assessments.reduce((s, a) => s + a.riskScore, 0) / n);
  const dist = { low: 0, medium: 0, high: 0, critical: 0 } as Record<RiskLevel, number>;
  assessments.forEach((a) => (dist[a.level] += 1));
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
  };
}

/** City-wide daily series for trend charts. */
export function cityTrend(assessments: ZoneAssessment[]) {
  const days = 14;
  return Array.from({ length: days }, (_, i) => {
    const temp =
      assessments.reduce((s, a) => s + (a.zone.temperatureHistory[i] ?? 0), 0) / assessments.length;
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

/** Resource allocation proportional to priority score across zones. */
export function resourceAllocation(assessments: ZoneAssessment[]) {
  const top = assessments.slice(0, 6);
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
