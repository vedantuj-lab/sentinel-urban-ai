// src/auth/index.ts
// Central export for authentication utilities.
// This file ensures a stable import path for the rest of the app.

export { AuthProvider, useAuth, RoleGuard } from "./auth-context";
export type { Role, AppUser } from "./auth-context";
