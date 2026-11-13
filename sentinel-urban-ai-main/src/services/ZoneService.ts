import type { Zone } from "../types/risk";
import { ZONES } from "@/data/mockZones";

export class ZoneService {
  static async getZones(): Promise<Zone[]> {
    try {
      const res = await fetch("/api/zones");
      if (res.ok) {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          return await res.json();
        }
      }
      return ZONES;
    } catch (e) {
      console.error(e);
      return ZONES;
    }
  }

  static async getZoneById(id: string): Promise<Zone | undefined> {
    const zones = await this.getZones();
    return zones.find((z) => z.id === id);
  }
}
