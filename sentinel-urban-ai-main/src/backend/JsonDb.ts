import fs from "fs/promises";
import path from "path";

/**
 * An isomorphic JSON-based persistent database supporting both Node.js (filesystem) and browser (localStorage).
 */
export class JsonDb<T extends { id: string }> {
  private filePath: string;
  private data: T[] = [];
  private initialized = false;
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    if (typeof window === "undefined") {
      const dbDir = path.resolve(process.cwd(), ".data");
      this.filePath = path.join(dbDir, `${collectionName}.json`);
    } else {
      this.filePath = collectionName;
    }
  }

  private async ensureDir() {
    if (typeof window !== "undefined") return;
    const dbDir = path.dirname(this.filePath);
    try {
      await fs.mkdir(dbDir, { recursive: true });
    } catch (e) {
      // ignore
    }
  }

  async init() {
    if (this.initialized) return;
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(`db_${this.collectionName}`);
        if (raw && (raw.trim().startsWith("<") || !raw.trim().startsWith("["))) {
          this.data = [];
        } else {
          this.data = raw ? JSON.parse(raw) : [];
        }
      } catch {
        this.data = [];
      }
      this.initialized = true;
      return;
    }
    await this.ensureDir();
    try {
      const raw = await fs.readFile(this.filePath, "utf-8");
      if (raw && (raw.trim().startsWith("<") || !raw.trim().startsWith("["))) {
        this.data = [];
      } else {
        this.data = JSON.parse(raw);
      }
    } catch (e) {
      this.data = [];
      await this.save();
    }
    this.initialized = true;
  }

  private async save() {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          `db_${this.collectionName}`,
          JSON.stringify(this.data, null, 2),
        );
      } catch {
        // Ignore localStorage quota or access errors
      }
      return;
    }
    await this.ensureDir();
    await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2), "utf-8");
  }

  async getAll(): Promise<T[]> {
    await this.init();
    return [...this.data];
  }

  async getById(id: string): Promise<T | undefined> {
    await this.init();
    return this.data.find((item) => item.id === id);
  }

  async find(predicate: (item: T) => boolean): Promise<T[]> {
    await this.init();
    return this.data.filter(predicate);
  }

  async findOne(predicate: (item: T) => boolean): Promise<T | undefined> {
    await this.init();
    return this.data.find(predicate);
  }

  async create(item: T): Promise<T> {
    await this.init();
    this.data.push(item);
    await this.save();
    return item;
  }

  async update(id: string, patch: Partial<T>): Promise<T | undefined> {
    await this.init();
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    this.data[index] = { ...this.data[index], ...patch, id };
    await this.save();
    return this.data[index];
  }

  async delete(id: string): Promise<boolean> {
    await this.init();
    const initialLen = this.data.length;
    this.data = this.data.filter((item) => item.id !== id);
    if (this.data.length !== initialLen) {
      await this.save();
      return true;
    }
    return false;
  }

  async clear() {
    this.data = [];
    await this.save();
  }
}
