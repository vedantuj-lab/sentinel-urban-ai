# UrbanSense AI — Data Dictionary

This document defines the schema, units, ranges, physical bounds, and provenance sources for all variables consumed by UrbanSense AI.

| Column Field Name        | Data Type | Units       | Physical Bounds  | Provenance Source       | Description                                                     |
| :----------------------- | :-------- | :---------- | :--------------- | :---------------------- | :-------------------------------------------------------------- |
| `zone_id`                | String    | Identifier  | N/A              | Municipal Ward Coding   | Unique administrative ward code (e.g. `Z-01`).                  |
| `zone_name`              | String    | Text        | N/A              | OpenStreetMap / PMC     | Name of the urban zone/ward sector.                             |
| `lat`                    | Float     | Degrees     | 18.0° to 19.0° N | OpenStreetMap Centroids | Latitude centroid for weather API calls.                        |
| `lon`                    | Float     | Degrees     | 73.0° to 74.5° E | OpenStreetMap Centroids | Longitude centroid for weather API calls.                       |
| `temperature`            | Float     | °C          | 20.0°C to 50.0°C | Open-Meteo API / LST    | Ambient air / land surface temperature.                         |
| `humidity`               | Float     | %           | 0.0% to 100.0%   | Open-Meteo API          | Relative humidity percentage.                                   |
| `rainfall`               | Float     | mm          | 0.0mm to 100.0mm | Open-Meteo API          | 24-hour accumulated rainfall precipitation.                     |
| `vegetation_coverage`    | Float     | %           | 0.0% to 100.0%   | Sentinel-2 NDVI Proxy   | Vegetation canopy cover percentage.                             |
| `built_up_density`       | Float     | %           | 0.0% to 100.0%   | GHSL / NDBI Proxy       | Impermeable built-up infrastructure density %.                  |
| `population_exposure`    | Integer   | Persons/km² | 0 to 50,000      | WorldPop / Census 2021  | Population density per square kilometer.                        |
| `historical_heat_events` | Float     | Days/month  | 0.0 to 1.0       | Open-Meteo 14-Day       | Share of days above 37°C threshold in 14-day record.            |
| `vulnerability_score`    | Float     | Index (0–1) | 0.0 to 1.0       | Census Proxy Index      | Socio-economic vulnerability index (share of elderly/children). |

---

## Fixed Physical Normalisation Bounds

To ensure score stability when replacing datasets, inputs are normalised using physical bounds:

- **Temperature**: $T_{\text{norm}} = \frac{T - 20}{50 - 20}$
- **Built-up Density**: $B_{\text{norm}} = \frac{\text{builtUp}}{100}$
- **Vegetation Cover**: $V_{\text{norm}} = \frac{100 - \text{vegetation}}{100}$
- **Population Density**: $P_{\text{norm}} = \frac{\text{popDensity}}{30000}$
