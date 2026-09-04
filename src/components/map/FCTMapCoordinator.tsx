"use client";

import React, { useState, useMemo } from "react";
import type { NGOConfig, FCTAreaCouncilData, FCTAreaCouncilId } from "@/lib/schema/ngo.schema";
import { FCTInteractiveMap } from "./FCTInteractiveMap";
import { CouncilDetailDrawer } from "./CouncilDetailDrawer";
import { FALLBACK_FCT_COUNCILS } from "./fct-councils-data";

export interface FCTMapCoordinatorProps {
  config?: Partial<NGOConfig>;
  onOpenDonation?: (councilId?: string) => void;
  className?: string;
}

const COUNCIL_LIST: Array<{ id: FCTAreaCouncilId; label: string }> = [
  { id: "amac", label: "AMAC" },
  { id: "bwari", label: "Bwari" },
  { id: "gwagwalada", label: "Gwagwalada" },
  { id: "kuje", label: "Kuje" },
  { id: "kwali", label: "Kwali" },
  { id: "abaji", label: "Abaji" },
];

export function FCTMapCoordinator({
  config,
  onOpenDonation,
  className = "",
}: FCTMapCoordinatorProps) {
  const [selectedCouncilId, setSelectedCouncilId] = useState<FCTAreaCouncilId | null>(null);

  // Merge provided councils from config with robust fallback data
  const councils: Record<FCTAreaCouncilId, FCTAreaCouncilData> = useMemo(() => {
    if (config?.councils && Object.keys(config.councils).length > 0) {
      return {
        ...FALLBACK_FCT_COUNCILS,
        ...config.councils,
      };
    }
    return FALLBACK_FCT_COUNCILS;
  }, [config?.councils]);

  // Aggregated Stats
  const totalProjects = useMemo(() => {
    return Object.values(councils).reduce(
      (acc, council) => acc + (council.activeProjects?.length ?? 0),
      0
    );
  }, [councils]);

  const totalBeneficiaries = useMemo(() => {
    return Object.values(councils).reduce((acc, council) => {
      const councilTotal = council.activeProjects?.reduce(
        (sum, p) => sum + (p.beneficiariesCount ?? 0),
        0
      );
      return acc + (councilTotal ?? 0);
    }, 0);
  }, [councils]);

  const activeCouncil = selectedCouncilId ? councils[selectedCouncilId] : null;

  return (
    <section
      id="fct-map"
      className={`py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-parchment-ground,#FAF8F5)] text-[var(--color-granite-deep,#111113)] relative overflow-hidden ${className}`}
      aria-label="FCT Field Operations and Area Councils"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE7DE] border border-[var(--color-parchment-border,#E5DFD5)] text-xs font-bold uppercase tracking-wider text-[var(--color-terracotta-primary,#B85D36)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta-primary,#B85D36)] animate-pulse" />
            Federal Capital Territory Geographic Scope
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-[var(--color-granite-deep,#111113)]">
            Federal Capital Territory Field Operations
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-granite-muted,#7A736B)] leading-relaxed font-body">
            Explore active resilience projects, solar borehole installations, mobile clinics, and IDP learning centres across all 6 Area Councils.
          </p>
        </div>

        {/* Quick Filter Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full max-w-full min-w-0">
          <button
            type="button"
            onClick={() => setSelectedCouncilId(null)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary,#B85D36)] ${
              selectedCouncilId === null
                ? "bg-[var(--color-granite-deep,#111113)] text-white shadow-xs"
                : "bg-white border border-[var(--color-parchment-border,#E5DFD5)] text-[var(--color-granite-deep,#111113)] hover:bg-[#F3EDE4]"
            }`}
          >
            All 6 Councils Overview
          </button>
          {COUNCIL_LIST.map((council) => {
            const isSelected = selectedCouncilId === council.id;
            return (
              <button
                key={council.id}
                type="button"
                onClick={() => setSelectedCouncilId(council.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary,#B85D36)] ${
                  isSelected
                    ? "bg-[var(--color-terracotta-primary,#B85D36)] text-white shadow-xs"
                    : "bg-white border border-[var(--color-parchment-border,#E5DFD5)] text-[var(--color-granite-deep,#111113)] hover:bg-[#F3EDE4]"
                }`}
              >
                {council.label}
              </button>
            );
          })}
        </div>

        {/* Interactive Map & Telemetry Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Interactive Vector Map (7 Cols) */}
          <div className="lg:col-span-7">
            <FCTInteractiveMap
              councils={councils}
              selectedCouncilId={selectedCouncilId}
              onSelectCouncil={(id) => setSelectedCouncilId(id)}
            />
            <p className="mt-3 text-xs text-[var(--color-granite-muted,#7A736B)] text-center sm:text-left flex items-center gap-1.5 justify-center sm:justify-start">
              <svg className="w-4 h-4 text-[var(--color-terracotta-primary,#B85D36)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span>Click or tap any Area Council polygon or headquarters pin to inspect field operations.</span>
            </p>
          </div>

          {/* Council Highlights & Live Telemetry (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Territory Aggregate Metric Ribbon */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-[var(--color-parchment-border,#E5DFD5)] shadow-soft">
                <div className="text-xs uppercase tracking-wider text-[var(--color-granite-muted,#7A736B)] font-semibold">
                  Field Deployments
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-display text-[var(--color-granite-deep,#111113)] mt-1">
                  {totalProjects} Active
                </div>
                <div className="text-xs text-[var(--color-savannah-primary,#1C3F35)] mt-1 font-medium">
                  Verified across 6 councils
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[var(--color-parchment-border,#E5DFD5)] shadow-soft">
                <div className="text-xs uppercase tracking-wider text-[var(--color-granite-muted,#7A736B)] font-semibold">
                  Direct Beneficiaries
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-display text-[var(--color-terracotta-primary,#B85D36)] mt-1">
                  {totalBeneficiaries.toLocaleString()}
                </div>
                <div className="text-xs text-[var(--color-granite-muted,#7A736B)] mt-1 font-medium">
                  FCT rural & peri-urban
                </div>
              </div>
            </div>

            {/* Dynamic Council Spotlight or Territory Summary Card */}
            {activeCouncil ? (
              <div className="p-6 rounded-2xl bg-white border border-[var(--color-terracotta-primary,#B85D36)] shadow-card space-y-4 transition-all duration-300">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-terracotta-primary,#B85D36)]">
                      Selected Area Council
                    </span>
                    <h3 className="text-2xl font-bold font-display text-[var(--color-granite-deep,#111113)]">
                      {activeCouncil.name}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-savannah-primary,#1C3F35)] text-white">
                    {activeCouncil.activeProjects.length} Projects
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-[var(--color-granite-muted,#7A736B)]">
                  <div><strong className="text-[var(--color-granite-deep,#111113)]">Headquarters:</strong> {activeCouncil.headquarters}</div>
                  <div><strong className="text-[var(--color-granite-deep,#111113)]">Terrain Profile:</strong> {activeCouncil.terrainType}</div>
                  <div><strong className="text-[var(--color-granite-deep,#111113)]">Field Lead:</strong> {activeCouncil.fieldDispatchLead.name} ({activeCouncil.fieldDispatchLead.role})</div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCouncilId(activeCouncil.id)}
                    className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-savannah-primary,#1C3F35)] text-white text-sm font-semibold hover:bg-emerald-950 transition-colors text-center"
                  >
                    Open Council Profile & Projects
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenDonation) {
                        onOpenDonation(activeCouncil.id);
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[var(--color-terracotta-primary,#B85D36)] text-white text-sm font-bold hover:bg-[#A34E2A] transition-colors text-center"
                  >
                    Donate to {activeCouncil.name.split(" ")[0]}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white border border-[var(--color-parchment-border,#E5DFD5)] shadow-card space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-savannah-primary,#1C3F35)]" />
                  <h3 className="text-lg font-bold font-display text-[var(--color-granite-deep,#111113)]">
                    Abuja Territory Direct Outreach
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-[var(--color-granite-muted,#7A736B)]">
                  Our operations bridge the divide between central metropolitan Abuja and remote border settlements along the Gurara, Niger, and Kaduna boundary corridors.
                </p>
                <div className="space-y-2 pt-2 border-t border-[var(--color-parchment-border,#E5DFD5)]">
                  {Object.values(councils).slice(0, 3).map((council) => (
                    <div
                      key={council.id}
                      onClick={() => setSelectedCouncilId(council.id)}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-[var(--color-parchment-border,#E5DFD5)] flex items-center justify-between cursor-pointer hover:border-[var(--color-terracotta-primary,#B85D36)] transition-all"
                    >
                      <div>
                        <div className="text-xs font-bold text-[var(--color-granite-deep,#111113)]">{council.name}</div>
                        <div className="text-[11px] text-[var(--color-granite-muted,#7A736B)]">HQ: {council.headquarters}</div>
                      </div>
                      <span className="text-xs font-bold text-[var(--color-terracotta-primary,#B85D36)]">
                        {council.activeProjects.length} Projects →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Slide-over Detail Drawer */}
        <CouncilDetailDrawer
          council={activeCouncil}
          isOpen={activeCouncil !== null}
          onClose={() => setSelectedCouncilId(null)}
          onOpenDonation={(councilId) => {
            setSelectedCouncilId(null);
            onOpenDonation?.(councilId);
          }}
        />
      </div>
    </section>
  );
}
