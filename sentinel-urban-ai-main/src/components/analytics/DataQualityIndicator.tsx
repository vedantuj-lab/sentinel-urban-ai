import React from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  score: number;
  level: "Low" | "Moderate" | "High";
  completeness: number;
  consistency: number;
  validity?: number;
  availability?: number;
  warningMessage?: string;
  className?: string;
}

/**
 * Step 8: Data Quality Score Component (0–100)
 * Classifications:
 * 80–100 = High Quality
 * 60–79 = Moderate Quality
 * 0–59 = Low Quality
 */
export const DataQualityIndicator: React.FC<Props> = ({
  score,
  level,
  completeness,
  consistency,
  validity = 90,
  availability = 90,
  warningMessage,
  className,
}) => {
  const getColor = () => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500";
    if (score >= 60) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getBgColor = () => {
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-100";
    return "bg-rose-50 text-rose-700 border-rose-100";
  };

  const isLowQuality = score < 60;

  return (
    <div className={cn("p-6 rounded-[2rem] border border-slate-200 bg-white shadow-sm", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">
            Data_Quality_Score
          </h3>
        </div>
        <span
          className={cn(
            "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border",
            getBgColor(),
          )}
        >
          {level} Quality ({score}/100)
        </span>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="currentColor"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={213.6}
              strokeDashoffset={213.6 * (1 - score / 100)}
              className={cn("transition-all duration-1000 ease-out", getColor().split(" ")[1])}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-slate-800 tabular-nums">{score}</span>
            <span className="text-[7px] font-black text-slate-400 tracking-widest">QUALITY</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
              <span>Completeness</span>
              <span>{completeness}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-500 transition-all duration-700"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
              <span>Consistency</span>
              <span>{consistency}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-500 transition-all duration-700"
                style={{ width: `${consistency}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {(isLowQuality || warningMessage) && (
        <div className="mt-5 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-rose-800 leading-snug">
            {warningMessage ||
              "Prediction reliability may be reduced because of insufficient or inconsistent data."}
          </p>
        </div>
      )}
    </div>
  );
};
