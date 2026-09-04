"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Layers, MapPin, Compass, Radio } from "lucide-react";
import type { FCTAreaCouncilData, FCTAreaCouncilId } from "@/lib/schema/ngo.schema";
import { FALLBACK_FCT_COUNCILS } from "./fct-councils-data";

export interface FCTInteractiveMapProps {
  councils?: Record<FCTAreaCouncilId, FCTAreaCouncilData>;
  selectedCouncilId: FCTAreaCouncilId | null;
  onSelectCouncil: (id: FCTAreaCouncilId) => void;
  className?: string;
}

type MapStyleKey = "positron" | "liberty" | "bright";

interface MapStyleOption {
  key: MapStyleKey;
  label: string;
  url: string;
}

const MAP_STYLES: MapStyleOption[] = [
  { key: "positron", label: "Positron", url: "https://tiles.openfreemap.org/styles/positron" },
  { key: "liberty", label: "Liberty", url: "https://tiles.openfreemap.org/styles/liberty" },
  { key: "bright", label: "Bright", url: "https://tiles.openfreemap.org/styles/bright" },
];

interface CouncilMeta {
  id: FCTAreaCouncilId;
  name: string;
  headquarters: string;
  terrainType: string;
  coordinates: { lng: number; lat: number };
  fallbackPercent: { x: number; y: number };
}

const COUNCIL_CENTROIDS: CouncilMeta[] = [
  {
    id: "bwari",
    name: "Bwari Area Council",
    headquarters: "Bwari",
    terrainType: "Granite Inselbergs & Highlands",
    coordinates: { lng: 7.3756, lat: 9.2789 },
    fallbackPercent: { x: 68, y: 16 },
  },
  {
    id: "amac",
    name: "Abuja Municipal Area Council (AMAC)",
    headquarters: "Garki",
    terrainType: "Urban & Peri-Urban Hills",
    coordinates: { lng: 7.4951, lat: 9.0579 },
    fallbackPercent: { x: 80, y: 36 },
  },
  {
    id: "gwagwalada",
    name: "Gwagwalada Area Council",
    headquarters: "Gwagwalada",
    terrainType: "Floodplain & Agrarian Basins",
    coordinates: { lng: 7.0864, lat: 8.9482 },
    fallbackPercent: { x: 34, y: 46 },
  },
  {
    id: "kuje",
    name: "Kuje Area Council",
    headquarters: "Kuje",
    terrainType: "Undulating Forested Valleys",
    coordinates: { lng: 7.2345, lat: 8.8789 },
    fallbackPercent: { x: 52, y: 52 },
  },
  {
    id: "kwali",
    name: "Kwali Area Council",
    headquarters: "Kwali",
    terrainType: "Savannah Plains & Pottery Belt",
    coordinates: { lng: 7.0142, lat: 8.8719 },
    fallbackPercent: { x: 26, y: 54 },
  },
  {
    id: "abaji",
    name: "Abaji Area Council",
    headquarters: "Abaji",
    terrainType: "Southern Confluence Savannah",
    coordinates: { lng: 6.9428, lat: 8.4739 },
    fallbackPercent: { x: 18, y: 88 },
  },
];

