import type { RiskLevel, Zone, RiskDriver } from "../types/risk";

/**
 * Step 18 & 19: Recommendation Engine & Intervention Decision Support.
 * Connects Risk → Explanation → Priority → Actionable Recommendations.
 */
export class RecommendationService {
  static getRecommendations(
    level: RiskLevel,
    zone: Zone,
    drivers: RiskDriver[],
    dataQualityScore?: number,
  ): string {
    // Check for low data quality scenario first (Step 18 rule)
    if (dataQualityScore !== undefined && dataQualityScore < 60) {
      return "Collect additional environmental data before making high-impact decisions.";
    }

    const isHighTemp = zone.temperatureC > 37;
    const isLowVeg = zone.vegetationPct < 15;
    const isHighPop = zone.population > 80000 || zone.populationDensity > 15000;
    const isHighBuiltUp = zone.builtUpPct > 75;

    // Rule-based conditional logic matching Section 18
    if (isHighTemp && isLowVeg) {
      return `Prioritise green-cover and shading measures in the affected zone (${zone.name}).`;
    }

    if (isHighTemp && isHighPop) {
      return `Prioritise vulnerable-population protection and targeted heat-awareness measures in ${zone.ward}.`;
    }

    if (isHighBuiltUp) {
      return `Conduct targeted heat-mitigation assessment and prioritise cooling/shading strategies for ${zone.name}.`;
    }

    // Default level-based logic
    switch (level) {
      case "critical":
        return `Issue immediate localised heat advisory for ${zone.name}. Escalate for emergency resource reallocation.`;
      case "high":
        return `Prioritise heat mitigation interventions and schedule field validation within 48 hours for ${zone.name}.`;
      case "medium":
        return `Plan tree-cover expansion for ${zone.name} and keep under continuous monitoring.`;
      default:
        return `Maintain routine observation for ${zone.name}. No immediate intervention required.`;
    }
  }

  static getActionItems(
    level: RiskLevel,
    zone: Zone,
    drivers: RiskDriver[],
    dataQualityScore?: number,
  ): string[] {
    const actions: string[] = [];

    if (dataQualityScore !== undefined && dataQualityScore < 60) {
      actions.push("Deploy mobile validation sensor node");
      actions.push("Audit sensor telemetry for gaps and anomalies");
    }

    drivers.forEach((d) => {
      if (d.label.includes("Temperature") && d.weightPct > 25) {
        actions.push("Deploy mobile hydration units at transit hubs");
      }
      if (d.label.includes("Vegetation") && d.weightPct > 18) {
        actions.push("Identify pockets for rapid tree-cover expansion");
      }
      if (d.label.includes("Built-up") && d.weightPct > 18) {
        actions.push("Initiate cool-roof pilot for industrial/dense sectors");
      }
      if (d.label.includes("Vulnerability") && d.weightPct > 15) {
        actions.push(`Map vulnerable households (Index: ${zone.vulnerabilityIndex.toFixed(2)})`);
      }
    });

    if (level === "high" || level === "critical") {
      actions.push("Issue SMS alerts to local health centres");
    }

    if (actions.length === 0) {
      actions.push("Continue routine environmental monitoring");
      actions.push("Preserve existing vegetation cover");
    }

    return Array.from(new Set(actions));
  }
}
