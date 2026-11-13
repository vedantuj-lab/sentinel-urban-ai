export function RiskLegend({ className }: { className?: string }) {
  const categories = [
    { label: "LOW", range: "0–39", color: "#10B981", bg: "bg-emerald-500" },
    { label: "MODERATE", range: "40–64", color: "#F59E0B", bg: "bg-amber-500" },
    { label: "HIGH", range: "65–84", color: "#F97316", bg: "bg-orange-500" },
    { label: "CRITICAL", range: "85–100", color: "#EF4444", bg: "bg-red-500" },
  ];

  return (
    <div
      className={`p-3 rounded-2xl bg-background/90 backdrop-blur-md border border-border/80 shadow-md ${className || ""}`}
    >
      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
        Heat Risk Topography Scale
      </span>
      <div className="flex items-center gap-3">
        {categories.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${c.bg} shrink-0`} />
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-black text-foreground uppercase">{c.label}</span>
              <span className="text-[8px] font-mono font-medium text-muted-foreground">
                {c.range}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
