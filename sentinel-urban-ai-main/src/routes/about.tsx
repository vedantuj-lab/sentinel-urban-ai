import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import {
  Shield,
  Target,
  Users,
  Globe,
  Building2,
  Zap,
  FlaskConical,
  Award,
  Brain,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <PublicLayout>
      <div className="py-24 sm:py-32 relative isolate bg-[#0B0F19] text-white">
        {/* Background Multi-Color Glows */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#7C3AED]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-[#DB2777]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl lg:text-center mb-24"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7C3AED] px-4 py-1.5 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20">
              Intelligence Profile
            </span>
            <p className="mt-6 text-4xl sm:text-6xl font-black tracking-tight text-white leading-[0.98] editorial uppercase">
              Pulse of the <br />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">
                Metropolis.
              </span>
            </p>
            <p className="mt-8 text-base sm:text-lg leading-relaxed text-white/70 font-medium italic border-l-4 border-[#7C3AED] pl-6 bg-white/[0.02] py-4 rounded-r-2xl">
              "UrbanSense AI is an explainable, confidence-aware, region-adaptive urban risk
              prioritisation and intervention decision-support platform."
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 mb-32">
            <div className="lg:col-span-2 space-y-12">
              <section className="space-y-4 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-md">
                <h3 className="text-2xl font-black uppercase tracking-tight editorial flex items-center gap-3 text-white">
                  <Target className="h-6 w-6 text-[#DB2777]" />
                  The Problem
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed font-semibold">
                  Most cities react to environmental problems only after they occur — heatwaves lead
                  to hospitalizations, and floods cause damage before action is taken. This reactive
                  approach disproportionately affects vulnerable populations in dense, informal, or
                  low-vegetation zones.
                </p>
              </section>

              <section className="space-y-4 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-md">
                <h3 className="text-2xl font-black uppercase tracking-tight editorial flex items-center gap-3 text-white">
                  <Zap className="h-6 w-6 text-[#F59E0B]" />
                  Our Solution
                </h3>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed font-semibold">
                  We provide a software-only AI platform that transforms fragmented environmental
                  data into prioritized intervention strategies. By predicting risks 48-72 hours in
                  advance, we enable city administrators to deploy resources where they are needed
                  most, saving lives and infrastructure.
                </p>
              </section>
            </div>

            <div className="rounded-[3rem] p-10 bg-gradient-to-br from-[#7C3AED]/20 via-[#111827] to-[#DB2777]/20 border border-white/15 text-white relative overflow-hidden shadow-2xl">
              <FlaskConical className="h-10 w-10 text-[#7C3AED] mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-widest editorial mb-4 leading-tight">
                Research <br /> Gap Alignment
              </h3>
              <div className="space-y-6">
                <p className="text-xs text-white/70 leading-relaxed font-semibold">
                  Extending spatial explainability into operational city-level prioritisation and
                  confidence-aware risk prediction.
                </p>
                <div className="pt-6 border-t border-white/10 space-y-3">
                  {[
                    "Regional Data Calibration",
                    "Prediction Confidence Rating",
                    "Data Quality Validation",
                    "Decision Support Engine",
                  ].map((g) => (
                    <div key={g} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
                        {g}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 space-y-16">
            <section id="values">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-black uppercase tracking-tight editorial text-white">
                  Core Philosophy
                </h3>
                <div className="h-px flex-1 bg-white/10 mx-8 hidden md:block" />
                <Award className="h-7 w-7 text-[#7C3AED]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Data Integrity",
                    desc: "We prioritize scientific accuracy and robust modeling over generic data aggregation.",
                    icon: Shield,
                    color: "text-[#7C3AED]",
                  },
                  {
                    title: "Citizen Centricity",
                    desc: "Our platform is designed to serve the people living in the city, not just the systems managing it.",
                    icon: Users,
                    color: "text-[#DB2777]",
                  },
                  {
                    title: "Sustainable Urbanism",
                    desc: "Every prediction and recommendation is aimed at building long-term urban resilience.",
                    icon: Globe,
                    color: "text-[#F59E0B]",
                  },
                ].map((val) => (
                  <div
                    key={val.title}
                    className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 backdrop-blur-md hover:bg-white/[0.05] transition-all group"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                      <val.icon className={`h-6 w-6 ${val.color}`} />
                    </div>
                    <h4 className="text-lg font-black mb-3 uppercase tracking-wider text-white">
                      {val.title}
                    </h4>
                    <p className="text-xs text-white/60 font-semibold leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-16 border-t border-white/10">
              <section
                id="privacy"
                className="space-y-4 p-8 rounded-[2rem] bg-white/[0.02] border border-white/10"
              >
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#7C3AED]">
                  Privacy Protocol
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-semibold">
                  UrbanSense AI adheres to strict data privacy standards. All environmental
                  telemetry and citizen observations are processed with anonymized identifiers.
                  System logs are retained for 90 days for audit purposes.
                </p>
              </section>
              <section
                id="terms"
                className="space-y-4 p-8 rounded-[2rem] bg-white/[0.02] border border-white/10"
              >
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#DB2777]">
                  Operational Terms
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-semibold">
                  This platform is an intelligence decision-support system. While our models achieve
                  90%+ accuracy, all mitigation actions must be verified by on-ground personnel.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
