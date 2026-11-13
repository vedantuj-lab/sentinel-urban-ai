# UrbanSense AI — Urban Risk Intelligence & Intervention Decision-Support Platform

UrbanSense AI is an explainable, confidence-aware, and region-adaptive urban environmental risk intelligence platform designed for urban analysts and city administrators, complete with a multilingual AI Copilot and Android mobile app.

## 🚀 Quick Start

```sh
git clone https://github.com/vedantuj-lab/sentinel-urban-ai.git
cd sentinel-urban-ai/sentinel-urban-ai-main
npm install
npm run build
node web_server.mjs
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

## ✨ Key Features
- **Multilingual AI Copilot**: English (`en-IN`), Hindi (`hi-IN`), and Marathi (`mr-IN`) voice & text assistant with Devanagari transcription.
- **Precise Indian Geocoding**: Accurate resolution for Mira Road, Bhayandar, Thane, Mumbai, Pune, and regional wards.
- **Organic GIS Ward Polygons**: Precise multi-vertex ward boundaries (`puneGeoJSON.ts`) for accurate heat-risk overlay mapping.
- **Role-Based Workspaces**: Tailored dashboards for Urban Analysts and City Administrators.
- **Android Companion App**: Native Jetpack Compose mobile client for field observations and risk assessments.
