"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { Governance } from "@/lib/schema/ngo.schema";
import { AuditedFinancialDonut } from "./AuditedFinancialDonut";
import { TrusteeBoardList } from "./TrusteeBoardList";

interface RegulatoryTrustPanelProps {
  governance: Governance;
  className?: string;
}

export const RegulatoryTrustPanel: React.FC<RegulatoryTrustPanelProps> = ({
  governance,
  className = "",
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const complianceBadges = [
    {
      id: "cac",
      title: "Corporate Affairs Commission",
      authority: "Federal Republic of Nigeria",
      statute: "Part F, CAMA 2020 (Incorporated Trustees)",
      value: governance.cacNumber,
      copyValue: governance.cacNumber,
      issued: `Incorporated ${governance.incorporationDate}`,
      iconBg: "bg-[var(--color-savannah-primary)]",
      statusText: "Active & In Good Standing",
      statusColor: "text-[var(--color-savannah-primary)] bg-[var(--color-savannah-surface)] border-[var(--color-savannah-primary)]/20",
      description:
        "Legally registered non-profit corporate entity with perpetual succession and common seal under Nigerian federal law.",
    },
    {
      id: "scuml",
      title: "SCUML Anti-Money Laundering",
      authority: "EFCC & Federal Ministry of Industry, Trade and Investment",
      statute: "Money Laundering (Prevention and Prohibition) Act 2022",
      value: governance.scumlNumber,
      copyValue: governance.scumlNumber,
      issued: "Special Control Unit Certified",
      iconBg: "bg-[var(--color-terracotta-primary)]",
      statusText: "AML/CFT Compliant",
      statusColor: "text-[var(--color-terracotta-primary)] bg-[var(--color-terracotta-surface)] border-[var(--color-terracotta-primary)]/20",
      description:
        "Full certification of compliance against anti-money laundering and terrorism financing for humanitarian asset flows.",
    },
    {
      id: "firs",
      title: "Federal Inland Revenue Service",
      authority: "FIRS Tax Registry Directorate",
      statute: "National Tax Identification & Exemption Filing",
      value: governance.firsTin,
      copyValue: governance.firsTin,
      issued: "Valid Tax Identification Number (TIN)",
      iconBg: "bg-[var(--color-granite-card)]",
      statusText: "Tax Clearance Current",
      statusColor: "text-[var(--color-granite-deep)] bg-[var(--color-parchment-subtle)] border-[var(--color-parchment-border)]",
      description:
        "Registered federal taxpayer entity with mandatory statutory annual returns and donor tax deductibility credentials.",
    },
    {
      id: "cita",
      title: "Statutory Tax Exemption Status",
      authority: "Companies Income Tax Act (CITA) 2004",
      statute: governance.taxExemptionCitation,
      value: "Section 23 Non-Profit Exemption",
      copyValue: governance.taxExemptionCitation,
      issued: "FCT & Federal Non-Profit Exemption",
      iconBg: "bg-[var(--color-ochre-accent)]",
      statusText: "100% Tax Exempted Gifts",
      statusColor: "text-[var(--color-ochre-accent)] bg-[#FBF3E4] border-[var(--color-ochre-accent)]/30",
      description:
        "Donations and donor contributions qualify as allowable non-profit deductions under Section 23 of CITA 2004.",
    },
  ];

  return (
    <section
      id="governance"
      aria-label="Statutory Compliance, Governance and Transparency"
      className={`relative scroll-mt-20 border-t border-[var(--color-parchment-border)] bg-[var(--color-parchment-ground)] py-16 sm:py-24 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[var(--color-parchment-border)]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-savannah-primary)]/20 bg-[var(--color-savannah-surface)] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-savannah-primary)]">
              <span className="h-2 w-2 rounded-full bg-[var(--color-savannah-primary)]" />
              Institutional Credibility & Trust
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-granite-deep)] font-display sm:text-4xl lg:text-5xl">
              Statutory Compliance, Governance & Transparency
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--color-granite-muted)]">
              Operating with unwavering institutional integrity across the Federal Capital Territory.
              Every regulatory charter, AML certification, and audited financial disbursement is
              openly verifiable.
            </p>
          </div>

          {/* Annual Audited Report Action Button */}
          <div className="shrink-0">
            <a
              href={governance.annualReportPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[var(--color-savannah-primary)] px-5 py-3 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:bg-[#142E27] hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-savannah-primary)] focus-visible:ring-offset-2 active:scale-[0.98]"
            >
              <svg
                className="h-5 w-5 text-white/90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Download Audited Report ({governance.auditedFinancialYear})</span>
            </a>
            <div className="mt-1.5 text-center md:text-right text-[11px] text-[var(--color-granite-muted)]">
              PDF Format • Verified External Audit
            </div>
          </div>
        </div>

        {/* 1. Verified Regulatory Charters Grid */}
        <div className="mt-12">
          <div className="flex items-center justify-between pb-4">
            <h3 className="text-lg font-bold text-[var(--color-granite-deep)] font-display sm:text-xl">
              Verified Regulatory Charters & Legal Registrations
            </h3>
            <span className="text-xs text-[var(--color-granite-muted)]">
              Click number to copy
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {complianceBadges.map((badge, idx) => {
              const isCopied = copiedKey === badge.id;
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="group flex flex-col justify-between rounded-2xl border border-[var(--color-parchment-border)] bg-white p-5 shadow-soft transition-all duration-200 hover:border-[var(--color-savannah-primary)]/40 hover:shadow-card"
                >
                  <div>
                    {/* Badge header & status */}
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.statusColor}`}
                      >
                        {badge.statusText}
                      </span>
                      <span className="text-[10px] font-medium text-[var(--color-granite-muted)]">
                        {badge.issued}
                      </span>
                    </div>

                    {/* Title & Authority */}
                    <h4 className="mt-3 text-sm font-bold text-[var(--color-granite-deep)] font-display">
                      {badge.title}
                    </h4>
                    <p className="text-[11px] font-medium text-[var(--color-granite-muted)]">
                      {badge.authority}
                    </p>

                    {/* Registration Key Badge (Clickable Copy) */}
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => handleCopy(badge.id, badge.copyValue)}
                        className="flex w-full items-center justify-between rounded-lg border border-[var(--color-parchment-border)] bg-[var(--color-parchment-ground)] px-3 py-2 text-left font-mono text-xs font-bold text-[var(--color-granite-deep)] transition-colors hover:bg-[var(--color-parchment-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-savannah-primary)]"
                        title={`Click to copy ${badge.value}`}
                        aria-label={`Copy ${badge.title} identifier: ${badge.value}`}
                      >
                        <span className="truncate pr-2">{badge.value}</span>
                        <span className="shrink-0 text-[10px] font-sans font-medium text-[var(--color-terracotta-primary)]">
                          {isCopied ? "Copied!" : "Copy"}
                        </span>
                      </button>
                    </div>

                    {/* Statute & Description */}
                    <p className="mt-2.5 text-xs leading-relaxed text-[var(--color-granite-muted)]">
                      {badge.description}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-[var(--color-parchment-border)]/60 pt-2.5 text-[10px] font-medium text-[var(--color-granite-muted)]">
                    {badge.statute}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 2. Audited Financial Donut & Capital Allocation */}
        <div className="mt-14">
          <AuditedFinancialDonut
            financialAllocation={governance.financialAllocation}
            fiscalYear={governance.auditedFinancialYear}
          />
        </div>

        {/* 3. Board of Incorporated Trustees */}
        <div className="mt-16 border-t border-[var(--color-parchment-border)] pt-14">
          <TrusteeBoardList trustees={governance.trustees} />
        </div>
      </div>
    </section>
  );
};
