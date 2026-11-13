import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { FeatureHero } from "@/components/common/FeatureHero";
import { RoleGuard } from "@/auth/auth-context";
import { useState, useMemo } from "react";
import {
  MapPin,
  Globe,
  Upload,
  Search,
  FileSpreadsheet,
  FileText,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Thermometer,
  Wind,
  Droplets,
  Download,
  BarChart3,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/state/app-store";
import { ZoneDetailsPanel } from "@/components/common/ZoneDetailsPanel";
import { LocationService, ResolvedLocation } from "@/services/LocationService";
import { AssistantService } from "@/services/AssistantService";
import { DocumentParserService, ParsedDatasetResult } from "@/services/DocumentParserService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyst/analysis")({
  component: ZoneAnalysisPage,
});

function ZoneAnalysisPage() {
  const { ready, assessments } = useAppStore();
  const [activeMode, setActiveMode] = useState<"modeA" | "modeB">("modeA");

  // Mode A: Live Intelligence State
  const [selectedId, setSelectedId] = useState<string>("Z-01");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [liveLocationReport, setLiveLocationReport] = useState<{
    loc: ResolvedLocation;
    nearby: ResolvedLocation[];
    reportText: string;
  } | null>(null);

  // Mode B: Uploaded Dataset Analysis State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedDatasetResult | null>(null);

  const selectedAssessment = useMemo(() => {
    return assessments.find((a) => a.zone.id === selectedId) || assessments[0] || null;
  }, [assessments, selectedId]);

  // Handle Mode A Live Location Search
  const handleLiveLocationSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    setSearching(true);
    try {
      const resolvedLoc = await LocationService.resolveLocation(q);
      if (!resolvedLoc) {
        toast.error(`Could not resolve location for "${q}". Try another city or ward.`);
        return;
      }

      const nearby = await LocationService.getNearbyLocations(
        resolvedLoc.latitude,
        resolvedLoc.longitude,
      );
      const asstMsg = await AssistantService.processQuery(
        `weather and risk in ${resolvedLoc.name}`,
      );

      setLiveLocationReport({
        loc: resolvedLoc,
        nearby,
        reportText: asstMsg.text,
      });

      toast.success(`Resolved ${resolvedLoc.formattedAddress}`);
    } catch (err: any) {
      toast.error(`Location resolution failed: ${err.message || "Unknown error"}`);
    } finally {
      setSearching(false);
    }
  };

  // Handle Mode B File Upload Parsing (CSV, PDF, DOCX)
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setParsing(true);

    try {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const text = await file.text();

      let result: ParsedDatasetResult;
      if (ext === "csv") {
        result = DocumentParserService.parseCSV(text, file.name);
      } else if (ext === "pdf") {
        result = DocumentParserService.parsePDF(text, file.name);
      } else if (ext === "docx" || ext === "doc") {
        result = DocumentParserService.parseDOCX(text, file.name);
      } else {
        throw new Error("Unsupported file format. Please upload CSV, PDF, or DOCX.");
      }

      setParsedResult(result);
      toast.success(`Successfully analyzed ${file.name} (${result.validRowCount} rows parsed).`);
    } catch (err: any) {
      toast.error(`Failed to process file: ${err.message || "Parse error"}`);
    } finally {
      setParsing(false);
    }
  };

  if (!ready) {
    return (
      <RoleGuard allowedRoles={["analyst"]}>
        <AppLayout title="Zone & Dataset Analysis">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </AppLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["analyst"]}>
      <AppLayout title="Analysis Workspace">
        <div className="space-y-8">
          <FeatureHero
            title="Analysis Workspace & Intelligence"
            description="Differentiated analysis modes: Mode A (Live Geographic Intelligence & Nearby Areas) and Mode B (Uploaded Dataset Analysis for CSV/PDF/DOCX)."
            badgeText="Dual Analysis Engine"
            theme="analysis"
          >
            {/* Mode Selector Tabs inside Hero */}
            <div className="flex p-1 bg-slate-900/80 border border-white/20 rounded-2xl backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setActiveMode("modeA")}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                  activeMode === "modeA"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-white/60 hover:text-white",
                )}
              >
                <Globe className="h-4 w-4" />
                Mode A: Live Intelligence
              </button>
              <button
                type="button"
                onClick={() => setActiveMode("modeB")}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2",
                  activeMode === "modeB"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-white/60 hover:text-white",
                )}
              >
                <Upload className="h-4 w-4" />
                Mode B: Uploaded Dataset
              </button>
            </div>
          </FeatureHero>

          {/* MODE A: LIVE GEOGRAPHIC INTELLIGENCE */}
          {activeMode === "modeA" && (
            <div className="space-y-8">
              {/* Universal Place Search Bar */}
              <Card className="border border-teal-500/30 bg-gradient-to-r from-teal-500/5 to-transparent shadow-sm rounded-2xl p-6">
                <form
                  onSubmit={handleLiveLocationSearch}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search Churchgate, Bhayandar, Andheri, Pune, London..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-sm rounded-xl"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={searching}
                    className="h-12 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider gap-2 shrink-0"
                  >
                    <Globe className={cn("h-4 w-4", searching && "animate-spin")} />
                    {searching ? "Resolving..." : "Search Location"}
                  </Button>
                </form>
              </Card>

              {/* Resolved Location Live Report */}
              {liveLocationReport && (
                <Card className="border border-teal-500/30 shadow-md bg-card rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">
                        Resolved Location Report
                      </span>
                      <h3 className="text-xl font-bold text-foreground">
                        {liveLocationReport.loc.formattedAddress}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        Coordinates: {liveLocationReport.loc.latitude.toFixed(4)},{" "}
                        {liveLocationReport.loc.longitude.toFixed(4)}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase">
                      Live Telemetry Active
                    </span>
                  </div>

                  {/* Summary Text */}
                  <div className="p-4 rounded-xl bg-surface border border-border whitespace-pre-line text-xs font-medium text-foreground leading-relaxed">
                    {liveLocationReport.reportText}
                  </div>

                  {/* Nearby Areas Search Results */}
                  {liveLocationReport.nearby.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                        Nearby Resolvable Locations
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {liveLocationReport.nearby.map((nb) => (
                          <div
                            key={nb.name}
                            onClick={() => {
                              setSearchQuery(nb.name);
                              handleLiveLocationSearch();
                            }}
                            className="p-3.5 rounded-xl border border-border bg-surface/50 hover:bg-surface transition-all cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <span className="text-xs font-bold text-foreground block">
                                {nb.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">{nb.region}</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                              {nb.distanceKm} km
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* Standard Monitored Pune Wards List & Zone Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-4">
                  <Card className="border border-border shadow-sm rounded-2xl p-4 bg-card">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-3 px-2">
                      Active SUHI Sensor Zones
                    </span>
                    <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                      {assessments.map((a) => (
                        <div
                          key={a.zone.id}
                          onClick={() => setSelectedId(a.zone.id)}
                          className={cn(
                            "p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                            a.zone.id === selectedId
                              ? "bg-teal-500/10 border-teal-500/40 text-teal-700 font-semibold"
                              : "bg-surface/40 border-transparent hover:bg-surface",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-sm">{a.zone.name}</span>
                          </div>
                          <span className="text-sm font-mono font-bold">{a.riskScore}/100</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  <ZoneDetailsPanel assessment={selectedAssessment} />
                </div>
              </div>
            </div>
          )}

          {/* MODE B: UPLOADED DATASET ANALYSIS */}
          {activeMode === "modeB" && (
            <div className="space-y-8">
              {/* File Upload Dropzone */}
              <Card className="border-2 border-dashed border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-2xl p-8 text-center space-y-4">
                <div className="h-14 w-14 mx-auto rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Upload className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Upload Custom Environmental Dataset
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                    Upload CSV, PDF, or DOCX documents to validate columns, extract thermal
                    measurements, and compute descriptive statistics.
                  </p>
                </div>

                <input
                  type="file"
                  accept=".csv,.pdf,.docx,.doc"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="dataset-file-input"
                />

                <Button
                  asChild
                  className="h-12 px-6 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  <label htmlFor="dataset-file-input">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Select CSV / PDF / DOCX File
                  </label>
                </Button>
              </Card>

              {/* Parsing Progress */}
              {parsing && (
                <Card className="p-6 text-center space-y-2">
                  <div className="h-8 w-8 animate-spin mx-auto rounded-full border-4 border-indigo-600 border-t-transparent" />
                  <p className="text-xs font-bold text-foreground">
                    Extracting & validating dataset records...
                  </p>
                </Card>
              )}

              {/* Parsed Results Overview */}
              {parsedResult && !parsing && (
                <div className="space-y-6">
                  <Card className="border border-indigo-500/30 bg-card rounded-2xl p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                          Uploaded File Analysis Report
                        </span>
                        <h3 className="text-xl font-bold text-foreground">
                          {parsedResult.fileName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Type: {parsedResult.fileType.toUpperCase()} • Valid Rows:{" "}
                          {parsedResult.validRowCount} • Invalid Rows:{" "}
                          {parsedResult.invalidRowCount}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase">
                        Parsed Successfully
                      </span>
                    </div>

                    {/* Detected Summary Metrics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-surface border border-border">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                          Mean Temperature
                        </span>
                        <span className="text-2xl font-black font-mono text-indigo-600">
                          {parsedResult.detectedMetrics.avgTemperatureC != null
                            ? `${parsedResult.detectedMetrics.avgTemperatureC}°C`
                            : "N/A"}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-surface border border-border">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                          Peak Temperature
                        </span>
                        <span className="text-2xl font-black font-mono text-rose-600">
                          {parsedResult.detectedMetrics.maxTemperatureC != null
                            ? `${parsedResult.detectedMetrics.maxTemperatureC}°C`
                            : "N/A"}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-surface border border-border">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                          Detected Locations
                        </span>
                        <span className="text-sm font-bold text-foreground block truncate">
                          {parsedResult.detectedMetrics.detectedLocations.join(", ") ||
                            "None in File"}
                        </span>
                      </div>
                    </div>

                    {/* Column Schema Summary Table */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                        Detected Column Schema & Statistics
                      </span>
                      <div className="overflow-x-auto border border-border rounded-xl">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-surface text-muted-foreground uppercase text-[10px] font-black">
                            <tr>
                              <th className="p-3">Column Name</th>
                              <th className="p-3">Type</th>
                              <th className="p-3">Min</th>
                              <th className="p-3">Max</th>
                              <th className="p-3">Mean</th>
                              <th className="p-3">Median</th>
                              <th className="p-3">Sample Values</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {parsedResult.columns.map((col) => (
                              <tr key={col.colName}>
                                <td className="p-3 font-bold text-foreground">{col.colName}</td>
                                <td className="p-3 font-mono capitalize">{col.type}</td>
                                <td className="p-3 font-mono">{col.min ?? "—"}</td>
                                <td className="p-3 font-mono">{col.max ?? "—"}</td>
                                <td className="p-3 font-mono font-bold text-indigo-600">
                                  {col.mean ?? "—"}
                                </td>
                                <td className="p-3 font-mono">{col.median ?? "—"}</td>
                                <td className="p-3 text-muted-foreground truncate max-w-[200px]">
                                  {col.sampleValues.join(", ")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </AppLayout>
    </RoleGuard>
  );
}
