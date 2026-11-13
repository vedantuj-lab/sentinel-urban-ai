import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MiniatureCity } from "@/components/common/MiniatureCity";
import {
  Shield,
  ArrowRight,
  Activity,
  BarChart3,
  Github,
  Brain,
  Thermometer,
  TrendingUp,
  Flame,
  CheckCircle2,
  Globe,
  Cpu,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <PublicLayout>
      {/* HERO SECTION */}
      <div className="relative isolate overflow-hidden min-h-[92vh] flex items-center justify-center bg-[#0B0F19] text-white py-16">
        {/* Multi-Color Ambient Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#7C3AED]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#DB2777]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-[#047857]/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 z-10 w-full">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl flex-shrink-0 text-center lg:text-left"
          >
            {/* Live Pipeline Badge */}
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white border border-white/10 backdrop-blur-md shadow-2xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span>Observe • Analyse • Predict • Prioritise • Recommend</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-7xl mb-6 leading-[1.02] editorial uppercase">
              From Urban Data To <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#DB2777] to-[#F59E0B]">
                Actionable Risk Intelligence.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg leading-relaxed text-white/70 mb-10 max-w-xl mx-auto lg:mx-0 font-medium">
              UrbanSense AI observes environmental patterns, forecasts emerging heat stress risks,
              explains key drivers, and prioritises high-vulnerability sectors for targeted city
              interventions.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="h-16 px-9 text-xs font-black uppercase tracking-[0.25em] bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#DB2777] hover:opacity-95 text-white shadow-[0_0_35px_rgba(124,58,237,0.5)] rounded-2xl border border-white/20 transition-all hover:scale-105 group"
                asChild
              >
                <Link to="/analyst">
                  Explore Analyst Workspace
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Link
                to="/map"
                className="inline-flex items-center gap-2 h-16 px-8 text-xs font-black uppercase tracking-[0.25em] text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl backdrop-blur-md transition-all"
              >
                <Globe className="h-4 w-4 text-[#7C3AED]" />
                Explore Map
              </Link>
            </div>
          </motion.div>

          {/* Right Hero: Interactive 3D HUD City Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative w-full lg:w-[650px] aspect-square flex items-center justify-center"
          >
            <div className="relative w-full h-full rounded-[3.5rem] border border-white/15 bg-slate-950/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(124,58,237,0.2)] overflow-hidden group p-2">
              <MiniatureCity />

              {/* Top-Left HUD Badge: City Health */}
              <div className="absolute top-6 left-6 p-4 bg-slate-900/90 border border-emerald-500/30 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-3 z-20">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-400/80">
                    City Health Score
                  </p>
                  <p className="text-xs font-black text-white font-mono">94.2% Resilience</p>
                </div>
              </div>

              {/* Top-Right HUD Badge: Temperature Peak */}
              <div className="absolute top-6 right-6 p-4 bg-slate-900/90 border border-amber-500/30 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-3 z-20">
                <Thermometer className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-400/80">
                    Heat Stress Peak
                  </p>
                  <p className="text-xs font-black text-white font-mono">38.4°C Ambient</p>
                </div>
              </div>

              {/* Bottom-Left HUD Badge: Model Confidence */}
              <div className="absolute bottom-6 left-6 p-4 bg-slate-900/90 border border-purple-500/30 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-3 z-20">
                <Brain className="h-5 w-5 text-[#7C3AED]" />
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-300">
                    Model Confidence
                  </p>
                  <p className="text-xs font-black text-white font-mono">91% Verified</p>
                </div>
              </div>

              {/* Bottom-Right HUD Badge: Hotspot Alert */}
              <div className="absolute bottom-6 right-6 p-4 bg-slate-900/90 border border-rose-500/30 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-3 z-20">
                <div className="h-9 w-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-rose-400 animate-pulse" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-rose-400">
                    Critical Hotspot
                  </p>
                  <p className="text-xs font-black text-white">Sector B3 Heat Load</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* METRICS & STATS RIBBON */}
      <div className="py-16 bg-[#070A12] border-y border-white/10 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Sensor Nodes", value: "128,402", color: "text-[#7C3AED]" },
              { label: "Predictive Forecast Window", value: "72 Hours", color: "text-[#DB2777]" },
              { label: "Prioritised Interventions", value: "8,410", color: "text-[#F59E0B]" },
              { label: "City Resilience Gain", value: "+14.2%", color: "text-emerald-400" },
            ].map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                key={stat.label}
                className="text-center group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all"
              >
                <p
                  className={`text-3xl sm:text-4xl font-black ${stat.color} tracking-tight tabular-nums mb-1 font-mono`}
                >
                  {stat.value}
                </p>
                <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/50">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 6-STEP INTELLIGENCE PIPELINE WORKFLOW */}
      <div className="py-28 bg-[#0B0F19] text-white relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7C3AED] px-4 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20">
              End-To-End Decision Support
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight editorial">
              Our 6-Stage Risk{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">
                Intelligence Pipeline
              </span>
            </h2>
            <p className="text-sm sm:text-base text-white/60 font-semibold leading-relaxed">
              Converting raw environmental data into explainable, confidence-aware risk insights and
              prioritised interventions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                name: "Observe",
                desc: "Ingests environmental telemetry including air temperature, humidity, vegetation cover, and built-up density.",
                icon: Activity,
                badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/30",
                accent: "border-teal-500/40",
              },
              {
                step: "02",
                name: "Analyse",
                desc: "Validates data schema, detects missing or anomalous values, and evaluates overall data completeness.",
                icon: BarChart3,
                badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
                accent: "border-indigo-500/40",
              },
              {
                step: "03",
                name: "Predict",
                desc: "Applies machine learning models to forecast 72-hour heat risk stress scores and prediction confidence ratings.",
                icon: Cpu,
                badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
                accent: "border-purple-500/40",
              },
              {
                step: "04",
                name: "Explain",
                desc: "Deconstructs risk scores into factor contributions (Temperature %, Built-up %, Low Vegetation %, Population Exposure %).",
                icon: Brain,
                badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
                accent: "border-amber-500/40",
              },
              {
                step: "05",
                name: "Prioritise",
                desc: "Ranks zones using a multi-criteria engine combining hazard severity, population exposure, and vulnerability.",
                icon: TrendingUp,
                badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
                accent: "border-rose-500/40",
              },
              {
                step: "06",
                name: "Recommend",
                desc: "Generates actionable, factor-linked intervention directives like cool-roof protocols or shading measures.",
                icon: CheckCircle2,
                badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                accent: "border-emerald-500/40",
              },
            ].map((card, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                key={card.step}
                className={`p-8 rounded-[2.5rem] bg-white/[0.02] border ${card.accent} backdrop-blur-md hover:bg-white/[0.05] transition-all group relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`px-3 py-1 rounded-xl text-[10px] font-black font-mono border ${card.badgeColor}`}
                  >
                    STAGE {card.step}
                  </span>
                  <card.icon className="h-6 w-6 text-white/60 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-wider mb-3 text-white">
                  {card.name}
                </h3>
                <p className="text-xs text-white/60 font-semibold leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* PRIMARY USE CASE SHOWCASE: URBAN HEAT RISK */}
      <div className="py-28 bg-[#070A12] border-t border-white/10 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Heat Module Details */}
            <div className="space-y-8">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#DB2777] px-4 py-1.5 rounded-full bg-[#DB2777]/10 border border-[#DB2777]/20">
                Primary Use Case
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight editorial leading-tight">
                Urban Heat Risk <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DB2777] to-[#F59E0B]">
                  Intelligence Engine
                </span>
              </h2>
              <p className="text-sm sm:text-base text-white/70 font-semibold leading-relaxed">
                Dense urban built environment traps solar radiation, generating microclimate heat
                islands. UrbanSense AI evaluates multi-factor environmental indices to safeguard
                vulnerable urban communities.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[9px] font-black text-[#DB2777] uppercase tracking-widest block mb-1">
                    Temperature Threshold
                  </span>
                  <span className="text-xl font-black font-mono">34°C Baseline</span>
                </div>
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[9px] font-black text-[#F59E0B] uppercase tracking-widest block mb-1">
                    Vegetation Inverse Factor
                  </span>
                  <span className="text-xl font-black font-mono">NDVI Weighted</span>
                </div>
              </div>

              <Button
                size="lg"
                className="h-14 px-8 text-xs font-black uppercase tracking-widest bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white rounded-2xl shadow-2xl"
                asChild
              >
                <Link to="/analyst">Launch Heat Analysis Workspace</Link>
              </Button>
            </div>

            {/* Right Column: High-Res Aerial Visual + Translucent Overlay */}
            <div className="relative aspect-square lg:aspect-auto lg:h-[520px] rounded-[3.5rem] overflow-hidden border border-white/15 shadow-2xl group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=2000')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070A12] via-[#070A12]/40 to-transparent" />

              {/* Translucent Heat Radar Overlay */}
              <div className="absolute bottom-8 left-8 right-8 p-6 rounded-3xl bg-slate-900/80 border border-white/20 backdrop-blur-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#DB2777]">
                    Zone A — High Heat Index
                  </span>
                  <span className="text-xs font-mono font-bold text-white bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">
                    84 / 100
                  </span>
                </div>
                <p className="text-xs text-white/80 font-semibold leading-relaxed">
                  "Elevated heat risk caused by high ambient temperature, dense built-up
                  infrastructure, and low vegetation coverage."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FUTURE EXPANSION DOMAINS */}
      <div className="py-20 bg-[#0B0F19] text-white border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center space-y-8">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
            Modular Architecture
          </span>
          <h3 className="text-2xl font-black uppercase tracking-wider editorial">
            Multi-Domain Risk Frameworks
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              {
                name: "Urban Heat Risk",
                status: "Active Primary",
                color: "bg-rose-500/10 text-rose-400 border-rose-500/30",
              },
              {
                name: "Flood Risk",
                status: "Pluggable Module",
                color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
              },
              {
                name: "Air Quality Index",
                status: "Pluggable Module",
                color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
              },
              {
                name: "Waste Management Risk",
                status: "Pluggable Module",
                color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
              },
              {
                name: "Infrastructure Stress",
                status: "Pluggable Module",
                color: "bg-purple-500/10 text-purple-400 border-purple-500/30",
              },
            ].map((d) => (
              <div
                key={d.name}
                className={`px-5 py-3 rounded-2xl border backdrop-blur-md flex items-center gap-3 ${d.color}`}
              >
                <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider">{d.name}</span>
                <span className="text-[9px] font-mono opacity-60 uppercase">({d.status})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCT ENGINEER SPOTLIGHT */}
      <div className="py-28 bg-[#070A12] border-t border-white/10 text-white relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7C3AED]">
                Architect Spotlight
              </span>
              <h2 className="text-4xl font-black uppercase tracking-tight editorial">
                Vedant{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">
                  Dalvi
                </span>
              </h2>
              <p className="text-sm sm:text-base text-white/70 font-semibold leading-relaxed">
                Engineering intelligent urban decision-support software by bridging spatial data
                telemetry, explainable risk models, and command-center interfaces.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
                  <Brain className="h-6 w-6 text-[#7C3AED] shrink-0" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Spatial Explainability
                    </h4>
                    <p className="text-xs text-white/60">
                      Designing transparent driver attribution models for urban planning decisions.
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
                  <Shield className="h-6 w-6 text-[#DB2777] shrink-0" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white">
                      Modular Software Architecture
                    </h4>
                    <p className="text-xs text-white/60">
                      Full-stack React/TypeScript & Android native application design.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="https://github.com/vedant-dalvi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 h-12 px-6 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <Github className="h-4 w-4" />
                  Explore Developer Repositories
                </a>
              </div>
            </div>

            <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-[#7C3AED]/20 via-white/[0.03] to-[#DB2777]/20 border border-white/15 text-center space-y-6 shadow-2xl relative">
              <p className="text-7xl sm:text-8xl font-black text-white/25 tracking-tighter select-none font-mono">
                VEDANT
              </p>
              <p className="text-7xl sm:text-8xl font-black text-white/25 tracking-tighter select-none font-mono -mt-10">
                DALVI
              </p>
              <div className="space-y-2 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7C3AED]">
                  Core Philosophy
                </p>
                <p className="text-2xl font-black uppercase tracking-widest text-white editorial">
                  Code With Purpose
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="py-24 bg-[#0B0F19] text-white border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 text-center space-y-8 p-12 rounded-[3.5rem] bg-gradient-to-r from-[#7C3AED]/25 via-[#DB2777]/20 to-[#F59E0B]/25 border border-white/20 backdrop-blur-2xl shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight editorial">
            Access Urban Risk{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">
              Intelligence
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-white/80 font-semibold max-w-xl mx-auto">
            Authenticate as an Urban Analyst or Administrator to explore risk hotspots, run
            prediction simulations, and review recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="h-14 px-8 text-xs font-black uppercase tracking-widest bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white rounded-2xl shadow-2xl"
              asChild
            >
              <Link to="/login">Sign In to Platform</Link>
            </Button>
            <Link
              to="/map"
              className="inline-flex items-center justify-center h-14 px-8 text-xs font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-2xl backdrop-blur-md transition-all"
            >
              Explore Interactive Risk Map
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
