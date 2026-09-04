"use client";

import React from "react";
import type { NGOConfig } from "@/lib/schema/ngo.schema";
import { HeroVideoPlayer } from "./HeroVideoPlayer";
import { SoundscapeToggle } from "./SoundscapeToggle";
import { ImpactCounterGrid } from "./ImpactCounterGrid";

export interface HeroProps {
  config?: NGOConfig;
  onOpenDonation?: () => void;
  className?: string;
}

export function Hero({ config, onOpenDonation, className = "" }: HeroProps) {
  const missionText =
    config?.organization?.mission ||
    "Empowering grassroots communities across Abuja's six area councils through sustainable infrastructure, healthcare access, civic governance, and youth innovation.";

  const soundscapeUrl = config?.media?.ambientAudioSoundscapeUrl;

  const handleExploreMapClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mapSection = document.getElementById("fct-map");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "#fct-map";
    }
  };

  return (
    <section
      className={`relative min-h-[92vh] flex flex-col justify-between overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-20 px-4 sm:px-6 lg:px-8 ${className}`}
      aria-labelledby="hero-heading"
    >
      {/* 1. Full-bleed Ambient Background Video / Poster Layer */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <HeroVideoPlayer config={config} />
      </div>

      {/* 2. Top Bar Utility: Ambient Soundscape & Territory Badge */}
      <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 mb-8 z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-parchment-ground)]/90 backdrop-blur-xs border border-[var(--color-parchment-border)] shadow-soft">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-terracotta-primary)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-terracotta-primary)]" />
          </span>
          <span className="text-xs font-semibold tracking-wider text-[var(--color-granite-deep)] uppercase">
            Federal Capital Territory • Abuja
          </span>
        </div>

        <SoundscapeToggle audioUrl={soundscapeUrl} />
      </div>

      {/* 3. Main Center Stage: Fluid Headline & Mission Anchor */}
      <div className="w-full max-w-5xl mx-auto my-auto text-center z-20 py-4 lg:py-8">
        {/* 2-Line Hero Iron Rule: Desktop capped headline */}
        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--color-parchment-ground)] font-display leading-[1.08] drop-shadow-sm"
        >
          From Granite to Grassroots: Resilient Communities Across Abuja's Six Corridors
        </h1>

        {/* Mission Subtitle */}
        <p className="mt-6 sm:mt-8 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-[var(--color-parchment-subtle)]/90 font-normal leading-relaxed font-body">
          {missionText}
        </p>

        {/* Dual Action CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={onOpenDonation}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[var(--color-terracotta-primary)] text-white font-bold text-base shadow-card hover:bg-[var(--color-terracotta-link)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-granite-deep)] cursor-pointer"
          >
            <span>Support Our Mission</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <a
            href="#fct-map"
            onClick={handleExploreMapClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[var(--color-parchment-ground)]/90 backdrop-blur-xs text-[var(--color-granite-deep)] font-semibold text-base border border-[var(--color-parchment-border)] hover:bg-[var(--color-parchment-ground)] hover:border-[var(--color-terracotta-primary)]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary)] cursor-pointer shadow-soft"
          >
            <svg
              className="w-4 h-4 text-[var(--color-savannah-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Explore Field Map</span>
          </a>
        </div>
      </div>

      {/* 4. Bottom Bento Strip: Audited Impact Counter Grid */}
      <div className="w-full max-w-7xl mx-auto mt-12 lg:mt-16 z-20">
        <ImpactCounterGrid config={config} />
      </div>
    </section>
  );
}
