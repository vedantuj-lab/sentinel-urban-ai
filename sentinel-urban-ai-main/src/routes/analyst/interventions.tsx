import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { FeatureHero } from "@/components/common/FeatureHero";
import { RoleGuard } from "@/auth/auth-context";
import { InterventionPlannerCard } from "@/components/analytics/InterventionPlannerCard";
import { useAppStore } from "@/lib/state/app-store";

export const Route = createFileRoute("/analyst/interventions")({
  component: InterventionPlanner,
});

function InterventionPlanner() {
  const { ready, assessments } = useAppStore();

  if (!ready) {
    return (
      <RoleGuard allowedRoles={["analyst"]}>
        <AppLayout title="Intervention Planner">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </AppLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["analyst"]}>
      <AppLayout title="Intervention Planner">
        <div className="space-y-6">
          <FeatureHero
            title="Greedy Resource Intervention Planner"
            description="Resource-constrained intervention planning to greedily maximize population coverage across high-risk municipal sectors."
            badgeText="Resource Optimization"
            theme="interventions"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InterventionPlannerCard assessments={assessments} />
          </div>
        </div>
      </AppLayout>
    </RoleGuard>
  );
}
