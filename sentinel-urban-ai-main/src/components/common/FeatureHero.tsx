import React from "react";
import { cn } from "@/lib/utils";

export type FeatureHeroTheme =
  | "forest"
  | "heat"
  | "analysis"
  | "priorities"
  | "interventions"
  | "scenarios"
  | "admin"
  | "data"
  | "models"
  | "operations";

interface Props {
  title: string;
  description: string;
  badgeText: string;
  theme: FeatureHeroTheme;
  bgImageUrl?: string;
  children?: React.ReactNode;
  className?: string;
}

const THEME_STYLES: Record<
  FeatureHeroTheme,
  { gradient: string; badge: string; defaultBg: string }
> = {
  forest: {
    gradient: "from-[#065F46]/90 via-[#047857]/80 to-[#0B0F19]/95",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    defaultBg:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000",
  },
  heat: {
    gradient: "from-[#C2410C]/90 via-[#EA580C]/80 to-[#0B0F19]/95",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    defaultBg:
      "https://images.unsplash.com/photo-1523848309072-c081734f968a?auto=format&fit=crop&q=80&w=2000",
  },
  analysis: {
    gradient: "from-[#4338CA]/90 via-[#6366F1]/80 to-[#0B0F19]/95",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    defaultBg:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=2000",
  },
  priorities: {
    gradient: "from-[#9F1239]/90 via-[#E11D48]/80 to-[#0B0F19]/95",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    defaultBg:
      "https://images.unsplash.com/photo-1516912481808-34061f8bc9a2?auto=format&fit=crop&q=80&w=2000",
  },
  interventions: {
    gradient: "from-[#075985]/90 via-[#0284C7]/80 to-[#0B0F19]/95",
    badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    defaultBg:
      "https://images.unsplash.com/photo-1517733948473-efec927ec1be?auto=format&fit=crop&q=80&w=2000",
  },
  scenarios: {
    gradient: "from-[#6D28D9]/90 via-[#9333EA]/80 to-[#0B0F19]/95",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    defaultBg:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2000",
  },
  admin: {
    gradient: "from-[#172554]/90 via-[#1D4ED8]/80 to-[#0B0F19]/95",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    defaultBg:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=2000",
  },
  data: {
    gradient: "from-[#334155]/90 via-[#475569]/80 to-[#0B0F19]/95",
    badge: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    defaultBg:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000",
  },
  models: {
    gradient: "from-[#065F46]/90 via-[#047857]/80 to-[#0B0F19]/95",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    defaultBg:
      "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&q=80&w=2000",
  },
  operations: {
    gradient: "from-[#0F766E]/90 via-[#115E59]/80 to-[#0B0F19]/95",
    badge: "bg-teal-500/20 text-teal-300 border-teal-500/40",
    defaultBg:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=2000",
  },
};

export function FeatureHero({
  title,
  description,
  badgeText,
  theme,
  bgImageUrl,
  children,
  className,
}: Props) {
  const t = THEME_STYLES[theme] || THEME_STYLES.forest;
  const image = bgImageUrl || t.defaultBg;

  return (
    <div
      className={cn(
        "relative rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl p-8 sm:p-10 text-white mb-8",
        className,
      )}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {/* Dark Overlay Gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-r", t.gradient)} />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <span
            className={cn(
              "inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border backdrop-blur-md shadow-sm",
              t.badge,
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            {badgeText}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight editorial leading-tight text-white">
            {title}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-white/80 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>

        {children && <div className="shrink-0 flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
