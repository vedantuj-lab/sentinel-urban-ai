package ai.urbansense

import ai.urbansense.data.model.InterventionDto
import ai.urbansense.data.model.LoginResponse
import ai.urbansense.data.model.RiskAssessmentDto
import ai.urbansense.data.model.ZoneDto
import ai.urbansense.data.remote.UrbanSenseApi
import ai.urbansense.data.repository.RiskRepository
import ai.urbansense.viewmodel.CitizenViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class CitizenViewModelTest {

    private val testDispatcher = StandardTestDispatcher()

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    private fun createMockApi(): UrbanSenseApi {
        return object : UrbanSenseApi {
            override suspend fun login(credentials: Map<String, String>): LoginResponse = error("Not implemented")
            override suspend fun getZones(): List<ZoneDto> = emptyList()
            override suspend fun getRisks(): List<RiskAssessmentDto> = emptyList()
            override suspend fun getInterventions(): List<InterventionDto> = emptyList()
            override suspend fun updateIntervention(id: String, updates: Map<String, String>): InterventionDto {
                return InterventionDto(id, "z1", "Title", "pending", 1, "Today")
            }
            override suspend fun submitObservation(observation: Map<String, String>): Map<String, String> = emptyMap()
        }
    }

    @Test
    fun loadRisks_populatesRisksState() = runTest(testDispatcher) {
        val repository = RiskRepository(createMockApi())
        val viewModel = CitizenViewModel(repository)

        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertFalse(state.isLoading)
        assertTrue(state.risks.isNotEmpty())
    }

    @Test
    fun submitObservation_setsSuccessFlag() = runTest(testDispatcher) {
        val repository = RiskRepository(createMockApi())
        val viewModel = CitizenViewModel(repository)

        viewModel.submitObservation("Heat Island", "Ward 12", "Extreme temperature observed")
        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertTrue(state.submissionSuccess)
        assertFalse(state.isSubmitting)
    }

    @Test
    fun resetSubmissionStatus_clearsSuccessFlag() = runTest(testDispatcher) {
        val repository = RiskRepository(createMockApi())
        val viewModel = CitizenViewModel(repository)

        viewModel.submitObservation("Heat Island", "Ward 12", "Extreme temperature observed")
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.resetSubmissionStatus()
        val state = viewModel.uiState.value
        assertFalse(state.submissionSuccess)
    }
}

