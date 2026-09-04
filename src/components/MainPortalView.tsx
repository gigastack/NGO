"use client";

import React, { useState } from "react";
import type { NGOConfig } from "@/lib/schema/ngo.schema";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { FCTMapCoordinator } from "@/components/map/FCTMapCoordinator";
import { ProgrammaticPillarsGrid } from "@/components/pillars/ProgrammaticPillarsGrid";
import { MiniDocumentaryHub } from "@/components/media/MiniDocumentaryHub";
import { RegulatoryTrustPanel } from "@/components/governance/RegulatoryTrustPanel";
import { SocialActivityWall } from "@/components/social/SocialActivityWall";
import { DonationDrawer, type CurrencyType } from "@/components/donation/DonationDrawer";

export interface MainPortalViewProps {
  config: NGOConfig;
}

export function MainPortalView({ config }: MainPortalViewProps) {
  const [donationOpen, setDonationOpen] = useState(false);
  const [initialCurrency, setInitialCurrency] = useState<CurrencyType>("NGN");
  const [initialTierId, setInitialTierId] = useState<string | undefined>(undefined);

  const handleOpenDonation = (tierId?: string, currency?: CurrencyType) => {
    if (tierId) setInitialTierId(tierId);
    if (currency) setInitialCurrency(currency);
    setDonationOpen(true);
  };

  const handleCloseDonation = () => {
    setDonationOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-parchment-ground)] text-[var(--color-granite-deep)]">
      {/* 1. Persistent Sticky Navigation Shell */}
      <Navbar
        organization={config.organization}
        branding={config.branding}
        onOpenDonation={() => handleOpenDonation()}
      />

      {/* 2. Main Landmark Flow */}
      <main id="main-content" className="flex-1">
        {/* Section 1: Cinematic Hero & Ambient Media Surface */}
        <Hero
          config={config}
          onOpenDonation={() => handleOpenDonation()}
        />

        {/* Section 2: Interactive FCT Area Councils Map & Dispatch Drawer */}
        <div>
          <FCTMapCoordinator
            config={config}
            onOpenDonation={(_councilId) => handleOpenDonation()}
          />
        </div>

        {/* Section 3: Programmatic Pillars Bento Grid */}
        <div>
          <ProgrammaticPillarsGrid
            onOpenDonationDrawer={(tierId) => handleOpenDonation(tierId)}
          />
        </div>

        {/* Section 4: Mini-Documentary Hub */}
        <div>
          <MiniDocumentaryHub />
        </div>

        {/* Section 5: Trust, Governance & Audited Financial Disclosure */}
        <div>
          <RegulatoryTrustPanel governance={config.governance} />
        </div>

        {/* Section 6: Resilient Social Activity Wall */}
        <div id="social">
          <SocialActivityWall initialItems={config.socialFeed} />
        </div>
      </main>

      {/* 3. Comprehensive Statutory Footer */}
      <Footer
        organization={config.organization}
        branding={config.branding}
        governance={config.governance}
        onOpenDonation={() => handleOpenDonation()}
      />

      {/* 4. Multi-Currency Slide-Over Donation Drawer */}
      <DonationDrawer
        isOpen={donationOpen}
        onClose={handleCloseDonation}
        banking={config.banking}
        initialCurrency={initialCurrency}
        initialTierId={initialTierId}
      />
    </div>
  );
}
