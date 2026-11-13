# UrbanSense AI — Urban Risk Intelligence & Intervention Decision-Support Platform

UrbanSense AI is an explainable, confidence-aware, and region-adaptive urban environmental risk intelligence platform designed for urban analysts and city administrators.

## 1. Core Problem & Value Proposition

**Subproblem Statement**:

> “To observe, analyse, and predict urban environmental patterns to identify risk-prone areas and prioritise timely interventions.”

UrbanSense AI transforms raw environmental data into a transparent, actionable decision-support workflow:
$$\text{OBSERVE} \longrightarrow \text{VALIDATE} \longrightarrow \text{ANALYSE} \longrightarrow \text{ASSESS} \longrightarrow \text{EXPLAIN} \longrightarrow \text{IDENTIFY} \longrightarrow \text{PRIORITISE} \longrightarrow \text{RECOMMEND}$$

Primary Use Case: **Urban Heat Risk** (Pune Metropolitan Area demo dataset with 14-day history).

---

## 2. Platform Navigation & Roles

UrbanSense AI strictly implements **Two Roles**:

### 1. Urban Analyst (`analyst@urbansense.ai`)

- **Overview**: Executive city-wide thermal status, Data Quality, Reliability Score, and Top Priority Zone.
- **Risk Map**: Interactive Leaflet + OpenStreetMap spatial map with risk markers, confidence sliders, and side drawer.
- **Zone Analysis**: Environmental drivers, natural language explainability, "Path to Lower Risk" calculator, and Consistency Check.
- **Priority**: City-level priority ranking, "Temperature-Only vs UrbanSense Priority" comparison, and Priority Robustness Check.
- **Recommendations**: Factor-driven intervention directives and the greedy "Intervention Planner".

### 2. Administrator (`admin@urbansense.ai`)

- **System Overview**: Active dataset, regional calibration status, weather connection, and model pipeline health.
- **Data Management**: CSV dataset upload, schema validation (`zone_id`, `zone_name`, `temperature`, `humidity`, `rainfall`, `vegetation_coverage`, `built_up_density`, `population_exposure`, `historical_heat_events`, `vulnerability_score`), null detection, data quality calculation, and dataset activation.
- **Regional Settings**: Independent configuration of Risk Weights (temperature threshold, built-up, vegetation, humidity) and Priority Weights (severity, exposure, frequency, vulnerability, reliability).
- **Model Configuration**: Read-only model specifications, versioning (`v1.0.4`), input feature pipeline, and academic limitations.

---

## 3. 3-Minute Demo Presentation Script

### ⏱️ Minute 0:00 – 1:00: Urban Analyst Journey

1. **Landing Page**: Start at `http://localhost:8080/`. Highlight the 6-stage pipeline: _Observe → Validate → Analyse → Assess → Explain → Prioritise → Recommend_.
2. **Analyst Overview**: Click _"Explore Analyst Workspace"_. Point out the 4 core KPIs: **Overall Heat Risk** (`HIGH`), **Data Quality Score** (`91%`), **Prediction Reliability** (`87%`), and **Top Priority Zone** (`Shivaji Industrial Belt`).
3. **Interactive Risk Map**: Open `/map`. Click the `[ USE MY LOCATION ]` button to demonstrate browser geolocation and accuracy circle. Select a red/critical zone marker to open the side drawer showing risk drivers and action directives.

### ⏱️ Minute 1:00 – 2:00: Explainability & New Differentiators

4. **Path to Lower Risk**: Scroll to the counterfactual calculator. Show how increasing vegetation by $+28\%$ or reducing built-up density by $-24\%$ is projected to drop the zone from `HIGH` to `MODERATE` risk.
5. **Intervention Planner**: Move to the planner card. Adjust the resource constraint slider (e.g. $N=3$ zones) to demonstrate greedy population coverage optimization ($228,000$ residents covered).
6. **Temperature vs. Priority Comparison**: Highlight the comparative table showing why sorting by temperature alone is insufficient compared to multi-criteria priority scoring.

### ⏱️ Minute 2:00 – 3:00: Administrator Journey

7. **Admin Quick Switch**: Click **`[ Admin ]`** in the top header to enter the Administrator Portal.
8. **Data Management**: Go to the **Data Mgmt** tab. Upload `zones.csv`, show the automated column validation report, missing value check, and click **Activate Verified Dataset**.
9. **Admin Change History**: Show how weight and dataset changes are recorded in the Admin Change History log.

---

## 4. Test Accounts (Prototype Mode)

For development and demonstration testing:

- **Urban Analyst**: `analyst@urbansense.ai` / `demo1234`
- **Administrator**: `admin@urbansense.ai` / `demo1234`

_Note: Active dataset selection, regional weights, and user session state are persisted in client-side `localStorage` behind SSR-safe helper utilities._

---

## 5. Academic Foundation & Research Gap

Based on research by **Shahfahad et al. (2026)** (_Predicting surface urban heat island intensity and its drivers using machine learning and spatial XAI for achieving SDG-11_).

UrbanSense AI extends the research by adding:

1. **Data Validation & Quality Scoring** (Completeness, Consistency, Validity, Availability).
2. **Regional Calibration** (Adjustable temperature thresholds and land-use factors).
3. **Transparent Reliability Scoring** (Heuristic 50–95% score based on data completeness, stability, and input availability).
4. **City-Level Priority Ranking** (Multi-criteria formula considering risk severity, population exposure, historical frequency, and vulnerability).
5. **Actionable Intervention Support** (Factor-linked recommendations and greedy resource planning).

---

## 6. Development & Deployment

### Run Locally

```sh
npm install
npm run dev
```

### Build for Production

```sh
npm run build
```

This produces a standalone SSR server in `.output/server/index.mjs`.
