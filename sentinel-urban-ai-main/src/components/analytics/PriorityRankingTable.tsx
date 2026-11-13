import { useState, useMemo } from "react";
import type { ZoneAssessment } from "@/types/risk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  assessments: ZoneAssessment[];
  onSelect?: (id: string) => void;
}

/**
 * Step 17: City-Level Priority Ranking.
 * Supports sorting by Priority, Risk, Population Exposure, Confidence, and Historical Frequency.
 */
export function PriorityRankingTable({ assessments, onSelect }: Props) {
  const [sortKey, setSortKey] = useState<
    keyof ZoneAssessment | "zoneName" | "frequency" | "exposure"
  >("priorityScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedData = useMemo(() => {
    return [...assessments].sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortKey === "zoneName") {
        valA = a.zone.name;
        valB = b.zone.name;
      } else if (sortKey === "frequency") {
        valA = a.zone.historicalRiskFrequency;
        valB = b.zone.historicalRiskFrequency;
      } else if (sortKey === "exposure") {
        const order = { Low: 1, Moderate: 2, High: 3, "Very High": 4 };
        valA = order[a.populationExposure as keyof typeof order] || 0;
        valB = order[b.populationExposure as keyof typeof order] || 0;
      } else {
        valA = a[sortKey as keyof ZoneAssessment];
        valB = b[sortKey as keyof ZoneAssessment];
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [assessments, sortKey, sortOrder]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  return (
    <div className="rounded-[2.5rem] border border-border/40 bg-white overflow-hidden shadow-premium">
      <div className="p-8 border-b border-border/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-black uppercase tracking-widest editorial">
            City_Level_Priority_Ranking
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full border border-border"
                >
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-4 rounded-2xl">
                <p className="text-xs font-medium leading-relaxed">
                  Priority Score = (Risk Severity * 35%) + (Population Exposure * 20%) + (Historical
                  Frequency * 15%) + (Vulnerability * 20%) + (Prediction Confidence * 10%)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Badge
          variant="outline"
          className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary bg-primary/5 px-3 py-1.5 rounded-xl w-fit"
        >
          {assessments.length}_City_Zones_Ranked
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-surface/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-12 text-center text-[10px] font-black uppercase tracking-widest">
                Rank
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("zoneName")}
                  className="text-[10px] font-black uppercase tracking-widest h-8 px-2"
                >
                  Zone <ArrowUpDown className="ml-1.5 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("riskScore")}
                  className="text-[10px] font-black uppercase tracking-widest h-8 px-2"
                >
                  Risk Level <ArrowUpDown className="ml-1.5 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("confidence")}
                  className="text-[10px] font-black uppercase tracking-widest h-8 px-2"
                >
                  Confidence <ArrowUpDown className="ml-1.5 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("exposure")}
                  className="text-[10px] font-black uppercase tracking-widest h-8 px-2"
                >
                  Exposure <ArrowUpDown className="ml-1.5 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("frequency")}
                  className="text-[10px] font-black uppercase tracking-widest h-8 px-2"
                >
                  History <ArrowUpDown className="ml-1.5 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("priorityScore")}
                  className="text-[10px] font-black uppercase tracking-widest h-8 px-2 ml-auto"
                >
                  Priority <ArrowUpDown className="ml-1.5 h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((a, i) => (
              <TableRow
                key={a.zone.id}
                className="group cursor-pointer hover:bg-surface/60 transition-colors border-b border-border/10 last:border-none"
                onClick={() => onSelect?.(a.zone.id)}
              >
                <TableCell className="text-center font-black text-muted-foreground tabular-nums">
                  #{i + 1}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-black text-sm uppercase tracking-tight">{a.zone.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      {a.zone.ward}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "text-[9px] font-black uppercase tracking-wider border-none px-2.5 py-0.5 rounded-lg",
                      a.level === "critical"
                        ? "bg-risk-critical text-white"
                        : a.level === "high"
                          ? "bg-risk-high text-white"
                          : a.level === "medium"
                            ? "bg-risk-medium text-white"
                            : "bg-risk-low text-white",
                    )}
                  >
                    {a.level} ({a.riskScore}/100)
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "text-[10px] font-black tabular-nums px-2 py-0.5 rounded-lg border",
                      a.confidence >= 80
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : a.confidence >= 60
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-rose-50 text-rose-700 border-rose-100",
                    )}
                  >
                    {a.confidence}%
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                      a.populationExposure === "Very High"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : a.populationExposure === "High"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-surface text-muted-foreground border-border/40",
                    )}
                  >
                    {a.populationExposure}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
                    {Math.round(a.zone.historicalRiskFrequency * 100)}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-lg font-black tabular-nums">{a.priorityScore}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
