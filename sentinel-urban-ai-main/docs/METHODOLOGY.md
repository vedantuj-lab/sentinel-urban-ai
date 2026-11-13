# UrbanSense AI — Methodology & Formulas

## 1. Heat Index Calculation (Rothfusz Regression)

UrbanSense AI calculates heat stress using the **National Weather Service Heat Index** formula (Rothfusz regression), evaluating ambient temperature ($T$ in °F) and relative humidity ($RH$):

$$\text{HI} = -42.379 + 2.04901523 T + 10.14333127 RH - 0.22475541 T \cdot RH - 0.00683783 T^2 - 0.05481717 RH^2 + 0.00122874 T^2 RH + 0.00085282 T RH^2 - 0.00000199 T^2 RH^2$$

In Celsius equivalent, when $T \ge 27^\circ\text{C}$, heat index accounts for apparent human thermal stress.

---

## 2. Transparent Weighted Risk Model

The Risk Score ($R \in [0, 100]$) is computed using expert-assigned regional weights:

$$R = \text{clamp}\left( 100 \times \left( w_T \cdot T_{\text{norm}} + w_B \cdot B_{\text{norm}} + w_V \cdot V_{\text{norm}} + w_P \cdot P_{\text{norm}} + w_H \cdot H_{\text{norm}} + w_U \cdot U_{\text{norm}} \right) \right)$$

### Risk Bands

- **0 – 39**: `LOW`
- **40 – 59**: `MODERATE`
- **60 – 79**: `HIGH`
- **80 – 100**: `CRITICAL`

---

## 3. Heuristic Reliability Score (50 – 95%)

Reliability ($Rel$) is a heuristic quality indicator (NOT a statistical probability):

$$Rel = \text{clamp}\left( 0.40 \cdot \text{DataQuality} + 0.35 \cdot \text{Completeness} + 0.25 \cdot \text{HistoricalStability}, 50, 95 \right)$$

---

## 4. Multi-Criteria Priority Engine

The Priority Score ($P \in [0, 100]$) combines risk severity, population exposure, historical frequency, vulnerability, and a reliability tie-breaker:

$$P = \text{Severity} \cdot w_{\text{sev}} + \text{Exposure} \cdot w_{\text{exp}} + \text{Frequency} \cdot w_{\text{freq}} + \text{Vulnerability} \cdot w_{\text{vuln}} + \text{Reliability} \cdot w_{\text{rel}}$$

Default Priority Weights:

- **Severity**: 30%
- **Exposure**: 25%
- **Frequency**: 15%
- **Vulnerability**: 20%
- **Reliability**: 10%
  _(Total must equal 100%)._
