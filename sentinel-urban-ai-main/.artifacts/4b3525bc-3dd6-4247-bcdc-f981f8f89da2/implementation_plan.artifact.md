# Implementation Plan - Phase 2: Role-Based Intelligence Integration

Expand the newly implemented intelligence features (Data Quality, XAI, Priority Engine) across all user roles: City Administrator and Field Officer.

## User Review Required

> [!IMPORTANT]
> This update will synchronize the intelligence metrics across all dashboards. The Field Officer will now see _why_ their missions are prioritized, and the City Administrator will get a city-wide data quality health report.

## Proposed Changes

### City Administrator Dashboard

#### [MODIFY] [Admin Dashboard](file:///C:/Users/Vedant/Downloads/sentinel-urban-ai-main/sentinel-urban-ai-main/src/routes/admin/index.tsx)

- Add a **Data Quality Summary** KPI to the top strip.
- Update the **Priority Engine** card to use the new `priorityScore` and `priorityLevel`.
- Add a "System Trust" indicator showing the city-wide average prediction confidence.
- Ensure the "Resource Allocation" logic reflects the new prioritisation tiers.

### Field Officer Dashboard

#### [MODIFY] [Field Dashboard](file:///C:/Users/Vedant/Downloads/sentinel-urban-ai-main/sentinel-urban-ai-main/src/routes/field/index.tsx)

- Update **Mission Queue** badges to show semantic priority levels (e.g., "Critical Priority" instead of "1").
- Integrate **Explainable AI (XAI)** into the "Tactical Brief" so officers understand the risk drivers.
- Show **Prediction Confidence** in the task telemetry section.
- Add "Decision Support" framing to the intervention recommendations.

### Shared Components

#### [NEW] [DataValidationSummary.tsx](file:///C:/Users/Vedant/Downloads/sentinel-urban-ai-main/sentinel-urban-ai-main/src/components/analytics/DataValidationSummary.tsx)

- A detailed breakdown of city-wide data health (Completeness, Consistency, Outliers).

---

## Verification Plan

### Automated Tests

- Verify that `RiskService.getCityStats` includes the new confidence and quality averages.

### Manual Verification

- Login as **Administrator** and verify the "Data Quality Summary" reflects the simulated data quality.
- Login as **Field Officer** and verify that mission details include the explanation from the XAI engine.
- Verify that "Critical" priority tasks are correctly highlighted in both dashboards.