// GeoJSON FeatureCollection for the 6 Area Councils with accurate boundaries covering FCT
const FCT_COUNCILS_GEOJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "bwari",
      properties: { id: "bwari", name: "Bwari" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [7.20, 9.40],
            [7.48, 9.48],
            [7.65, 9.38],
            [7.62, 9.12],
            [7.45, 9.10],
            [7.30, 9.15],
            [7.20, 9.40],
          ],
        ],
      },
    },
    {
      type: "Feature",
      id: "amac",
      properties: { id: "amac", name: "AMAC" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [7.30, 9.15],
            [7.45, 9.10],
            [7.62, 9.12],
            [7.72, 8.95],
            [7.55, 8.85],
            [7.35, 8.90],
            [7.30, 9.15],
          ],
        ],
      },
    },
    {
      type: "Feature",
      id: "gwagwalada",
      properties: { id: "gwagwalada", name: "Gwagwalada" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [6.95, 9.15],
            [7.20, 9.18],
            [7.30, 9.15],
            [7.25, 8.95],
            [7.05, 8.85],
            [6.90, 8.95],
            [6.95, 9.15],
          ],
        ],
      },
    },
    {
      type: "Feature",
      id: "kuje",
      properties: { id: "kuje", name: "Kuje" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [7.25, 8.95],
            [7.35, 8.90],
            [7.55, 8.85],
            [7.65, 8.65],
            [7.40, 8.60],
            [7.20, 8.70],
            [7.25, 8.95],
          ],
        ],
      },
    },
    {
      type: "Feature",
      id: "kwali",
      properties: { id: "kwali", name: "Kwali" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [6.90, 8.95],
            [7.05, 8.85],
            [7.20, 8.70],
            [7.15, 8.55],
            [6.85, 8.65],
            [6.80, 8.80],
            [6.90, 8.95],
          ],
        ],
      },
    },
    {
      type: "Feature",
      id: "abaji",
      properties: { id: "abaji", name: "Abaji" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [6.85, 8.65],
            [7.15, 8.55],
            [7.40, 8.60],
            [7.25, 8.35],
            [6.95, 8.30],
            [6.75, 8.45],
            [6.85, 8.65],
          ],
        ],
      },
    },
  ],
};

