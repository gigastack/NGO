"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type {
  FCTAreaCouncilData,
  FCTFieldProject,
  FCTFieldProjectCategory,
} from "@/lib/schema/ngo.schema";
import { resolveMediaUrl } from "@/lib/media/resolver";

export interface CouncilDetailDrawerProps {
  council: FCTAreaCouncilData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDonation?: (councilId: string) => void;
}

const CATEGORY_STYLES: Record<
  FCTFieldProjectCategory,
  { label: string; bg: string; text: string; border: string }
> = {
  water_sanitation: {
    label: "Water & Sanitation",
    bg: "bg-cyan-50",
    text: "text-cyan-900",
    border: "border-cyan-200",
  },
  healthcare: {
    label: "Primary Health",
    bg: "bg-emerald-50",
    text: "text-emerald-900",
    border: "border-emerald-200",
  },
  education: {
    label: "Education & Literacy",
    bg: "bg-amber-50",
    text: "text-amber-900",
    border: "border-amber-200",
  },
  agriculture: {
    label: "Food Security & Agro",
    bg: "bg-lime-50",
    text: "text-lime-900",
    border: "border-lime-200",
  },
  idp_resilience: {
    label: "Displacement Resilience",
    bg: "bg-orange-50",
    text: "text-orange-900",
    border: "border-orange-200",
  },
};

export function CouncilDetailDrawer({
  council,
  isOpen,
  onClose,
  onOpenDonation,
}: CouncilDetailDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && council && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="council-drawer-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative w-full max-w-xl bg-[var(--color-parchment-ground,#FAF8F5)] h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-[var(--color-parchment-border,#E5DFD5)]"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[var(--color-parchment-border,#E5DFD5)] bg-[#F5EFE6] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--color-terracotta-primary,#B85D36)]" />
                  <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-granite-muted,#7A736B)]">
                    Area Council Field Profile
                  </span>
                </div>
                <h2
                  id="council-drawer-title"
                  className="text-2xl font-bold text-[var(--color-granite-deep,#111113)] font-display tracking-tight"
                >
                  {council.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-md bg-[var(--color-parchment-ground,#FAF8F5)] border border-[var(--color-parchment-border,#E5DFD5)] font-medium text-[var(--color-granite-deep,#111113)]">
                    HQ: {council.headquarters}
                  </span>
                  <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-md bg-[var(--color-parchment-ground,#FAF8F5)] border border-[var(--color-parchment-border,#E5DFD5)] font-medium text-[var(--color-granite-muted,#7A736B)]">
                    Terrain: {council.terrainType}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close Council Details Drawer"
                className="rounded-full p-2 text-[var(--color-granite-muted,#7A736B)] hover:text-[var(--color-granite-deep,#111113)] hover:bg-[var(--color-parchment-ground,#FAF8F5)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary,#B85D36)]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Field Stats Pill Ribbon */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-[var(--color-parchment-border,#E5DFD5)] shadow-xs">
                  <div className="text-xs text-[var(--color-granite-muted,#7A736B)] font-medium">Population Served</div>
                  <div className="text-xl font-bold text-[var(--color-granite-deep,#111113)] mt-0.5">
                    {council.populationServed.toLocaleString()}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[var(--color-parchment-border,#E5DFD5)] shadow-xs">
                  <div className="text-xs text-[var(--color-granite-muted,#7A736B)] font-medium">Active Initiatives</div>
                  <div className="text-xl font-bold text-[var(--color-savannah-primary,#1C3F35)] mt-0.5">
                    {council.activeProjects.length} Verified
                  </div>
                </div>
              </div>

              {/* Field Dispatch Lead Card */}
              {council.fieldDispatchLead && (
                <div className="p-4 rounded-xl bg-white border border-[var(--color-parchment-border,#E5DFD5)] space-y-3 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-terracotta-primary,#B85D36)]">
                    Operational Field Lead
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-[var(--color-granite-deep,#111113)] text-base">
                        {council.fieldDispatchLead.name}
                      </div>
                      <div className="text-xs text-[var(--color-granite-muted,#7A736B)]">
                        {council.fieldDispatchLead.role}
                      </div>
                    </div>
                    {council.fieldDispatchLead.phone && (
                      <a
                        href={`tel:${council.fieldDispatchLead.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-savannah-primary,#1C3F35)] text-white text-xs font-semibold hover:bg-emerald-900 transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-savannah-primary,#1C3F35)]"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>Dispatch Desk</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Active Projects List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[var(--color-granite-deep,#111113)] font-display">
                    Field Projects & Settlements
                  </h3>
                  <span className="text-xs text-[var(--color-granite-muted,#7A736B)]">
                    {council.activeProjects.length} active
                  </span>
                </div>

                {council.activeProjects.map((project: FCTFieldProject) => {
                  const style = CATEGORY_STYLES[project.category] || {
                    label: project.category,
                    bg: "bg-stone-100",
                    text: "text-stone-800",
                    border: "border-stone-200",
                  };
                  const resolvedImage = project.mediaPath ? resolveMediaUrl(project.mediaPath) : null;

                  return (
                    <article
                      key={project.id}
                      className="p-4 rounded-xl bg-white border border-[var(--color-parchment-border,#E5DFD5)] space-y-3 shadow-xs hover:border-[var(--color-terracotta-primary,#B85D36)] transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}
                        >
                          {style.label}
                        </span>
                        <span className="text-xs font-semibold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {project.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-[var(--color-granite-deep,#111113)] text-base leading-snug">
                        {project.title}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-[var(--color-granite-muted,#7A736B)]">
                        <span className="flex items-center gap-1 font-medium">
                          <svg className="w-3.5 h-3.5 text-[var(--color-terracotta-primary,#B85D36)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {project.settlementName} ({project.settlementType})
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-[var(--color-granite-deep,#111113)]">
                          {project.beneficiariesCount.toLocaleString()} reached
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-[var(--color-granite-deep,#111113)]/80">
                        {project.description}
                      </p>

                      {resolvedImage && (
                        <div className="relative w-full h-36 rounded-lg overflow-hidden bg-stone-100 mt-2">
                          <Image
                            src={resolvedImage}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 600px) 100vw, 500px"
                          />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Bottom Drawer Action Footer */}
            <div className="p-4 sm:p-6 border-t border-[var(--color-parchment-border,#E5DFD5)] bg-[#F5EFE6] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[var(--color-parchment-border,#E5DFD5)] text-sm font-semibold text-[var(--color-granite-deep,#111113)] hover:bg-white transition-colors"
              >
                Close View
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onOpenDonation) {
                    onOpenDonation(council.id);
                  }
                }}
                className="flex-1 px-5 py-2.5 rounded-xl bg-[var(--color-terracotta-primary,#B85D36)] text-white text-sm font-bold shadow-sm hover:bg-[#A34E2A] active:scale-[0.98] transition-all text-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-terracotta-primary,#B85D36)]"
              >
                Support {council.name.split(" ")[0]} Initiatives
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
