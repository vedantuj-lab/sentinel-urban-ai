import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Alert, InterventionTask, Observation, TaskStatus } from "@/lib/risk/types";
import { assessAll } from "@/lib/risk/engine";
import { ZONES } from "@/lib/risk/zones";

const STORAGE_KEY = "urbansense.state.v1";

function seedTasks(): InterventionTask[] {
  const ranked = assessAll(ZONES);
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
      title: titles[i],
      riskType: "heat" as const,
      priority: (Math.min(4, Math.ceil((i + 1) / 1.6)) || 1) as 1 | 2 | 3 | 4,
      status: statuses[i],
      deadline: deadline.toISOString(),
      assignee: "Sameer Kulkarni",
      notes:
        i === 0
          ? [{ at: new Date(Date.now() - 36e5).toISOString(), text: "Shade nets sourced from ward depot." }]
          : [],
      evidence: i === 4 ? ["cool-roof-verification.jpg"] : [],
    };
  });
}

function seedAlerts(): Alert[] {
  const ranked = assessAll(ZONES).filter((a) => a.riskScore >= 60);
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
  tasks: InterventionTask[];
  observations: Observation[];
  alerts: Alert[];
  acknowledgedAlerts: string[];
}

interface StoreValue extends StoreShape {
  ready: boolean;
  updateTask: (id: string, patch: Partial<InterventionTask>) => void;
  addTaskNote: (id: string, text: string) => void;
  addEvidence: (id: string, fileName: string) => void;
  addObservation: (o: Omit<Observation, "id" | "at" | "status">) => Observation;
  acknowledgeAlert: (id: string) => void;
  reset: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreShape>({
    tasks: [],
    observations: [],
    alerts: [],
    acknowledgedAlerts: [],
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let initial: StoreShape | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) initial = JSON.parse(raw) as StoreShape;
    } catch {
      /* ignore */
    }
    setState(
      initial ?? {
        tasks: seedTasks(),
        alerts: seedAlerts(),
        observations: [
          {
            id: "O-1001",
            zoneId: "Z-02",
            category: "Heat discomfort",
            description: "No shade at the bus stop near the vegetable market; crowd waits in the sun.",
            at: new Date(Date.now() - 864e5).toISOString(),
            status: "Accepted",
          },
        ],
        acknowledgedAlerts: [],
      },
    );
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const updateTask = useCallback<StoreValue["updateTask"]>((id, patch) => {
    setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      ready,
      updateTask,
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
        setState({
          tasks: seedTasks(),
          alerts: seedAlerts(),
          observations: [],
          acknowledgedAlerts: [],
        }),
    }),
    [state, ready, updateTask],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}
