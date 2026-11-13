import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { FeatureHero } from "@/components/common/FeatureHero";
import { RoleGuard } from "@/auth/auth-context";
import { useState, useMemo } from "react";
import { PriorityRankingTable } from "@/components/analytics/PriorityRankingTable";
import { PathToLowerRiskCard } from "@/components/analytics/PathToLowerRiskCard";
import { useAppStore } from "@/lib/state/app-store";

export const Route = createFileRoute("/analyst/priorities")({
  component: PrioritiesAndRecommendations,
});

function PrioritiesAndRecommendations() {
  const { ready, assessments } = useAppStore();
  const [selectedId, setSelectedId] = useState<string>("Z-01");

  const selectedAssessment = useMemo(() => {
    return assessments.find((a) => a.zone.id === selectedId) || assessments[0] || null;
  }, [assessments, selectedId]);

  if (!ready) {
    return (
      <RoleGuard allowedRoles={["analyst"]}>
        <AppLayout title="Priorities & Recommendations">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </AppLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["analyst"]}>
      <AppLayout title="Priorities & Recommendations">
        <div className="space-y-6">
          <FeatureHero
            title="Priorities & Action Directives"
            description="Multi-criteria priority ranking based on heat hazard severity, population exposure, vulnerability index, and data reliability."
            badgeText="City Priority Engine"
            theme="priorities"
          />

          <PriorityRankingTable assessments={assessments} onSelect={setSelectedId} />

          {selectedAssessment && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PathToLowerRiskCard
                zone={selectedAssessment.zone}
                currentScore={selectedAssessment.riskScore}
                currentLevel={selectedAssessment.level}
              />
            </div>
          )}
        </div>
      </AppLayout>
    </RoleGuard>
  );
}
