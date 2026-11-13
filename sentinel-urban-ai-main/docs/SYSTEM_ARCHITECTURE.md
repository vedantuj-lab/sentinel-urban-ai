# System Architecture — UrbanSense AI

UrbanSense AI is a full-stack urban climate intelligence and heat-risk decision-support platform designed for urban analysts and municipal administrators.

---

## 1. System Layers & Technologies

- **Frontend Application Layer:**
  - React 19 (`react`, `react-dom`)
  - TanStack Router (`@tanstack/react-router`)
  - TailwindCSS 4 + Lucide Icons
  - Leaflet GIS Maps (`react-leaflet`, `leaflet`)
  - Web Speech API (`SpeechRecognition`, `SpeechSynthesisUtterance`)
  - Framer Motion

- **Data Orchestration & Telemetry Services:**
  - `LocationService`: Open-Meteo Geocoding API (`geocoding-api.open-meteo.com`)
  - `AssistantService`: Open-Meteo Forecast API (`api.open-meteo.com`) + Pune SUHI Dataset v1.0.4
  - `DocumentParserService`: CSV, PDF, and DOCX document parser

- **Backend & Persistence Layer:**
  - Nitro / H3 server handlers (`/api/*`)
  - `JsonDb` repository pattern (`src/backend/JsonDb.ts`)
  - LocalStorage SSR-safe state fallback

---

## 2. Authenticated Roles & Security

1. **Administrator (`admin@urbansense.ai`)**:
   - System Overview, Data Management, Model Configuration, System Operations, User Management, Settings.
2. **Urban Analyst (`analyst@urbansense.ai`)**:
   - Overview, Heat Risk Map, Zone Analysis (Mode A & Mode B), Priorities & Recommendations, Intervention Planner, Scenarios.
