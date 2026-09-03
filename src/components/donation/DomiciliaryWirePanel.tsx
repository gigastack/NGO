"use client";

import React, { useState } from "react";
import { Check, Copy, Globe2, Building2, User, CreditCard, Hash, ShieldCheck, Info } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import type { DomiciliaryAccount, DonationTier } from "@/lib/schema/ngo.schema";

export interface DomiciliaryWirePanelProps {
  accounts: DomiciliaryAccount[];
  selectedCurrency: "USD" | "EUR" | "GBP";
  onSelectCurrency?: (currency: "USD" | "EUR" | "GBP") => void;
  selectedTier?: DonationTier | null;
  customAmount?: number | null;
}

export function DomiciliaryWirePanel({
  accounts,
  selectedCurrency,
  onSelectCurrency,
  selectedTier,
  customAmount,
}: DomiciliaryWirePanelProps) {
  const [internalCurrency, setInternalCurrency] = useState<"USD" | "EUR" | "GBP">(selectedCurrency);
  const activeCurrency = onSelectCurrency ? selectedCurrency : internalCurrency;

  const handleCurrencyChange = (curr: "USD" | "EUR" | "GBP") => {
    if (onSelectCurrency) {
      onSelectCurrency(curr);
    } else {
      setInternalCurrency(curr);
    }
  };

  const currentAccount = accounts.find((acc) => acc.currency === activeCurrency) ?? accounts[0];

  const { copy, copiedText, isCopied } = useClipboard({ timeout: 2000 });

  const currencySymbols: Record<"USD" | "EUR" | "GBP", string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  // Compute donation reference
  const donationUsd = selectedTier?.amountUsd ?? customAmount ?? null;
  const symbol = currencySymbols[activeCurrency] || "$";
  const formattedAmount = donationUsd ? `${symbol}${donationUsd.toLocaleString()}` : null;

  if (!currentAccount) {
    return (
      <div className="p-6 text-center text-sm text-[var(--color-granite-muted)]">
        No domiciliary wire account configured for {activeCurrency}.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Currency Selector Sub-Tabs */}
      <div className="flex items-center justify-between rounded-xl bg-[var(--color-parchment-subtle)] p-1 border border-[var(--color-parchment-border)]">
        {(["USD", "EUR", "GBP"] as const).map((curr) => {
          const isActive = activeCurrency === curr;
          return (
            <button
              key={curr}
              type="button"
              onClick={() => handleCurrencyChange(curr)}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isActive
                  ? "bg-[var(--color-parchment-ground)] text-[var(--color-savannah-primary)] shadow-soft font-bold"
                  : "text-[var(--color-granite-muted)] hover:text-[var(--color-granite-deep)]"
              }`}
            >
              <span>{curr}</span>
              <span className="text-[10px] opacity-75 font-normal">
                ({currencySymbols[curr]})
              </span>
            </button>
          );
        })}
      </div>

      {formattedAmount && (
        <div className="rounded-xl bg-[var(--color-terracotta-surface)] border border-[var(--color-terracotta-primary)]/20 px-4 py-2.5 flex items-center justify-between text-xs">
          <span className="text-[var(--color-granite-muted)] font-medium">
            Intended Wire Donation:
          </span>
          <span className="font-bold text-[var(--color-terracotta-primary)] font-mono text-sm">
            {formattedAmount}
          </span>
        </div>
      )}

      {/* Wire Account Details Card */}
      <div className="rounded-2xl border border-[var(--color-parchment-border)] bg-[var(--color-parchment-subtle)] p-5 shadow-soft space-y-4">
        {/* Header with Bank & Verified Non-Profit */}
        <div className="flex items-center justify-between border-b border-[var(--color-parchment-border)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-savannah-surface)] text-[var(--color-savannah-primary)]">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide uppercase text-[var(--color-granite-muted)]">
                Depository Bank
              </p>
              <h4 className="text-sm font-semibold text-[var(--color-granite-deep)]">
                {currentAccount.bankName}
              </h4>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-savannah-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--color-savannah-primary)]">
            <Globe2 className="h-3.5 w-3.5" />
            {activeCurrency} Wire
          </span>
        </div>

        {/* Account Details List */}
        <div className="space-y-3">
          {/* Account Name */}
          <div className="flex items-start justify-between gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-[var(--color-granite-muted)] font-medium">
              <User className="h-3.5 w-3.5" />
              Beneficiary Name
            </span>
            <span className="text-right font-semibold text-[var(--color-granite-deep)]">
              {currentAccount.accountName}
            </span>
          </div>

          {/* Account Number with 1-Click Copy */}
          <div className="rounded-xl border border-[var(--color-parchment-border)] bg-[var(--color-parchment-ground)] p-3 flex items-center justify-between gap-2">
            <div>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-granite-muted)]">
                <CreditCard className="h-3 w-3 text-[var(--color-terracotta-primary)]" />
                Account Number
              </span>
              <p className="font-mono text-base font-bold tracking-wider text-[var(--color-granite-deep)]">
                {currentAccount.accountNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copy(currentAccount.accountNumber)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isCopied && copiedText === currentAccount.accountNumber
                  ? "bg-[var(--color-savannah-primary)] text-white"
                  : "bg-[var(--color-parchment-subtle)] text-[var(--color-granite-deep)] hover:bg-[var(--color-parchment-border)]"
              }`}
              aria-label="Copy account number"
            >
              {isCopied && copiedText === currentAccount.accountNumber ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* SWIFT / BIC Code with Copy */}
          <div className="rounded-xl border border-[var(--color-parchment-border)] bg-[var(--color-parchment-ground)] p-3 flex items-center justify-between gap-2">
            <div>
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-granite-muted)]">
                <Hash className="h-3 w-3 text-[var(--color-savannah-primary)]" />
                SWIFT / BIC Code
              </span>
              <p className="font-mono text-base font-bold tracking-wider text-[var(--color-granite-deep)]">
                {currentAccount.swiftBic}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copy(currentAccount.swiftBic)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isCopied && copiedText === currentAccount.swiftBic
                  ? "bg-[var(--color-savannah-primary)] text-white"
                  : "bg-[var(--color-parchment-subtle)] text-[var(--color-granite-deep)] hover:bg-[var(--color-parchment-border)]"
              }`}
              aria-label="Copy SWIFT BIC"
            >
              {isCopied && copiedText === currentAccount.swiftBic ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Routing / IBAN if available */}
          {currentAccount.routingIban && (
            <div className="rounded-xl border border-[var(--color-parchment-border)] bg-[var(--color-parchment-ground)] p-3 flex items-center justify-between gap-2">
              <div>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-granite-muted)]">
                  <Hash className="h-3 w-3 text-[var(--color-ochre-accent)]" />
                  Routing / IBAN
                </span>
                <p className="font-mono text-xs sm:text-sm font-bold tracking-wide text-[var(--color-granite-deep)] break-all">
                  {currentAccount.routingIban}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copy(currentAccount.routingIban!)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  isCopied && copiedText === currentAccount.routingIban
                    ? "bg-[var(--color-savannah-primary)] text-white"
                    : "bg-[var(--color-parchment-subtle)] text-[var(--color-granite-deep)] hover:bg-[var(--color-parchment-border)]"
                }`}
                aria-label="Copy IBAN"
              >
                {isCopied && copiedText === currentAccount.routingIban ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* International Wire Note */}
      <div className="rounded-xl bg-[var(--color-parchment-subtle)] border border-[var(--color-parchment-border)] p-4 text-xs text-[var(--color-granite-deep)] space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-[var(--color-savannah-primary)]">
          <Info className="h-4 w-4 shrink-0" />
          <span>International Wire Correspondent Instructions</span>
        </div>
        <p className="text-[var(--color-granite-muted)] leading-relaxed">
          For cross-border transfers from the US, UK, Europe, or Diaspora networks, instruct your sending institution to route via GTBank Nigeria correspondent banks. Quote the Beneficiary Name and SWIFT/BIC code <span className="font-mono font-semibold text-[var(--color-granite-deep)]">{currentAccount.swiftBic}</span>.
        </p>
        <div className="pt-2 border-t border-[var(--color-parchment-border)]/60 flex items-center justify-between text-[11px]">
          <span className="text-[var(--color-granite-muted)]">Purpose of Remittance:</span>
          <span className="font-medium text-[var(--color-granite-deep)]">Charitable Donation / Grassroots Development</span>
        </div>
      </div>
    </div>
  );
}
