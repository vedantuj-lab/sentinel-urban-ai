# UrbanSense AI — Comprehensive Technical Solution Overview

UrbanSense AI is an explainable, confidence-aware, and region-adaptive urban environmental risk intelligence platform designed for urban analysts and city administrators. It combines spatial GIS mapping, automated data validation, a multilingual AI Copilot, and an Android mobile app into a unified decision-support ecosystem.

---

## 🏛️ Architecture & Solution Components

### 1. Multilingual AI Copilot & Voice Interface
- **Multilingual Support**: Fully integrated conversational assistant supporting English (`en-IN`), Hindi (`hi-IN`), and Marathi (`mr-IN`).
- **Speech-to-Text & Transcription**: Native Web Speech API integration with Devanagari script preservation and language-specific recognition.
- **Context Awareness**: Remembers active conversation context (location, selected ward, previous weather query) to handle follow-up questions seamlessly (e.g., *"What is the temperature in Mira Road?"* followed by *"What about Bhayandar?"* or *"Compare them"*).

### 2. Precise Indian Geocoding & Regional Filtering
- **Problem Solved**: Prevents incorrect international geocoding resolution (e.g., Mira Road resolving to Nova Scotia, Canada).
- **Solution**: Implements regional priority filters and a comprehensive local Indian locations database (`LocationService.ts`) ensuring correct administrative hierarchy resolution (Thane, Mumbai, Pune, Maharashtra, India).

### 3. Organic GIS Heat Risk Mapping (`puneGeoJSON.ts`)
- **Spatial Accuracy**: Replaces basic rectangular bounding boxes with organic multi-vertex ward polygons for Pune and Mumbai metropolitan wards.
- **Choropleth Visuals**: Transparent fills with subtle outlines ensuring underlying roads, landmarks, and map labels remain completely visible.

### 4. Risk Modeling & Decision-Support Engine
- **Multi-Criteria Priority Ranking**: Evaluates risk severity, population exposure, historical event frequency, vulnerability, and data reliability.
- **Counterfactual Calculator**: Provides "Path to Lower Risk" recommendations (e.g., increasing vegetation coverage or reducing built-up density to shift risk categories).
- **Intervention Planner**: Greedy resource allocation planner for municipal resource distribution.

### 5. Android Companion App (`android-app/`)
- **Native Kotlin & Jetpack Compose**: Built with modern Material 3 design, Coroutines, Flow, and Hilt dependency injection.
- **Role-Based Views**: Citizen observation reporting, field analyst intervention tracking, and secure authentication.

---

## 🚀 Quick Start & Deployment

### Run Locally
```sh
npm install
npm run build
node web_server.mjs
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.
