"use client";

import React, { useState } from "react";
import type { FCTAreaCouncilData, FCTAreaCouncilId } from "@/lib/schema/ngo.schema";
import { FCT_MAP_PATHS } from "./fct-councils-data";

export interface FCTMapSVGProps {
  councils?: Record<FCTAreaCouncilId, FCTAreaCouncilData>;
  selectedCouncilId: FCTAreaCouncilId | null;
  onSelectCouncil: (id: FCTAreaCouncilId) => void;
  className?: string;
}

export function FCTMapSVG({
  councils,
  selectedCouncilId,
  onSelectCouncil,
  className = "",
}: FCTMapSVGProps) {
  const [hoveredCouncilId, setHoveredCouncilId] = useState<FCTAreaCouncilId | null>(null);

  const getCouncilProjectCount = (id: FCTAreaCouncilId): number => {
    if (!councils || !councils[id]) return 0;
    return councils[id].activeProjects?.length ?? 0;
  };

  const getCouncilName = (id: FCTAreaCouncilId, fallback: string): string => {
    if (councils && councils[id]?.name) {
      return councils[id].name;
    }
    return fallback;
  };

  return (
    <div
      className={`relative w-full aspect-[800/750] rounded-2xl bg-[var(--color-parchment-ground,#FAF8F5)] border border-[var(--color-parchment-border,#E5DFD5)] p-2 sm:p-6 shadow-soft overflow-hidden select-none ${className}`}
      role="region"
      aria-label="Interactive Map of Federal Capital Territory 6 Area Councils"
    >
      {/* Background Cartographic Subtle Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#B85D36_0.75px,transparent_0.75px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 800 750"
        className="w-full h-full relative z-10 transition-transform duration-500 ease-out"
        role="group"
        aria-label="Map showing AMAC, Bwari, Gwagwalada, Kuje, Kwali, and Abaji Area Councils"
      >
        <defs>
          {/* Subtle Drop Shadow for Selected Path */}
          <filter id="fct-map-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#111113" floodOpacity="0.18" />
          </filter>

          {/* Active Accent Gradient */}
          <linearGradient id="terracotta-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C96E47" />
            <stop offset="100%" stopColor="#A8522C" />
          </linearGradient>

          <linearGradient id="savannah-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#255246" />
            <stop offset="100%" stopColor="#15332A" />
          </linearGradient>
        </defs>

        {/* FCT Map Area Council Boundaries */}
        <g id="fct-councils-polygons" className="cursor-pointer">
          {FCT_MAP_PATHS.map((pathDef) => {
            const isSelected = selectedCouncilId === pathDef.id;
            const isHovered = hoveredCouncilId === pathDef.id;
            const projectCount = getCouncilProjectCount(pathDef.id);

            // Afro-Modernism color palette logic
            let fillColor = "#F3EDE4"; // Default muted parchment
            let strokeColor = "#D5CBC0"; // Default boundary
            let strokeWidth = "2";

            if (isSelected) {
              fillColor = "#B85D36"; // Terracotta Primary
              strokeColor = "#111113";
              strokeWidth = "3.5";
            } else if (isHovered) {
              fillColor = "#E4DDD0"; // Warmer hovered parchment
              strokeColor = "#B85D36"; // Terracotta accent stroke
              strokeWidth = "2.5";
            }

            return (
              <path
                key={pathDef.id}
                id={`council-path-${pathDef.id}`}
                d={pathDef.d}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter={isSelected ? "url(#fct-map-shadow)" : undefined}
                className="transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B85D36] focus-visible:ring-offset-2"
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`${getCouncilName(pathDef.id, pathDef.name)}. Headquarters: ${pathDef.headquarters}. ${projectCount} active projects. Press Enter or Space to view details.`}
                onMouseEnter={() => setHoveredCouncilId(pathDef.id)}
                onMouseLeave={() => setHoveredCouncilId(null)}
                onClick={() => onSelectCouncil(pathDef.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectCouncil(pathDef.id);
                  }
                }}
              />
            );
          })}
        </g>

        {/* Council Centroid Markers & Pin Labels */}
        <g id="fct-council-markers" className="pointer-events-none">
          {FCT_MAP_PATHS.map((pathDef) => {
            const isSelected = selectedCouncilId === pathDef.id;
            const isHovered = hoveredCouncilId === pathDef.id;
            const projectCount = getCouncilProjectCount(pathDef.id);

            const cx = pathDef.center.x + (pathDef.labelOffset?.x ?? 0);
            const cy = pathDef.center.y + (pathDef.labelOffset?.y ?? 0);
            const bx = pathDef.center.x + (pathDef.badgeOffset?.x ?? 0);
            const by = pathDef.center.y + (pathDef.badgeOffset?.y ?? 0);

            const textColor = isSelected ? "#FAF8F5" : "#111113";
            const subTextColor = isSelected ? "#F3EDE4" : "#7A736B";
            const pinColor = isSelected ? "#D49B35" : isHovered ? "#B85D36" : "#1C3F35";

            return (
              <g
                key={`marker-${pathDef.id}`}
                className="transition-opacity duration-300"
              >
                {/* Headquarters Radar Pulse Indicator */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy - 22}
                    r="12"
                    fill="#FAF8F5"
                    opacity="0.35"
                    className="animate-ping"
                  />
                )}

                {/* HQ Location Marker Pin */}
                <circle
                  cx={cx}
                  cy={cy - 22}
                  r={isSelected ? "5.5" : "4"}
                  fill={pinColor}
                  stroke="#FAF8F5"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Council Name Label */}
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  className={`font-semibold tracking-wide transition-all duration-200 ${
                    isSelected ? "text-[16px] font-bold" : "text-[14px]"
                  }`}
                  fill={textColor}
                  style={{
                    fontFamily: "var(--font-display, inherit)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {pathDef.name}
                </text>

                {/* Headquarters Subtitle */}
                <text
                  x={cx}
                  y={cy + 14}
                  textAnchor="middle"
                  className="text-[11px] font-medium"
                  fill={subTextColor}
                  style={{ fontFamily: "var(--font-body, sans-serif)" }}
                >
                  HQ: {pathDef.headquarters}
                </text>

                {/* Active Projects Count Badge Pill */}
                {projectCount > 0 && (
                  <g transform={`translate(${bx - 44}, ${by + 4})`}>
                    <rect
                      x="0"
                      y="0"
                      width="88"
                      height="20"
                      rx="10"
                      fill={isSelected ? "#1C3F35" : isHovered ? "#111113" : "#FAF8F5"}
                      stroke={isSelected ? "#255246" : "#E5DFD5"}
                      strokeWidth="1"
                      className="transition-all duration-300"
                    />
                    <text
                      x="44"
                      y="14"
                      textAnchor="middle"
                      className="text-[10px] font-semibold"
                      fill={isSelected ? "#FAF8F5" : isHovered ? "#FAF8F5" : "#1C3F35"}
                      style={{ fontFamily: "var(--font-body, sans-serif)" }}
                    >
                      {projectCount} {projectCount === 1 ? "Project" : "Projects"}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Legend / Key in bottom corner */}
      <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-6 z-20 flex flex-col gap-1.5 p-2.5 sm:p-3 rounded-xl bg-[var(--color-parchment-ground,#FAF8F5)]/90 backdrop-blur-sm border border-[var(--color-parchment-border,#E5DFD5)] text-xs text-[var(--color-granite-muted,#7A736B)] shadow-sm pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--color-terracotta-primary,#B85D36)]" />
          <span className="font-medium text-[var(--color-granite-deep,#111113)]">Selected Council</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--color-savannah-primary,#1C3F35)]" />
          <span className="font-medium text-[var(--color-granite-deep,#111113)]">Field Dispatch Hub</span>
        </div>
      </div>
    </div>
  );
}
