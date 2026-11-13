# Urban Sense AI

PHASE 1 — LOVABLE: INITIAL WEB APPLICATION

Build a modern, realistic, professional and fully responsive web application called:

UrbanSense AI — Urban Risk Intelligence & Intervention Platform

1. PROJECT PURPOSE

The application is based on the following subproblem statement:

“To observe, analyse, and predict urban environmental patterns to identify risk-prone areas and prioritise timely interventions.”

The goal is NOT to create another civic complaint management system.

Instead, create a software-only AI-powered urban intelligence platform that:

Observe → Analyse → Predict → Identify → Prioritise → Recommend Intervention

The first working demonstration should focus on Urban Heat Risk, but the architecture must be modular so that Flood Risk, Air Quality, Waste Risk and Infrastructure Risk can be added later.

Do NOT use IoT hardware, physical sensors, Arduino, Raspberry Pi, robotics or other hardware dependencies.

Use simulated/demo datasets initially.

2. TARGET USERS

Create role-based access for:

Citizen

Urban Analyst

Field Officer

City Administrator

Each role must have a different dashboard and relevant functionality.

Do not duplicate the same dashboard for every role.

3. APPLICATION STRUCTURE

Create these main pages:

Public

Landing Page

About UrbanSense AI

How It Works

Risk Intelligence

Urban Risk Map

Login

Register

Citizen

Citizen Dashboard

Local Risk Overview

Risk Map

Alerts

Recommendations

Report Observation

Profile

Urban Analyst

Analyst Dashboard

Urban Risk Analytics

Heat Risk Prediction

Pattern Analysis

Risk Hotspots

Geographic Analysis

Model Insights

Reports

Field Officer

Field Dashboard

Assigned Priority Areas

Intervention Tasks

Area Details

Task Status

Field Updates

Evidence Upload

Performance

City Administrator

Admin Dashboard

City Overview

Risk Monitoring

Priority Zones

Resource Prioritisation

Intervention Management

Analytics

Reports

User Management

System Settings

4. LANDING PAGE

Create a visually impressive but professional landing page.

Hero headline:

“See Urban Risks Before They Become Urban Problems.”

Subtitle:

“UrbanSense AI observes environmental patterns, predicts emerging risks and helps cities prioritise where action is needed first.”

Add CTA buttons:

Explore Risk Intelligence

View Urban Risk Map

Add an animated city background using a realistic urban visual.

Do NOT make the page look like a generic AI SaaS template.

Use subtle:

map animations

glowing risk zones

floating data points

city-grid effects

smooth transitions

micro-interactions

Avoid excessive animations.

5. HOW IT WORKS

Create a visual six-step workflow:

OBSERVE

ANALYSE

PREDICT

IDENTIFY

PRIORITISE

INTERVENE

For each stage show:

Input → Processing → Output

Example:

Environmental Data
↓
AI Analysis
↓
Risk Prediction
↓
Hotspot Detection
↓
Priority Ranking
↓
Recommended Intervention

Create a visually attractive process diagram.

6. URBAN RISK DASHBOARD

Create a professional command-centre style dashboard.

Top KPI cards:

Overall Urban Risk

High-Risk Zones

Active Predictions

Priority Interventions

Areas Monitored

Alerts Generated

Include:

Risk Distribution

Low / Medium / High / Critical

Environmental Trend

Temperature trend over time.

Risk Trend

Risk increase/decrease over the previous days.

Top Priority Zones

Display:

Rank
Zone
Risk Score
Population Exposure
Risk Type
Priority
Recommended Action

7. URBAN RISK MAP

This is one of the most important features.

Create a large interactive city map.

Show:

Risk hotspots

Low-risk zones

Medium-risk zones

High-risk zones

Critical zones

Each zone should display:

Zone name

Risk score

Temperature

Population exposure

Historical trend

Predicted risk

Priority level

Recommended intervention

Allow filtering by:

Risk level

Date

Risk type

Zone

Prediction confidence

Clicking a zone should open a detailed side panel.

8. URBAN HEAT PREDICTION

Create a dedicated page.

Inputs:

Historical temperature

Current temperature

Rainfall

Humidity

Land-use category

Population density

Built-up density

Vegetation coverage

Date/time

Show prediction:

Heat Risk Score

0–100

Example:

87/100 — HIGH RISK

Also show:

Prediction confidence

Risk trend

Main contributing factors

Expected risk period

9. EXPLAINABLE AI

Do NOT only display an AI prediction.

Show WHY the risk is high.

Example:

Risk Drivers:

Temperature
██████████ 32%

Built-up Density
████████ 25%

Low Vegetation
██████ 18%

Population Density
█████ 15%

Historical Heat Pattern
███ 10%

Create a visually clear explainability section.

10. PRIORITY ENGINE

This is the key differentiating feature.

