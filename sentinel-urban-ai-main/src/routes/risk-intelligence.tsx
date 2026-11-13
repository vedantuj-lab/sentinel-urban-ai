import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import {
  Thermometer,
  Droplets,
  Wind,
  ArrowRight,
  TrendingUp,
  Map as MapIcon,
  BarChart3,
  Activity,
  Zap,
  Globe2,
  LineChart,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/risk-intelligence")({
  component: RiskIntelligencePage,
});

const TRAJECTORY_DATA = [
  { time: "00:00", heat: 28, risk: 20 },
  { time: "04:00", heat: 26, risk: 15 },
  { time: "08:00", heat: 32, risk: 45 },
  { time: "12:00", heat: 42, risk: 85 },
  { time: "16:00", heat: 40, risk: 75 },
  { time: "20:00", heat: 34, risk: 40 },
  { time: "23:59", heat: 30, risk: 25 },
];

function RiskIntelligencePage() {
  const risks = [
    {
      title: "Urban Heat",
      desc: "Surface and ambient heat build-up driven by built density and low vegetation cover.",
      status: "Active Monitoring",
      icon: Thermometer,
      color: "risk-high",
      metric: "42°C Peak",
    },
    {
      title: "Flood Risk",
      desc: "Waterlogging and drainage stress modelled from rainfall patterns and urban slope.",
      status: "Predictive",
      icon: Droplets,
      color: "blue-500",
      metric: "84mm/h Sat",
    },
    {
      title: "Air Quality",
      desc: "Concentration of particulate matter and pollutants across transit corridors.",
      status: "Real-time",
      icon: Wind,
      color: "teal-500",
      metric: "142 AQI",
    },
  ];

  return (
    <PublicLayout>
      <div className="relative isolate overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 grid-overlay opacity-10" />
          <div className="absolute inset-0 atmospheric-depth opacity-30" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mb-24"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">
              Pattern Intelligence
            </span>
            <h2 className="text-5xl font-black tracking-tight text-foreground sm:text-7xl mb-8 leading-[1] editorial">
              Deciphering the <br /> Urban <span className="text-primary italic">Trajectory.</span>
            </h2>
            <p className="text-xl leading-relaxed text-muted-foreground font-medium">
              Our research canvas transforms multi-source environmental telemetry into predictive
              models that safeguard the metropolis.
            </p>
          </motion.div>

          {/* Research Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {risks.map((risk, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                key={risk.title}
              >
                <Card className="border-none shadow-premium bg-white group hover:bg-surface/50 transition-all rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-10 pb-6">
                    <div className="flex items-center justify-between mb-8">
                      <div
                        className={`h-14 w-14 rounded-2xl bg-${risk.color}/10 flex items-center justify-center border border-${risk.color}/20 group-hover:scale-110 transition-transform`}
                      >
                        <risk.icon className={`h-7 w-7 text-${risk.color}`} />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[9px] font-black uppercase tracking-widest border-border/60"
                      >
                        {risk.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-black uppercase tracking-widest editorial">
                      {risk.title}
                    </CardTitle>
                    <CardDescription className="text-xs font-semibold mt-2">
                      {risk.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-10 pb-12">
                    <div className="pt-8 border-t border-border/40 flex items-end justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                          Active_Index
                        </p>
                        <p className="text-2xl font-black tabular-nums">{risk.metric}</p>
                      </div>
                      <Button
                        variant="ghost"
                        className="h-12 w-12 rounded-2xl hover:bg-primary/5 text-primary"
                        asChild
                      >
                        <Link to="/map">
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Analysis Canvas (The "Trajectories") */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[4rem] bg-sidebar border-none p-12 lg:p-20 overflow-hidden relative shadow-premium"
          >
            <div className="absolute inset-0 grid-overlay opacity-5 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />

            <div className="relative z-10 lg:flex gap-20 items-center">
              <div className="flex-1 space-y-10">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                    System Methodology
                  </span>
                  <h3 className="text-4xl font-black text-white editorial leading-tight uppercase">
                    Predictive <br /> Momentum.
                  </h3>
                </div>
                <p className="text-white/60 text-lg leading-relaxed font-medium">
                  Our models analyze temporal data trajectories to identify risk thresholds before
                  they are breached. By correlating heat flux with population density, we generate
                  actionable intervention targets.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { label: "Confidence", val: "92.4%", icon: Brain },
                    { label: "Latence", val: "420ms", icon: Activity },
                    { label: "Sync", val: "ACTIVE", icon: Zap },
                    { label: "Coverage", val: "100%", icon: Globe2 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                          {item.label}
                        </p>
                        <p className="text-lg font-black text-white">{item.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 mt-20 lg:mt-0">
                <Card className="bg-white/5 border-white/10 rounded-[3rem] p-10 backdrop-blur-xl shadow-2xl relative group">
                  <div className="absolute top-8 left-10 flex items-center gap-3">
                    <LineChart className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      Live_Trajectory_Canvas
                    </span>
                  </div>

                  <div className="h-[350px] mt-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={TRAJECTORY_DATA}>
                        <defs>
                          <linearGradient id="colorHeat" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="rgba(255,255,255,0.05)"
                        />
                        <XAxis
                          dataKey="time"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 9, fontWeight: 900, fill: "rgba(255,255,255,0.3)" }}
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111",
                            border: "1px solid #333",
                            borderRadius: "16px",
                            fontSize: "10px",
                            fontWeight: "900",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="heat"
                          stroke="var(--color-primary)"
                          strokeWidth={4}
                          fillOpacity={1}
                          fill="url(#colorHeat)"
                          animationDuration={2000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">
                        Momentum_Peak
                      </p>
                      <p className="text-xl font-black text-white">84.2%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">
                        Alert_Phase
                      </p>
                      <p className="text-xl font-black text-primary">STAGE_2</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>

          <div className="mt-32 text-center">
            <Button
              size="lg"
              className="h-16 px-12 rounded-2xl bg-[var(--admin-primary)] text-white font-black uppercase tracking-widest shadow-premium group"
              asChild
            >
              <Link to="/map" className="flex items-center gap-4">
                <MapIcon className="h-5 w-5" />
                Enter Spatial Explorer
                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
