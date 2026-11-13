import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Role = "citizen" | "analyst" | "field" | "admin";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  zoneId: string;
  org?: string;
}

export const ROLE_LABEL: Record<Role, string> = {
  citizen: "Citizen",
  analyst: "Urban Analyst",
  field: "Field Officer",
  admin: "City Administrator",
};

export const ROLE_HOME: Record<Role, string> = {
  citizen: "/citizen",
  analyst: "/analyst",
  field: "/field",
  admin: "/admin",
};

export const DEMO_ACCOUNTS: { email: string; password: string; user: AppUser }[] = [
  {
    email: "citizen@urbansense.ai",
    password: "demo1234",
    user: {
      id: "u-1",
      name: "Ananya Rane",
      email: "citizen@urbansense.ai",
      role: "citizen",
      zoneId: "Z-02",
    },
  },
  {
    email: "analyst@urbansense.ai",
    password: "demo1234",
    user: {
      id: "u-2",
      name: "Dr. Vikram Nair",
      email: "analyst@urbansense.ai",
      role: "analyst",
      zoneId: "Z-01",
      org: "City Environment Cell",
    },
  },
  {
    email: "officer@urbansense.ai",
    password: "demo1234",
    user: {
      id: "u-3",
      name: "Sameer Kulkarni",
      email: "officer@urbansense.ai",
      role: "field",
      zoneId: "Z-03",
      org: "Ward Operations",
    },
  },
  {
    email: "admin@urbansense.ai",
    password: "demo1234",
    user: {
      id: "u-4",
      name: "Meera Deshpande",
      email: "admin@urbansense.ai",
      role: "admin",
      zoneId: "Z-04",
      org: "Municipal Command Centre",
    },
  },
];

const STORAGE_KEY = "urbansense.session";

interface AuthValue {
  user: AppUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<AppUser>;
  register: (input: {
    name: string;
    email: string;
    role: Role;
    zoneId: string;
  }) => Promise<AppUser>;
  signOut: () => void;
  updateProfile: (patch: Partial<AppUser>) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AppUser);
    } catch {
      /* ignore corrupted session */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: AppUser | null) => {
    setUser(next);
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const signIn = useCallback<AuthValue["signIn"]>(
    async (email, password) => {
      await new Promise((r) => setTimeout(r, 550));
      const match = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
      );
      if (!match) throw new Error("Invalid email or password. Try a demo account below.");
      persist(match.user);
      return match.user;
    },
    [persist],
  );

  const register = useCallback<AuthValue["register"]>(
    async ({ name, email, role, zoneId }) => {
      await new Promise((r) => setTimeout(r, 650));
      const next: AppUser = {
        id: `u-${Date.now()}`,
        name,
        email: email.trim().toLowerCase(),
        role,
        zoneId,
      };
      persist(next);
      return next;
    },
    [persist],
  );

  const value = useMemo<AuthValue>(
    () => ({
      user,
      ready,
      signIn,
      register,
      signOut: () => persist(null),
      updateProfile: (patch) => persist(user ? { ...user, ...patch } : null),
    }),
    [user, ready, signIn, register, persist],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
