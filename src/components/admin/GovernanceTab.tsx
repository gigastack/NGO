"use client";

import React from "react";
import { Governance, FinancialAllocation, Trustee } from "@/lib/schema/ngo.schema";
import { Scale, Users, FileText, PieChart, Plus, Trash2, AlertTriangle, CheckCircle } from "lucide-react";

interface GovernanceTabProps {
  data: Governance;
  onChange: (updated: Governance) => void;
}

export const GovernanceTab: React.FC<GovernanceTabProps> = ({ data, onChange }) => {
  const handleFieldChange = <K extends keyof Governance>(field: K, value: Governance[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAllocationChange = (field: keyof FinancialAllocation, value: number) => {
    onChange({
      ...data,
      financialAllocation: {
        ...data.financialAllocation,
        [field]: value,
      },
    });
  };

  const handleTrusteeChange = <K extends keyof Trustee>(
    index: number,
    field: K,
    value: Trustee[K]
  ) => {
    const updated = [...data.trustees];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({
      ...data,
      trustees: updated,
    });
  };

  const handleAddTrustee = () => {
    const newTrustee: Trustee = {
      name: "New Trustee",
      role: "Board Member",
      qualification: "M.Sc. Public Administration",
      bio: "Committed to transparent humanitarian governance and civic leadership in Nigeria.",
    };
    onChange({
      ...data,
      trustees: [...data.trustees, newTrustee],
    });
  };

  const handleDeleteTrustee = (index: number) => {
    if (data.trustees.length <= 1) return;
    const updated = data.trustees.filter((_, idx) => idx !== index);
    onChange({
      ...data,
      trustees: updated,
    });
  };

  const totalAllocation =
    (data.financialAllocation.programsPercent || 0) +
    (data.financialAllocation.logisticsPercent || 0) +
    (data.financialAllocation.governancePercent || 0);

  const isAllocationValid = totalAllocation === 100;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[#B85D36]/10 text-[#B85D36] border border-[#B85D36]/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-[#FAF8F5]">
              Governance, Regulatory & Trust Roster
            </h2>
            <p className="text-xs text-[#A1A1AA]">
              Maintain CAC corporate registration numbers, SCUML anti-money laundering citations, financial allocations, and trustees.
            </p>
          </div>
        </div>
      </div>

      {/* Statutory Regulatory IDs */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] border-b border-[#27272A] pb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#B85D36]" /> Statutory Registration Identifiers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              CAC Registration Number
            </label>
            <input
              type="text"
              value={data.cacNumber}
              onChange={(e) => handleFieldChange("cacNumber", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              placeholder="CAC/IT/NO/123456"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              SCUML Certificate Number
            </label>
            <input
              type="text"
              value={data.scumlNumber}
              onChange={(e) => handleFieldChange("scumlNumber", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              placeholder="SCUML-RN:2024/001"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              FIRS Tax Identification (TIN)
            </label>
            <input
              type="text"
              value={data.firsTin}
              onChange={(e) => handleFieldChange("firsTin", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              placeholder="12345678-0001"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Tax Exemption Statutory Citation
            </label>
            <input
              type="text"
              value={data.taxExemptionCitation}
              onChange={(e) => handleFieldChange("taxExemptionCitation", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Annual Report PDF Link
            </label>
            <input
              type="text"
              value={data.annualReportPdfUrl}
              onChange={(e) => handleFieldChange("annualReportPdfUrl", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>
        </div>
      </div>

      {/* Audited Financial Allocation */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#1C3F35]" /> Financial Allocation Breakdown ({data.auditedFinancialYear})
          </h3>
          <div className="flex items-center gap-2">
            {isAllocationValid ? (
              <span className="inline-flex items-center gap-1 text-xs text-[#4EAA86] font-mono font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> 100% Balanced
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-mono font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" /> Total: {totalAllocation}% (Must sum to 100%)
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Direct Field Programs (%)
            </label>
            <input
              type="number"
              value={data.financialAllocation.programsPercent}
              onChange={(e) =>
                handleAllocationChange("programsPercent", parseInt(e.target.value) || 0)
              }
              className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Field Logistics & Fleet (%)
            </label>
            <input
              type="number"
              value={data.financialAllocation.logisticsPercent}
              onChange={(e) =>
                handleAllocationChange("logisticsPercent", parseInt(e.target.value) || 0)
              }
              className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Admin & Governance (%)
            </label>
            <input
              type="number"
              value={data.financialAllocation.governancePercent}
              onChange={(e) =>
                handleAllocationChange("governancePercent", parseInt(e.target.value) || 0)
              }
              className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>
        </div>
      </div>

      {/* Trustees Board Roster */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#B85D36]" /> Board of Trustees ({data.trustees.length})
          </h3>
          <button
            type="button"
            onClick={handleAddTrustee}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#27272A] hover:bg-[#3F3F46] text-[#FAF8F5] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Trustee
          </button>
        </div>

        <div className="space-y-4">
          {data.trustees.map((trustee, idx) => (
            <div
              key={trustee.name || idx}
              className="bg-[#111113] border border-[#27272A] rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FAF8F5]">Trustee #{idx + 1}</span>
                {data.trustees.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTrustee(idx)}
                    className="text-[#71717A] hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[#71717A] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={trustee.name}
                    onChange={(e) => handleTrusteeChange(idx, "name", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#71717A] mb-1">Board Role</label>
                  <input
                    type="text"
                    value={trustee.role}
                    onChange={(e) => handleTrusteeChange(idx, "role", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#71717A] mb-1">Qualification</label>
                  <input
                    type="text"
                    value={trustee.qualification}
                    onChange={(e) => handleTrusteeChange(idx, "qualification", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#71717A] mb-1">Biography</label>
                <textarea
                  rows={2}
                  value={trustee.bio}
                  onChange={(e) => handleTrusteeChange(idx, "bio", e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
