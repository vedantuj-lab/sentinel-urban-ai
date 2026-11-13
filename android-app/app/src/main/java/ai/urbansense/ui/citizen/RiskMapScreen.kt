package ai.urbansense.ui.citizen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import ai.urbansense.data.model.RiskAssessmentDto
import ai.urbansense.viewmodel.CitizenViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RiskMapScreen(
    onBack: () -> Unit,
    viewModel: CitizenViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var selectedRisk by remember { mutableStateOf<RiskAssessmentDto?>(null) }
    
    // Default center (can be dynamic based on zones)
    val center = if (uiState.risks.isNotEmpty()) {
        LatLng(uiState.risks[0].zone.lat, uiState.risks[0].zone.lng)
    } else {
        LatLng(12.9716, 77.5946) // Bangalore default
    }
    
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(center, 12f)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Urban Risk Map") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Box(Modifier.padding(padding).fillMaxSize()) {
            GoogleMap(
                modifier = Modifier.fillMaxSize(),
                cameraPositionState = cameraPositionState
            ) {
                uiState.risks.forEach { risk ->
                    val hue = when (risk.level) {
                        "critical" -> BitmapDescriptorFactory.HUE_RED
                        "high" -> BitmapDescriptorFactory.HUE_ORANGE
                        "medium" -> BitmapDescriptorFactory.HUE_YELLOW
                        else -> BitmapDescriptorFactory.HUE_GREEN
                    }
                    
                    Marker(
                        state = MarkerState(position = LatLng(risk.zone.lat, risk.zone.lng)),
                        title = risk.zone.name,
                        snippet = "Risk: ${risk.level.uppercase()} (${risk.riskScore}/100)",
                        icon = BitmapDescriptorFactory.defaultMarker(hue),
                        onClick = {
                            selectedRisk = risk
                            false // Allow default behavior to center/show info window
                        }
                    )
                }
            }

            // Bottom detail panel for the selected risk zone
            selectedRisk?.let { risk ->
                Card(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(16.dp)
                        .fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(risk.zone.name, style = MaterialTheme.typography.titleLarge)
                                Text("Land Use: ${risk.zone.landUse}", style = MaterialTheme.typography.bodySmall)
                            }
                            IconButton(onClick = { selectedRisk = null }) {
                                Text("✕", style = MaterialTheme.typography.titleMedium)
                            }
                        }
                        
                        Spacer(Modifier.height(8.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                            Column {
                                Text("Risk Score", style = MaterialTheme.typography.bodySmall)
                                Text("${risk.riskScore}/100", style = MaterialTheme.typography.titleMedium, color = Color.Red)
                            }
                            Column {
                                Text("Population", style = MaterialTheme.typography.bodySmall)
                                Text("${risk.zone.population}", style = MaterialTheme.typography.titleMedium)
                            }
                            Column {
                                Text("Vulnerability Index", style = MaterialTheme.typography.bodySmall)
                                Text("${risk.zone.vulnerabilityIndex}", style = MaterialTheme.typography.titleMedium)
                            }
                        }

                        Spacer(Modifier.height(8.dp))
                        Text("Recommended Mitigation:", style = MaterialTheme.typography.titleSmall)
                        Text(risk.recommendation, style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }
    }
}
