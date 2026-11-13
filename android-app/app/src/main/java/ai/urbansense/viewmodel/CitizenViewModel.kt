package ai.urbansense.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import ai.urbansense.data.model.RiskAssessmentDto
import ai.urbansense.data.repository.RiskRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CitizenUiState(
    val isLoading: Boolean = false,
    val risks: List<RiskAssessmentDto> = emptyList(),
    val error: String? = null,
    val isSubmitting: Boolean = false,
    val submissionSuccess: Boolean = false
)

@HiltViewModel
class CitizenViewModel @Inject constructor(
    private val repository: RiskRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CitizenUiState())
    val uiState: StateFlow<CitizenUiState> = _uiState

    init {
        loadRisks()
    }

    fun loadRisks() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            repository.getAllRisks()
                .onSuccess { list ->
                    _uiState.value = _uiState.value.copy(risks = list, isLoading = false)
                }
                .onFailure { err ->
                    _uiState.value = _uiState.value.copy(error = err.message, isLoading = false)
                }
        }
    }

    fun submitObservation(category: String, location: String, description: String, imageName: String? = null) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmitting = true, submissionSuccess = false)
            repository.submitObservation(category, location, description, imageName)
                .onSuccess {
                    _uiState.value = _uiState.value.copy(isSubmitting = false, submissionSuccess = true)
                }
                .onFailure { err ->
                    _uiState.value = _uiState.value.copy(isSubmitting = false, error = err.message)
                }
        }
    }

    fun resetSubmissionStatus() {
        _uiState.value = _uiState.value.copy(submissionSuccess = false, error = null)
    }
}
