"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Trustee } from "@/lib/schema/ngo.schema";

interface TrusteeBoardListProps {
  trustees: Trustee[];
  className?: string;
}

// Icon mappings or initials generator for distinguished trustees
const getTrusteeRoleBadgeColor = (role: string) => {
  if (role.toLowerCase().includes("chairperson")) {
    return {
      badge: "border-[var(--color-savannah-primary)]/30 bg-[var(--color-savannah-surface)] text-[var(--color-savannah-primary)]",
      iconBg: "bg-[var(--color-savannah-primary)] text-white",
      borderAccent: "hover:border-[var(--color-savannah-primary)]",
    };
  }
  if (role.toLowerCase().includes("infrastructure")) {
    return {
      badge: "border-[var(--color-terracotta-primary)]/30 bg-[var(--color-terracotta-surface)] text-[var(--color-terracotta-primary)]",
      iconBg: "bg-[var(--color-terracotta-primary)] text-white",
      borderAccent: "hover:border-[var(--color-terracotta-primary)]",
    };
  }
  if (role.toLowerCase().includes("community")) {
    return {
      badge: "border-[var(--color-ochre-accent)]/30 bg-[#FBF3E4] text-[var(--color-ochre-accent)]",
      iconBg: "bg-[var(--color-ochre-accent)] text-white",
      borderAccent: "hover:border-[var(--color-ochre-accent)]",
    };
  }
  // Legal or general
  return {
    badge: "border-[var(--color-granite-muted)]/30 bg-[var(--color-parchment-subtle)] text-[var(--color-granite-deep)]",
    iconBg: "bg-[var(--color-granite-deep)] text-white",
    borderAccent: "hover:border-[var(--color-granite-deep)]",
  };
};

export const TrusteeBoardList: React.FC<TrusteeBoardListProps> = ({
  trustees,
  className = "",
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-terracotta-primary)]">
            <span className="h-1.5 w-4 rounded-full bg-[var(--color-terracotta-primary)]" />
            Fiduciary Leadership
          </div>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-granite-deep)] font-display sm:text-3xl">
            Board of Incorporated Trustees
          </h3>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm text-[var(--color-granite-muted)]">
            Statutorily registered under Part F of the Companies and Allied Matters Act (CAMA) 2020.
            Entrusted with direct fiduciary, programmatic, and civil accountability.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-granite-muted)]">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-savannah-primary)]" />
          4 Confirmed Trustees
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {trustees.map((trustee, idx) => {
          const colors = getTrusteeRoleBadgeColor(trustee.role);
          const isExpanded = expandedIndex === idx;
          const initials = trustee.name
            .replace(/^(Hon\.|Dr\.|Engr\.|Hajia|Barr\.)\s+/i, "")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <motion.div
              key={trustee.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className={`group relative flex flex-col justify-between rounded-2xl border border-[var(--color-parchment-border)] bg-white p-6 shadow-soft transition-all duration-200 ${colors.borderAccent} hover:shadow-card`}
            >
              <div>
                {/* Header row: Avatar/Initials Badge + Role Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold font-display text-sm tracking-wider shadow-inner ${colors.iconBg}`}
                    >
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[var(--color-granite-deep)] group-hover:text-[var(--color-terracotta-primary)] transition-colors font-display sm:text-lg">
                        {trustee.name}
                      </h4>
                      <p className="text-xs font-medium text-[var(--color-granite-muted)]">
                        {trustee.qualification}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role Pill */}
                <div className="mt-4">
                  <span
                    className={`inline-block rounded-md border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${colors.badge}`}
                  >
                    {trustee.role}
                  </span>
                </div>

                {/* Bio text */}
                <div className="mt-3.5 text-xs sm:text-sm leading-relaxed text-[var(--color-granite-deep)]/80">
                  <p className={isExpanded ? "" : "line-clamp-3 sm:line-clamp-4"}>
                    {trustee.bio}
                  </p>
                </div>
              </div>

              {/* Footer interactive affordance */}
              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-parchment-border)]/60 pt-3">
                <span className="text-[11px] font-medium text-[var(--color-granite-muted)]">
                  CAMA Part F Verified
                </span>
                <button
                  type="button"
                  onClick={() => toggleExpand(idx)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-terracotta-primary)] hover:text-[var(--color-terracotta-link)] focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary)] focus-visible:outline-none rounded-md px-1.5 py-0.5"
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? "Collapse" : "Read full"} biography for ${trustee.name}`}
                >
                  <span>{isExpanded ? "Show Less" : "Full Bio"}</span>
                  <svg
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
