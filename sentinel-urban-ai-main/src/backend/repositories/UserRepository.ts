import { JsonDb } from "../JsonDb";
import { UserEntity } from "../entities/User";

export class UserRepository {
  private static db = new JsonDb<UserEntity>("users");

  static async findByEmail(email: string) {
    return this.db.findOne((u) => u.email === email.toLowerCase());
  }

  static async findById(id: string) {
    return this.db.getById(id);
  }

  static async create(user: Omit<UserEntity, "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    return this.db.create({
      ...user,
      createdAt: now,
      updatedAt: now,
    });
  }

  static async update(id: string, patch: Partial<UserEntity>) {
    return this.db.update(id, {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  }

  static async getAll() {
    return this.db.getAll();
  }
}
