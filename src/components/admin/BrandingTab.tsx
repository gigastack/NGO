"use client";

import React from "react";
import { Branding } from "@/lib/schema/ngo.schema";
import { Palette, Sun, Moon, Laptop, Image, Shield } from "lucide-react";

interface BrandingTabProps {
  data: Branding;
  onChange: (updated: Branding) => void;
}

const PRESET_PALETTES = [
  { name: "Terracotta Earth", hex: "#B85D36", bg: "bg-[#B85D36]" },
  { name: "Savannah Emerald", hex: "#1C3F35", bg: "bg-[#1C3F35]" },
  { name: "Ochre Clay", hex: "#C27D38", bg: "bg-[#C27D38]" },
  { name: "Sahel Bronze", hex: "#9E6B38", bg: "bg-[#9E6B38]" },
  { name: "Abuja Forest", hex: "#2E5D4B", bg: "bg-[#2E5D4B]" },
];

export const BrandingTab: React.FC<BrandingTabProps> = ({ data, onChange }) => {
  const handleChange = <K extends keyof Branding>(field: K, value: Branding[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[#B85D36]/10 text-[#B85D36] border border-[#B85D36]/20">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-[#FAF8F5]">Branding, Heraldry & Theme</h2>
            <p className="text-xs text-[#A1A1AA]">
              Configure institutional emblems, color schemes, crest paths, and visual tokens.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colors & Appearance */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] border-b border-[#27272A] pb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#B85D36]" /> Color Palette & Theme
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-2">
              Primary Brand Color (Hex)
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl border border-white/20 shadow-inner shrink-0"
                style={{ backgroundColor: data.primaryColorHex || "#B85D36" }}
              />
              <input
                type="text"
                value={data.primaryColorHex}
                onChange={(e) => handleChange("primaryColorHex", e.target.value)}
                className="w-full px-3.5 py-2 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                placeholder="#B85D36"
              />
            </div>

            {/* Presets */}
            <div className="mt-3">
              <span className="text-[11px] text-[#71717A] block mb-1.5">Afro-Modernist Presets:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_PALETTES.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => handleChange("primaryColorHex", preset.hex)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#111113] border border-[#27272A] hover:border-[#3F3F46] text-[#A1A1AA] hover:text-[#FAF8F5] transition-colors"
                  >
                    <span className={`w-3 h-3 rounded-full ${preset.bg}`} />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-2">
              Default Theme Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "dark", label: "Dark Obsidian", icon: Moon },
                { id: "light", label: "Light Parchment", icon: Sun },
                { id: "system", label: "System Sync", icon: Laptop },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = data.themeMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleChange("themeMode", item.id as "light" | "dark" | "system")}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#B85D36]/15 border-[#B85D36] text-[#FAF8F5]"
                        : "bg-[#111113] border-[#27272A] text-[#71717A] hover:text-[#A1A1AA] hover:border-[#3F3F46]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? "text-[#B85D36]" : "text-[#71717A]"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Emblems, Logos & Favicon */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] border-b border-[#27272A] pb-3 flex items-center gap-2">
            <Image className="w-4 h-4 text-[#1C3F35]" /> Assets & Emblems
          </h3>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Logo Asset URL
            </label>
            <input
              type="text"
              value={data.logoUrl}
              onChange={(e) => handleChange("logoUrl", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              placeholder="/media/logo.svg or https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Logo Alt Text (Accessibility)
            </label>
            <input
              type="text"
              value={data.logoAlt}
              onChange={(e) => handleChange("logoAlt", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Crest SVG Path (Optional)
            </label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-3 w-4 h-4 text-[#71717A]" />
              <input
                type="text"
                value={data.crestSvgPath || ""}
                onChange={(e) => handleChange("crestSvgPath", e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                placeholder="/media/crest.svg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Favicon URL
            </label>
            <input
              type="text"
              value={data.faviconUrl}
              onChange={(e) => handleChange("faviconUrl", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              placeholder="/favicon.ico"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
