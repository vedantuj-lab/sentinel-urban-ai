package ai.urbansense.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ai.urbansense.ui.theme.*

@Composable
fun RiskBadge(level: String, modifier: Modifier = Modifier) {
    val color = when (level.lowercase()) {
        "critical" -> RiskCritical
        "high" -> RiskHigh
        "medium" -> RiskMedium
        else -> RiskLow
    }

    Box(
        modifier = modifier
            .background(color = color.copy(alpha = 0.1f), shape = RoundedCornerShape(12.dp))
            .border(width = 1.dp, color = color.copy(alpha = 0.3f), shape = RoundedCornerShape(12.dp))
            .padding(horizontal = 12.dp, vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = level.uppercase(),
            color = color,
            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Black)
        )
    }
}

@Composable
fun ScoreMeter(score: Int, level: String, modifier: Modifier = Modifier) {
    val color = when (level.lowercase()) {
        "critical" -> RiskCritical
        "high" -> RiskHigh
        "medium" -> RiskMedium
        else -> RiskLow
    }

    Column(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "RISK TOPOGRAPHY SCORE",
                style = MaterialTheme.typography.labelMedium.copy(color = Color.Gray)
            )
            Text(
                text = "$score/100",
                style = MaterialTheme.typography.titleMedium.copy(color = color, fontWeight = FontWeight.Black)
            )
        }
        Spacer(modifier = Modifier.height(6.dp))
        LinearProgressIndicator(
            progress = score / 100f,
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp),
            color = color,
            trackColor = Color(0xFFE2E8F0)
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SentinelCard(
    modifier: Modifier = Modifier,
    topAccentColor: Color? = null,
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        onClick = onClick ?: {},
        enabled = onClick != null,
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(28.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            if (topAccentColor != null) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(4.dp)
                        .background(topAccentColor)
                )
            }
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp)
            ) {
                content()
            }
        }
    }
}

@androidx.compose.ui.tooling.preview.Preview(showBackground = true)
@Composable
fun SentinelCardPreview() {
    UrbanSenseAITheme {
        SentinelCard(topAccentColor = CitizenPrimary) {
            RiskBadge(level = "critical")
            Spacer(modifier = Modifier.height(12.dp))
            ScoreMeter(score = 88, level = "critical")
        }
    }
}
