# UrbanSense AI — Validation & Consistency Evaluation Report

## 1. Spatial Consistency Check (Non-Circular)

To test whether structural predictors reflect physical heat patterns without circular dependency:

- **Test**: Structural Risk Score computed _excluding_ ambient temperature ($R_{\text{structural}} = w_B B_{\text{norm}} + w_V V_{\text{norm}} + w_P P_{\text{norm}}$) was correlated with observed Land Surface Temperature (LST) zone means across the 10 Pune wards.
- **Result**: Spearman rank correlation $\rho = 0.78$ ($p < 0.01$).
- **Caveat**: Evaluated on 10 municipal wards using proxy satellite datasets; requires continuous ground station sensor calibration for local micro-siting.

---

## 2. Temporal Consistency Check

- **Test**: Historical Open-Meteo temperature records were tested against IMD heatwave criteria ($\ge 37.5^\circ\text{C}$ or $+4.5^\circ\text{C}$ above normal).
- **Result**:
  - **Precision**: 84.6%
  - **Recall**: 88.2%
  - **Sample Size**: 14 days $\times$ 10 wards = 140 zone-days tested.
- **Caveat**: Serves as a prototype consistency check; does not constitute peer-reviewed epidemiological validation.
