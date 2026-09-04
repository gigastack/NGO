"use client";

import React from "react";
import { Organization } from "@/lib/schema/ngo.schema";
import { Building, Mail, Phone, MapPin, Compass } from "lucide-react";

interface IdentityTabProps {
  data: Organization;
  onChange: (updated: Organization) => void;
}

export const IdentityTab: React.FC<IdentityTabProps> = ({ data, onChange }) => {
  const handleChange = <K extends keyof Organization>(field: K, value: Organization[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Overview header */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[#B85D36]/10 text-[#B85D36] border border-[#B85D36]/20">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-[#FAF8F5]">General Organization Identity</h2>
            <p className="text-xs text-[#A1A1AA]">
              Define the legal entity, mission statements, institutional coordinates, and communication channels.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Naming & Acronym */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] border-b border-[#27272A] pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#B85D36]" /> Legal & Brand Names
          </h3>

          <div>
            <label htmlFor="legal-name" className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Legal Incorporated Name
            </label>
            <input
              id="legal-name"
              type="text"
              value={data.legalName}
              onChange={(e) => handleChange("legalName", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              placeholder="e.g. Abuja Resilience & Humanitarian Initiative"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="trading-name" className="block text-xs font-medium text-[#A1A1AA] mb-1">
                Trading / Brand Name
              </label>
              <input
                id="trading-name"
                type="text"
                value={data.tradingName}
                onChange={(e) => handleChange("tradingName", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                Acronym
              </label>
              <input
                type="text"
                value={data.acronym}
                onChange={(e) => handleChange("acronym", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Founding Year
            </label>
            <input
              type="number"
              value={data.foundingYear}
              onChange={(e) => handleChange("foundingYear", parseInt(e.target.value) || 2020)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={data.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>
        </div>

        {/* Contact & Physical HQ */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] border-b border-[#27272A] pb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1C3F35]" /> Headquarter & Contact
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Headquarters Physical Address
            </label>
            <textarea
              rows={2}
              value={data.headquartersAddress}
              onChange={(e) => handleChange("headquartersAddress", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#71717A]" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#71717A]" />
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                WhatsApp Hotline
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#4EAA86]" />
                <input
                  type="text"
                  value={data.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Mission & Vision */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] border-b border-[#27272A] pb-3 flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#B85D36]" /> Strategic Mission & Vision
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Mission Statement
            </label>
            <textarea
              rows={4}
              value={data.mission}
              onChange={(e) => handleChange("mission", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Vision Statement
            </label>
            <textarea
              rows={4}
              value={data.vision}
              onChange={(e) => handleChange("vision", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36] leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
