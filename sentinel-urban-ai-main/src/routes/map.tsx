import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { RiskMap } from "@/maps/RiskMap";
import { ZoneDetailsPanel } from "@/components/common/ZoneDetailsPanel";
import { RiskLegend } from "@/components/common/RiskLegend";
import { ZONES } from "@/data/mockZones";
import { RiskService } from "@/services/RiskService";
import { Search, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FeatureHero } from "@/components/common/FeatureHero";

export const Route = createFileRoute("/map")({
  component: HeatRiskMapPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      zoneId: (search.zoneId as string) || undefined,
    };
  },
});

function HeatRiskMapPage() {
  const { zoneId } = useSearch({ from: "/map" });
  const [selectedId, setSelectedId] = useState<string>("Z-01");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (zoneId) setSelectedId(zoneId);
  }, [zoneId]);

  const assessments = useMemo(() => RiskService.assessAllSync(ZONES), []);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((a) => {
      const matchesSearch =
        a.zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.zone.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.zone.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [assessments, searchQuery]);

  const selectedAssessment = useMemo(() => {
    return assessments.find((a) => a.zone.id === selectedId) || assessments[0] || null;
  }, [assessments, selectedId]);

  return (
    <AppLayout title="Heat Risk Map">
      <div className="space-y-6">
        <FeatureHero
          title="SUHI Heat Risk GIS Workspace"
          description="Interactive Surface Urban Heat Island (SUHI) analysis, Land Surface Temperature (°C), and population exposure mapping."
          badgeText="Spatial Thermal GIS"
          theme="heat"
        />

        {/* Main Map Workspace Section (70% Map / 30% Details Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Map Container (70% Desktop Width) */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-border/80 shadow-md bg-card">
            <RiskMap
              assessments={assessments}
              selectedId={selectedId}
              onSelect={setSelectedId}
              className="h-[680px] w-full"
            />
          </div>

          {/* Canonical Selected Zone Details (30% Desktop Width) */}
          <div className="lg:col-span-3">
            <ZoneDetailsPanel assessment={selectedAssessment} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
