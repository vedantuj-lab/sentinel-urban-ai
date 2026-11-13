/**
 * Research-Gap Test Scenarios Verification Suite
 * Verifies all 5 mandatory test scenarios from Section 27.
 */
import { RiskService } from "../services/RiskService";
import { RegionService } from "../services/RegionService";
import type { Zone } from "../types/risk";

const baseZone: Zone = {
  id: "Z-TEST",
  name: "Test Sector",
  ward: "Ward 10",
  lat: 18.5,
  lng: 73.8,
  mx: 50,
  my: 50,
  landUse: "dense-residential",
  temperatureC: 35,
  humidityPct: 40,
  rainfallMm: 0,
  vegetationPct: 20,
  builtUpPct: 70,
  populationDensity: 10000,
  population: 50000,
  historicalRiskFrequency: 0.5,
  vulnerabilityIndex: 0.5,
  temperatureHistory: [34, 35, 35],
  riskHistory: [50, 55, 60],
};

export function runResearchGapScenarios() {
  console.log("==================================================");
  console.log("RUNNING URBAN SENSE AI RESEARCH-GAP SCENARIOS TEST");
  console.log("==================================================");

  // SCENARIO 1: High temp, low veg, high pop
  console.log("\n[SCENARIO 1]: High temp + Low veg + High pop");
  const s1Zone: Zone = {
    ...baseZone,
    temperatureC: 42,
    vegetationPct: 5,
    builtUpPct: 90,
    population: 120000,
    populationDensity: 22000,
  };
  const s1Result = RiskService.assessZoneSync(s1Zone);
  console.log(`  Risk Score: ${s1Result.riskScore} (${s1Result.level.toUpperCase()})`);
  console.log(
    `  Priority Score: ${s1Result.priorityScore} (${s1Result.priorityLevel.toUpperCase()})`,
  );
  console.log(`  Recommendation: "${s1Result.recommendation}"`);
  assert(s1Result.riskScore >= 70, "Scenario 1 failed: Expected High/Critical Risk Score >= 70");
  assert(
    s1Result.priorityScore >= 60,
    "Scenario 1 failed: Expected High/Critical Priority Score >= 60",
  );
  assert(
    s1Result.recommendation.length > 0,
    "Scenario 1 failed: Expected non-empty recommendation",
  );

  // SCENARIO 2: Moderate temp, good vegetation
  console.log("\n[SCENARIO 2]: Moderate temp + Good vegetation");
  const s2Zone: Zone = {
    ...baseZone,
    temperatureC: 32,
    vegetationPct: 55,
    builtUpPct: 30,
    population: 20000,
    populationDensity: 3000,
  };
  const s2Result = RiskService.assessZoneSync(s2Zone);
  console.log(`  Risk Score: ${s2Result.riskScore} (${s2Result.level.toUpperCase()})`);
  assert(s2Result.riskScore < 60, "Scenario 2 failed: Expected Low/Moderate Risk Score < 60");

  // SCENARIO 3: High risk but poor data quality
  console.log("\n[SCENARIO 3]: High risk with poor data quality / missing fields");
  const s3Zone: Zone = {
    ...baseZone,
    temperatureC: 41,
    humidityPct: -10, // Invalid range
    vegetationPct: undefined as any, // Missing value
    builtUpPct: 85,
  };
  const s3Result = RiskService.assessZoneSync(s3Zone);
  console.log(`  Risk Score: ${s3Result.riskScore}`);
  console.log(`  Data Quality Score: ${s3Result.dataQualityScore}`);
  console.log(`  Confidence: ${s3Result.confidence}% (${s3Result.confidenceLevel})`);
  console.log(`  Warning: "${s3Result.dataQualityWarning}"`);
  assert(s3Result.dataQualityScore < 70, "Scenario 3 failed: Expected Data Quality Score < 70");
  assert(
    s3Result.dataQualityWarning !== undefined && s3Result.dataQualityWarning.length > 0,
    "Scenario 3 failed: Expected warning message for degraded dataset",
  );

  // SCENARIO 4: Similar risk, different population exposure
  console.log("\n[SCENARIO 4]: Similar risk, different population exposure");
  const s4ZoneA: Zone = {
    ...baseZone,
    temperatureC: 38.5,
    builtUpPct: 80,
    vegetationPct: 15,
    population: 120000,
    populationDensity: 20000,
  };
  const s4ZoneB: Zone = {
    ...baseZone,
    temperatureC: 38.5,
    builtUpPct: 80,
    vegetationPct: 15,
    population: 5000,
    populationDensity: 1200,
  };
  const s4ResultA = RiskService.assessZoneSync(s4ZoneA);
  const s4ResultB = RiskService.assessZoneSync(s4ZoneB);
  console.log(`  Zone A Priority Score: ${s4ResultA.priorityScore} (High Exposure)`);
  console.log(`  Zone B Priority Score: ${s4ResultB.priorityScore} (Low Exposure)`);
  assert(
    s4ResultA.priorityScore > s4ResultB.priorityScore,
    "Scenario 4 failed: Higher exposure zone must receive higher priority score",
  );

  // SCENARIO 5: Regional configuration adaptation
  console.log("\n[SCENARIO 5]: Regional configuration adaptation");
  RegionService.setActiveRegion("delhi");
  const delhiResult = RiskService.assessZoneSync(baseZone);

  RegionService.setActiveRegion("bengaluru");
  const blrResult = RiskService.assessZoneSync(baseZone);

  console.log(`  Base Zone Risk in Delhi (38°C threshold): ${delhiResult.riskScore}`);
  console.log(`  Base Zone Risk in Bengaluru (30°C threshold): ${blrResult.riskScore}`);
  assert(
    delhiResult.riskScore !== blrResult.riskScore,
    "Scenario 5 failed: Risk score must adapt dynamically based on regional configuration parameters",
  );

  // Reset region
  RegionService.setActiveRegion("demo");
  console.log("\nALL 5 RESEARCH-GAP SCENARIOS PASSED SUCCESSFULLY!\n");
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED]: ${message}`);
  }
}

// Auto-run when file is loaded in test environment
try {
  runResearchGapScenarios();
} catch (err) {
  console.error("Scenario execution error:", err);
}
