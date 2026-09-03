"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Heart, Shield, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Banking, DonationTier } from "@/lib/schema/ngo.schema";
import { NairaTransferPanel } from "./NairaTransferPanel";
import { DomiciliaryWirePanel } from "./DomiciliaryWirePanel";

export type CurrencyType = "NGN" | "USD" | "EUR" | "GBP";

export interface DonationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  banking: Banking;
  initialCurrency?: CurrencyType;
  initialTierId?: string;
}

export function DonationDrawer({
  isOpen,
  onClose,
  banking,
  initialCurrency = "NGN",
  initialTierId,
}: DonationDrawerProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>(initialCurrency);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(
    initialTierId ?? banking.donationTiers[0]?.id ?? null
  );
  const [customAmount, setCustomAmount] = useState<string>("");

  // Handle ESC key press to close drawer
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Lock body scroll when drawer is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const selectedTier = banking.donationTiers.find((t) => t.id === selectedTierId) ?? null;

  const handleSelectTier = (tier: DonationTier) => {
    setSelectedTierId(tier.id);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
    if (val) {
      setSelectedTierId(null);
    }
  };

  const isNgn = selectedCurrency === "NGN";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-[var(--color-granite-deep)]/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Slide-over Panel Container */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 pointer-events-none">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-screen max-w-xl pointer-events-auto bg-[var(--color-parchment-ground)] border-l border-[var(--color-parchment-border)] shadow-modal flex flex-col h-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="donation-drawer-title"
            >
              {/* Sacred Earth Crest Trust Header */}
              <div className="relative border-b border-[var(--color-parchment-border)] bg-[var(--color-parchment-subtle)] px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-terracotta-surface)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-terracotta-primary)]">
                      <Shield className="h-3 w-3" />
                      <span>Sacred Earth Crest • Direct Impact Giving</span>
                    </div>
                    <h2
                      id="donation-drawer-title"
                      className="text-lg sm:text-xl font-bold font-display text-[var(--color-granite-deep)]"
                    >
                      Supporting Abuja Grassroots
                    </h2>
                    <p className="text-xs text-[var(--color-granite-muted)] leading-relaxed">
                      100% of your tax-deductible gift goes directly to water, maternal health, and youth resilience in FCT councils.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-parchment-ground)] border border-[var(--color-parchment-border)] text-[var(--color-granite-muted)] hover:text-[var(--color-granite-deep)] hover:bg-[var(--color-parchment-subtle)] transition-colors cursor-pointer shrink-0"
                    aria-label="Close donation drawer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Multi-Currency Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-granite-muted)]">
                    Select Currency
                  </label>
                  <div className="grid grid-cols-4 gap-2 rounded-xl bg-[var(--color-parchment-subtle)] p-1.5 border border-[var(--color-parchment-border)]">
                    {(["NGN", "USD", "EUR", "GBP"] as const).map((curr) => {
                      const isActive = selectedCurrency === curr;
                      return (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => setSelectedCurrency(curr)}
                          className={`rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? "bg-[var(--color-parchment-ground)] text-[var(--color-terracotta-primary)] shadow-soft"
                              : "text-[var(--color-granite-muted)] hover:text-[var(--color-granite-deep)]"
                          }`}
                        >
                          {curr === "NGN" ? "₦ NGN" : curr === "USD" ? "$ USD" : curr === "EUR" ? "€ EUR" : "£ GBP"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preset Impact Donation Tiers */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-granite-muted)]">
                      Impact Donation Tiers
                    </label>
                    <span className="text-[11px] text-[var(--color-savannah-primary)] font-medium">
                      Select an impact tier
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {banking.donationTiers.map((tier) => {
                      const isSelected = selectedTierId === tier.id;
                      const displayAmount = isNgn
                        ? `₦${tier.amountNgn.toLocaleString("en-NG")}`
                        : selectedCurrency === "USD"
                        ? `$${tier.amountUsd}`
                        : selectedCurrency === "EUR"
                        ? `€${Math.round(tier.amountUsd * 0.95)}`
                        : `£${Math.round(tier.amountUsd * 0.82)}`;

                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => handleSelectTier(tier)}
                          className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-[var(--color-terracotta-primary)] bg-[var(--color-terracotta-surface)] shadow-soft ring-1 ring-[var(--color-terracotta-primary)]"
                              : "border-[var(--color-parchment-border)] bg-[var(--color-parchment-ground)] hover:border-[var(--color-terracotta-primary)]/40 hover:bg-[var(--color-parchment-subtle)]"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-mono text-base font-bold text-[var(--color-granite-deep)]">
                              {displayAmount}
                            </span>
                            {isSelected && (
                              <span className="flex h-2 w-2 rounded-full bg-[var(--color-terracotta-primary)]" />
                            )}
                          </div>
                          <span className="text-xs font-semibold text-[var(--color-terracotta-primary)] mt-0.5">
                            {tier.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Highlighted Community Impact Description */}
                  {selectedTier && (
                    <motion.div
                      key={selectedTier.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-xl border border-[var(--color-savannah-primary)]/20 bg-[var(--color-savannah-surface)]/70 p-3.5 text-xs text-[var(--color-granite-deep)] space-y-1"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[var(--color-savannah-primary)]">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span>Direct Grassroots Impact: {selectedTier.label}</span>
                      </div>
                      <p className="text-[var(--color-granite-deep)] leading-relaxed">
                        {selectedTier.impactDescription}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Dynamic Transfer Panels */}
                <div className="pt-2 border-t border-[var(--color-parchment-border)]">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-granite-muted)]">
                      {isNgn ? "Direct Bank Transfer (Nigeria)" : `Cross-Border Wire (${selectedCurrency})`}
                    </span>
                  </div>

                  {isNgn ? (
                    <NairaTransferPanel
                      account={banking.ngnAccount}
                      selectedTier={selectedTier}
                      customAmount={customAmount ? Number(customAmount) : null}
                    />
                  ) : (
                    <DomiciliaryWirePanel
                      accounts={banking.domiciliaryAccounts}
                      selectedCurrency={selectedCurrency as "USD" | "EUR" | "GBP"}
                      onSelectCurrency={(curr) => setSelectedCurrency(curr)}
                      selectedTier={selectedTier}
                      customAmount={customAmount ? Number(customAmount) : null}
                    />
                  )}
                </div>
              </div>

              {/* Drawer Footer with Non-profit Audit Notice */}
              <div className="border-t border-[var(--color-parchment-border)] bg-[var(--color-parchment-subtle)] px-6 py-4 flex items-center justify-between text-xs text-[var(--color-granite-muted)]">
                <div className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-[var(--color-terracotta-primary)] shrink-0" />
                  <span>CAC Incorporated Trustee Registered</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="font-semibold text-[var(--color-granite-deep)] hover:text-[var(--color-terracotta-primary)] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
