# UrbanSense AI — Urban Risk Intelligence & Intervention Decision-Support Platform

UrbanSense AI is an explainable, confidence-aware, and region-adaptive urban environmental risk intelligence platform designed for urban analysts and city administrators, complete with a multilingual AI Copilot and Android mobile app.

## 1. Core Problem & Value Proposition

UrbanSense AI transforms raw environmental data into a transparent, actionable decision-support workflow:
$$\text{OBSERVE} \longrightarrow \text{VALIDATE} \longrightarrow \text{ANALYSE} \longrightarrow \text{ASSESS} \longrightarrow \text{EXPLAIN} \longrightarrow \text{IDENTIFY} \longrightarrow \text{PRIORITISE} \longrightarrow \text{RECOMMEND}$$

- **Primary Use Case**: Urban Heat Risk & Environmental Resilience (Pune & Mumbai Metropolitan Region demo dataset with multi-ward organic boundaries).
- **Multilingual AI Copilot**: Fully integrated conversational assistant supporting English (`en-IN`), Hindi (`hi-IN`), and Marathi (`mr-IN`) with speech recognition, Devanagari transcription, and live Open-Meteo weather telemetry.
- **Geographic Precision**: Advanced Indian regional geocoding with priority filters ensuring correct location resolution (e.g., resolving "Mira Road" to Thane district, Maharashtra, India).

---

## 2. Platform Navigation & Roles

UrbanSense AI strictly implements **Two Roles**:

### 1. Urban Analyst (`analyst@urbansense.ai`)
- Executive thermal status, data quality, reliability scores, and priority zones.
- Interactive Leaflet spatial map with organic multi-vertex ward polygon geometries.
- Zone analysis, counterfactual risk reduction calculators, and multi-criteria priority rankings.

### 2. Administrator (`admin@urbansense.ai`)
- Dataset management, CSV validation, regional weighting calibration, and model pipeline configuration.

---

## 3. Local Development & Deployment

### Run Development Server
```sh
npm install
npm run dev
```

### Run Production Server
```sh
npm run build
node web_server.mjs
```
The production server runs persistently on `http://localhost:3000` (or `http://localhost:8080`).