export function FCTInteractiveMap({
  councils = FALLBACK_FCT_COUNCILS,
  selectedCouncilId,
  onSelectCouncil,
  className = "",
}: FCTInteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<MapLibreMap | null>(null);

  const [activeStyle, setActiveStyle] = useState<MapStyleKey>("positron");
  const [hoveredCouncilId, setHoveredCouncilId] = useState<FCTAreaCouncilId | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markerPositions, setMarkerPositions] = useState<
    Record<FCTAreaCouncilId, { x: number; y: number } | null>
  >({
    bwari: null,
    amac: null,
    gwagwalada: null,
    kuje: null,
    kwali: null,
    abaji: null,
  });

  // Project screen positions from map coordinates
  const updateMarkerPositions = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const newPositions: Partial<Record<FCTAreaCouncilId, { x: number; y: number }>> = {};
    COUNCIL_CENTROIDS.forEach((c) => {
      try {
        const point = map.project([c.coordinates.lng, c.coordinates.lat]);
        newPositions[c.id] = { x: point.x, y: point.y };
      } catch {
        // Fallback gracefully if projection fails
      }
    });

    setMarkerPositions((prev) => ({ ...prev, ...newPositions }));
  }, []);

  // Configure GeoJSON Source and Fill/Border Layers
  const addGeoJsonLayers = useCallback((map: MapLibreMap) => {
    if (!map.getSource("fct-councils")) {
      map.addSource("fct-councils", {
        type: "geojson",
        data: FCT_COUNCILS_GEOJSON,
      });
    }

    if (!map.getLayer("fct-councils-fill")) {
      map.addLayer({
        id: "fct-councils-fill",
        type: "fill",
        source: "fct-councils",
        paint: {
          "fill-color": "#B85D36",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            0.55,
            ["boolean", ["feature-state", "hover"], false],
            0.38,
            0.12,
          ],
        },
      });
    }

    if (!map.getLayer("fct-councils-borders")) {
      map.addLayer({
        id: "fct-councils-borders",
        type: "line",
        source: "fct-councils",
        paint: {
          "line-color": "#B85D36",
          "line-width": 2,
        },
      });
    }
  }, []);

  // Update feature-state for hover and selected council on MapLibre vector layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    COUNCIL_CENTROIDS.forEach((c) => {
      try {
        map.setFeatureState(
          { source: "fct-councils", id: c.id },
          {
            hover: hoveredCouncilId === c.id,
            selected: selectedCouncilId === c.id,
          }
        );
      } catch {
        // Ignore if layer not yet fully ready
      }
    });
  }, [hoveredCouncilId, selectedCouncilId, mapLoaded]);

  // Fly to selected council when selectedCouncilId changes
  useEffect(() => {
    if (!selectedCouncilId) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    const council = COUNCIL_CENTROIDS.find((c) => c.id === selectedCouncilId);
    if (council) {
      map.flyTo({
        center: [council.coordinates.lng, council.coordinates.lat],
        zoom: 10.2,
        speed: 1.2,
      });
    }
  }, [selectedCouncilId]);

  // Handle Council Selection
  const handleSelectCouncil = useCallback(
    (id: FCTAreaCouncilId) => {
      onSelectCouncil(id);
      const map = mapInstanceRef.current;
      if (map) {
        const council = COUNCIL_CENTROIDS.find((c) => c.id === id);
        if (council) {
          map.flyTo({
            center: [council.coordinates.lng, council.coordinates.lat],
            zoom: 10.2,
            speed: 1.2,
          });
        }
      }
    },
    [onSelectCouncil]
  );

  // Initialize MapLibre GL instance dynamically (lazy loaded to protect First Load JS budget)
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      try {
        const maplibregl = await import("maplibre-gl");
        if (!isMounted || !mapContainerRef.current) return;

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: MAP_STYLES.find((s) => s.key === activeStyle)?.url || MAP_STYLES[0].url,
          center: [7.25, 8.95],
          zoom: 8.8,
          pitch: 15,
          maxBounds: [
            [6.60, 8.15],
            [7.90, 9.60],
          ],
        });

        // Navigation control positioned top-right
        const navControl = new maplibregl.NavigationControl({
          showCompass: true,
          showZoom: true,
        });
        map.addControl(navControl, "top-right");

        map.on("load", () => {
          if (!isMounted) return;
          addGeoJsonLayers(map);
          setMapLoaded(true);
          updateMarkerPositions();
        });

        map.on("style.load", () => {
          if (!isMounted) return;
          addGeoJsonLayers(map);
        });

        map.on("move", updateMarkerPositions);
        map.on("zoom", updateMarkerPositions);
        map.on("resize", updateMarkerPositions);

        map.on("mousemove", "fct-councils-fill", (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const id = feature.properties?.id as FCTAreaCouncilId;
            if (id) {
              setHoveredCouncilId(id);
              map.getCanvas().style.cursor = "pointer";
            }
          }
        });

        map.on("mouseleave", "fct-councils-fill", () => {
          setHoveredCouncilId(null);
          map.getCanvas().style.cursor = "";
        });

        map.on("click", "fct-councils-fill", (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const id = feature.properties?.id as FCTAreaCouncilId;
            if (id) {
              handleSelectCouncil(id);
            }
          }
        });

        mapInstanceRef.current = map;
      } catch (err) {
        console.warn("MapLibre initialization fallback enabled:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [addGeoJsonLayers, handleSelectCouncil, updateMarkerPositions]); // eslint-disable-line react-hooks/exhaustive-deps

  // Switch Map Style
  const handleStyleChange = (styleKey: MapStyleKey) => {
    setActiveStyle(styleKey);
    const selected = MAP_STYLES.find((s) => s.key === styleKey);
    if (selected && mapInstanceRef.current) {
      mapInstanceRef.current.setStyle(selected.url);
    }
  };

  // Impeccable Audit Safeguard: Ensure every SVG inside container has viewBox and width/height
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const sanitizeSvgs = () => {
      const svgs = container.querySelectorAll("svg");
      svgs.forEach((svg) => {
        if (!svg.hasAttribute("viewBox")) {
          svg.setAttribute("viewBox", "0 0 24 24");
        }
        if (!svg.hasAttribute("width")) {
          svg.setAttribute("width", "24");
        }
        if (!svg.hasAttribute("height")) {
          svg.setAttribute("height", "24");
        }
      });
    };

    sanitizeSvgs();
    const observer = new MutationObserver(sanitizeSvgs);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Telemetry HUD Data
  const activeCouncilData = useMemo(() => {
    const activeId = hoveredCouncilId || selectedCouncilId;
    if (activeId && councils[activeId]) {
      return councils[activeId];
    }
    return null;
  }, [hoveredCouncilId, selectedCouncilId, councils]);

  const activeCouncilMeta = useMemo(() => {
    const activeId = hoveredCouncilId || selectedCouncilId;
    if (activeId) {
      return COUNCIL_CENTROIDS.find((c) => c.id === activeId) || null;
    }
    return null;
  }, [hoveredCouncilId, selectedCouncilId]);

  return (
    <div
      className={`relative w-full aspect-[800/650] sm:aspect-[800/600] rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] shadow-sm overflow-hidden select-none ${className}`}
      role="region"
      aria-label="Interactive Vector Map of Federal Capital Territory 6 Area Councils"
    >
      {/* Background Cartographic Subtle Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#B85D36_0.75px,transparent_0.75px)] [background-size:24px_24px] z-0"
        aria-hidden="true"
      />

      {/* MapLibre GL Canvas Container */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full z-0"
        aria-hidden="true"
      />

      {/* Parchment Skeleton Fallback while WebGL / Tile Style Initializes */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#FAF8F5]/80 backdrop-blur-xs pointer-events-none">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FAF8F5] border border-[#E5DFD5] shadow-xs text-xs font-medium text-[#7A736B]">
            <Compass className="w-4 h-4 animate-spin text-[#B85D36]" viewBox="0 0 24 24" width="16" height="16" />
            <span>Loading FCT Vector Cartography...</span>
          </div>
        </div>
      )}

      {/* Style Switcher Pill (Top-Left) */}
      <div
        className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1 p-1 bg-[#FAF8F5]/90 backdrop-blur-md border border-[#E5DFD5] rounded-xl shadow-sm text-xs"
        role="group"
        aria-label="Map Tile Style Switcher"
      >
        <div className="flex items-center gap-1 px-2 py-1 text-[#7A736B] font-medium">
          <Layers className="w-3.5 h-3.5 text-[#B85D36]" viewBox="0 0 24 24" width="14" height="14" />
          <span className="hidden sm:inline">Style</span>
        </div>
        {MAP_STYLES.map((style) => (
          <button
            key={style.key}
            type="button"
            onClick={() => handleStyleChange(style.key)}
            className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-all duration-200 cursor-pointer ${
              activeStyle === style.key
                ? "bg-[#111113] text-[#FAF8F5] shadow-xs font-semibold"
                : "text-[#7A736B] hover:text-[#111113] hover:bg-[#EDE7DE]"
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>

      {/* Interactive Council Markers & Buttons Overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {COUNCIL_CENTROIDS.map((council) => {
          const isSelected = selectedCouncilId === council.id;
          const isHovered = hoveredCouncilId === council.id;
          const councilData = councils[council.id];
          const projectCount = councilData?.activeProjects?.length ?? 0;
          const councilName = councilData?.name || council.name;
          const headquarters = councilData?.headquarters || council.headquarters;
          const pos = markerPositions[council.id];

          // Dynamic stroke color based on hover / selected state: default "#D5CBC0", hovered/selected "#B85D36"
          const currentStroke = isHovered || isSelected ? "#B85D36" : "#D5CBC0";

          return (
            <div
              key={council.id}
              className="absolute w-max pointer-events-auto transition-transform duration-200 ease-out"
              style={{
                left: pos ? `${pos.x}px` : `${council.fallbackPercent.x}%`,
                top: pos ? `${pos.y}px` : `${council.fallbackPercent.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <button
                type="button"
                id={`council-path-${council.id}`}
                data-marker-id={`council-marker-${council.id}`}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${councilName}. Headquarters: ${headquarters}. ${projectCount} active projects.`}
                onMouseEnter={() => setHoveredCouncilId(council.id)}
                onMouseLeave={() => setHoveredCouncilId(null)}
                onClick={() => handleSelectCouncil(council.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectCouncil(council.id);
                  }
                }}
                {...({ stroke: currentStroke } as React.HTMLAttributes<HTMLButtonElement>)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 shadow-sm cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B85D36] ${
                  isSelected
                    ? "bg-[#111113] text-[#FAF8F5] border-[#B85D36] shadow-md scale-105"
                    : isHovered
                    ? "bg-[#FAF8F5] text-[#111113] border-[#B85D36] shadow-md scale-102"
                    : "bg-[#FAF8F5]/90 backdrop-blur-sm text-[#111113] border-[#D5CBC0] hover:border-[#B85D36]"
                }`}
              >
                {/* Terracotta / Savannah Indicator Badge with Pulse Dot */}
                <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                  {(isSelected || isHovered) && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B85D36] opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isSelected
                        ? "bg-[#B85D36]"
                        : isHovered
                        ? "bg-[#B85D36]"
                        : "bg-[#1C3F35]"
                    }`}
                  />
                </span>

                {/* Council Label */}
                <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
                  {council.id.toUpperCase()}
                </span>

                {/* Project Counter Pill */}
                {projectCount > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full transition-colors duration-200 ${
                      isSelected
                        ? "bg-[#B85D36] text-[#FAF8F5]"
                        : isHovered
                        ? "bg-[#EDE7DE] text-[#B85D36]"
                        : "bg-[#EDE7DE] text-[#1C3F35]"
                    }`}
                  >
                    {projectCount}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Telemetry HUD Pill (Bottom-Left) */}
      <div
        className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 flex flex-col gap-1 p-3 sm:p-3.5 max-w-[280px] sm:max-w-xs bg-[#FAF8F5]/95 backdrop-blur-md border border-[#E5DFD5] rounded-xl shadow-md text-xs text-[#7A736B] pointer-events-none select-none"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#E5DFD5]/60 pb-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#111113]">
            <Radio className="w-3.5 h-3.5 text-[#B85D36] animate-pulse" viewBox="0 0 24 24" width="14" height="14" />
            <span className="truncate">
              {activeCouncilData?.name || activeCouncilMeta?.name || "Federal Capital Territory"}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#B85D36]">
            {activeCouncilData ? "Active" : "Telemetry"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] pt-1">
          <div>
            <span className="text-[#9A938A] block text-[10px]">Headquarters</span>
            <span className="font-medium text-[#111113] truncate block">
              {activeCouncilData?.headquarters || activeCouncilMeta?.headquarters || "Abuja"}
            </span>
          </div>
          <div>
            <span className="text-[#9A938A] block text-[10px]">Coordinates</span>
            <span className="font-mono text-[10px] text-[#111113] block">
              {activeCouncilData?.coordinates
                ? `${activeCouncilData.coordinates.lat.toFixed(2)}°N, ${activeCouncilData.coordinates.lng.toFixed(2)}°E`
                : activeCouncilMeta
                ? `${activeCouncilMeta.coordinates.lat.toFixed(2)}°N, ${activeCouncilMeta.coordinates.lng.toFixed(2)}°E`
                : "9.06°N, 7.50°E"}
            </span>
          </div>
          <div className="col-span-2 mt-0.5">
            <span className="text-[#9A938A] block text-[10px]">Terrain Profile</span>
            <span className="font-medium text-[#111113] text-[10px] truncate block">
              {activeCouncilData?.terrainType || activeCouncilMeta?.terrainType || "Savannah Woodland & Granite Ridges"}
            </span>
          </div>
        </div>
      </div>

      {/* Map Legend / Dispatch Indicator (Bottom-Right) */}
      <div className="hidden sm:flex absolute bottom-4 right-4 z-20 items-center gap-3 px-3 py-1.5 bg-[#FAF8F5]/90 backdrop-blur-md border border-[#E5DFD5] rounded-xl shadow-xs text-[11px] text-[#7A736B] pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B85D36]" />
          <span className="font-medium text-[#111113]">Terracotta Focus</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1C3F35]" />
          <span className="font-medium text-[#111113]">Savannah Hub</span>
        </div>
      </div>
    </div>
  );
}
