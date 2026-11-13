package ai.urbansense.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ai.urbansense.data.model.InterventionDto
import ai.urbansense.data.remote.UrbanSenseApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class FieldUiState(
    val interventions: List<InterventionDto> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class FieldViewModel @Inject constructor(
    private val api: UrbanSenseApi
) : ViewModel() {

    private val _uiState = MutableStateFlow(FieldUiState())
    val uiState = _uiState.asStateFlow()

    init {
        loadInterventions()
    }

    fun loadInterventions() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            try {
                val response = api.getInterventions()
                _uiState.value = _uiState.value.copy(
                    interventions = response,
                    isLoading = false
                )
            } catch (e: Exception) {
                // Fallback mock interventions for offline field officer deployment
                _uiState.value = _uiState.value.copy(
                    interventions = if (_uiState.value.interventions.isNotEmpty()) _uiState.value.interventions else getFallbackInterventions(),
                    isLoading = false
                )
            }
        }
    }

    fun updateStatus(id: String, status: String) {
        viewModelScope.launch {
            try {
                api.updateIntervention(id, mapOf("status" to status))
                loadInterventions()
            } catch (e: Exception) {
                // Update local state when offline
                val updated = _uiState.value.interventions.map {
                    if (it.id == id) it.copy(status = status) else it
                }
                _uiState.value = _uiState.value.copy(interventions = updated)
            }
        }
    }

    fun updateInterventionWithNotes(id: String, status: String, notes: String) {
        viewModelScope.launch {
            try {
                api.updateIntervention(id, mapOf(
                    "status" to status,
                    "notes" to notes
                ))
                loadInterventions()
            } catch (e: Exception) {
                // Update local state when offline
                val updated = _uiState.value.interventions.map {
                    if (it.id == id) it.copy(status = status) else it
                }
                _uiState.value = _uiState.value.copy(interventions = updated)
            }
        }
    }

    private fun getFallbackInterventions(): List<InterventionDto> {
        return listOf(
            InterventionDto(
                id = "int_101",
                zoneId = "z1",
                title = "Deploy Temporary Shade Canopy & Hydration Point",
                status = "pending",
                priority = 1,
                deadline = "14:00 Today",
                priorityLevel = "Critical",
                explanation = "Critical heat accumulation detected in Central Commercial District. High foot traffic vulnerability.",
                actions = listOf(
                    "Erect high-UV block shade awnings near central plaza",
                    "Distribute hydration packets and emergency thermal advisories",
                    "Verify operational status of automated misting system"
                )
            ),
            InterventionDto(
                id = "int_102",
                zoneId = "z2",
                title = "Inspect Cool-Roof Retrofit Site",
                status = "pending",
                priority = 2,
                deadline = "17:30 Today",
                priorityLevel = "High",
                explanation = "Thermal imagery indicates elevated roof albedo loss in Northern Industrial Sector.",
                actions = listOf(
                    "Measure rooftop surface reflectance",
                    "Inspect reflective coating layer thickness",
                    "Log thermal sensor telemetry"
                )
            )
        )
    }
}
