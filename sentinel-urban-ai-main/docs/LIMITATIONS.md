# UrbanSense AI — Platform Limitations & Disclosures

1. **Spatial Resolution**:
   - Risk scoring is calculated at administrative ward level (~1–4 km²), designed for municipal resource prioritization rather than building-level micro-siting.

2. **Data & Telemetry Limitations**:
   - Demo dataset uses simulated baseline inputs calibrated to Pune geography.
   - Live weather uses Open-Meteo REST API centroids without physical IoT sensor hardware.

3. **Heuristic Reliability Indicator**:
   - The Reliability Score (50–95%) is a heuristic quality indicator combining completeness and stability, NOT a statistical probability distribution.

4. **Consistency Check Scope**:
   - The Spatial Consistency Check demonstrates agreement with satellite LST proxies but does not replace full meteorological sensor calibration.

5. **Decision Support Boundary**:
   - Recommendations are conditional planning options. UrbanSense AI does not physically execute interventions or guarantee microclimate temperature reductions.
