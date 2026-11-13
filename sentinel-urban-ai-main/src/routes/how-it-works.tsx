import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import {
  Eye,
  Globe2,
  LineChart,
  Brain,
  ListOrdered,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorks,
});

function HowItWorks() {
  const workflowStages = [
    {
      num: "01",
      name: "OBSERVE & VALIDATE",
      title: "Data Observation, Validation & Quality Scoring",
      desc: "Collect real-time & historical environmental telemetry. Automatically run completeness, consistency, validity, and outlier checks to compute a transparent Data Quality Score (0–100).",
      input:
        "Temperature, Humidity, Rainfall, Vegetation, Built-up, Exposure, History, Vulnerability",
      output: "Validated Dataset & Data Quality Score",
      icon: Eye,
      accent: "border-teal-500/40 bg-teal-500/10 text-teal-400",
    },
    {
      num: "02",
      name: "NORMALISE & ADAPT",
      title: "Data Normalisation & Regional Calibration",
      desc: "Normalise inputs across scales and calibrate thresholds for specific metropolitan profiles (Mumbai, Delhi, Pune, Bengaluru, Demo Region) to resolve regional data dependencies.",
      input: "Validated Data + Selected Regional Configuration",
      output: "Regionally Adapted Parameter Baselines",
      icon: Globe2,
      accent: "border-indigo-500/40 bg-indigo-500/10 text-indigo-400",
    },
    {
      num: "03",
      name: "PREDICT & CONFIDENCE",
      title: "Urban Heat Risk Prediction & Confidence Calculation",
      desc: "Lightweight ML models calculate predicted heat risk scores and levels (LOW, MODERATE, HIGH, CRITICAL) along with prediction confidence and data reliability warnings.",
      input: "Calibrated Telemetry Streams",
      output: "Risk Score + Risk Level + Prediction Confidence %",
      icon: LineChart,
      accent: "border-purple-500/40 bg-purple-500/10 text-purple-300",
    },
    {
      num: "04",
      name: "EXPLAIN & IDENTIFY",
      title: "Spatial Explainability & Hotspot Map Identification",
      desc: "Identify primary risk drivers with exact percentage contributions (e.g. Temp 32%, Built-up 27%) and render interactive GIS risk surface hotspots.",
      input: "Risk Scores & Driver Contributions",
      output: "Spatial Hotspot Map & Natural Language Explanations",
      icon: Brain,
      accent: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    },
    {
      num: "05",
      name: "PRIORITISE & RANK",
      title: "Transparent Priority Engine & City-Level Ranking",
      desc: "Rank urban zones using a 5-factor transparent priority formula (Severity + Exposure + Frequency + Vulnerability + Confidence) with explicit human-readable reasons.",
      input: "Risk Severity, Population Load, History & Vulnerability",
      output: "Transparent Priority Score & City-Level Priority Ranking Table",
      icon: ListOrdered,
      accent: "border-rose-500/40 bg-rose-500/10 text-rose-400",
    },
    {
      num: "06",
      name: "RECOMMEND & INTERVENE",
      title: "Context-Aware Recommendations & Decision Support",
      desc: "Generate conditional intervention strategies (e.g., green cover, shading, vulnerable population protection, data collection) and dispatch actionable tasks.",
      input: "Priority Rankings & Driver Factors",
      output: "Targeted Recommendations & Action Directives",
      icon: CheckCircle2,
      accent: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    },
  ];

  return (
    <PublicLayout>
      <div className="py-24 sm:py-32 bg-[#0B0F19] text-white relative isolate">
        {/* Background Multi-Color Glows */}
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#7C3AED]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-[500px] h-[500px] bg-[#DB2777]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-3xl text-center mb-20 space-y-4">
            <span className="text-[10px] font-black tracking-[0.4em] text-[#7C3AED] uppercase px-4 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20">
              System Architecture
            </span>
            <h2 className="text-3xl sm:text-6xl font-black tracking-tight text-white editorial uppercase leading-none">
              From Telemetry to <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">
                Intervention.
              </span>
            </h2>
            <p className="mt-6 text-sm sm:text-base leading-relaxed text-white/70 font-semibold">
              UrbanSense AI follows a 6-stage research-gap-driven pipeline to ensure that city
              resources are directed where they have the maximum impact on public safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workflowStages.map((stage) => (
              <div
                key={stage.num}
                className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md hover:bg-white/[0.05] transition-all relative overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-black font-mono px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-white/80">
                      STAGE {stage.num}
                    </span>
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center border ${stage.accent}`}
                    >
                      <stage.icon className="h-5 w-5" />
                    </div>
                  </div>

                  <span className="text-[9px] font-black tracking-widest text-[#7C3AED] uppercase block mb-1">
                    {stage.name}
                  </span>
                  <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight editorial leading-snug">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed font-semibold mb-6">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-3">
                  <div>
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest block mb-0.5">
                      Input Stream
                    </span>
                    <p className="text-[11px] font-bold text-white/90 leading-snug">
                      {stage.input}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="h-3.5 w-3.5 text-[#DB2777] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest block mb-0.5">
                        Generated Output
                      </span>
                      <p className="text-[11px] font-bold text-[#DB2777] leading-snug">
                        {stage.output}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* METHODOLOGY & LIMITATIONS SECTION */}
          <div className="mt-28 space-y-8 p-10 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#F59E0B]">
                  Academic & Operational Boundaries
                </span>
                <h3 className="text-2xl font-black uppercase tracking-wider editorial text-white mt-1">
                  Methodology & Platform Limitations
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest">
                Explicit Disclosure
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-semibold text-white/70 leading-relaxed">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-white font-black uppercase block">Zone-Level Resolution</span>
                <p>
                  Telemetry and risk predictions are calculated at urban ward/zone scale (~1–3 km²),
                  suitable for municipal planning rather than building-level micro-siting.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-white font-black uppercase block">
                  Heuristic Reliability Score
                </span>
                <p>
                  The 50–95% reliability metric is a prototype heuristic derived from sensor
                  completeness, quality checks, and stability, NOT a statistical probability
                  distribution.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-white font-black uppercase block">
                  Decision Support Boundary
                </span>
                <p>
                  UrbanSense AI generates recommendations for human planner evaluation. The software
                  does NOT physically deploy interventions or guarantee physical temperature drops.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-white font-black uppercase block">
                  Consistency Check Scope
                </span>
                <p>
                  The historical consistency check compares risk scores against 14-day demo heat
                  patterns without independent satellite-ground truth verification.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-white font-black uppercase block">
                  Live Weather Dependency
                </span>
                <p>
                  Live meteorological streams rely on Open-Meteo REST endpoints. When offline or
                  unthrottled, the system seamlessly defaults to calibrated demo baselines.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-white font-black uppercase block">
                  Prototype Authentication
                </span>
                <p>
                  Session persistence uses client-side localStorage helpers and pre-configured role
                  profiles designed for prototype demonstration and research review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
