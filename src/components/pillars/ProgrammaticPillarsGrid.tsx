"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { resolveMediaUrl } from "@/lib/media/resolver";

interface ProgrammaticPillarsGridProps {
  onOpenDonationDrawer?: (tierId?: string) => void;
}

export function ProgrammaticPillarsGrid({ onOpenDonationDrawer }: ProgrammaticPillarsGridProps) {
  const healthImg = resolveMediaUrl("https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80");
  const youthImg = resolveMediaUrl("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80");

  return (
    <section
      id="pillars"
      aria-labelledby="pillars-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[var(--color-terracotta-surface,#F9EFEB)] text-[var(--color-terracotta-link,#9E4723)] border border-[var(--color-terracotta-primary,#B85D36)]/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta-primary,#B85D36)]" />
          Core Programmatic Pillars
        </div>
        <h2
          id="pillars-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-[var(--color-granite-deep,#111113)] leading-[1.15] mb-4"
        >
          Core Programmatic Pillars: Grassroots Intervention Infrastructure Across the FCT
        </h2>
        <p className="text-base sm:text-lg text-[var(--color-granite-muted,#7A736B)] leading-relaxed">
          Targeted community-rooted operations designed for enduring self-reliance across agrarian councils, urban informal clusters, and peri-urban artisan centers.
        </p>
      </div>

      {/* Asymmetric Gapless Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Pillar 1: Clean Aquifers & Primary Healthcare (7 cols span) */}
        <article className="lg:col-span-7 flex flex-col justify-between overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[var(--color-parchment-border,#E5DFD5)] shadow-soft hover:shadow-card hover:border-[var(--color-terracotta-primary,#B85D36)]/30 transition-all duration-300 group">
          <div className="p-6 sm:p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-terracotta-primary,#B85D36)]">
                  Act II · Health & Water Security
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--color-savannah-surface,#E8F0ED)] text-[var(--color-savannah-primary,#1C3F35)] border border-[var(--color-savannah-primary,#1C3F35)]/20">
                  Kwali & Kuje Councils
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-[var(--color-granite-deep,#111113)] mb-3 leading-snug">
                Clean Aquifers & Primary Healthcare
              </h3>

              <p className="text-sm sm:text-base text-[var(--color-granite-muted,#7A736B)] leading-relaxed mb-6">
                Direct hydrological drilling powering deep borehole pumps with 100% solar micro-arrays. Seamlessly integrated with cold-chain vaccine storage and rural maternal triage outposts in Kwali and Kuje agrarian zones.
              </p>

              {/* Metric Callout Highlight */}
              <div className="flex flex-wrap items-baseline gap-3 p-4 rounded-xl bg-[var(--color-parchment-subtle,#F3EFEA)] border border-[var(--color-parchment-border,#E5DFD5)] mb-6">
                <span className="text-3xl sm:text-4xl font-display font-bold text-[var(--color-savannah-primary,#1C3F35)]">
                  14
                </span>
                <div>
                  <span className="text-sm font-bold text-[var(--color-granite-deep,#111113)] block">
                    Solar Water Points Installed
                  </span>
                  <span className="text-xs text-[var(--color-granite-muted,#7A736B)]">
                    Serving 38,000+ residents with zero grid downtime
                  </span>
                </div>
              </div>
            </div>

            {/* Illustration Visual */}
            <div className="relative aspect-[16/8] w-full rounded-xl overflow-hidden bg-[var(--color-parchment-subtle,#F3EFEA)] border border-[var(--color-parchment-border,#E5DFD5)]">
              <Image
                src={healthImg}
                alt="Solar clinic and rural water extraction point in Kwali"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-[var(--color-parchment-border,#E5DFD5)] flex items-center justify-between">
              <Link
                href="#map"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-terracotta-primary,#B85D36)] hover:text-[var(--color-terracotta-link,#9E4723)] transition-colors"
              >
                <span>Explore Kwali & Kuje Deployments</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {onOpenDonationDrawer && (
                <button
                  type="button"
                  onClick={() => onOpenDonationDrawer("tier-resilience")}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-savannah-primary,#1C3F35)] text-white hover:bg-[var(--color-savannah-primary,#1C3F35)]/90 transition"
                  aria-label="Support Clean Water"
                >
                  Support Clean Water
                </button>
              )}
            </div>
          </div>
        </article>

        {/* Right Stack: Pillar 2 and Pillar 3 (5 cols span) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Pillar 2: Solar STEM & Ancestral Heritage */}
          <article className="flex flex-col justify-between overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[var(--color-parchment-border,#E5DFD5)] shadow-soft hover:shadow-card hover:border-[var(--color-terracotta-primary,#B85D36)]/30 transition-all duration-300 group">
            <div className="p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-terracotta-primary,#B85D36)]">
                  Act III · Youth Innovation
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[var(--color-terracotta-surface,#F9EFEB)] text-[var(--color-terracotta-link,#9E4723)] border border-[var(--color-terracotta-primary,#B85D36)]/20">
                  Ushafa & Bwari/AMAC
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--color-granite-deep,#111113)] mb-2">
                Solar STEM & Ancestral Heritage
              </h3>

              <p className="text-sm text-[var(--color-granite-muted,#7A736B)] leading-relaxed mb-4">
                Preserving Ushafa pottery guilds through digital archives while equipping youth in Bwari and AMAC with clean-energy hardware, coding labs, and drone telemetry.
              </p>

              {/* Metric Pill */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-display font-bold text-[var(--color-terracotta-primary,#B85D36)]">
                  1,200+
                </span>
                <span className="text-xs font-semibold text-[var(--color-granite-deep,#111113)]">
                  Youth Certified in Micro-Solar & Web Systems
                </span>
              </div>

              {/* Visual Thumbnail */}
              <div className="relative aspect-[16/7] w-full rounded-xl overflow-hidden bg-[var(--color-parchment-subtle,#F3EFEA)] border border-[var(--color-parchment-border,#E5DFD5)] mb-4">
                <Image
                  src={youthImg}
                  alt="Youth STEM and digital lab in Ushafa"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>

              <Link
                href="#stories"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-terracotta-primary,#B85D36)] hover:underline"
              >
                <span>Watch the Ushafa Pottery & Code Reel</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </article>

          {/* Pillar 3: IDP Resilience & Emergency Relief */}
          <article className="flex flex-col justify-between overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[var(--color-parchment-border,#E5DFD5)] shadow-soft hover:shadow-card hover:border-[var(--color-terracotta-primary,#B85D36)]/30 transition-all duration-300 group">
            <div className="p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-terracotta-primary,#B85D36)]">
                  Humanitarian Frontline
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[var(--color-ochre-accent,#D49B35)]/15 text-[var(--color-ochre-accent,#D49B35)] border border-[var(--color-ochre-accent,#D49B35)]/30">
                  Kuchingoro & Karu
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--color-granite-deep,#111113)] mb-2">
                IDP Resilience & Emergency Relief
              </h3>

              <p className="text-sm text-[var(--color-granite-muted,#7A736B)] leading-relaxed mb-4">
                Operational rapid relief hubs providing direct nutritional kits, emergency maternal care, and dignified transitional shelter for internally displaced families.
              </p>

              {/* Metric Pill */}
              <div className="flex items-baseline gap-2 mb-4 p-3 rounded-lg bg-[var(--color-parchment-subtle,#F3EFEA)] border border-[var(--color-parchment-border,#E5DFD5)]">
                <span className="text-2xl font-display font-bold text-[var(--color-savannah-primary,#1C3F35)]">
                  6,400
                </span>
                <span className="text-xs font-medium text-[var(--color-granite-deep,#111113)]">
                  Families Sustained with Medical & Food Relief
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href="#governance"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-terracotta-primary,#B85D36)] hover:underline"
                >
                  <span>View Audited Relief Expenditure</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                {onOpenDonationDrawer && (
                  <button
                    type="button"
                    onClick={() => onOpenDonationDrawer("relief")}
                    className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--color-terracotta-primary,#B85D36)] text-white hover:bg-[var(--color-terracotta-link,#9E4723)] transition"
                  >
                    Support Outpost
                  </button>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
