export interface ResolvedLocation {
  name: string;
  region?: string;
  country?: string;
  latitude: number;
  longitude: number;
  population?: number;
  formattedAddress: string;
  isUserLocation?: boolean;
  distanceKm?: number;
  hasLocalHeatRiskDataset?: boolean;
}

export class LocationService {
  /**
   * Resolves any global place name, ward, city, or address using Open-Meteo Geocoding API with Indian regional priority
   */
  static async resolveLocation(query: string): Promise<ResolvedLocation | null> {
    const clean = query.trim().toLowerCase();
    if (!clean) return null;

    // 1. Check known local Indian locations map first
    const localMatch = KNOWN_LOCATIONS_MAP[clean];
    if (localMatch) {
      return {
        name: localMatch.name,
        region: localMatch.region || "Maharashtra",
        country: "India",
        latitude: localMatch.lat,
        longitude: localMatch.lng,
        formattedAddress: `${localMatch.name}, ${localMatch.region || "Maharashtra"}, India`,
        hasLocalHeatRiskDataset: localMatch.hasDataset ?? false,
      };
    }

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=10&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Geocoding API response not OK");

      const data = await res.json();
      if (data.results && data.results.length > 0) {
        // Prioritize results in India or Maharashtra
        const results: any[] = data.results;
        const indianResult = results.find(
          (r) => (r.country && r.country.toLowerCase() === "india") || (r.admin1 && r.admin1.toLowerCase().includes("maharashtra"))
        ) || results[0];

        const best = indianResult;
        const parts = [best.name, best.admin1, best.country].filter(Boolean);
        return {
          name: best.name,
          region: best.admin1 || "",
          country: best.country || "",
          latitude: best.latitude,
          longitude: best.longitude,
          population: best.population,
          formattedAddress: parts.join(", "),
          hasLocalHeatRiskDataset: /pune|shivajinagar|kothrud|aundh|hadapsar|bhawani/i.test(
            parts.join(" "),
          ),
        };
      }
    } catch (e) {
      console.warn("Geocoding service failed", e);
    }

    return null;
  }

  /**
   * Returns nearby resolvable places/wards relative to given coordinates
   */
  static async getNearbyLocations(
    latitude: number,
    longitude: number,
  ): Promise<ResolvedLocation[]> {
    const results: ResolvedLocation[] = [];

    Object.values(KNOWN_LOCATIONS_MAP).forEach((loc) => {
      const dist = LocationService.haversineDistance(latitude, longitude, loc.lat, loc.lng);
      if (dist < 50 && dist > 0.1) {
        results.push({
          name: loc.name,
          region: loc.region,
          country: "India",
          latitude: loc.lat,
          longitude: loc.lng,
          formattedAddress: `${loc.name}, ${loc.region}, India`,
          distanceKm: Math.round(dist * 10) / 10,
          hasLocalHeatRiskDataset: loc.hasDataset,
        });
      }
    });

    results.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    return results.slice(0, 5);
  }

  /**
   * Haversine formula to compute geographic distance in kilometers
   */
  static haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Requests browser geolocation permission and returns user coordinates
   */
  static async getUserCurrentLocation(): Promise<ResolvedLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Browser does not support geolocation."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          resolve({
            name: "My Current Position",
            region: "Local Geolocation",
            country: "India",
            latitude,
            longitude,
            formattedAddress: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
            isUserLocation: true,
          });
        },
        (err) => {
          reject(new Error(err.message || "Geolocation permission denied."));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    });
  }
}

const KNOWN_LOCATIONS_MAP: Record<
  string,
  { name: string; lat: number; lng: number; region: string; hasDataset?: boolean }
> = {
  "mira road": {
    name: "Mira Road",
    lat: 19.2789,
    lng: 72.8546,
    region: "Thane, Maharashtra",
  },
  bhayandar: {
    name: "Bhayandar",
    lat: 19.2904,
    lng: 72.8527,
    region: "Thane, Maharashtra",
  },
  thane: {
    name: "Thane City",
    lat: 19.2183,
    lng: 72.9781,
    region: "Maharashtra",
  },
  mumbai: {
    name: "Mumbai Metropolitan Region",
    lat: 19.076,
    lng: 72.8777,
    region: "Maharashtra",
  },
  bandra: {
    name: "Bandra West",
    lat: 19.0596,
    lng: 72.8295,
    region: "Mumbai, Maharashtra",
  },
  borivali: {
    name: "Borivali",
    lat: 19.2307,
    lng: 72.8567,
    region: "Mumbai, Maharashtra",
  },
  andheri: {
    name: "Andheri West",
    lat: 19.1197,
    lng: 72.8464,
    region: "Mumbai, Maharashtra",
  },
  "navi mumbai": {
    name: "Navi Mumbai",
    lat: 19.033,
    lng: 73.0297,
    region: "Maharashtra",
  },
  vasai: {
    name: "Vasai",
    lat: 19.3919,
    lng: 72.8397,
    region: "Palghar, Maharashtra",
  },
  virar: {
    name: "Virar",
    lat: 19.4566,
    lng: 72.8105,
    region: "Palghar, Maharashtra",
  },
  pune: {
    name: "Pune Metropolitan Region",
    lat: 18.5204,
    lng: 73.8567,
    region: "Maharashtra",
    hasDataset: true,
  },
  shivajinagar: {
    name: "Shivajinagar",
    lat: 18.5304,
    lng: 73.8467,
    region: "Pune, Maharashtra",
    hasDataset: true,
  },
  kothrud: {
    name: "Kothrud",
    lat: 18.5074,
    lng: 73.8077,
    region: "Pune, Maharashtra",
    hasDataset: true,
  },
  aundh: {
    name: "Aundh",
    lat: 18.5584,
    lng: 73.8077,
    region: "Pune, Maharashtra",
    hasDataset: true,
  },
  hadapsar: {
    name: "Hadapsar",
    lat: 18.5084,
    lng: 73.9257,
    region: "Pune, Maharashtra",
    hasDataset: true,
  },
  nashik: {
    name: "Nashik",
    lat: 19.9975,
    lng: 73.7898,
    region: "Maharashtra",
  },
};
