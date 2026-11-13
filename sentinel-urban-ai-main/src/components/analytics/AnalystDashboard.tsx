import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Database, Brain, Flame, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FeatureHero } from "@/components/common/FeatureHero";
import { AppLayout } from "@/layouts/AppLayout";
import { useAppStore } from "@/lib/state/app-store";
import { RoleGuard } from "@/auth/auth-context";

export function AnalystDashboard() {
  const { ready, assessments, stats, refreshIntelligence } = useAppStore();
  const [exportOpen, setExportOpen] = useState(false);

  const top3Zones = useMemo(() => {
    return [...assessments].sort((a, b) => a.priorityRank - b.priorityRank).slice(0, 3);
  }, [assessments]);

  const handleExportCSV = () => {
    const headers = [
      "Zone ID",
      "Zone Name",
      "Ward",
      "Land Use",
      "Population",
      "Risk Score",
      "Risk Level",
      "Confidence",
      "Priority Rank",
      "Priority Score",
    ];
    const rows = assessments.map((a) => [
      a.zone.id,
      `"${a.zone.name}"`,
      `"${a.zone.ward}"`,
      a.zone.landUse,
      a.zone.population,
      a.riskScore,
      a.level,
      a.confidence,
      a.priorityRank,
      a.priorityScore,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `UrbanSense_Telemetry_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!ready || !stats) {
    return (
      <RoleGuard allowedRoles={["analyst"]}>
        <AppLayout title="Urban Analyst Overview">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </AppLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["analyst"]}>
      <AppLayout title="Urban Analyst Overview">
        <div className="space-y-8">
          <FeatureHero
            title="Urban Analyst Overview"
            description="Observe microclimate heat risk, monitor active telemetry feeds, and review top priority municipal sectors."
            badgeText="Urban Heat Risk Intelligence"
            theme="forest"
          >
            <Button
              onClick={() => setExportOpen(true)}
              className="h-11 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-widest border border-white/20 shadow-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Brief
            </Button>
          </FeatureHero>

          {/* EXACTLY 4 KPI CARDS WITH MULTI-COLOR ACCENTS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border border-rose-500/20 shadow-sm bg-gradient-to-br from-rose-500/5 to-transparent rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  Overall Heat Risk
                </span>
                <Flame className="h-5 w-5 text-rose-600" />
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-black tabular-nums tracking-tight text-foreground">
                  {stats.overall}
                </span>
                <span className="text-xs font-bold text-muted-foreground ml-1">/ 100</span>
              </div>
            </Card>

            <Card className="border border-amber-500/20 shadow-sm bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Highest-Priority Zone
                </span>
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div className="space-y-1">
                <span className="text-base font-bold tracking-tight text-foreground truncate block">
                  {assessments[0]?.zone.name || "Central District"}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  {assessments[0]?.zone.ward || "Ward 12"}
                </span>
              </div>
            </Card>

            <Card className="border border-emerald-500/20 shadow-sm bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Zones Requiring Attention
                </span>
                <Database className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-black tabular-nums tracking-tight text-foreground">
                  {stats.highRiskZones}
                </span>
                <span className="text-xs font-bold text-muted-foreground ml-1">Zones</span>
              </div>
            </Card>

            <Card className="border border-purple-500/20 shadow-sm bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  Data Freshness
                </span>
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div className="space-y-1">
                <span className="text-base font-bold tracking-tight text-foreground">
                  Live API Active
                </span>
                <span className="text-xs text-emerald-600 font-bold block">
                  Pune GIS Feed Online
                </span>
              </div>
            </Card>
          </div>

          {/* TWO COLUMN MAIN SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: Compact Heat Risk Overview + Full Map Link */}
            <div className="lg:col-span-6 space-y-6">
              <Card className="border border-border shadow-sm rounded-2xl p-6 space-y-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    Heat Risk Topography Overview
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    High surface heat concentrations detected in urban commercial corridors with
                    high built-up density and low vegetative canopy.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface/50 border border-border space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-muted-foreground">Assessed Sectors</span>
                    <span className="text-foreground">{assessments.length} Wards</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-muted-foreground">Critical Hotspots</span>
                    <span className="text-coral">{stats.highRiskZones} Zones</span>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-xl gap-2 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest"
                >
                  <Link to="/map">
                    Launch Complete Heat Risk Map
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            </div>

            {/* RIGHT: Top Three Priority Zones */}
            <div className="lg:col-span-6 space-y-4">
              <Card className="border border-border shadow-sm rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                    Top 3 Priority Zones
                  </h3>
                  <Link
                    to="/analyst/priorities"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {top3Zones.map((a, idx) => (
                    <div
                      key={a.zone.id}
                      className="p-4 rounded-xl border border-border bg-surface/50 hover:bg-surface transition-all flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                            #{idx + 1}
                          </span>
                          <span className="text-sm font-bold text-foreground">{a.zone.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground block">
                          {a.zone.ward} • Pop: {a.zone.population.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-mono font-black text-foreground block">
                          {a.riskScore}/100
                        </span>
                        <Link
                          to="/analyst/analysis"
                          className="text-[10px] font-bold text-primary hover:underline uppercase"
                        >
                          Inspect Zone →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Telemetry Export Dialog */}
        <Dialog open={exportOpen} onOpenChange={setExportOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Export Intelligence Brief</DialogTitle>
              <DialogDescription>
                Choose the format for your intelligence brief export.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleExportCSV}
                className="w-full h-12 rounded-xl font-bold text-sm gap-2"
              >
                <Download className="h-4 w-4" />
                Export as CSV
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </RoleGuard>
  );
}
