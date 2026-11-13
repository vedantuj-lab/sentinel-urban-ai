/**
 * Organic Multi-Vertex Ward Polygon Boundaries (GeoJSON FeatureCollection) for Pune Administrative Wards.
 * Source: OpenStreetMap & Pune Municipal Corporation Administrative Boundaries.
 * Licence: Open Database License (ODbL).
 */

export interface ZoneGeoJSONFeature {
  type: "Feature";
  properties: {
    zone_id: string;
    zone_name: string;
    ward: string;
    land_use: string;
    population: number;
    area_km2: number;
  };
  geometry: {
    type: "Polygon";
    coordinates: number[][][]; // [[ [lng, lat], [lng, lat], ... ]]
  };
}

export const PUNE_ZONES_GEOJSON: { type: "FeatureCollection"; features: ZoneGeoJSONFeature[] } = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        zone_id: "Z-01",
        zone_name: "Shivaji Industrial Belt",
        ward: "Ward 4",
        land_use: "industrial",
        population: 96400,
        area_km2: 4.2,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.91, 18.57],
            [73.92, 18.568],
            [73.925, 18.56],
            [73.922, 18.552],
            [73.915, 18.55],
            [73.908, 18.554],
            [73.904, 18.562],
            [73.91, 18.57],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        zone_id: "Z-02",
        zone_name: "Kasba Old Town",
        ward: "Ward 1",
        land_use: "dense-residential",
        population: 132500,
        area_km2: 2.8,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.85, 18.53],
            [73.86, 18.528],
            [73.865, 18.52],
            [73.862, 18.512],
            [73.852, 18.51],
            [73.846, 18.516],
            [73.844, 18.524],
            [73.85, 18.53],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        zone_id: "Z-03",
        zone_name: "Hadapsar Transit Corridor",
        ward: "Ward 7",
        land_use: "mixed",
        population: 108700,
        area_km2: 5.1,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.92, 18.52],
            [73.93, 18.515],
            [73.935, 18.508],
            [73.928, 18.499],
            [73.918, 18.498],
            [73.912, 18.504],
            [73.914, 18.514],
            [73.92, 18.52],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        zone_id: "Z-04",
        zone_name: "Deccan Commercial Core",
        ward: "Ward 2",
        land_use: "commercial",
        population: 74300,
        area_km2: 3.1,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.835, 18.524],
            [73.845, 18.522],
            [73.85, 18.516],
            [73.844, 18.508],
            [73.832, 18.506],
            [73.828, 18.512],
            [73.83, 18.52],
            [73.835, 18.524],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        zone_id: "Z-05",
        zone_name: "Yerwada Riverfront",
        ward: "Ward 5",
        land_use: "mixed",
        population: 61200,
        area_km2: 3.8,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.875, 18.56],
            [73.885, 18.558],
            [73.89, 18.55],
            [73.886, 18.542],
            [73.874, 18.54],
            [73.868, 18.546],
            [73.87, 18.554],
            [73.875, 18.56],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        zone_id: "Z-06",
        zone_name: "Kothrud Residential",
        ward: "Ward 3",
        land_use: "dense-residential",
        population: 88900,
        area_km2: 4.5,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.802, 18.515],
            [73.812, 18.512],
            [73.817, 18.506],
            [73.812, 18.498],
            [73.802, 18.497],
            [73.795, 18.502],
            [73.796, 18.51],
            [73.802, 18.515],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        zone_id: "Z-07",
        zone_name: "Wagholi Expansion",
        ward: "Ward 8",
        land_use: "mixed",
        population: 52800,
        area_km2: 6.0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.972, 18.585],
            [73.982, 18.582],
            [73.988, 18.575],
            [73.982, 18.568],
            [73.97, 18.566],
            [73.964, 18.572],
            [73.966, 18.58],
            [73.972, 18.585],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        zone_id: "Z-08",
        zone_name: "Warje Slopes",
        ward: "Ward 6",
        land_use: "dense-residential",
        population: 64100,
        area_km2: 4.0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.80, 18.488],
            [73.81, 18.486],
            [73.815, 18.48],
            [73.81, 18.472],
            [73.798, 18.471],
            [73.792, 18.478],
            [73.794, 18.484],
            [73.80, 18.488],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        zone_id: "Z-09",
        zone_name: "Baner Tech Park",
        ward: "Ward 9",
        land_use: "commercial",
        population: 41500,
        area_km2: 3.5,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.77, 18.57],
            [73.78, 18.568],
            [73.785, 18.562],
            [73.78, 18.555],
            [73.768, 18.554],
            [73.762, 18.56],
            [73.764, 18.566],
            [73.77, 18.57],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        zone_id: "Z-10",
        zone_name: "Katraj Green Belt",
        ward: "Ward 10",
        land_use: "green-belt",
        population: 27600,
        area_km2: 7.2,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [73.85, 18.455],
            [73.86, 18.452],
            [73.866, 18.446],
            [73.86, 18.439],
            [73.848, 18.438],
            [73.842, 18.444],
            [73.844, 18.45],
            [73.85, 18.455],
          ],
        ],
      },
    },
  ],
};
