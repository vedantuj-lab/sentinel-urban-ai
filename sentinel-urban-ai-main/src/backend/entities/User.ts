import { Role } from "@/auth/auth-context";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  zoneId: string;
  org?: string;
  createdAt: string;
  updatedAt: string;
}
