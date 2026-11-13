/**
 * Priority Service Unit Tests
 */
import { PriorityService } from "../services/PriorityService";
import type { Zone } from "../types/risk";

const mockZone: Zone = {
  id: "Z-TEST",
  name: "Test Zone",
  ward: "Ward X",
  lat: 0,
  lng: 0,
  mx: 50,
  my: 50,
  landUse: "dense-residential",
  temperatureC: 40,
  humidityPct: 40,
  rainfallMm: 0,
  vegetationPct: 10,
  builtUpPct: 90,
  populationDensity: 20000,
  population: 100000,
  historicalRiskFrequency: 0.8,
  vulnerabilityIndex: 0.8,
  temperatureHistory: [],
  riskHistory: [],
};

describe("PriorityService", () => {
  test("calculates higher priority for high vulnerability and exposure", () => {
    const score = PriorityService.calculatePriority(80, mockZone, 90);
    expect(score).toBeGreaterThan(50);
  });

  test("exposure band is calculated correctly", () => {
    const band = PriorityService.getExposureBand(mockZone.population, mockZone.populationDensity);
    expect(band).toBe("Very High");
  });
});

// Mock functions for environment without test runner
function describe(name: string, fn: Function) {
  console.log(`Describe: ${name}`);
  fn();
}
function test(name: string, fn: Function) {
  console.log(`  Test: ${name}`);
  try {
    fn();
  } catch (e) {
    console.error(e);
  }
}
function expect(val: any) {
  return {
    toBeGreaterThan: (other: number) => {
      if (!(val > other)) throw new Error(`Expected ${val} to be greater than ${other}`);
    },
    toBe: (other: any) => {
      if (val !== other) throw new Error(`Expected ${val} to be ${other}`);
    },
  };
}
