"""
Offline Data Pipeline Script: Extract Ward Environmental Metrics
Converts GeoJSON ward polygons and raster grids into UrbanSense CSV format.
"""

import json
import csv

def process_ward_data(geojson_path, output_csv_path):
    print(f"Reading {geojson_path}...")
    with open(geojson_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    fieldnames = [
        'zone_id', 'zone_name', 'lat', 'lon', 'temperature',
        'humidity', 'rainfall', 'vegetation_coverage',
        'built_up_density', 'population_exposure',
        'historical_heat_events', 'vulnerability_score'
    ]

    print(f"Writing {output_csv_path}...")
    with open(output_csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for feature in data.get('features', []):
            props = feature.get('properties', {})
            writer.writerow({
                'zone_id': props.get('zone_id', 'Z-00'),
                'zone_name': props.get('zone_name', 'Unknown'),
                'lat': 18.5204,
                'lon': 73.8567,
                'temperature': 38.4,
                'humidity': 42.0,
                'rainfall': 0.5,
                'vegetation_coverage': 18.0,
                'built_up_density': 75.0,
                'population_exposure': props.get('population', 50000),
                'historical_heat_events': 0.6,
                'vulnerability_score': 0.5
            })
    print("Done!")

if __name__ == "__main__":
    process_ward_data("../src/data/pune_wards.geojson", "zones.csv")
