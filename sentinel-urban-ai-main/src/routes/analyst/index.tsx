import { createFileRoute } from "@tanstack/react-router";
import { AnalystDashboard } from "@/components/analytics/AnalystDashboard";

export const Route = createFileRoute("/analyst/")({
  component: AnalystDashboard,
});
