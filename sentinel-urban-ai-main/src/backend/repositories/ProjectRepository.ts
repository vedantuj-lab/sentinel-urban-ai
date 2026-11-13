import { JsonDb } from "../JsonDb";
import { ProjectEntity } from "../entities/Project";

export class ProjectRepository {
  private static db = new JsonDb<ProjectEntity>("projects");

  static async init() {
    const existing = await this.db.getAll();
    if (existing.length === 0) {
      const now = new Date().toISOString();
      const demoProjects: Partial<ProjectEntity>[] = [
        {
          name: "UrbanSense Core",
          category: "Intelligence",
          primaryTech: "TypeScript / TanStack",
          description: "Main risk intelligence platform and command center orchestration.",
          status: "Active",
          githubUrl: "https://github.com/urbansense/core",
          featured: true,
          lastUpdated: now,
        },
        {
          name: "Sentinel Mobile",
          category: "Mobile",
          primaryTech: "Kotlin / Jetpack Compose",
          description: "Android application for field officers and real-time citizen reporting.",
          status: "Active",
          githubUrl: "https://github.com/urbansense/mobile",
          featured: true,
          lastUpdated: now,
        },
        {
          name: "HeatFlow ML",
          category: "Data Science",
          primaryTech: "Python / PyTorch",
          description: "Machine learning models for predicting urban heat island progression.",
          status: "Active",
          githubUrl: "https://github.com/urbansense/heatflow-ml",
          featured: true,
          lastUpdated: now,
        },
        {
          name: "AquaDrain Simulator",
          category: "Infrastructure",
          primaryTech: "C++ / WASM",
          description: "High-performance hydraulic simulation for urban flood risk assessment.",
          status: "Experimental",
          githubUrl: "https://github.com/urbansense/aquadrain",
          featured: false,
          lastUpdated: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        },
        {
          name: "Legacy Sensor Mesh",
          category: "Infrastructure",
          primaryTech: "C / Arduino",
          description: "Early prototype of IoT sensor nodes for micro-climate monitoring.",
          status: "Archived",
          githubUrl: "https://github.com/urbansense/legacy-mesh",
          featured: false,
          lastUpdated: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString(),
        },
        {
          name: "UrbanVitals Dashboard",
          category: "Public Health",
          primaryTech: "React / D3.js",
          description: "Visualization tool for correlating heat risks with public health data.",
          status: "Maintenance",
          githubUrl: "https://github.com/urbansense/urbanvitals",
          featured: false,
          lastUpdated: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
        },
      ];

      for (const p of demoProjects) {
        await this.db.create({
          ...p,
          id: `PROJ-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: now,
          updatedAt: now,
        } as ProjectEntity);
      }
    }
  }

  static async getAll() {
    await this.init();
    return this.db.getAll();
  }

  static async getFeatured() {
    await this.init();
    return this.db.find((p) => p.featured);
  }
}
