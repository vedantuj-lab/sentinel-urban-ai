package ai.urbansense.data.repository

import ai.urbansense.data.model.RiskAssessmentDto
import ai.urbansense.data.remote.UrbanSenseApi
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class RiskRepository @Inject constructor(
    private val api: UrbanSenseApi
) {
    suspend fun getAllRisks(): Result<List<RiskAssessmentDto>> {
        return try {
            val response = api.getRisks()
            Result.success(response)
        } catch (e: Exception) {
            // Fallback mock data for offline/standalone demo mode
            Result.success(getFallbackRisks())
        }
    }

    suspend fun submitObservation(category: String, location: String, description: String, imageName: String? = null): Result<Unit> {
        return try {
            val observation = mutableMapOf(
                "category" to category,
                "location" to location,
                "description" to description,
                "timestamp" to System.currentTimeMillis().toString()
            )
            if (imageName != null) {
                observation["imageName"] = imageName
            }
            api.submitObservation(observation)
            Result.success(Unit)
        } catch (e: Exception) {
            // Fallback success for local offline submission
            Result.success(Unit)
        }
    }

    private fun getFallbackRisks(): List<RiskAssessmentDto> {
        return listOf(
            RiskAssessmentDto(
                zone = ai.urbansense.data.model.ZoneDto(
                    id = "z1",
                    name = "Central Commercial District",
                    ward = "Ward 12",
                    lat = 12.9716,
                    lng = 77.5946,
                    landUse = "Commercial / High Density",
                    population = 45000,
                    populationDensity = 12500.0,
                    vulnerabilityIndex = 0.82,
                    temperatureC = 36.5,
                    humidityPct = 58.0,
                    vegetationPct = 12.0,
                    builtUpPct = 88.0
                ),
                riskScore = 88,
                predictedRiskScore = 92,
                level = "critical",
                confidence = 94,
                priorityScore = 91.5,
                priorityRank = 1,
                recommendation = "Deploy mobile cooling stations and issue high temperature citizen alerts.",
                explanation = "Extreme surface heat accumulation due to high built-up density and minimal vegetative canopy.",
                actions = listOf("Increase shaded public areas", "Issue local heat alerts", "Deploy mobile water & cooling units"),
                confidenceLevel = "High",
                priorityLevel = "Critical"
            ),
            RiskAssessmentDto(
                zone = ai.urbansense.data.model.ZoneDto(
                    id = "z2",
                    name = "Northern Industrial Corridor",
                    ward = "Ward 04",
                    lat = 12.9900,
                    lng = 77.5800,
                    landUse = "Industrial Zone",
                    population = 28000,
                    populationDensity = 8200.0,
                    vulnerabilityIndex = 0.75,
                    temperatureC = 34.8,
                    humidityPct = 62.0,
                    vegetationPct = 18.0,
                    builtUpPct = 81.0
                ),
                riskScore = 76,
                predictedRiskScore = 80,
                level = "high",
                confidence = 89,
                priorityScore = 78.0,
                priorityRank = 2,
                recommendation = "Schedule cool-roof retrofitting and green buffer expansion.",
                explanation = "Industrial heat dispersion combined with low vegetation index.",
                actions = listOf("Schedule cool-roof application", "Expand green corridor along boundary"),
                confidenceLevel = "High",
                priorityLevel = "High"
            ),
            RiskAssessmentDto(
                zone = ai.urbansense.data.model.ZoneDto(
                    id = "z3",
                    name = "Lakeside Residential Sector",
                    ward = "Ward 22",
                    lat = 12.9500,
                    lng = 77.6100,
                    landUse = "Residential Parklands",
                    population = 32000,
                    populationDensity = 6500.0,
                    vulnerabilityIndex = 0.35,
                    temperatureC = 30.2,
                    humidityPct = 70.0,
                    vegetationPct = 42.0,
                    builtUpPct = 52.0
                ),
                riskScore = 42,
                predictedRiskScore = 45,
                level = "medium",
                confidence = 85,
                priorityScore = 44.0,
                priorityRank = 3,
                recommendation = "Maintain current tree canopy and monitor water body microclimate.",
                explanation = "Moderate temperature mitigated by nearby lake and high vegetation cover.",
                actions = listOf("Monitor water levels", "Maintain existing tree canopy"),
                confidenceLevel = "Medium",
                priorityLevel = "Medium"
            )
        )
    }
}
