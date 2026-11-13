export interface RegionProfile {
  id: string;
  name: string;
  tempThreshold: number; // °C threshold where heat stress begins
  humidityWeight: number; // Weight factor 0-1
  vegetationWeight: number; // Weight factor 0-1
  builtUpWeight: number; // Weight factor 0-1
  popExposureWeight: number; // Weight factor 0-1
  historicalWeight: number; // Weight factor 0-1
  vulnerabilityWeight: number; // Weight factor 0-1
}

export const REGIONS: RegionProfile[] = [
  {
    id: "mumbai",
    name: "Mumbai",
    tempThreshold: 34,
    humidityWeight: 0.25,
    vegetationWeight: 0.15,
    builtUpWeight: 0.2,
    popExposureWeight: 0.22,
    historicalWeight: 0.1,
    vulnerabilityWeight: 0.08,
  },
  {
    id: "delhi",
    name: "Delhi",
    tempThreshold: 38,
    humidityWeight: 0.1,
    vegetationWeight: 0.22,
    builtUpWeight: 0.25,
    popExposureWeight: 0.2,
    historicalWeight: 0.13,
    vulnerabilityWeight: 0.1,
  },
  {
    id: "pune",
    name: "Pune",
    tempThreshold: 33,
    humidityWeight: 0.12,
    vegetationWeight: 0.22,
    builtUpWeight: 0.2,
    popExposureWeight: 0.22,
    historicalWeight: 0.14,
    vulnerabilityWeight: 0.1,
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    tempThreshold: 30,
    humidityWeight: 0.18,
    vegetationWeight: 0.2,
    builtUpWeight: 0.18,
    popExposureWeight: 0.2,
    historicalWeight: 0.14,
    vulnerabilityWeight: 0.1,
  },
  {
    id: "demo",
    name: "Demo Region",
    tempThreshold: 35,
    humidityWeight: 0.15,
    vegetationWeight: 0.2,
    builtUpWeight: 0.22,
    popExposureWeight: 0.2,
    historicalWeight: 0.13,
    vulnerabilityWeight: 0.1,
  },
];

export class RegionService {
  private static activeRegionId = "demo";

  static getActiveRegion(): RegionProfile {
    return REGIONS.find((r) => r.id === this.activeRegionId) || REGIONS[4];
  }

  static setActiveRegion(id: string) {
    if (REGIONS.some((r) => r.id === id)) {
      this.activeRegionId = id;
    }
  }

  static getRegions() {
    return REGIONS;
  }
}
