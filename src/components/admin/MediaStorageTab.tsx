"use client";

import React from "react";
import { Media } from "@/lib/schema/ngo.schema";
import { HardDrive, Cloud, Server, Video, Volume2, Film, Image as ImageIcon } from "lucide-react";

interface MediaStorageTabProps {
  data: Media;
  onChange: (updated: Media) => void;
}

export const MediaStorageTab: React.FC<MediaStorageTabProps> = ({ data, onChange }) => {
  const handleStorageChange = (provider: "cloudinary" | "s3" | "local" | "external") => {
    onChange({
      ...data,
      storage: {
        ...data.storage,
        provider,
      },
    });
  };

  const handleCloudinaryChange = (field: string, value: string | boolean) => {
    onChange({
      ...data,
      storage: {
        ...data.storage,
        cloudinary: {
          cloudName: data.storage.cloudinary?.cloudName || "",
          folder: data.storage.cloudinary?.folder || "portal-assets",
          secure: data.storage.cloudinary?.secure ?? true,
          [field]: value,
        },
      },
    });
  };

  const handleS3Change = (field: string, value: string) => {
    onChange({
      ...data,
      storage: {
        ...data.storage,
        s3: {
          bucket: data.storage.s3?.bucket || "",
          region: data.storage.s3?.region || "",
          endpoint: data.storage.s3?.endpoint || "",
          publicUrlBase: data.storage.s3?.publicUrlBase || "",
          [field]: value,
        },
      },
    });
  };

  const handleLocalChange = (basePath: string) => {
    onChange({
      ...data,
      storage: {
        ...data.storage,
        local: {
          basePath,
        },
      },
    });
  };

  const handleMediaFieldChange = <K extends keyof Media>(field: K, value: Media[K]) => {
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
          <div className="p-2 rounded-xl bg-[#1C3F35]/30 text-[#4EAA86] border border-[#1C3F35]/60">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-[#FAF8F5]">Media & Asset Infrastructure</h2>
            <p className="text-xs text-[#A1A1AA]">
              Select high-performance storage providers, CDN paths, and manage cinematic hero reels & soundscapes.
            </p>
          </div>
        </div>
      </div>

      {/* Storage Provider Selection */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] border-b border-[#27272A] pb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-[#B85D36]" /> Storage Engine Selector
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              id: "cloudinary",
              name: "Cloudinary CDN",
              desc: "On-the-fly media transformations and AVIF/WebP auto-format",
              icon: Cloud,
            },
            {
              id: "s3",
              name: "Amazon S3 / R2",
              desc: "Direct bucket storage with edge caching & zero egress",
              icon: Server,
            },
            {
              id: "local",
              name: "Local Static (/public)",
              desc: "Zero-configuration relative filesystem assets for dev/offline",
              icon: HardDrive,
            },
          ].map((engine) => {
            const Icon = engine.icon;
            const isSelected = data.storage.provider === engine.id;
            return (
              <button
                key={engine.id}
                type="button"
                onClick={() => handleStorageChange(engine.id as "cloudinary" | "s3" | "local")}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? "bg-[#1C3F35]/20 border-[#4EAA86] text-[#FAF8F5] shadow-lg shadow-[#1C3F35]/20"
                    : "bg-[#111113] border-[#27272A] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-[#FAF8F5]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${isSelected ? "text-[#4EAA86]" : "text-[#71717A]"}`} />
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#4EAA86] shadow-[0_0_8px_#4EAA86]" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#FAF8F5]">{engine.name}</h4>
                  <p className="text-xs text-[#71717A] mt-1 leading-snug">{engine.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Provider Settings */}
        <div className="pt-2">
          {data.storage.provider === "cloudinary" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#111113] p-4 rounded-xl border border-[#27272A]">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  Cloudinary Cloud Name
                </label>
                <input
                  type="text"
                  value={data.storage.cloudinary?.cloudName || ""}
                  onChange={(e) => handleCloudinaryChange("cloudName", e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  placeholder="abuja-resilience"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                  Folder Namespace
                </label>
                <input
                  type="text"
                  value={data.storage.cloudinary?.folder || "portal-assets"}
                  onChange={(e) => handleCloudinaryChange("folder", e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  placeholder="portal-assets"
                />
              </div>
            </div>
          )}

          {data.storage.provider === "s3" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#111113] p-4 rounded-xl border border-[#27272A]">
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">S3 Bucket Name</label>
                <input
                  type="text"
                  value={data.storage.s3?.bucket || ""}
                  onChange={(e) => handleS3Change("bucket", e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  placeholder="abuja-portal-media"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A1A1AA] mb-1">AWS / R2 Region</label>
                <input
                  type="text"
                  value={data.storage.s3?.region || ""}
                  onChange={(e) => handleS3Change("region", e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                  placeholder="af-south-1"
                />
              </div>
            </div>
          )}

          {data.storage.provider === "local" && (
            <div className="bg-[#111113] p-4 rounded-xl border border-[#27272A]">
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
                Local Base Public Path
              </label>
              <input
                type="text"
                value={data.storage.local?.basePath || "/media"}
                onChange={(e) => handleLocalChange(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                placeholder="/media"
              />
            </div>
          )}
        </div>
      </div>

      {/* Hero Cinematic Assets */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] border-b border-[#27272A] pb-3 flex items-center gap-2">
          <Video className="w-4 h-4 text-[#B85D36]" /> Hero Section Media & Ambience
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Hero Background Video (MP4 / WebM)
            </label>
            <div className="relative">
              <Film className="absolute left-3.5 top-3 w-4 h-4 text-[#71717A]" />
              <input
                type="text"
                value={data.heroBackgroundVideo}
                onChange={(e) => handleMediaFieldChange("heroBackgroundVideo", e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                placeholder="/media/hero/fct-drone-overview.mp4"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
              Hero Fallback Poster (Image)
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#71717A]" />
              <input
                type="text"
                value={data.heroFallbackPoster}
                onChange={(e) => handleMediaFieldChange("heroFallbackPoster", e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
                placeholder="/media/hero/fct-drone-poster.webp"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#A1A1AA] mb-1">
            Ambient Audio Soundscape URL (Optional)
          </label>
          <div className="relative">
            <Volume2 className="absolute left-3.5 top-3 w-4 h-4 text-[#71717A]" />
            <input
              type="text"
              value={data.ambientAudioSoundscapeUrl || ""}
              onChange={(e) => handleMediaFieldChange("ambientAudioSoundscapeUrl", e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-[#111113] border border-[#27272A] rounded-xl text-sm text-[#FAF8F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#B85D36]"
              placeholder="/media/audio/fct-savannah-ambient.mp3"
            />
          </div>
        </div>
      </div>

      {/* Mini-Documentary Hub Summary */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FAF8F5] flex items-center gap-2">
            <Film className="w-4 h-4 text-[#1C3F35]" /> Mini-Documentary Field Reels ({data.miniDocumentaries.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data.miniDocumentaries.map((doc, idx) => (
            <div key={doc.id || idx} className="bg-[#111113] border border-[#27272A] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-[#B85D36]/20 text-[#E0825B]">
                  {doc.councilId}
                </span>
                <span className="text-xs text-[#71717A]">{doc.durationMinutes} mins</span>
              </div>
              <h4 className="text-sm font-semibold text-[#FAF8F5] line-clamp-1">{doc.title}</h4>
              <p className="text-xs text-[#71717A] line-clamp-2">{doc.captionSummary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
