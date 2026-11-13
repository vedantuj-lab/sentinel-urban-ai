import { JsonDb } from "../JsonDb";
import { ObservationEntity } from "../entities/Observation";

export class ObservationRepository {
  private static db = new JsonDb<ObservationEntity>("observations");

  static async init() {
    const existing = await this.db.getAll();
    if (existing.length === 0) {
      await this.create({
        userId: "u-1",
        zoneId: "Z-02",
        category: "Heat discomfort",
        description: "No shade at the bus stop.",
        status: "Accepted",
      });
    }
  }

  static async getAll() {
    await this.init();
    return this.db.getAll();
  }

  static async create(observation: Omit<ObservationEntity, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    return this.db.create({
      ...observation,
      id: `OBS-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    });
  }

  static async getByZoneId(zoneId: string) {
    return this.db.find((o) => o.zoneId === zoneId);
  }
}
