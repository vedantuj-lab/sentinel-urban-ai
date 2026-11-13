import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { FeatureHero } from "@/components/common/FeatureHero";
import { RoleGuard } from "@/auth/auth-context";
import { ScenarioComparison } from "@/components/analytics/ScenarioComparison";
import { useAppStore } from "@/lib/state/app-store";

export const Route = createFileRoute("/analyst/scenarios")({
  component: Scenarios,
});

function Scenarios() {
  const { ready, assessments } = useAppStore();

  if (!ready) {
    return (
      <RoleGuard allowedRoles={["analyst"]}>
        <AppLayout title="Scenarios">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </AppLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["analyst"]}>
      <AppLayout title="Scenarios">
        <div className="space-y-6">
          <FeatureHero
            title="Hypothetical Scenario Explorer"
            description="Side-by-side scenario simulation workspace evaluating baseline conditions versus tree canopy, cool roof, and green space interventions."
            badgeText="Simulation Engine"
            theme="scenarios"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScenarioComparison assessments={assessments} />
          </div>
        </div>
      </AppLayout>
    </RoleGuard>
  );
}
