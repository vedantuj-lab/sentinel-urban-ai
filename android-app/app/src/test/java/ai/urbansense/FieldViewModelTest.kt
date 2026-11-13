package ai.urbansense

import ai.urbansense.data.model.InterventionDto
import ai.urbansense.data.model.LoginResponse
import ai.urbansense.data.model.RiskAssessmentDto
import ai.urbansense.data.model.ZoneDto
import ai.urbansense.data.remote.UrbanSenseApi
import ai.urbansense.viewmodel.FieldViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class FieldViewModelTest {

    private val testDispatcher = StandardTestDispatcher()

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun loadInterventions_offlineFallback_populatesInterventions() = runTest(testDispatcher) {
        val mockApi = object : UrbanSenseApi {
            override suspend fun login(credentials: Map<String, String>): LoginResponse = error("Not implemented")
            override suspend fun getZones(): List<ZoneDto> = emptyList()
            override suspend fun getRisks(): List<RiskAssessmentDto> = emptyList()
            override suspend fun getInterventions(): List<InterventionDto> {
                throw Exception("Offline mode")
            }
            override suspend fun updateIntervention(id: String, updates: Map<String, String>): InterventionDto {
                throw Exception("Offline mode")
            }
            override suspend fun submitObservation(observation: Map<String, String>): Map<String, String> = emptyMap()
        }
        val viewModel = FieldViewModel(mockApi)

        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertFalse(state.isLoading)
        assertTrue(state.interventions.isNotEmpty())
    }

    @Test
    fun updateStatus_updatesLocalInterventionStatus() = runTest(testDispatcher) {
        val mockApi = object : UrbanSenseApi {
            override suspend fun login(credentials: Map<String, String>): LoginResponse = error("Not implemented")
            override suspend fun getZones(): List<ZoneDto> = emptyList()
            override suspend fun getRisks(): List<RiskAssessmentDto> = emptyList()
            override suspend fun getInterventions(): List<InterventionDto> {
                throw Exception("Offline mode")
            }
            override suspend fun updateIntervention(id: String, updates: Map<String, String>): InterventionDto {
                throw Exception("Offline mode")
            }
            override suspend fun submitObservation(observation: Map<String, String>): Map<String, String> = emptyMap()
        }
        val viewModel = FieldViewModel(mockApi)
        testDispatcher.scheduler.advanceUntilIdle()

        viewModel.updateStatus("int_101", "in_progress")
        testDispatcher.scheduler.advanceUntilIdle()

        val item = viewModel.uiState.value.interventions.find { it.id == "int_101" }
        assertEquals("in_progress", item?.status)
    }
}

