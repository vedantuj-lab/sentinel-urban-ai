package ai.urbansense

import ai.urbansense.data.model.InterventionDto
import ai.urbansense.data.model.LoginResponse
import ai.urbansense.data.model.RiskAssessmentDto
import ai.urbansense.data.model.UserDto
import ai.urbansense.data.model.ZoneDto
import ai.urbansense.data.remote.UrbanSenseApi
import ai.urbansense.data.repository.AuthRepository
import ai.urbansense.viewmodel.AuthViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Before
import org.junit.Test

@OptIn(ExperimentalCoroutinesApi::class)
class AuthViewModelTest {

    private val testDispatcher = StandardTestDispatcher()

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    private fun createMockApi(
        loginHandler: (Map<String, String>) -> LoginResponse
    ): UrbanSenseApi {
        return object : UrbanSenseApi {
            override suspend fun login(credentials: Map<String, String>): LoginResponse = loginHandler(credentials)
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
    fun login_citizenCredentials_succeedsWithCitizenRole() = runTest(testDispatcher) {
        val mockApi = createMockApi {
            LoginResponse(UserDto("1", "Citizen User", "citizen@urbansense.ai", "citizen", "zone_1"))
        }
        val repository = AuthRepository(DummyContext(), mockApi)
        val viewModel = AuthViewModel(repository)

        viewModel.login("citizen@urbansense.ai", "password")
        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertEquals("citizen", state.successRole)
        assertNull(state.error)
    }

    @Test
    fun login_fieldCredentials_succeedsWithFieldRole() = runTest(testDispatcher) {
        val mockApi = createMockApi {
            LoginResponse(UserDto("2", "Field Officer", "field@urbansense.ai", "field_officer", "zone_1"))
        }
        val repository = AuthRepository(DummyContext(), mockApi)
        val viewModel = AuthViewModel(repository)

        viewModel.login("field@urbansense.ai", "password")
        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertEquals("field_officer", state.successRole)
        assertNull(state.error)
    }

    @Test
    fun login_apiFailure_fallbackRoleReturned() = runTest(testDispatcher) {
        val mockApi = createMockApi {
            throw Exception("Network Timeout")
        }
        val repository = AuthRepository(DummyContext(), mockApi)
        val viewModel = AuthViewModel(repository)

        viewModel.login("field@urbansense.ai", "password")
        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertNotNull(state.successRole)
    }
}

private class DummyContext : android.content.ContextWrapper(null) {
    override fun getSharedPreferences(name: String?, mode: Int): android.content.SharedPreferences? = null
}

