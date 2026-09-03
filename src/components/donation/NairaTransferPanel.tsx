"use client";

import React from "react";
import { Check, Copy, MessageCircle, Building2, User, CreditCard, Hash, ShieldCheck } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import type { NgnAccount, DonationTier } from "@/lib/schema/ngo.schema";

export interface NairaTransferPanelProps {
  account: NgnAccount;
  selectedTier?: DonationTier | null;
  customAmount?: number | null;
}

export function NairaTransferPanel({
  account,
  selectedTier,
  customAmount,
}: NairaTransferPanelProps) {
  const { copy, copiedText, isCopied } = useClipboard({ timeout: 2000 });

  // Compute reference amount
  const donationAmount = selectedTier?.amountNgn ?? customAmount ?? null;
  const formattedAmount = donationAmount
    ? `₦${donationAmount.toLocaleString("en-NG")}`
    : "a donation";

  // Build pre-filled WhatsApp message
  const rawPhone = account.whatsappConfirmationPhone.replace(/[^0-9]/g, "");
  const whatsappText = encodeURIComponent(
    `Hello Abuja Resilience Initiative, I have completed a bank transfer donation of ${formattedAmount}${
      selectedTier ? ` for the "${selectedTier.label}" tier (${selectedTier.impactDescription})` : ""
    }. Please find my transfer receipt attached for confirmation.`
  );
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${whatsappText}`;

  const copyAccountNumber = () => {
    copy(account.accountNumber);
  };

  const isAccountCopied = isCopied && copiedText === account.accountNumber;

  return (
    <div className="space-y-6">
      {/* Account Details Card */}
      <div className="rounded-2xl border border-[var(--color-parchment-border)] bg-[var(--color-parchment-subtle)] p-5 shadow-soft">
        <div className="flex items-center justify-between border-b border-[var(--color-parchment-border)] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-savannah-surface)] text-[var(--color-savannah-primary)]">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide uppercase text-[var(--color-granite-muted)]">
                Bank Name
              </p>
              <h4 className="text-sm font-semibold text-[var(--color-granite-deep)]">
                {account.bankName}
              </h4>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-savannah-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--color-savannah-primary)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Non-Profit
          </span>
        </div>

        {/* Key Account Information Grid */}
        <div className="space-y-3.5">
          {/* Account Name */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-granite-muted)]">
              <User className="h-4 w-4 shrink-0" />
              <span>Account Name</span>
            </div>
            <p className="text-right text-sm font-semibold text-[var(--color-granite-deep)]">
              {account.accountName}
            </p>
          </div>

          {/* Account Number with 1-Click Copy */}
          <div className="rounded-xl border border-[var(--color-terracotta-primary)]/20 bg-[var(--color-parchment-ground)] p-3.5 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-granite-muted)]">
                <CreditCard className="h-3.5 w-3.5 text-[var(--color-terracotta-primary)]" />
                Account Number (NUBAN)
              </span>
              <p className="font-mono text-xl font-bold tracking-wider text-[var(--color-granite-deep)]">
                {account.accountNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={copyAccountNumber}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isAccountCopied
                  ? "bg-[var(--color-savannah-primary)] text-white shadow-sm"
                  : "bg-[var(--color-terracotta-primary)] text-white hover:bg-[var(--color-terracotta-link)] active:scale-95 shadow-sm"
              }`}
              aria-label="Copy account number"
            >
              {isAccountCopied ? (
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

          {/* Sort Code if available */}
          {account.sortCode && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--color-parchment-border)]/60">
              <span className="flex items-center gap-1.5 text-[var(--color-granite-muted)]">
                <Hash className="h-3.5 w-3.5" />
                Sort Code
              </span>
              <span className="font-mono font-medium text-[var(--color-granite-deep)]">
                {account.sortCode}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Instructions & Notes */}
      <div className="rounded-xl bg-[var(--color-savannah-surface)]/60 border border-[var(--color-savannah-primary)]/15 p-4 text-xs text-[var(--color-granite-deep)] leading-relaxed space-y-1.5">
        <p className="font-semibold text-[var(--color-savannah-primary)] flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" />
          Direct Bank Transfer Instructions
        </p>
        <p className="text-[var(--color-granite-muted)]">
          Initiate a transfer from any Nigerian bank app or USSD (*737#, *894#, etc.) using the 10-digit NUBAN number above. 100% of your funds go directly into our community-audited project pools across the 6 FCT Area Councils.
        </p>
      </div>

      {/* WhatsApp Confirmation Button */}
      <div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-card hover:bg-[#20bd5a] active:scale-[0.98] transition-all"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Confirm Transfer on WhatsApp</span>
        </a>
        <p className="mt-2 text-center text-xs text-[var(--color-granite-muted)]">
          Notify our field financial desk at {account.whatsappConfirmationPhone} for instant tax receipt and impact dispatch notice.
        </p>
      </div>
    </div>
  );
}
