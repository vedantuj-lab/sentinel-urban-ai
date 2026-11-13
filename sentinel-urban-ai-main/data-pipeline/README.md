# UrbanSense AI — Offline Data Pipeline

This directory contains the offline data ingestion script for extracting ward-level environmental metrics from public GIS datasets.

## Pipeline Inputs

1. **Landsat 8/9 Thermal Band (LST)**: Zone mean land surface temperature.
2. **Sentinel-2 NDVI**: Vegetation canopy cover %.
3. **GHSL Built-Up Grid**: Impermeable built surface density %.
4. **WorldPop 2020**: Ward population density.
5. **OpenStreetMap Boundaries**: Pune ward polygon GeoJSON.

## Output

Generates `zones.csv` with schema matching `docs/DATA_DICTIONARY.md`.

## Execution

```sh
python extract_ward_metrics.py --geojson pune_wards.geojson --output zones.csv
```

_(Note: Pipeline is run offline to generate baseline CSV files; the web application ingests the processed CSV via the Data Management tab)._
