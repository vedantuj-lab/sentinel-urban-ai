import { useAppStore } from "@/lib/state/app-store";
import { REGIONS } from "@/services/RegionService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Aligned with Step 10: Regional Adaptation Engine.
 */
export function RegionalConfigSelector() {
  const { activeRegionId, setRegion } = useAppStore();
  const current = REGIONS.find((r) => r.id === activeRegionId) || REGIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-11 rounded-2xl border-border/40 gap-3 px-6 bg-white/50 backdrop-blur-md shadow-sm"
        >
          <Globe className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {current.name}_ENGINE
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-3 py-2">
          Select Adaptation Region
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {REGIONS.map((r) => (
          <DropdownMenuItem
            key={r.id}
            onClick={() => setRegion(r.id)}
            className={cn(
              "rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest mb-1",
              r.id === activeRegionId && "bg-primary text-white focus:bg-primary focus:text-white",
            )}
          >
            {r.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
