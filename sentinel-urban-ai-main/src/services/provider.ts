import { ZONES } from "@/data/mockZones";
import type { Zone, ZoneAssessment, RiskTypeId } from "@/types/risk";
import { RiskService } from "./RiskService";
import { PriorityService, DEFAULT_PRIORITY_WEIGHTS, type PriorityWeights } from "./PriorityService";
import { RegionService } from "./RegionService";

export interface LiveWeatherData {
  isLive: boolean;
  source: "Open-Meteo API" | "Demo Dataset";
  lastUpdated: string;
  currentTempC?: number;
  currentHumidityPct?: number;
  currentRainfallMm?: number;
  dailyForecast7Day?: { day: string; tempMax: number; tempMin: number }[];
}

const STORAGE_ACTIVE_DATASET_KEY = "urbansense.active_dataset";
const STORAGE_PRIORITY_WEIGHTS_KEY = "urbansense.priority_weights";

export class DataProvider {
  /**
   * SSR-safe localStorage reader
   */
  private static getStorageItem(key: string): string | null {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  }

  /**
   * SSR-safe localStorage writer
   */
  private static setStorageItem(key: string, value: string): void {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  }

  /**
   * Returns active priority weights
   */
  static getPriorityWeights(): PriorityWeights {
    const raw = this.getStorageItem(STORAGE_PRIORITY_WEIGHTS_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as PriorityWeights;
      } catch (e) {
        console.error("Failed to parse priority weights", e);
      }
    }
    return DEFAULT_PRIORITY_WEIGHTS;
  }

  /**
   * Saves updated priority weights
   */
  static savePriorityWeights(weights: PriorityWeights): void {
    this.setStorageItem(STORAGE_PRIORITY_WEIGHTS_KEY, JSON.stringify(weights));
  }

  /**
   * Fetches Open-Meteo live weather data with fallback to demo data
   */
  static async fetchLiveWeather(): Promise<LiveWeatherData> {
    const nowStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current=temperature_2m,relative_humidity_2m,rain&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata",
      );

      if (!res.ok) throw new Error("Open-Meteo API response not OK");

      const json = await res.json();
      const current = json.current;
      const daily = json.daily;

      const dailyForecast7Day = (daily?.time || []).map((t: string, i: number) => ({
        day: new Date(t).toLocaleDateString("en-IN", { weekday: "short" }),
        tempMax: Math.round(daily.temperature_2m_max[i] ?? 38),
        tempMin: Math.round(daily.temperature_2m_min[i] ?? 24),
      }));

      return {
        isLive: true,
        source: "Open-Meteo API",
        lastUpdated: nowStr,
        currentTempC: current?.temperature_2m,
        currentHumidityPct: current?.relative_humidity_2m,
        currentRainfallMm: current?.rain,
        dailyForecast7Day,
      };
    } catch (e) {
      console.warn("Open-Meteo API unavailable, falling back to Demo Data", e);
      return {
        isLive: false,
        source: "Demo Dataset",
        lastUpdated: nowStr,
        currentTempC: 38.4,
        currentHumidityPct: 42,
        currentRainfallMm: 0.5,
        dailyForecast7Day: [
          { day: "Mon", tempMax: 39, tempMin: 25 },
          { day: "Tue", tempMax: 41, tempMin: 26 },
          { day: "Wed", tempMax: 40, tempMin: 25 },
          { day: "Thu", tempMax: 38, tempMin: 24 },
          { day: "Fri", tempMax: 37, tempMin: 23 },
          { day: "Sat", tempMax: 39, tempMin: 25 },
          { day: "Sun", tempMax: 40, tempMin: 26 },
        ],
      };
    }
  }

  /**
   * Retrieves all zone risk assessments using current active dataset & priority weights
   */
  static getAssessments(riskType: RiskTypeId = "heat"): ZoneAssessment[] {
    const weights = this.getPriorityWeights();
    return RiskService.assessAllSync(ZONES, riskType, weights);
  }

  /**
   * Retrieves single zone assessment
   */
  static getAssessmentForZone(zoneId: string, riskType: RiskTypeId = "heat"): ZoneAssessment {
    const assessments = this.getAssessments(riskType);
    return assessments.find((a) => a.zone.id === zoneId) || assessments[0];
  }
}
