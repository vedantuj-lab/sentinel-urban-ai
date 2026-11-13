package ai.urbansense.ui.field

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Star
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
import ai.urbansense.data.model.InterventionDto
import ai.urbansense.ui.components.SentinelCard
import ai.urbansense.ui.theme.*
import ai.urbansense.viewmodel.FieldViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FieldDashboard(
    onInterventionClick: (String) -> Unit,
    viewModel: FieldViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        containerColor = Color(0xFFF8FAFC),
        topBar = {
            TopAppBar(
                title = { 
                    Text(
                        "Field Operations Center", 
                        style = MaterialTheme.typography.labelLarge.copy(color = FieldPrimary)
                    ) 
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        }
    ) { padding ->
        if (uiState.isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = FieldPrimary)
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .padding(padding)
                    .fillMaxSize(),
                contentPadding = PaddingValues(20.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                item {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(width = 8.dp, height = 36.dp)
                                    .background(FieldPrimary, RoundedCornerShape(4.dp))
                            )
                            Spacer(Modifier.width(16.dp))
                            Text(
                                "Mission Queue",
                                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black)
                            )
                        }
                        Text(
                            "TACTICAL DISPATCH AND RISK LOGISTICS",
                            style = MaterialTheme.typography.labelMedium.copy(
                                color = Color.Gray,
                                letterSpacing = 2.sp
                            ),
                            modifier = Modifier.padding(start = 24.dp, top = 4.dp)
                        )
                    }
                }

                items(uiState.interventions) { intervention ->
                    FieldInterventionCard(
                        intervention = intervention,
                        onStatusUpdate = { viewModel.updateStatus(intervention.id, it) },
                        onClick = { onInterventionClick(intervention.id) }
                    )
                }
            }
        }
    }
}

@Composable
fun FieldInterventionCard(
    intervention: InterventionDto,
    onStatusUpdate: (String) -> Unit,
    onClick: () -> Unit
) {
    val priorityAccent = when (intervention.priorityLevel?.lowercase()) {
        "critical" -> RiskCritical
        "high" -> RiskHigh
        "medium" -> RiskMedium
        else -> RiskLow
    }

    SentinelCard(topAccentColor = priorityAccent) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .background(priorityAccent.copy(alpha = 0.1f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        "${intervention.priorityLevel?.uppercase() ?: "HIGH"} PRIORITY",
                        color = priorityAccent,
                        style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Black)
                    )
                }
                Text(
                    "ID: ${intervention.id}",
                    style = MaterialTheme.typography.labelSmall.copy(color = Color.Gray)
                )
            }
            
            Spacer(Modifier.height(12.dp))
            
            Text(
                text = intervention.title.uppercase(),
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black)
            )
            
            Text(
                text = "ETD / DEADLINE: ${intervention.deadline}",
                style = MaterialTheme.typography.labelMedium.copy(color = Color.Gray)
            )
            
            Spacer(Modifier.height(16.dp))
            
            // Tactical Brief section embedded for immediate access parity
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFF1F5F9), RoundedCornerShape(16.dp))
                    .padding(16.dp)
            ) {
                Column {
                    Text(
                        "TACTICAL BRIEF",
                        style = MaterialTheme.typography.labelSmall.copy(color = FieldPrimary, fontWeight = FontWeight.Bold)
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        text = "\"${intervention.explanation}\"",
                        style = MaterialTheme.typography.bodySmall.copy(fontStyle = FontStyle.Italic, color = Color.DarkGray)
                    )
                }
            }
            
            Spacer(Modifier.height(16.dp))
            Text(
                "DIRECTIVE CHAIN",
                style = MaterialTheme.typography.labelSmall.copy(color = Color.Gray, fontWeight = FontWeight.Bold)
            )
            Spacer(Modifier.height(6.dp))
            intervention.actions?.forEachIndexed { index, action ->
                Row(
                    modifier = Modifier.padding(vertical = 4.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Text(
                        text = "${index + 1}. ",
                        style = MaterialTheme.typography.bodySmall.copy(color = FieldPrimary, fontWeight = FontWeight.Bold)
                    )
                    Text(
                        text = action,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
            
            Spacer(Modifier.height(24.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = { onStatusUpdate("in_progress") },
                    enabled = intervention.status == "pending",
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = FieldPrimary),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.PlayArrow, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("START", style = MaterialTheme.typography.labelMedium)
                }
                
                Button(
                    onClick = { onStatusUpdate("completed") },
                    enabled = intervention.status == "in_progress",
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("COMPLETE", style = MaterialTheme.typography.labelMedium)
                }
            }
        }
    }
}
