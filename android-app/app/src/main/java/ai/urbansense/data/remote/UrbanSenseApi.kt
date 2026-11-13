package ai.urbansense.data.remote

import ai.urbansense.data.model.*
import retrofit2.http.*

interface UrbanSenseApi {
    @POST("api/auth/login")
    suspend fun login(@Body credentials: Map<String, String>): LoginResponse

    @GET("api/zones")
    suspend fun getZones(): List<ZoneDto>

    @GET("api/risks")
    suspend fun getRisks(): List<RiskAssessmentDto>

    @GET("api/interventions")
    suspend fun getInterventions(): List<InterventionDto>

    @PATCH("api/interventions/{id}")
    suspend fun updateIntervention(
        @Path("id") id: String,
        @Body updates: Map<String, String>
    ): InterventionDto

    @POST("api/observations")
    suspend fun submitObservation(@Body observation: Map<String, String>): Map<String, String>
}
