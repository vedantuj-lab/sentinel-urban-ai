import React from "react";
import { Brain, TrendingUp, Info } from "lucide-react";
import { RiskDriver } from "@/types/risk";
import { cn } from "@/lib/utils";

interface Props {
  explanation: string;
  drivers: RiskDriver[];
  confidence: number;
  confidenceLevel: string;
  className?: string;
}

export const ExplainabilityPanel: React.FC<Props> = ({
  explanation,
  drivers,
  confidence,
  confidenceLevel,
  className,
}) => {
  return (
    <div className={cn("p-4 rounded-xl border border-slate-200 bg-white shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center">
          <Brain className="w-4 h-4 mr-2 text-indigo-500" />
          Explainable AI Insights
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-medium text-slate-400">Confidence:</span>
          <span
            className={cn(
              "text-[10px] font-bold",
              confidenceLevel === "High"
                ? "text-emerald-600"
                : confidenceLevel === "Moderate"
                  ? "text-amber-600"
                  : "text-rose-600",
            )}
          >
            {confidence}%
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
          <p className="text-xs text-slate-600 leading-relaxed italic">"{explanation}"</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
          <TrendingUp className="w-3 h-3 mr-1.5" />
          Key Contributing Factors
        </h4>
        <div className="space-y-3">
          {drivers.map((driver, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-medium text-slate-700">{driver.label}</span>
                <span className="text-[10px] font-bold text-slate-500">
                  {driver.weightPct}% contribution
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500/80 transition-all duration-700"
                    style={{ width: `${driver.weightPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {driver.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
          <Info className="w-3 h-3" />
          <span>
            Regional models use local temperature thresholds and land-use sensitivity weights.
          </span>
        </div>
      </div>
    </div>
  );
};
