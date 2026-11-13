package ai.urbansense.ui.field

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import ai.urbansense.viewmodel.FieldViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InterventionDetailsScreen(
    interventionId: String,
    onBack: () -> Unit,
    viewModel: FieldViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val intervention = uiState.interventions.find { it.id == interventionId }
    
    var notes by remember { mutableStateOf("") }
    var evidenceUri by remember { mutableStateOf<Uri?>(null) }
    val snackbarHostState = remember { SnackbarHostState() }

    val evidencePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        evidenceUri = uri
    }
    
    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            TopAppBar(
                title = { Text("Task Details") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        if (intervention == null) {
            Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                Text("Intervention not found")
            }
        } else {
            Column(
                modifier = Modifier
                    .padding(padding)
                    .padding(16.dp)
                    .fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp)) {
                        Text(intervention.title, style = MaterialTheme.typography.headlineSmall)
                        Spacer(Modifier.height(8.dp))
                        Text("Status: ${intervention.status.uppercase()}", style = MaterialTheme.typography.bodyLarge)
                        Text("Priority Rank: Priority ${intervention.priority}", style = MaterialTheme.typography.bodyMedium)
                        Text("Deadline: ${intervention.deadline}", style = MaterialTheme.typography.bodyMedium)
                    }
                }
                
                Text("Field Evidence & Notes", style = MaterialTheme.typography.titleMedium)
                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    label = { Text("Enter observations from site...") },
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 4
                )

                // Field Evidence Upload Section
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                    )
                ) {
                    Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Photo Evidence", style = MaterialTheme.typography.titleSmall)
                        if (evidenceUri != null) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    "Attached: ${evidenceUri?.lastPathSegment ?: "evidence.jpg"}",
                                    style = MaterialTheme.typography.bodyMedium,
                                    maxLines = 1
                                )
                                TextButton(onClick = { evidenceUri = null }) {
                                    Text("Remove", color = MaterialTheme.colorScheme.error)
                                }
                            }
                        } else {
                            Button(
                                onClick = { evidencePickerLauncher.launch("image/*") },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = MaterialTheme.colorScheme.secondary
                                )
                            ) {
                                Text("Attach Site Photo")
                            }
                        }
                    }
                }
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = { 
                            viewModel.updateStatus(intervention.id, "in_progress")
                        },
                        modifier = Modifier.weight(1f),
                        enabled = intervention.status == "pending" || intervention.status == "Assigned"
                    ) {
                        Text("Start Task")
                    }
                    
                    Button(
                        onClick = { 
                            val finalNotes = if (evidenceUri != null) {
                                "$notes [Evidence: ${evidenceUri?.lastPathSegment}]"
                            } else {
                                notes
                            }
                            viewModel.updateInterventionWithNotes(intervention.id, "completed", finalNotes)
                            onBack()
                        },
                        modifier = Modifier.weight(1f),
                        enabled = intervention.status == "in_progress" || intervention.status == "In Progress"
                    ) {
                        Text("Complete Task")
                    }
                }
            }
        }
    }
}
