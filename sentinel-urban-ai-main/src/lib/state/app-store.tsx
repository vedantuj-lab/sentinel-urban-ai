import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  Alert,
  InterventionTask,
  Observation,
  TaskStatus,
  ZoneAssessment,
} from "@/types/risk";
import { RiskService } from "@/services/RiskService";
import { ZONES } from "@/data/mockZones";

const STORAGE_KEY = "urbansense.state.v1";

function seedTasks(): InterventionTask[] {
  const ranked = RiskService.assessAllSync(ZONES);
  const statuses: TaskStatus[] = [
    "In Progress",
    "Assigned",
    "Pending",
    "Verification",
    "Completed",
    "Assigned",
  ];
  const titles = [
    "Deploy temporary shading at transit stops",
    "Heat advisory door-to-door outreach",
    "Site survey for tree-cover expansion",
    "Install hydration points in market area",
    "Cool-roof pilot verification",
    "Vulnerable-household mapping",
  ];
  return ranked.slice(0, 6).map((a, i) => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + (i + 1));
    return {
      id: `T-${(101 + i).toString()}`,
      zoneId: a.zone.id,
      title: titles[i] ?? "Heat mitigation task",
      riskType: "heat" as const,
      priority: (Math.min(4, Math.ceil((i + 1) / 1.6)) || 1) as 1 | 2 | 3 | 4,
      status: statuses[i] ?? "Pending",
      deadline: deadline.toISOString(),
      assignee: "Sameer Kulkarni",
      notes:
        i === 0
          ? [
              {
                at: new Date(Date.now() - 36e5).toISOString(),
                text: "Shade nets sourced from ward depot.",
              },
            ]
          : [],
      evidence: i === 4 ? ["cool-roof-verification.jpg"] : [],
    };
  });
}

function seedAlerts(): Alert[] {
  const ranked = RiskService.assessAllSync(ZONES).filter((a) => a.riskScore >= 60);
  return ranked.slice(0, 5).map((a, i) => {
    const d = new Date();
    d.setHours(d.getHours() - i * 5);
    return {
      id: `A-${200 + i}`,
      zoneId: a.zone.id,
      level: a.level,
      title: `${a.level === "critical" ? "Critical" : "Elevated"} heat risk — ${a.zone.name}`,
      body: `Predicted heat risk ${a.predictedRiskScore}/100 with ${a.confidence}% confidence. ${a.recommendation}`,
      issuedAt: d.toISOString(),
    };
  });
}

interface StoreShape {
  assessments: ZoneAssessment[];
  stats: any;
  trend: any[];
  tasks: InterventionTask[];
  observations: Observation[];
  alerts: Alert[];
  acknowledgedAlerts: string[];
  activeRegionId: string;
}

interface StoreValue extends StoreShape {
  ready: boolean;
  refreshIntelligence: () => Promise<void>;
  updateTask: (id: string, patch: Partial<InterventionTask>) => void;
  addTaskNote: (id: string, text: string) => void;
  addEvidence: (id: string, fileName: string) => void;
  addObservation: (o: Omit<Observation, "id" | "at" | "status">) => Observation;
  acknowledgeAlert: (id: string) => void;
  setRegion: (id: string) => void;
  reset: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreShape>({
    assessments: [],
    stats: null,
    trend: [],
    tasks: [],
    observations: [],
    alerts: [],
    acknowledgedAlerts: [],
    activeRegionId: "demo",
  });
  const [ready, setReady] = useState(false);

  const initStore = useCallback(async () => {
    try {
      // In a real app we'd pass activeRegionId to the API
      const [tasksRes, risksRes] = await Promise.all([
        fetch("/api/interventions").catch(() => null),
        fetch("/api/risks").catch(() => null),
      ]);

      let tasks: any[] = [];
      let assessments: any[] = [];

      if (tasksRes && tasksRes.ok) {
        const contentType = tasksRes.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          try {
            tasks = await tasksRes.json();
          } catch (parseError) {
            console.warn("Failed to parse tasks JSON:", parseError);
          }
        }
      }

      if (risksRes && risksRes.ok) {
        const contentType = risksRes.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          try {
            assessments = await risksRes.json();
          } catch (parseError) {
            console.warn("Failed to parse risks JSON:", parseError);
          }
        }
      }

      if (!Array.isArray(assessments) || assessments.length === 0) {
        assessments = RiskService.assessAllSync(ZONES);
      }
      if (!Array.isArray(tasks) || tasks.length === 0) {
        tasks = seedTasks();
      }

      const stats = RiskService.getCityStats(assessments);
      const trend = RiskService.cityTrend(assessments);

      const alerts = assessments
        .filter((a: any) => a && a.riskScore >= 60)
        .slice(0, 5)
        .map((a: any, i: number) => ({
          id: `A-${200 + i}`,
          zoneId: a.zone.id,
          level: a.level,
          title: `${a.level === "critical" ? "Critical" : "Elevated"} heat risk — ${a.zone.name}`,
          body: `Predicted heat risk ${a.predictedRiskScore}/100 with ${a.confidence}% confidence. ${a.recommendation}`,
          issuedAt: new Date().toISOString(),
        }));

      setState((s) => ({
        ...s,
        assessments,
        stats,
        trend,
        tasks,
        alerts,
      }));
    } catch (e) {
      console.error("Store init failed", e);
      // Fallback to seeds for demo continuity
      const assessments = RiskService.assessAllSync(ZONES);
      setState((s) => ({
        ...s,
        assessments,
        stats: RiskService.getCityStats(assessments),
        trend: RiskService.cityTrend(assessments),
        tasks: seedTasks(),
        alerts: seedAlerts(),
      }));
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    initStore();
  }, [initStore]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const updateTask = useCallback<StoreValue["updateTask"]>(async (id, patch) => {
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
    await fetch(`/api/interventions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }, []);

  const setRegion = useCallback(
    (id: string) => {
      setState((s) => ({ ...s, activeRegionId: id }));
      // In demo mode, RiskService.assessAllSync uses RegionService.getActiveRegion()
      // which we need to update first
      import("@/services/RegionService").then((m) => {
        m.RegionService.setActiveRegion(id);
        initStore();
      });
    },
    [initStore],
  );

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      ready,
      refreshIntelligence: initStore,
      updateTask,
      setRegion,
      addTaskNote: (id, text) =>
        setState((s) => ({
          ...s,
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, notes: [...t.notes, { at: new Date().toISOString(), text }] } : t,
          ),
        })),
      addEvidence: (id, fileName) =>
        setState((s) => ({
          ...s,
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, evidence: [...t.evidence, fileName] } : t,
          ),
        })),
      addObservation: (o) => {
        const created: Observation = {
          ...o,
          id: `O-${Date.now()}`,
          at: new Date().toISOString(),
          status: "Submitted",
        };
        setState((s) => ({ ...s, observations: [created, ...s.observations] }));
        return created;
      },
      acknowledgeAlert: (id) =>
        setState((s) => ({
          ...s,
          acknowledgedAlerts: s.acknowledgedAlerts.includes(id)
            ? s.acknowledgedAlerts
            : [...s.acknowledgedAlerts, id],
        })),
      reset: () =>
        setState((s) => ({
          ...s,
          tasks: seedTasks(),
          alerts: seedAlerts(),
          observations: [],
          acknowledgedAlerts: [],
        })),
    }),
    [state, ready, updateTask, setRegion, initStore],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}
