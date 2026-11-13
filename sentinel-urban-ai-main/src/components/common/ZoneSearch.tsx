import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { ZONES } from "@/data/mockZones";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function ZoneSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-64 justify-start text-muted-foreground font-normal bg-surface"
        >
          <Search className="mr-2 h-4 w-4" />
          Search zones...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandInput placeholder="Type zone name or ID..." />
          <CommandList>
            <CommandEmpty>No zone found.</CommandEmpty>
            <CommandGroup heading="Urban Zones">
              {ZONES.map((zone) => (
                <CommandItem
                  key={zone.id}
                  value={zone.name}
                  onSelect={() => {
                    navigate({ to: "/map" });
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{zone.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">
                      {zone.id} · {zone.ward}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
