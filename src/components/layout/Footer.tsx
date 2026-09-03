"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  FileText,
  MapPin,
  Phone,
  MessageCircle,
  Heart,
} from "lucide-react";
import type { NGOConfig } from "@/lib/schema/ngo.schema";

export interface FooterProps {
  organization: NGOConfig["organization"];
  branding: NGOConfig["branding"];
  governance: NGOConfig["governance"];
  onOpenDonation?: () => void;
}

export function Footer({
  organization,
  branding,
  governance,
  onOpenDonation,
}: FooterProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (key: string, value: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback for non-secure or older environments
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // Graceful silence on permission deny
    }
  };

  const currentYear = new Date().getFullYear();
  // Clean phone numbers for WhatsApp wa.me links (digits only)
  const cleanWhatsapp = organization.whatsappNumber.replace(/[^0-9]/g, "");
  const crestPath = branding.crestSvgPath || "/branding/crest.svg";

  return (
    <footer className="bg-[var(--color-granite-deep)] text-[var(--color-parchment-ground)] border-t border-[var(--color-granite-border)] relative overflow-hidden">
      {/* Top Subtle Savannah Accent Strip */}
      <div className="h-1.5 w-full bg-[var(--color-savannah-primary)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-[var(--color-granite-border)]">
          {/* Column 1: Organization & Identity (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-savannah-primary)] flex items-center justify-center p-2 text-white shadow-soft">
                <img
                  src={crestPath}
                  alt=""
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.classList.remove("hidden");
                  }}
                />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  className="w-6 h-6 hidden text-[var(--color-ochre-accent)]"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>

              <div>
                <span className="font-display font-bold text-lg tracking-tight block text-[var(--color-parchment-ground)]">
                  {organization.tradingName}
                </span>
                <span className="text-xs text-[var(--color-ochre-accent)] font-medium">
                  {organization.legalName}
                </span>
              </div>
            </div>

            <p className="text-sm text-[var(--color-granite-muted)] leading-relaxed">
              {organization.tagline}
            </p>

            <p className="text-xs text-[var(--color-granite-muted)]/80 leading-relaxed italic">
              &ldquo;{organization.mission}&rdquo;
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenDonation}
                className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold text-white bg-[var(--color-terracotta-primary)] hover:bg-[var(--color-terracotta-link)] transition-all shadow-soft active:scale-[0.98]"
              >
                <Heart className="w-3.5 h-3.5 fill-white/20" />
                <span>Support Our Field Missions</span>
              </button>
            </div>
          </div>

          {/* Column 2: Statutory Registration & Transparency (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-savannah-surface)]" />
              <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-[var(--color-parchment-ground)]">
                Statutory Compliance
              </h3>
            </div>

            <p className="text-xs text-[var(--color-granite-muted)]">
              Registered Non-Governmental Organization in the Federal Republic of Nigeria.
            </p>

            <div className="space-y-2 pt-1 font-mono text-xs">
              {/* CAC Number */}
              <div className="flex items-center justify-between p-2 rounded bg-[var(--color-granite-card)] border border-[var(--color-granite-border)]">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-sans text-[var(--color-granite-muted)]">
                    CAC Part F (Incorporation)
                  </span>
                  <span className="text-xs text-[var(--color-parchment-ground)] select-all font-mono">
                    {governance.cacNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("cac", governance.cacNumber)}
                  className="p-1.5 text-[var(--color-granite-muted)] hover:text-white hover:bg-[var(--color-granite-border)] rounded transition-colors"
                  title="Copy CAC Registration Number"
                  aria-label="Copy CAC Registration Number"
                >
                  {copiedKey === "cac" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* SCUML Number */}
              <div className="flex items-center justify-between p-2 rounded bg-[var(--color-granite-card)] border border-[var(--color-granite-border)]">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-sans text-[var(--color-granite-muted)]">
                    EFCC / SCUML Cert
                  </span>
                  <span className="text-xs text-[var(--color-parchment-ground)] select-all font-mono">
                    {governance.scumlNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("scuml", governance.scumlNumber)}
                  className="p-1.5 text-[var(--color-granite-muted)] hover:text-white hover:bg-[var(--color-granite-border)] rounded transition-colors"
                  title="Copy SCUML Certificate Number"
                  aria-label="Copy SCUML Certificate Number"
                >
                  {copiedKey === "scuml" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* FIRS TIN */}
              <div className="flex items-center justify-between p-2 rounded bg-[var(--color-granite-card)] border border-[var(--color-granite-border)]">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-sans text-[var(--color-granite-muted)]">
                    FIRS Tax Identification Number
                  </span>
                  <span className="text-xs text-[var(--color-parchment-ground)] select-all font-mono">
                    {governance.firsTin}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("tin", governance.firsTin)}
                  className="p-1.5 text-[var(--color-granite-muted)] hover:text-white hover:bg-[var(--color-granite-border)] rounded transition-colors"
                  title="Copy Tax Identification Number"
                  aria-label="Copy Tax Identification Number"
                >
                  {copiedKey === "tin" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-[var(--color-granite-muted)] pt-1">
              <span className="font-semibold text-[var(--color-parchment-ground)]">Tax Status: </span>
              {governance.taxExemptionCitation}
            </div>
          </div>

          {/* Column 3: Abuja HQ & Direct Lines (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-[var(--color-parchment-ground)]">
              Abuja Headquarters
            </h3>

            <div className="space-y-3 text-xs text-[var(--color-granite-muted)]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--color-terracotta-primary)] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {organization.headquartersAddress}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--color-savannah-surface)] shrink-0" />
                <a
                  href={`tel:${organization.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {organization.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  <span>WhatsApp Field Dispatch</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Annual Audited Report link */}
            <div className="pt-2">
              <a
                href={governance.annualReportPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 p-2 rounded bg-[var(--color-granite-card)] hover:bg-[var(--color-granite-border)] border border-[var(--color-granite-border)] text-xs text-[var(--color-parchment-ground)] transition-colors w-full group"
              >
                <FileText className="w-4 h-4 text-[var(--color-ochre-accent)] group-hover:scale-110 transition-transform" />
                <div className="flex flex-col text-left">
                  <span className="font-semibold">Audited Financial Report</span>
                  <span className="text-[10px] text-[var(--color-granite-muted)]">
                    Fiscal Year {governance.auditedFinancialYear} (PDF)
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 ml-auto text-[var(--color-granite-muted)]" />
              </a>
            </div>
          </div>

          {/* Column 4: Quick Portals & Links (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-[var(--color-parchment-ground)]">
              Quick Navigation
            </h3>

            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#impact"
                  className="text-[var(--color-granite-muted)] hover:text-white transition-colors"
                >
                  Impact Metrics
                </a>
              </li>
              <li>
                <a
                  href="#fct-map"
                  className="text-[var(--color-granite-muted)] hover:text-white transition-colors"
                >
                  FCT Area Councils Map
                </a>
              </li>
              <li>
                <a
                  href="#pillars"
                  className="text-[var(--color-granite-muted)] hover:text-white transition-colors"
                >
                  Programmatic Pillars
                </a>
              </li>
              <li>
                <a
                  href="#governance"
                  className="text-[var(--color-granite-muted)] hover:text-white transition-colors"
                >
                  Board & Trustees
                </a>
              </li>
              <li>
                <a
                  href="#stories"
                  className="text-[var(--color-granite-muted)] hover:text-white transition-colors"
                >
                  Field Dispatch Stories
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[var(--color-ochre-accent)] hover:underline font-medium"
                >
                  <span>Admin Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-granite-muted)]">
          <div>
            &copy; {currentYear} {organization.legalName} ({organization.acronym}). All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="#governance" className="hover:text-white transition-colors">
              Financial Transparency
            </a>
            <span className="text-[var(--color-granite-border)]">&bull;</span>
            <a href={`mailto:${organization.email}`} className="hover:text-white transition-colors">
              {organization.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
