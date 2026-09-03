"use client";

import React from "react";
import { Banking, DomiciliaryAccount, DonationTier, NgnAccount } from "@/lib/schema/ngo.schema";
import { CreditCard, Landmark, Globe, Plus, Trash2, HeartHandshake } from "lucide-react";

interface BankingWireTabProps {
  data: Banking;
  onChange: (updated: Banking) => void;
}

export const BankingWireTab: React.FC<BankingWireTabProps> = ({ data, onChange }) => {
  const handleNgnChange = <K extends keyof NgnAccount>(field: K, value: NgnAccount[K]) => {
    onChange({
      ...data,
      ngnAccount: {
        ...data.ngnAccount,
        [field]: value,
      },
    });
  };

  const handleDomiciliaryChange = <K extends keyof DomiciliaryAccount>(
    index: number,
    field: K,
    value: DomiciliaryAccount[K]
  ) => {
    const updated = [...data.domiciliaryAccounts];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({
      ...data,
      domiciliaryAccounts: updated,
    });
  };

  const handleTierChange = <K extends keyof DonationTier>(
    index: number,
    field: K,
    value: DonationTier[K]
  ) => {
    const updated = [...data.donationTiers];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({
      ...data,
      donationTiers: updated,
    });
  };

  const handleAddTier = () => {
    const newTier: DonationTier = {
      id: `tier-${Date.now()}`,
      label: "Community Supporter",
      amountNgn: 50000,
      amountUsd: 50,
      impactDescription: "Provides emergency medical kits and food sustenance.",
    };
    onChange({
      ...data,
      donationTiers: [...data.donationTiers, newTier],
    });
  };

  const handleDeleteTier = (index: number) => {
    if (data.donationTiers.length <= 1) return; // Keep at least one tier
    const updated = data.donationTiers.filter((_, idx) => idx !== index);
    onChange({
      ...data,
      donationTiers: updated,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[#1C3F35]/30 text-[#4EAA86] border border-[#1C3F35]/60">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-[#FAF8F5]">
              Institutional Banking & Wire Transfers
            </h2>
            <p className="text-xs text-[#A1A1AA]">
              Configure Nigerian corporate banking (GTBank NGN), foreign currency wire routing, and public donation tiers.
            </p>
          </div>
        </div>
      </div>

      {/* GTBank NGN Account Details */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] border-b border-[#27272A] pb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#B85D36]" /> Primary Nigerian Naira (NGN) Account
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Bank Name
            </label>
            <input
              type="text"
              value={data.ngnAccount.bankName}
              onChange={(e) => handleNgnChange("bankName", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Account Beneficiary Name
            </label>
            <input
              type="text"
              value={data.ngnAccount.accountName}
              onChange={(e) => handleNgnChange("accountName", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Account Number (10 Digits)
            </label>
            <input
              type="text"
              value={data.ngnAccount.accountNumber}
              onChange={(e) => handleNgnChange("accountNumber", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              WhatsApp Confirmation Hotline
            </label>
            <input
              type="text"
              value={data.ngnAccount.whatsappConfirmationPhone}
              onChange={(e) => handleNgnChange("whatsappConfirmationPhone", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>
        </div>
      </div>

      {/* Domiciliary Foreign Wire Accounts */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] border-b border-[#27272A] pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#1C3F35]" /> International Domiciliary Wire Accounts
        </h3>

        <div className="space-y-4">
          {data.domiciliaryAccounts.map((dom, idx) => (
            <div
              key={dom.currency || idx}
              className="bg-[#111113] border border-[#27272A] rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#27272A] pb-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-[#B85D36]/20 text-[#E0825B]">
                  {dom.currency} Wire Channel
                </span>
                <span className="text-xs text-[#71717A]">{dom.bankName}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[#71717A] mb-1">Account Number</label>
                  <input
                    type="text"
                    value={dom.accountNumber}
                    onChange={(e) => handleDomiciliaryChange(idx, "accountNumber", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#71717A] mb-1">SWIFT / BIC Code</label>
                  <input
                    type="text"
                    value={dom.swiftBic}
                    onChange={(e) => handleDomiciliaryChange(idx, "swiftBic", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#71717A] mb-1">Routing / IBAN (Optional)</label>
                  <input
                    type="text"
                    value={dom.routingIban || ""}
                    onChange={(e) => handleDomiciliaryChange(idx, "routingIban", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donation Impact Tiers */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#B85D36]" /> Public Donation Impact Tiers ({data.donationTiers.length})
          </h3>
          <button
            type="button"
            onClick={handleAddTier}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#27272A] hover:bg-[#3F3F46] text-[#FAF8F5] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Tier
          </button>
        </div>

        <div className="space-y-3">
          {data.donationTiers.map((tier, idx) => (
            <div
              key={tier.id || idx}
              className="bg-[#111113] border border-[#27272A] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-2/3">
                <div>
                  <label className="block text-[11px] text-[#71717A] mb-1">Tier Label</label>
                  <input
                    type="text"
                    value={tier.label}
                    onChange={(e) => handleTierChange(idx, "label", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#71717A] mb-1">Amount (NGN ₦)</label>
                  <input
                    type="number"
                    value={tier.amountNgn}
                    onChange={(e) =>
                      handleTierChange(idx, "amountNgn", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#71717A] mb-1">Amount (USD $)</label>
                  <input
                    type="number"
                    value={tier.amountUsd}
                    onChange={(e) =>
                      handleTierChange(idx, "amountUsd", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  />
                </div>
              </div>

              <div className="w-full md:w-1/3 flex items-center gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] text-[#71717A] mb-1">Impact Description</label>
                  <input
                    type="text"
                    value={tier.impactDescription}
                    onChange={(e) => handleTierChange(idx, "impactDescription", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  />
                </div>
                {data.donationTiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTier(idx)}
                    className="mt-4 p-1.5 text-[#71717A] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