Do not simply rank areas according to temperature.

Calculate a conceptual priority score using:

Risk Severity
+
Population Exposure
+
Historical Frequency
+
Prediction Confidence
+
Vulnerability

Generate:

Priority 1
Priority 2
Priority 3
...

Example:

Priority 1 — Zone A

Risk: 91
Population Exposure: High
Historical Frequency: High
Priority: CRITICAL

Recommended Action:

“Prioritise heat mitigation measures and issue a local heat advisory.”

11. INTERVENTION RECOMMENDATION

For every high-risk area provide recommendations.

Example:

High Heat Risk

Possible actions:

Increase shaded public areas

Prioritise tree-cover planning

Issue heat alerts

Prioritise vulnerable population zones

Schedule field inspection

Important:

The system should provide recommendations, NOT claim that it has physically performed them.

12. CITIZEN FEATURES

Citizen Dashboard should show:

Current local risk

Today's risk

Tomorrow's predicted risk

Nearby hotspots

Alerts

Safety recommendations

Risk map

Add:

Report Observation

Citizen can submit:

Location

Risk category

Description

Image

Date/time

This is NOT the primary complaint system.

It should be treated as an optional data source for urban intelligence.

13. FIELD OFFICER

Field officers should see:

Priority Work Queue

Task
Area
Risk
Priority
Deadline
Status

Allow:

Accept task

Start task

Update status

Upload evidence

Add notes

Mark completed

Use statuses:

Pending
Assigned
In Progress
Verification
Completed

14. ADMIN

Admin should see:

City Command Centre

Show:

City risk score

Active hotspots

Priority zones

Open interventions

Completed interventions

Environmental trends

Alert statistics

Add resource prioritisation.

Example:

Zone A → High risk → Allocate 30% resources
Zone B → Medium risk → Allocate 20%
Zone C → Low risk → Monitor

15. REPORTS

Create a Reports section.

Generate reports containing:

Risk summary

Top hotspots

Environmental trends

Prediction results

Priority areas

Recommended interventions

Intervention status

Include:

Download PDF
Export CSV

Initially these can use demo data.

16. DATA

Create realistic mock data for:

At least 10 urban zones.

Each zone should contain:

Zone ID

Zone name

Latitude

Longitude

Temperature

Humidity

Rainfall

Vegetation coverage

Built-up density

Population density

Historical risk

Predicted risk

Risk score

Confidence

Priority

Recommendation

Do not use fake-looking values such as 12345 or random meaningless values.

Make the demo data internally consistent.

17. DESIGN SYSTEM

Design should look like a real urban technology platform.

Style:

modern

professional

clean

premium

data-driven

realistic

accessible

Use a restrained colour system.

Risk colours:

Low → green
Medium → yellow/orange
High → orange/red
Critical → deep red

Do not use excessive gradients.

Use:

cards

maps

charts

tables

status badges

side panels

timeline components

KPI cards

Every page should have a purposeful layout.

Do not make every page look identical.

18. RESPONSIVENESS

The application must work properly on:

Desktop

Laptop

Tablet

Mobile

Do not simply shrink the desktop layout.

Create proper responsive layouts.

19. AUTHENTICATION

Create working demo authentication.

Roles:

Citizen
Analyst
Field Officer
Administrator

After login, redirect users to the appropriate dashboard.

Protect role-specific routes.

20. IMPORTANT UX REQUIREMENTS

Every button must perform a meaningful action.

Do NOT create dead buttons.

Every page must have:

loading state

empty state

error state

success feedback

Forms must have validation.

Use realistic demo data.

No broken links.

No placeholder “Coming Soon” features unless absolutely necessary.

21. TECHNICAL ARCHITECTURE

Use a modular architecture.

Separate:

UI
Data
Authentication
Risk Engine
Prediction Layer
Recommendation Engine
Map Layer
Analytics
Reports

Do not hard-code everything inside UI components.

Create reusable components.

Prepare the project for future API/backend integration.

22. IMPORTANT FUTURE EXTENSIBILITY

The system must eventually support:

Urban Heat
Flood Risk
Air Quality
Waste Risk
Infrastructure Risk

Create a generic concept:

RiskType

so additional risk models can be plugged in later.

For now:

DEFAULT RISK TYPE = URBAN HEAT

23. FINAL REQUIREMENT

Build the initial application as a realistic working prototype.

Do NOT overcomplicate it.

Prioritise:

Working navigation

Excellent UI/UX

Urban risk map

Risk dashboard

Heat-risk prediction demonstration

Priority engine

Explainable AI

Intervention recommendations

Role-based dashboards

Responsive design

The final result should look like a real software product that could be demonstrated to an Idea Lab evaluation panel.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sentinel-urban-ai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e1a0623f-2baf-41a0-9a30-1ab8357fcded).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
