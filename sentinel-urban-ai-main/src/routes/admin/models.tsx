import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { FeatureHero } from "@/components/common/FeatureHero";
import { RoleGuard } from "@/auth/auth-context";
import { Cpu, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Route = createFileRoute("/admin/models")({
  component: ModelManagement,
});

function ModelManagement() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AppLayout title="Model Management">
        <div className="space-y-8">
          <FeatureHero
            title="ML Model Configuration & Pipeline"
            description="Manage active ML model versions (v1.0.4), input feature weights, inference pipeline latency, and scientific calibration."
            badgeText="Machine Learning Engine"
            theme="models"
          />

          <Card className="shadow-sm border border-border bg-card rounded-2xl p-6 max-w-3xl">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Model Configuration & Pipeline Status
              </CardTitle>
              <CardDescription className="text-sm">
                Active ML model metadata, version history, and input feature dependencies.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-surface/50 border border-border">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest block mb-1">
                    Current Model
                  </span>
                  <span className="text-sm font-bold">Urban Heat ML</span>
                </div>
                <div className="p-4 rounded-xl bg-surface/50 border border-border">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest block mb-1">
                    Version
                  </span>
                  <span className="text-sm font-bold text-primary">v1.0.4</span>
                </div>
                <div className="p-4 rounded-xl bg-surface/50 border border-border">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest block mb-1">
                    Status
                  </span>
                  <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Active
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-surface/50 border border-border">
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest block mb-1">
                    Inference Latency
                  </span>
                  <span className="text-sm font-bold">42ms</span>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-surface/30 border border-border space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  Active Input Feature Pipeline
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: "Temperature Index", weight: "32% influence" },
                    { name: "Built-up Density Factor", weight: "27% influence" },
                    { name: "Vegetation Coverage Index", weight: "23% influence" },
                    { name: "Population Exposure Load", weight: "18% influence" },
                  ].map((f) => (
                    <div
                      key={f.name}
                      className="p-3 rounded-lg bg-white border border-border flex justify-between items-center"
                    >
                      <span className="text-sm font-bold text-foreground">{f.name}</span>
                      <span className="text-xs font-mono text-primary font-bold">{f.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </RoleGuard>
  );
}
