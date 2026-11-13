package ai.urbansense.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import ai.urbansense.ui.theme.*

@Composable
fun RiskOrb(
    score: Int,
    level: String,
    modifier: Modifier = Modifier
) {
    val baseColor = when (level.lowercase()) {
        "critical" -> RiskCritical
        "high" -> RiskHigh
        "medium" -> RiskMedium
        else -> RiskLow
    }

    val infiniteTransition = rememberInfiniteTransition(label = "orb_pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.85f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    Box(modifier = modifier.size(120.dp)) {
        Canvas(modifier = Modifier.size(120.dp)) {
            val center = this.center
            val radius = size.minDimension / 2

            // Draw glowing outer ring
            drawCircle(
                color = baseColor.copy(alpha = 0.15f),
                radius = radius * pulseScale,
                center = center
            )

            // Draw second decorative stroke ring
            drawCircle(
                color = baseColor.copy(alpha = 0.35f),
                radius = radius * 0.8f,
                center = center,
                style = Stroke(width = 2.dp.toPx())
            )

            // Draw inner rich gradient circle representing the living data state
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(baseColor, baseColor.copy(alpha = 0.6f)),
                    center = center,
                    radius = radius * 0.65f
                    ),
                radius = radius * 0.65f,
                center = center
            )
        }
    }
}

@androidx.compose.ui.tooling.preview.Preview(showBackground = true)
@Composable
fun RiskOrbPreview() {
    UrbanSenseAITheme {
        RiskOrb(score = 88, level = "critical")
    }
}
