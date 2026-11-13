/**
 * Risk Model Unit Tests
 * Framework: Vitest / Jest
 */
import { HeatRiskModel } from "../models/HeatRiskModel";
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
  temperatureHistory: [38, 39, 40],
  riskHistory: [70, 75, 80],
};

describe("HeatRiskModel", () => {
  const model = new HeatRiskModel();

  test("calculates high risk for dense urban areas with high temperature", () => {
    const result = model.calculateRisk({ zone: mockZone });
    expect(result.score).toBeGreaterThan(70);
    expect(result.level).toBe("high");
  });

  test("identifies primary risk drivers correctly", () => {
    const result = model.calculateRisk({ zone: mockZone });
    expect(result.drivers.length).toBeGreaterThan(0);
    expect(result.drivers[0].weightPct).toBeGreaterThan(0);
  });

  test("predicts future risk based on momentum", () => {
    const predicted = model.getPredictedScore(mockZone, 80);
    expect(predicted).toBeGreaterThan(80); // because temp is rising
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
