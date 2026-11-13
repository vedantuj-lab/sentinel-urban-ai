import { useState, useMemo, useEffect } from "react";
import type { ZoneAssessment } from "@/types/risk";
import { LEVEL_HEX } from "@/components/common/risk-ui";
import { cn } from "@/lib/utils";
import { useIsClient } from "@/hooks/use-is-client";
import { PUNE_ZONES_GEOJSON } from "@/data/puneGeoJSON";
import {
  Navigation,
  Search,
  Zap,
  AlertTriangle,
  Info,
  X,
  List,
  Map as MapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Circle,
  GeoJSON,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function getLayerColor(a: ZoneAssessment, layer: "heat" | "lst" | "exposure"): string {
  if (layer === "lst") {
    const temp = a.zone.temperatureC;
    if (temp < 32) return "#3B82F6";
    if (temp < 36) return "#EAB308";
    if (temp < 40) return "#F97316";
    return "#DC2626";
  }
  if (layer === "exposure") {
    const pop = a.zone.populationDensity;
    if (pop < 5000) return "#10B981";
    if (pop < 15000) return "#0F766E";
    if (pop < 35000) return "#4F46E5";
    return "#7C3AED";
  }
  return LEVEL_HEX[a.level];
}

interface Props {
  assessments: ZoneAssessment[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  compact?: boolean;
  showSideDrawer?: boolean;
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [center, zoom, map]);
  return null;
}

export function RiskMap({
  assessments,
  selectedId,
  onSelect,
  className,
  compact,
  showSideDrawer = false,
}: Props) {
  const isClient = useIsClient();
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [activeLayer, setActiveLayer] = useState<"heat" | "lst" | "exposure">("heat");
  const [searchQuery, setSearchQuery] = useState("");
  const [showListView, setShowListView] = useState(false);

  // Geolocation state
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  // Selected Zone
  const selectedAssessment = useMemo(() => {
    return assessments.find((a) => a.zone.id === selectedId) || null;
  }, [assessments, selectedId]);

  // Filtered Assessments
  const filteredAssessments = useMemo(() => {
    return assessments.filter((a) => {
      const matchesLevel = filterLevel === "all" || a.level === filterLevel;
      const matchesSearch =
        !searchQuery ||
        a.zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.zone.ward.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [assessments, filterLevel, searchQuery]);

  // Default Center (Pune Metro Area)
  const mapCenter: [number, number] = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lng];
    if (selectedAssessment) return [selectedAssessment.zone.lat, selectedAssessment.zone.lng];
    return [18.5204, 73.8567]; // Pune default
  }, [userLocation, selectedAssessment]);

  const mapZoom = useMemo(() => {
    if (userLocation) return 14;
    if (selectedAssessment) return 13;
    return 12;
  }, [userLocation, selectedAssessment]);

  // Browser Geolocation Handler
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    setLocationDenied(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude, accuracy });
        toast.success("Location acquired. Centring map on your position.");
      },
      (err) => {
        setLocating(false);
        setLocationDenied(true);
        toast.error("Location access was denied. You can continue using the map manually.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[450px] flex items-center justify-center bg-slate-900 rounded-[2.5rem] border border-border">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Initialising OpenStreetMap GIS Canvas...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[2.5rem] border border-border/40 bg-slate-950 shadow-2xl flex flex-col lg:flex-row",
        compact ? "aspect-[4/3] sm:aspect-[16/9]" : "h-[700px]",
        className,
      )}
    >
      {/* View Mode Switcher: Map vs Accessible Text List View */}
      {showListView ? (
        <div className="flex-1 bg-slate-900 p-8 overflow-y-auto space-y-4 text-white z-20">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-black uppercase tracking-wide editorial">
                Accessible Ward List View
              </h3>
              <p className="text-xs text-white/60">
                Screen-reader accessible tabular listing of all urban risk zones.
              </p>
            </div>
            <Button
              onClick={() => setShowListView(false)}
              className="h-10 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider"
            >
              <MapIcon className="h-4 w-4 mr-2" /> Show Map View
            </Button>
          </div>

          <div className="space-y-3">
            {filteredAssessments.map((a) => (
              <div
                key={a.zone.id}
                onClick={() => {
                  onSelect?.(a.zone.id);
                  setShowListView(false);
                }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all"
              >
                <div>
                  <span className="text-xs font-black uppercase block text-white">
                    {a.zone.name} ({a.zone.ward})
                  </span>
                  <span className="text-[10px] text-white/50">
                    {a.zone.landUse} • Pop: {a.zone.population.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    P#{a.priorityRank}
                  </span>
                  <span
                    className="px-3 py-1 rounded-xl text-[10px] font-black uppercase text-white"
                    style={{ backgroundColor: LEVEL_HEX[a.level] }}
                  >
                    {a.level} ({a.riskScore}/100)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Map Canvas Container */
        <div className="flex-1 relative h-full w-full z-0">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            className="z-0 rounded-[2.5rem]"
          >
            <MapController center={mapCenter} zoom={mapZoom} />

            {/* OpenStreetMap Tile Layer */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* GeoJSON Polygon Choropleth Layer */}
            <GeoJSON
              key={`${activeLayer}-${filteredAssessments.map((a) => a.zone.id).join("-")}`}
              data={PUNE_ZONES_GEOJSON as any}
              style={(feature) => {
                const zoneId = feature?.properties?.zone_id;
                const a = assessments.find((item) => item.zone.id === zoneId);
                const color = a ? getLayerColor(a, activeLayer) : "#3B82F6";
                const isSelected = selectedId === zoneId;

                return {
                  fillColor: color,
                  fillOpacity: isSelected ? 0.65 : 0.35,
                  color: isSelected ? "#FFFFFF" : color,
                  weight: isSelected ? 3 : 1.5,
                };
              }}
              onEachFeature={(feature, layer) => {
                const zoneId = feature?.properties?.zone_id;
                layer.on({
                  click: () => {
                    if (zoneId) onSelect?.(zoneId);
                  },
                });
              }}
            />

            {/* User Geolocation Marker */}
            {userLocation && (
              <>
                <Circle
                  center={[userLocation.lat, userLocation.lng]}
                  radius={userLocation.accuracy || 200}
                  pathOptions={{ color: "#06B6D4", fillColor: "#06B6D4", fillOpacity: 0.15 }}
                />
                <CircleMarker
                  center={[userLocation.lat, userLocation.lng]}
                  radius={10}
                  pathOptions={{
                    color: "#06B6D4",
                    fillColor: "#7C3AED",
                    fillOpacity: 1,
                    weight: 3,
                  }}
                >
                  <Popup>
                    <div className="p-2 text-center font-sans">
                      <p className="font-black text-xs uppercase tracking-wider text-indigo-900">
                        Your Location
                      </p>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        Accuracy: ±{Math.round(userLocation.accuracy)}m
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              </>
            )}

            {/* Ward Centroid Markers */}
            {filteredAssessments.map((a) => {
              const color = getLayerColor(a, activeLayer);
              const isSelected = selectedId === a.zone.id;
              const markerRadius = Math.max(
                8,
                Math.min(20, Math.round(a.zone.population / 12000 + a.riskScore / 12)),
              );

              return (
                <CircleMarker
                  key={a.zone.id}
                  center={[a.zone.lat, a.zone.lng]}
                  radius={markerRadius}
                  pathOptions={{
                    color: isSelected ? "#FFFFFF" : color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.95 : 0.75,
                    weight: isSelected ? 3 : 1.5,
                  }}
                  eventHandlers={{
                    click: () => onSelect?.(a.zone.id),
                  }}
                >
                  <Popup className="rounded-2xl shadow-2xl">
                    <div className="p-3 max-w-xs space-y-3 font-sans">
                      <div className="flex items-start justify-between gap-2 border-b pb-2">
                        <div>
                          <h4 className="font-black text-sm uppercase tracking-wide text-slate-900 leading-tight">
                            {a.zone.name}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">
                            {a.zone.ward} • {a.zone.landUse}
                          </p>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          {a.level}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800">
                        <div className="p-2 rounded bg-slate-100">
                          <span className="text-[8px] uppercase font-black text-slate-400 block">
                            Risk Score
                          </span>
                          <span className="text-base font-black tabular-nums">
                            {a.riskScore}/100
                          </span>
                        </div>
                        <div className="p-2 rounded bg-slate-100">
                          <span className="text-[8px] uppercase font-black text-slate-400 block">
                            Priority Score
                          </span>
                          <span className="text-base font-black tabular-nums text-indigo-600">
                            {a.priorityScore}/100
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelect?.(a.zone.id)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-sm"
                      >
                        VIEW FULL ANALYSIS
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Top Controls Overlay */}
          <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2 max-w-lg">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50" />
              <Input
                id="map-search-input"
                name="mapSearch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ward..."
                className="pl-9 h-11 text-xs font-semibold rounded-2xl border-white/20 bg-slate-900/90 text-white placeholder:text-white/40 shadow-2xl backdrop-blur-xl"
              />
            </div>

            {/* Use My Location Button */}
            <Button
              onClick={handleUseMyLocation}
              disabled={locating}
              className="h-11 rounded-2xl px-4 bg-gradient-to-r from-teal-600 to-indigo-600 hover:opacity-95 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-2xl border border-white/20"
            >
              <Navigation className={cn("h-3.5 w-3.5", locating && "animate-spin")} />
              {locating ? "LOCATING..." : "USE MY LOCATION"}
            </Button>

            {/* Layer Switcher Buttons */}
            <div className="flex bg-slate-900/90 border border-white/20 p-1 rounded-2xl backdrop-blur-xl shadow-2xl">
              <button
                type="button"
                onClick={() => setActiveLayer("heat")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                  activeLayer === "heat"
                    ? "bg-[#7C3AED] text-white shadow-md"
                    : "text-white/60 hover:text-white",
                )}
              >
                Heat Risk
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer("lst")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                  activeLayer === "lst"
                    ? "bg-amber-600 text-white shadow-md"
                    : "text-white/60 hover:text-white",
                )}
              >
                LST Temp
              </button>
              <button
                type="button"
                onClick={() => setActiveLayer("exposure")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                  activeLayer === "exposure"
                    ? "bg-teal-600 text-white shadow-md"
                    : "text-white/60 hover:text-white",
                )}
              >
                Exposure
              </button>
            </div>

            {/* List View Toggle Button for Accessibility */}
            <Button
              onClick={() => setShowListView(true)}
              className="h-11 rounded-2xl px-3 bg-slate-900/90 hover:bg-slate-800 text-white border border-white/20 shadow-2xl"
              title="Accessible Text List View"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Location Permission Denied Notice */}
          {locationDenied && (
            <div className="absolute top-20 left-6 right-6 z-10 p-3 rounded-2xl bg-rose-900/90 border border-rose-500/50 text-white text-xs font-semibold flex items-center justify-between backdrop-blur-xl">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-300 shrink-0" />
                Location access was denied. You can continue using the map manually.
              </span>
              <button
                onClick={() => setLocationDenied(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Privacy Notice Overlay */}
          <div className="absolute bottom-4 left-6 z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-[9px] font-semibold text-white/60 backdrop-blur-md">
            <Info className="h-3 w-3 text-cyan-400 shrink-0" />
            <span>
              Your location is used only to centre the map and is not stored by UrbanSense AI.
            </span>
          </div>

          {/* Legend Overlay */}
          <div className="absolute bottom-4 right-6 z-10 flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-white/15 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-xl shadow-2xl">
            {activeLayer === "heat" &&
              (["low", "medium", "high", "critical"] as const).map((l) => (
                <span key={l} className="inline-flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: LEVEL_HEX[l] }}
                  />
                  {l}
                </span>
              ))}

            {activeLayer === "lst" && (
              <>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" /> &lt;32°C
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#EAB308]" /> 32-36°C
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F97316]" /> 36-40°C
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626]" /> &gt;40°C
                </span>
              </>
            )}

            {activeLayer === "exposure" && (
              <>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" /> &lt;5k/km²
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0F766E]" /> 5k-15k
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#4F46E5]" /> 15k-35k
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#7C3AED]" /> &gt;35k/km²
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Side Panel Drawer for Selected Zone (Only when showSideDrawer is true) */}
      {showSideDrawer && selectedAssessment && !showListView && (
        <div className="w-full lg:w-[380px] bg-slate-900 border-t lg:border-t-0 lg:border-l border-white/15 p-6 flex flex-col justify-between space-y-6 overflow-y-auto text-white z-10">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-teal-400">
                  {selectedAssessment.zone.ward}
                </span>
                <h3 className="text-xl font-black uppercase tracking-wide editorial leading-tight text-white">
                  {selectedAssessment.zone.name}
                </h3>
                <p className="text-[10px] font-semibold text-white/50">
                  {selectedAssessment.zone.landUse}
                </p>
              </div>
              <span
                className="px-3 py-1 rounded-xl text-[10px] font-black uppercase text-white shadow-lg shrink-0"
                style={{ backgroundColor: LEVEL_HEX[selectedAssessment.level] }}
              >
                {selectedAssessment.level}
              </span>
            </div>

            {/* Key Scores */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50 block mb-1">
                  Risk Score
                </span>
                <span className="text-2xl font-black font-mono">
                  {selectedAssessment.riskScore}/100
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50 block mb-1">
                  Priority Rank
                </span>
                <span className="text-2xl font-black font-mono text-amber-400">
                  #{selectedAssessment.priorityRank}
                </span>
              </div>
            </div>

            {/* Reliability & Quality */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50 block mb-1">
                  Reliability
                </span>
                <span className="text-lg font-black font-mono text-cyan-400">
                  {selectedAssessment.confidence}%
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50 block mb-1">
                  Data Quality
                </span>
                <span className="text-lg font-black font-mono text-emerald-400">
                  {selectedAssessment.dataQualityScore}%
                </span>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7C3AED]">
                Top Risk Drivers
              </span>
              <div className="space-y-2">
                {selectedAssessment.drivers.slice(0, 3).map((d) => (
                  <div
                    key={d.label}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold flex justify-between items-center"
                  >
                    <span>{d.label}</span>
                    <span className="font-mono text-indigo-300 font-bold">{d.weightPct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900/40 to-indigo-900/40 border border-teal-500/30 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Action Directive
              </span>
              <p className="text-xs font-semibold leading-relaxed text-white/90">
                {selectedAssessment.recommendation}
              </p>
            </div>
          </div>

          <Button
            asChild
            className="w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white shadow-2xl"
          >
            <a href="/analyst">VIEW FULL ANALYSIS</a>
          </Button>
        </div>
      )}
    </div>
  );
}
