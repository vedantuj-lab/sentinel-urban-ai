package ai.urbansense.ui.citizen

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import ai.urbansense.data.model.RiskAssessmentDto
import ai.urbansense.ui.components.*
import ai.urbansense.ui.theme.*
import ai.urbansense.viewmodel.CitizenViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CitizenDashboard(
    onReportClick: () -> Unit,
    onViewMapClick: () -> Unit,
    viewModel: CitizenViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        containerColor = Color(0xFFF8FAFC),
        topBar = {
            TopAppBar(
                title = { 
                    Text(
                        "Sentinel Portal", 
                        style = MaterialTheme.typography.labelLarge.copy(color = CitizenPrimary)
                    ) 
                },
                actions = {
                    TextButton(onClick = onViewMapClick) {
                        Text("RISK MAP", style = MaterialTheme.typography.labelMedium)
                    }
                    Button(
                        onClick = onReportClick, 
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = CitizenPrimary)
                    ) {
                        Text("SYNC INTEL", style = MaterialTheme.typography.labelMedium)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { padding ->
        if (uiState.isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = CitizenPrimary)
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .padding(padding)
                    .fillMaxSize(),
                contentPadding = PaddingValues(20.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                // Neighbourhood Vitals Title
                item {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(width = 8.dp, height = 40.dp)
                                    .background(CitizenPrimary, RoundedCornerShape(4.dp))
                            )
                            Spacer(Modifier.width(16.dp))
                            Text(
                                text = "Neighbourhood ",
                                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black)
                            )
                            Text(
                                text = "Vitals",
                                style = MaterialTheme.typography.headlineMedium.copy(
                                    fontWeight = FontWeight.Black,
                                    color = CitizenPrimary
                                )
                            )
                        }
                        Text(
                            text = "ACTIVE SURVEILLANCE FEED",
                            style = MaterialTheme.typography.labelMedium.copy(
                                color = Color.Gray,
                                letterSpacing = 3.sp
                            ),
                            modifier = Modifier.padding(start = 24.dp, top = 4.dp)
                        )
                    }
                }

                // Main Local Risk Card
                val primaryRisk = uiState.risks.firstOrNull()
                if (primaryRisk != null) {
                    item {
                        SentinelCard(topAccentColor = CitizenPrimary) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        "LOCAL RISK ORB",
                                        style = MaterialTheme.typography.labelMedium.copy(color = Color.Gray)
                                    )
                                    Spacer(Modifier.height(4.dp))
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        RiskBadge(primaryRisk.level)
                                        Spacer(Modifier.width(8.dp))
                                        Text(
                                            "${primaryRisk.confidence}% CONFIDENCE",
                                            style = MaterialTheme.typography.labelMedium.copy(color = Color.Gray.copy(alpha = 0.6f))
                                        )
                                    }
                                    Spacer(Modifier.height(20.dp))
                                    Row(verticalAlignment = Alignment.Bottom) {
                                        Text(
                                            primaryRisk.riskScore.toString(),
                                            style = MaterialTheme.typography.displayLarge.copy(fontSize = 64.sp)
                                        )
                                        Column(Modifier.padding(start = 8.dp, bottom = 8.dp)) {
                                            Text(
                                                "SCORE",
                                                style = MaterialTheme.typography.labelMedium.copy(color = Color.Gray)
                                            )
                                            Text(
                                                "LIVE_FEED",
                                                style = MaterialTheme.typography.labelSmall.copy(
                                                    color = CitizenPrimary,
                                                    fontWeight = FontWeight.Bold
                                                )
                                            )
                                        }
                                    }
                                }
                                RiskOrb(
                                    score = primaryRisk.riskScore,
                                    level = primaryRisk.level,
                                    modifier = Modifier.size(100.dp)
                                )
                            }
                            
                            Spacer(Modifier.height(16.dp))
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0xFFF1F5F9), RoundedCornerShape(16.dp))
                                    .padding(16.dp)
                            ) {
                                Text(
                                    text = "\"${primaryRisk.explanation}\"",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        fontStyle = FontStyle.Italic,
                                        color = Color.DarkGray
                                    )
                                )
                            }
                            
                            Spacer(Modifier.height(16.dp))
                            ScoreMeter(primaryRisk.riskScore, primaryRisk.level)
                        }
                    }

                    // Environmental Pulse Card
                    item {
                        SentinelCard {
                            Text(
                                "ENVIRONMENTAL PULSE",
                                style = MaterialTheme.typography.labelMedium.copy(color = Color.Gray)
                            )
                            Spacer(Modifier.height(20.dp))
                            Row(modifier = Modifier.fillMaxWidth()) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        "AIR_TEMP",
                                        style = MaterialTheme.typography.labelMedium.copy(color = Color.Gray)
                                    )
                                    Text(
                                        "${primaryRisk.zone.temperatureC?.toInt()}°C",
                                        style = MaterialTheme.typography.headlineMedium
                                    )
                                }
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        "HUMIDITY",
                                        style = MaterialTheme.typography.labelMedium.copy(color = Color.Gray)
                                    )
                                    Text(
                                        "${primaryRisk.zone.humidityPct?.toInt()}%",
                                        style = MaterialTheme.typography.headlineMedium
                                    )
                                }
                            }
                            Spacer(Modifier.height(20.dp))
                            HorizontalDivider(color = BorderColor.copy(alpha = 0.5f))
                            Spacer(Modifier.height(20.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Info, contentDescription = null, tint = CitizenPrimary, modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(8.dp))
                                Text(
                                    "24H_FORECAST",
                                    style = MaterialTheme.typography.labelMedium.copy(color = Color.Gray)
                                )
                                Spacer(Modifier.weight(1f))
                                Surface(
                                    color = CitizenPrimary.copy(alpha = 0.1f),
                                    shape = RoundedCornerShape(8.dp),
                                    modifier = Modifier.border(1.dp, CitizenPrimary.copy(alpha = 0.2f), RoundedCornerShape(8.dp))
                                ) {
                                    Text(
                                        "${primaryRisk.predictedRiskScore} PTS",
                                        style = MaterialTheme.typography.labelMedium.copy(color = CitizenPrimary),
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }
                        }
                    }
                }

                // Nearby Hazards / Protocols sections can go here...
                item {
                    SentinelCard(topAccentColor = RiskHigh) {
                         Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Warning, contentDescription = null, tint = RiskHigh)
                            Spacer(Modifier.width(12.dp))
                            Text(
                                "ALERT PROTOCOLS",
                                style = MaterialTheme.typography.labelMedium.copy(color = Color.Black)
                            )
                         }
                         Spacer(Modifier.height(16.dp))
                         Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                             ProtocolItem("Heat Warning [ACT-01]", "Peak load forecast at 14:00. Activation of cool-roof protocols recommended.")
                             ProtocolItem("Zone_Health Update", "Vegetation density improved by 4% in Sector 2.")
                         }
                    }
                }
            }
        }
    }
}

@Composable
fun ProtocolItem(title: String, body: String) {
    Surface(
        color = Color(0xFFFEF2F2),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier.border(1.dp, RiskHigh.copy(alpha = 0.1f), RoundedCornerShape(16.dp))
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(title, style = MaterialTheme.typography.labelMedium.copy(color = RiskHigh))
            Text(body, style = MaterialTheme.typography.bodySmall)
        }
    }
}
