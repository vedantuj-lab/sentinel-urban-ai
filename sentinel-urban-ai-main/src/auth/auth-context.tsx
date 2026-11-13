import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppUser, Role, DEMO_ACCOUNTS } from "@/data/demoAccounts";
import { loginFn, logoutFn, getMeFn } from "./auth-functions";

export { type Role, type AppUser, DEMO_ACCOUNTS };

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrator",
  analyst: "Urban Analyst",
};

export const ROLE_HOME: Record<Role, string> = {
  admin: "/admin",
  analyst: "/analyst",
};

const STORAGE_KEY = "urbansense.session";

// Default preview user (Urban Analyst)
const DEFAULT_PREVIEW_USER: AppUser = DEMO_ACCOUNTS[1].user;

interface AuthValue {
  user: AppUser;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<AppUser>;
  register: (input: {
    name: string;
    email: string;
    role: Role;
    zoneId: string;
    password: string;
  }) => Promise<AppUser>;
  signOut: () => void;
  switchRole: (role: Role) => void;
  updateProfile: (patch: Partial<AppUser>) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser>(DEFAULT_PREVIEW_USER);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initAuth() {
      try {
        const { user: serverUser } = await getMeFn();
        if (serverUser) {
          setUser(serverUser);
        } else {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (raw) {
            setUser(JSON.parse(raw) as AppUser);
          } else {
            // Auto-login as default Analyst for instant preview
            setUser(DEFAULT_PREVIEW_USER);
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREVIEW_USER));
          }
        }
      } catch (e) {
        console.error("Auth init failed", e);
        setUser(DEFAULT_PREVIEW_USER);
      }
      setReady(true);
    }
    initAuth();
  }, []);

  const persist = useCallback((next: AppUser) => {
    setUser(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const signIn = useCallback<AuthValue["signIn"]>(
    async (email, password) => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      try {
        const { user: loggedUser } = await loginFn({
          data: { email: cleanEmail, password: cleanPassword },
        });
        persist(loggedUser);
        return loggedUser;
      } catch (e: any) {
        // Fallback for demo testing
        const demo = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === cleanEmail);
        if (demo) {
          persist(demo.user);
          return demo.user;
        }
        throw new Error(e.message || "Invalid email or password.");
      }
    },
    [persist],
  );

  const register = useCallback<AuthValue["register"]>(
    async ({ name, email, role, zoneId }) => {
      const cleanName = name.trim().replace(/[<>]/g, "");
      const cleanEmail = email.trim().toLowerCase();

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          role,
          zoneId,
          password: "demo1234",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.statusMessage || "Registration failed.");
      }

      const { user: regUser } = await res.json();
      persist(regUser);
      return regUser;
    },
    [persist],
  );

  const switchRole = useCallback((role: Role) => {
    setUser((currentUser) => {
      if (currentUser.role === role) return currentUser;
      const demo = DEMO_ACCOUNTS.find((a) => a.user.role === role);
      const updated = demo ? demo.user : { ...currentUser, role };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      if (typeof document !== "undefined") {
        document.cookie = `urbansense_session=${encodeURIComponent(JSON.stringify(updated))}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      return updated;
    });
    toast.success(`Switched role to ${ROLE_LABEL[role]}`);
  }, []);

  const signOut = useCallback(async () => {
    await logoutFn();
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(DEFAULT_PREVIEW_USER);
    toast.info("Logged out. Preview mode active.");
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      ready,
      signIn,
      register,
      signOut,
      switchRole,
      updateProfile: (patch) => persist({ ...user, ...patch }),
    }),
    [user, ready, signIn, register, signOut, switchRole, persist],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function RoleGuard({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: Role[];
}) {
  const { user, ready, switchRole } = useAuth();

  useEffect(() => {
    if (ready && user && !allowedRoles.includes(user.role)) {
      // Auto-switch role if visiting a valid route to allow seamless feature previewing
      const targetRole = allowedRoles[0];
      if (user.role !== targetRole) {
        switchRole(targetRole);
      }
    }
  }, [user?.role, ready, allowedRoles, switchRole]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
            Loading Platform...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
