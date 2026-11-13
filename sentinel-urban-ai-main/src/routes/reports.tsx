import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/layouts/AppLayout";
import { useAuth, RoleGuard } from "@/auth/auth-context";
import {
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Upload,
  Key,
  Clock,
  Copy,
  Plus,
  Trash2,
  FileType,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ZONES } from "@/data/mockZones";
import { RiskService } from "@/services/RiskService";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

interface ReportItem {
  id: string;
  title: string;
  date: string;
  status: "Generated" | "Archived" | "Uploaded";
  type: string;
  fileSize?: string;
}

function ReportsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [reportsList, setReportsList] = useState<ReportItem[]>([
    {
      id: "R-2026-001",
      title: "Daily Heat Risk Summary",
      date: "2026-08-27",
      status: "Generated",
      type: "Standard",
      fileSize: "1.2 MB",
    },
    {
      id: "R-2026-002",
      title: "Weekly Intervention Analysis",
      date: "2026-08-24",
      status: "Generated",
      type: "Analytical",
      fileSize: "2.4 MB",
    },
    {
      id: "R-2026-003",
      title: "Ward-wise Population Exposure",
      date: "2026-08-20",
      status: "Archived",
      type: "Census-linked",
      fileSize: "3.1 MB",
    },
    {
      id: "R-2026-004",
      title: "Model Performance Audit Q3",
      date: "2026-08-15",
      status: "Archived",
      type: "Audit",
      fileSize: "850 KB",
    },
    {
      id: "R-2026-005",
      title: "Citizen Observation Log",
      date: "2026-08-10",
      status: "Generated",
      type: "Feedback",
      fileSize: "1.8 MB",
    },
  ]);

  const [schedules, setSchedules] = useState([
    {
      id: "1",
      name: "Daily Risk Digest",
      time: "08:00 AM",
      recipients: "city-officials@urbansense.ai",
      active: true,
    },
    {
      id: "2",
      name: "Critical Alert Instant Report",
      time: "Real-time",
      recipients: "emergency-dispatch@urbansense.ai",
      active: true,
    },
  ]);

  const filteredReports = useMemo(() => {
    return reportsList.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || r.type.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [reportsList, searchQuery, selectedCategory]);

  const handleDownload = (format: "PDF" | "CSV", reportTitle?: string) => {
    const assessments = RiskService.assessAllSync(ZONES);
    const dateStr = new Date().toISOString().split("T")[0];

    if (format === "CSV") {
      const headers = [
        "Zone ID",
        "Zone Name",
        "Ward",
        "Risk Score",
        "Level",
        "Priority Rank",
        "Confidence %",
        "Temperature (°C)",
        "Population",
      ];
      const rows = assessments.map((a) => [
        a.zone.id,
        a.zone.name,
        a.zone.ward,
        a.riskScore,
        a.level.toUpperCase(),
        a.priorityRank,
        a.confidence,
        a.zone.temperatureC,
        a.zone.population,
      ]);

      const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `UrbanSense_Intelligence_${reportTitle ? reportTitle.replace(/\s+/g, "_") : "Report"}_${dateStr}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("CSV Dataset exported successfully.");
      return;
    }

    // PDF Download Generation
    const pdfTextContent = `================================================================================
URBANSENSE AI - METROPOLITAN RISK INTELLIGENCE REPORT
================================================================================
Title: ${reportTitle || "City-Wide Environmental Risk Assessment"}
Generated Date: ${dateStr}
Security Classification: Official / Proprietary
Issued By: Sentinel Urban AI Autonomous Surveillance System

EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
This report summarizes environmental telemetry, vulnerability index scoring,
and priority intervention rankings across monitored urban sectors.

ZONE RISK ASSESSMENTS
--------------------------------------------------------------------------------
${assessments
  .map(
    (a) => `[${a.zone.id}] ${a.zone.name} (${a.zone.ward})
  - Risk Score: ${a.riskScore}/100 (${a.level.toUpperCase()})
  - Priority Rank: #${a.priorityRank} | Confidence: ${a.confidence}%
  - Ambient Temp: ${a.zone.temperatureC}°C | Built-up: ${a.zone.builtUpPct}%
  - Action Needed: ${a.recommendation}
`,
  )
  .join("\n")}
--------------------------------------------------------------------------------
Verification Hash: ${Math.random().toString(36).substring(2, 15)}
End of Report - UrbanSense AI Engine 2026
================================================================================`;

    const blob = new Blob([pdfTextContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `UrbanSense_Risk_Report_${reportTitle ? reportTitle.replace(/\s+/g, "_") : "Summary"}_${dateStr}.pdf`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("PDF Document report generated and downloaded.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const isPdf = file.name.toLowerCase().endsWith(".pdf");
      const isCsv = file.name.toLowerCase().endsWith(".csv");

      if (!isPdf && !isCsv) {
        toast.error("Please upload a PDF (.pdf) or CSV (.csv) document.");
        return;
      }

      const newReport: ReportItem = {
        id: `R-2026-00${reportsList.length + 1}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        date: new Date().toISOString().split("T")[0],
        status: "Uploaded",
        type: isPdf ? "PDF Document" : "CSV Dataset",
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      };

      setReportsList((prev) => [newReport, ...prev]);
      toast.success(`Successfully uploaded and validated ${file.name}`);
    }, 1200);
  };

  const handleGenerateKey = () => {
    const newKey = `us_live_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`;
    setGeneratedApiKey(newKey);
    setIsApiKeyDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API Key copied to clipboard!");
  };

  return (
    <RoleGuard allowedRoles={["admin", "analyst"]}>
      <AppLayout title="Reports & Data Export">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Intelligence Reports & Documents
              </h2>
              <p className="text-muted-foreground">
                Export risk assessments or upload custom PDF / CSV telemetry reports.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2 rounded-xl"
                onClick={() => handleDownload("CSV")}
              >
                <Download className="h-4 w-4 text-emerald-600" />
                Export CSV
              </Button>
              <Button className="gap-2 rounded-xl" onClick={() => handleDownload("PDF")}>
                <FileText className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Upload Dropzone & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-dashed border-2 border-primary/30 bg-primary/5 rounded-[2rem] p-6 hover:bg-primary/10 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept=".pdf,.csv"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-lg">
                  <Upload className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    Upload Custom Report or Dataset (PDF / CSV)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag and drop or click to upload external environmental reports (.pdf) or sensor
                    raw data (.csv).
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                      <FileType className="h-3 w-3" /> PDF Documents
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <FileType className="h-3 w-3" /> CSV Data Tables
                    </span>
                  </div>
                </div>
              </div>
              {isUploading && (
                <div className="mt-4 p-3 rounded-xl bg-background border border-primary/30 flex items-center gap-3">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                  <span className="text-xs font-bold text-primary uppercase">
                    Parsing document & verifying schema...
                  </span>
                </div>
              )}
            </Card>

            <Card className="border-border shadow-panel rounded-[2rem] p-6 flex flex-col justify-center bg-surface/50">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Document Repository
              </span>
              <div className="text-3xl font-black text-foreground mt-1">
                {reportsList.length} Reports
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Including {reportsList.filter((r) => r.status === "Generated").length} generated
                risk briefs and {reportsList.filter((r) => r.status === "Uploaded").length} external
                uploads.
              </p>
            </Card>
          </div>

          {/* Search & Filter Card */}
          <Card className="border-border shadow-panel rounded-[2.5rem]">
            <CardHeader className="bg-surface/30 border-b border-border rounded-t-[2.5rem]">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, ID, or type..."
                    className="pl-9 h-10 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {[
                    "All",
                    "Standard",
                    "Analytical",
                    "Census-linked",
                    "Audit",
                    "Feedback",
                    "Uploaded",
                  ].map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      className="rounded-xl text-xs"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/50 border-b border-border">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Report ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Title
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Type
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Size
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-surface/30 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                        {report.id}
                      </td>
                      <td className="px-6 py-4 font-bold text-sm">{report.title}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{report.type}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{report.date}</td>
                      <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                        {report.fileSize || "1.5 MB"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            report.status === "Generated"
                              ? "bg-green-500/10 text-green-600 border border-green-500/20"
                              : report.status === "Uploaded"
                                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 text-xs rounded-lg text-primary"
                          onClick={() => handleDownload("PDF", report.title)}
                        >
                          <FileText className="h-3.5 w-3.5" /> PDF
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 text-xs rounded-lg text-emerald-600"
                          onClick={() => handleDownload("CSV", report.title)}
                        >
                          <Download className="h-3.5 w-3.5" /> CSV
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredReports.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-muted-foreground text-sm"
                      >
                        No reports matching your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border shadow-sm rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Automated Reporting Schedules
                </CardTitle>
                <CardDescription>
                  Configure scheduled PDF/CSV report delivery to municipal stakeholder email
                  endpoints.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {schedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface/50"
                  >
                    <div>
                      <span className="text-sm font-bold block">{sch.name}</span>
                      <span className="text-xs text-muted-foreground">{sch.recipients}</span>
                    </div>
                    <span className="text-xs font-bold text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                      {sch.time}
                    </span>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full rounded-xl mt-2"
                  onClick={() => setIsScheduleDialogOpen(true)}
                >
                  Manage Delivery Schedules
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  GIS & Raw Telemetry API Access
                </CardTitle>
                <CardDescription>
                  Access live environmental risk vectors and JSON/CSV streaming via REST endpoints.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Export live telemetry feeds directly into ArcGIS, QGIS, or custom urban
                  intelligence platforms.
                </p>
                <div className="p-3.5 rounded-xl bg-sidebar text-sidebar-foreground font-mono text-[11px] break-all border border-border">
                  GET /api/v1/intelligence/hotspots?format=json&type=heat
                </div>
                <Button variant="outline" className="w-full rounded-xl" onClick={handleGenerateKey}>
                  Generate Developer API Key
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Schedule Dialog */}
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogContent className="rounded-[2rem]">
            <DialogHeader>
              <DialogTitle>Manage Delivery Schedules</DialogTitle>
              <DialogDescription>
                Add or modify automated dispatch of PDF risk briefs to ward councillors.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase">Report Name</label>
                <Input placeholder="e.g. Ward 12 Morning Thermal Brief" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase">Recipient Emails</label>
                <Input placeholder="officials@citygov.in" className="rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsScheduleDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsScheduleDialogOpen(false);
                  toast.success("Schedule configuration saved.");
                }}
              >
                Save Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* API Key Dialog */}
        <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
          <DialogContent className="rounded-[2rem]">
            <DialogHeader>
              <DialogTitle>Developer API Key Created</DialogTitle>
              <DialogDescription>
                Use this API key in request headers:{" "}
                <code className="text-primary font-mono">Authorization: Bearer YOUR_KEY</code>
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-muted/50 rounded-2xl border border-border flex items-center justify-between font-mono text-xs break-all">
              <span>{generatedApiKey}</span>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedApiKey)}>
                <Copy className="h-4 w-4 text-primary" />
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsApiKeyDialogOpen(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </RoleGuard>
  );
}
