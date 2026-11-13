import { JsonDb } from "../JsonDb";
import { InterventionEntity } from "../entities/Intervention";

export class InterventionRepository {
  private static db = new JsonDb<InterventionEntity>("interventions");

  static async init() {
    const existing = await this.db.getAll();
    if (existing.length === 0) {
      const now = new Date().toISOString();
      const demoTasks = [
        {
          zoneId: "Z-01",
          title: "Industrial Heat Mitigation",
          description: "Deploy temporary shading",
          status: "In Progress",
          priority: 1,
          deadline: now,
          evidence: [],
          notes: [],
        },
        {
          zoneId: "Z-02",
          title: "Public Health Advisory",
          description: "Distribute hydration kits",
          status: "Assigned",
          priority: 2,
          deadline: now,
          evidence: [],
          notes: [],
        },
      ];
      for (const t of demoTasks) {
        await this.create(t as any);
      }
    }
  }

  static async getAll() {
    await this.init();
    return this.db.getAll();
  }

  static async getByZoneId(zoneId: string) {
    return this.db.find((i) => i.zoneId === zoneId);
  }

  static async create(intervention: Omit<InterventionEntity, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    return this.db.create({
      ...intervention,
      id: `INT-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    });
  }

  static async update(id: string, patch: Partial<InterventionEntity>) {
    return this.db.update(id, {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  }
}
