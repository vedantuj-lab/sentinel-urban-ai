import { JsonDb } from "../JsonDb";
import { ZoneEntity } from "../entities/Zone";
import { ZONES } from "@/data/mockZones";

export class ZoneRepository {
  private static db = new JsonDb<ZoneEntity>("zones");

  static async init() {
    const existing = await this.db.getAll();
    if (existing.length === 0) {
      const now = new Date().toISOString();
      for (const zone of ZONES) {
        await this.db.create({
          ...zone,
          createdAt: now,
          updatedAt: now,
        } as any); // Cast because mock zone shape is slightly different from entity but close enough for demo
      }
    }
  }

  static async getAll() {
    await this.init();
    return this.db.getAll();
  }

  static async getById(id: string) {
    await this.init();
    return this.db.getById(id);
  }
}
