package ai.urbansense

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import ai.urbansense.ui.theme.UrbanSenseAITheme
import ai.urbansense.ui.citizen.CitizenDashboard
import ai.urbansense.ui.citizen.ReportObservationScreen
import ai.urbansense.ui.citizen.RiskMapScreen
import ai.urbansense.ui.auth.LoginScreen
import ai.urbansense.ui.field.FieldDashboard
import ai.urbansense.ui.field.InterventionDetailsScreen
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            UrbanSenseAITheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    UrbanSenseApp()
                }
            }
        }
    }
}

@Composable
fun UrbanSenseApp() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = "login") {
        composable("login") {
            LoginScreen(
                onLoginSuccess = { role ->
                    if (role == "citizen") {
                        navController.navigate("citizen_dashboard")
                    } else {
                        navController.navigate("field_dashboard")
                    }
                }
            )
        }
        composable("citizen_dashboard") {
            CitizenDashboard(
                onReportClick = { navController.navigate("report_observation") },
                onViewMapClick = { navController.navigate("risk_map") }
            )
        }
        composable("risk_map") {
            RiskMapScreen(
                onBack = { navController.popBackStack() }
            )
        }
        composable("report_observation") {
            ReportObservationScreen(
                onBack = { navController.popBackStack() }
            )
        }
        composable("field_dashboard") {
            FieldDashboard(
                onInterventionClick = { id -> navController.navigate("intervention_details/$id") }
            )
        }
        composable("intervention_details/{id}") { backStackEntry ->
            val id = backStackEntry.arguments?.getString("id") ?: ""
            InterventionDetailsScreen(
                interventionId = id,
                onBack = { navController.popBackStack() }
            )
        }
    }
}
