package ai.urbansense.data.model

import com.google.gson.annotations.SerializedName

data class ZoneDto(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("ward") val ward: String,
    @SerializedName("lat") val lat: Double,
    @SerializedName("lng") val lng: Double,
    @SerializedName("landUse") val landUse: String,
    @SerializedName("population") val population: Int,
    @SerializedName("populationDensity") val populationDensity: Double,
    @SerializedName("vulnerabilityIndex") val vulnerabilityIndex: Double,
    @SerializedName("temperatureC") val temperatureC: Double? = 32.0,
    @SerializedName("humidityPct") val humidityPct: Double? = 65.0,
    @SerializedName("vegetationPct") val vegetationPct: Double? = 18.0,
    @SerializedName("builtUpPct") val builtUpPct: Double? = 75.0
)

data class RiskAssessmentDto(
    @SerializedName("zone") val zone: ZoneDto,
    @SerializedName("riskScore") val riskScore: Int,
    @SerializedName("predictedRiskScore") val predictedRiskScore: Int,
    @SerializedName("level") val level: String,
    @SerializedName("confidence") val confidence: Int,
    @SerializedName("priorityScore") val priorityScore: Double,
    @SerializedName("priorityRank") val priorityRank: Int,
    @SerializedName("recommendation") val recommendation: String,
    @SerializedName("explanation") val explanation: String? = "Surface heat building up due to high built-up density and lack of vegetative shade canopy.",
    @SerializedName("actions") val actions: List<String>? = listOf("Increase shaded public areas", "Issue local heat alerts", "Verify well-being of vulnerable population zones"),
    @SerializedName("confidenceLevel") val confidenceLevel: String? = "High",
    @SerializedName("priorityLevel") val priorityLevel: String? = "High"
)

data class UserDto(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("email") val email: String,
    @SerializedName("role") val role: String,
    @SerializedName("zoneId") val zoneId: String
)

data class LoginResponse(
    @SerializedName("user") val user: UserDto
)

data class InterventionDto(
    @SerializedName("id") val id: String,
    @SerializedName("zoneId") val zoneId: String,
    @SerializedName("title") val title: String,
    @SerializedName("status") val status: String,
    @SerializedName("priority") val priority: Int,
    @SerializedName("deadline") val deadline: String,
    @SerializedName("priorityLevel") val priorityLevel: String? = "High",
    @SerializedName("explanation") val explanation: String? = "Critical heat accumulation detected in this sector.",
    @SerializedName("actions") val actions: List<String>? = listOf("Prioritize heat mitigation measures", "Issue a local heat advisory", "Schedule immediate field inspection")
)
