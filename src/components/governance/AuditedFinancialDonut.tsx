"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FinancialAllocation } from "@/lib/schema/ngo.schema";

interface AuditedFinancialDonutProps {
  financialAllocation: FinancialAllocation;
  fiscalYear?: string;
  className?: string;
}

interface AllocationSlice {
  id: "programs" | "logistics" | "governance";
  label: string;
  sublabel: string;
  percent: number;
  color: string;
  hex: string;
  description: string;
  examples: string[];
}

export const AuditedFinancialDonut: React.FC<AuditedFinancialDonutProps> = ({
  financialAllocation,
  fiscalYear = "2024",
  className = "",
}) => {
  const [activeSliceId, setActiveSliceId] = useState<"programs" | "logistics" | "governance">("programs");

  const slices: AllocationSlice[] = [
    {
      id: "programs",
      label: "Direct Program Delivery",
      sublabel: "Water, Healthcare & Schools",
      percent: financialAllocation.programsPercent,
      color: "var(--color-savannah-primary)",
      hex: "#1C3F35",
      description:
        "Direct procurement of solar borehole pumps, maternal healthcare kits, vocational toolsets, and community school supplies in the 6 FCT Area Councils.",
      examples: [
        "Solar aquifer pumping stations (Bwari, Kuje)",
        "Maternal delivery sterile kits (Gwagwalada)",
        "Indigenous vocational grants (Abaji, Kwali)",
      ],
    },
    {
      id: "logistics",
      label: "Field Logistics & Monitoring",
      sublabel: "Terrain Transit & Verification",
      percent: financialAllocation.logisticsPercent,
      color: "var(--color-terracotta-primary)",
      hex: "#B85D36",
      description:
        "Terrain transport across rugged feeder roads, independent impact verification, community audit town halls, and real-time sensor telematics.",
      examples: [
        "Quarterly hydrological telemetry testing",
        "Rural 4WD access to riverine wards",
        "Third-party civil society impact audits",
      ],
    },
    {
      id: "governance",
      label: "Administrative Governance",
      sublabel: "Statutory Filing & Security",
      percent: financialAllocation.governancePercent,
      color: "var(--color-ochre-accent)",
      hex: "#D49B35",
      description:
        "External institutional financial audits, SCUML anti-money laundering compliance, statutory filings, and bank security custodian charges.",
      examples: [
        "IFRS external statutory audit reporting",
        "SCUML / EFCC compliance & KYC filings",
        "Data privacy & beneficiary registry security",
      ],
    },
  ];

  const activeSlice = slices.find((s) => s.id === activeSliceId) || slices[0];

  // SVG Geometry Calculation
  const size = 260;
  const strokeWidth = 34;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate cumulative offsets
  let accumulatedPercent = 0;
  const sliceAngles = slices.map((slice) => {
    const startPercent = accumulatedPercent;
    accumulatedPercent += slice.percent;
    const strokeDasharray = `${(slice.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((startPercent / 100) * circumference);
    return {
      ...slice,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div
      className={`rounded-2xl border border-[var(--color-parchment-border)] bg-[var(--color-parchment-ground)] p-6 sm:p-8 shadow-card transition-all ${className}`}
    >
      {/* Header with Title & Fiscal Badge */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-parchment-border)] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-savannah-primary)]/20 bg-[var(--color-savannah-surface)] px-3 py-1 text-xs font-semibold text-[var(--color-savannah-primary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-savannah-primary)] animate-pulse" />
            Statutory Fiscal Audit FY{fiscalYear}
          </div>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-[var(--color-granite-deep)] sm:text-2xl font-display">
            Audited Disbursal Ratios
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[var(--color-granite-muted)]">
            Every Naira accounted for under independent external review and statutory IFRS standards.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-parchment-border)] bg-white px-4 py-2 text-right shadow-soft">
          <div className="text-[11px] font-medium tracking-wide uppercase text-[var(--color-granite-muted)]">
            Efficiency Rating
          </div>
          <div className="text-lg font-bold text-[var(--color-savannah-primary)]">
            95% Programmatic
          </div>
          <div className="text-[10px] text-[var(--color-granite-muted)]">
            Delivery + Field Logistics
          </div>
        </div>
      </div>

      {/* Main Visual Section: Donut + Interactive Details */}
      <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left: SVG Donut chart with interactive hover */}
        <div className="flex flex-col items-center justify-center lg:col-span-5">
          <div className="relative flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="-rotate-90 transform"
              role="img"
              aria-label={`Audited Disbursal Chart: ${slices.map((s) => `${s.label} ${s.percent}%`).join(", ")}`}
            >
              {/* Background track circle */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke="var(--color-parchment-subtle)"
                strokeWidth={strokeWidth}
              />

              {/* Individual slice arcs */}
              {sliceAngles.map((slice) => {
                const isActive = slice.id === activeSliceId;
                return (
                  <circle
                    key={slice.id}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={slice.hex}
                    strokeWidth={isActive ? strokeWidth + 6 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    strokeLinecap="butt"
                    className="cursor-pointer transition-all duration-300 ease-out focus:outline-none"
                    style={{
                      opacity: isActive ? 1 : 0.78,
                      filter: isActive ? "drop-shadow(0px 4px 8px rgba(0,0,0,0.15))" : "none",
                    }}
                    onMouseEnter={() => setActiveSliceId(slice.id)}
                    onClick={() => setActiveSliceId(slice.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${slice.label}: ${slice.percent}%`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveSliceId(slice.id);
                      }
                    }}
                  />
                );
              })}
            </svg>

            {/* Centered Readout within the Donut Hole */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlice.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="flex flex-col items-center"
                >
                  <span
                    className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display"
                    style={{ color: activeSlice.hex }}
                  >
                    {activeSlice.percent}%
                  </span>
                  <span className="max-w-[130px] text-xs font-semibold uppercase tracking-wider text-[var(--color-granite-deep)]">
                    {activeSlice.label}
                  </span>
                  <span className="mt-0.5 text-[10px] text-[var(--color-granite-muted)] font-medium">
                    FY{fiscalYear} Allocated
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-[var(--color-granite-muted)]">
            Hover or tap segments to inspect breakdown
          </p>
        </div>

        {/* Right: Slices Breakdown and Context Card */}
        <div className="space-y-4 lg:col-span-7">
          {/* Interactive Slice Selector List */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {slices.map((slice) => {
              const isActive = slice.id === activeSliceId;
              return (
                <button
                  key={slice.id}
                  type="button"
                  onClick={() => setActiveSliceId(slice.id)}
                  className={`flex flex-col rounded-xl border p-3.5 text-left transition-all focus-visible:ring-2 focus-visible:ring-[var(--color-savannah-primary)] focus-visible:outline-none ${
                    isActive
                      ? "border-current bg-white shadow-soft"
                      : "border-[var(--color-parchment-border)] bg-[var(--color-parchment-ground)]/50 hover:bg-white/80"
                  }`}
                  style={{
                    borderColor: isActive ? slice.hex : undefined,
                  }}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: slice.hex }}
                    />
                    <span
                      className="text-lg font-bold font-display"
                      style={{ color: slice.hex }}
                    >
                      {slice.percent}%
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-bold text-[var(--color-granite-deep)]">
                    {slice.label}
                  </div>
                  <div className="text-[11px] text-[var(--color-granite-muted)]">
                    {slice.sublabel}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Slice Detailed Explanation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlice.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-[var(--color-parchment-border)] bg-white p-4 sm:p-5 shadow-soft"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: activeSlice.hex }}
                />
                <h4 className="text-sm font-bold text-[var(--color-granite-deep)]">
                  {activeSlice.label} Breakdown
                </h4>
              </div>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--color-granite-muted)]">
                {activeSlice.description}
              </p>

              <div className="mt-3.5 border-t border-[var(--color-parchment-border)]/60 pt-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-granite-muted)]">
                  Active Direct Cost Allocations:
                </div>
                <ul className="mt-1.5 space-y-1">
                  {activeSlice.examples.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-[var(--color-granite-deep)]">
                      <svg
                        className="h-3.5 w-3.5 shrink-0 text-[var(--color-savannah-primary)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Financial Disclaimer & Conversion Note */}
          <div className="flex items-start gap-2.5 rounded-lg bg-[var(--color-parchment-subtle)]/70 px-3.5 py-2.5 text-[11px] text-[var(--color-granite-muted)]">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-granite-deep)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <span className="font-semibold text-[var(--color-granite-deep)]">Fiduciary Guarantee:</span>{" "}
              Every grant, bequest, and individual gift received in Nigerian Naira (NGN) or Domiciliary Currencies (USD, GBP, EUR) is restricted and audited under the Nigerian Statement of Accounting Standards (SAS) and published annually.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
