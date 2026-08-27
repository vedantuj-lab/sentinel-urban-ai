export type RiskLevel = "low" | "medium" | "high" | "critical";

export type RiskTypeId = "heat" | "flood" | "air" | "waste" | "infrastructure";

export interface RiskTypeDef {
  id: RiskTypeId;
  label: string;
  shortLabel: string;
  description: string;
  available: boolean;
  unit: string;
}

export const RISK_TYPES: RiskTypeDef[] = [
  {
    id: "heat",
    label: "Urban Heat Risk",
    shortLabel: "Heat",
    description:
      "Surface and ambient heat build-up driven by built density, low vegetation and exposure.",
    available: true,
    unit: "°C",
  },
  {
    id: "flood",
    label: "Flood Risk",
    shortLabel: "Flood",
    description: "Waterlogging and drainage stress modelled from rainfall, slope and runoff.",
    available: false,
    unit: "mm",
  },
  {
    id: "air",
    label: "Air Quality Risk",
    shortLabel: "Air",
    description: "Particulate and pollutant concentration risk across corridors and zones.",
    available: false,
    unit: "AQI",
  },
  {
    id: "waste",
    label: "Waste Risk",
    shortLabel: "Waste",
    description: "Accumulation and collection-gap risk across wards.",
    available: false,
    unit: "t/day",
  },
  {
    id: "infrastructure",
    label: "Infrastructure Risk",
    shortLabel: "Infra",
    description: "Structural and utility stress modelling for ageing urban assets.",
    available: false,
    unit: "index",
  },
];

export const DEFAULT_RISK_TYPE: RiskTypeId = "heat";

export type LandUse = "dense-residential" | "commercial" | "industrial" | "mixed" | "green-belt";

export interface Zone {
  id: string;
  name: string;
  ward: string;
  lat: number;
  lng: number;
  /** normalised map position 0-100 used by the schematic city map */
  mx: number;
  my: number;
  landUse: LandUse;
  temperatureC: number;
  humidityPct: number;
  rainfallMm: number;
  vegetationPct: number;
  builtUpPct: number;
  populationDensity: number; // people per km²
  population: number;
  historicalRiskFrequency: number; // 0-1 share of past days flagged
  vulnerabilityIndex: number; // 0-1 (elderly, informal housing, low income)
  temperatureHistory: number[]; // last 14 days
  riskHistory: number[]; // last 14 days risk score
}

export interface RiskDriver {
  label: string;
  weightPct: number;
  value: string;
}

export interface ZoneAssessment {
  zone: Zone;
  riskScore: number;
  predictedRiskScore: number;
  level: RiskLevel;
  confidence: number;
  drivers: RiskDriver[];
  priorityScore: number;
  priorityRank: number;
  populationExposure: "Low" | "Moderate" | "High" | "Very High";
  recommendation: string;
  actions: string[];
  expectedPeriod: string;
  trendDelta: number;
}

export interface Alert {
  id: string;
  zoneId: string;
  level: RiskLevel;
  title: string;
  body: string;
  issuedAt: string;
}

export type TaskStatus = "Pending" | "Assigned" | "In Progress" | "Verification" | "Completed";

export interface InterventionTask {
  id: string;
  zoneId: string;
  title: string;
  riskType: RiskTypeId;
  priority: 1 | 2 | 3 | 4;
  status: TaskStatus;
  deadline: string;
  assignee: string;
  notes: { at: string; text: string }[];
  evidence: string[];
}

export interface Observation {
  id: string;
  zoneId: string;
  category: string;
  description: string;
  imageName?: string;
  at: string;
  status: "Submitted" | "Under Review" | "Accepted";
}
