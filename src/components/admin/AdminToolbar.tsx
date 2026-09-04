"use client";

import React from "react";
import Link from "next/link";
import {
  Save,
  Download,
  RefreshCw,
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface AdminToolbarProps {
  onSave: () => void;
  onDownload: () => void;
  onPurgeCache: () => void;
  onLock: () => void;
  isSaving: boolean;
  isPurging: boolean;
  hasUnsavedChanges: boolean;
  statusMessage: { type: "success" | "error" | "info"; text: string } | null;
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({
  onSave,
  onDownload,
  onPurgeCache,
  onLock,
  isSaving,
  isPurging,
  hasUnsavedChanges,
  statusMessage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#18181B]/95 backdrop-blur-md border-b border-[#27272A] px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left branding & status */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-[#FAF8F5] transition-colors px-2 py-1 rounded-md hover:bg-[#27272A]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portal</span>
          </Link>

          <div className="h-4 w-px bg-[#27272A]" />

          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm text-[#FAF8F5] tracking-tight">
              Abuja NGO Content Studio
            </span>
            {hasUnsavedChanges ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#B85D36]/20 text-[#E0825B] border border-[#B85D36]/40">
                Unsaved Edits
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#1C3F35]/30 text-[#4EAA86] border border-[#1C3F35]/60">
                Synced
              </span>
            )}
          </div>
        </div>

        {/* Dynamic status feedback notification */}
        {statusMessage && (
          <div
            className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg border animate-fade-in ${
              statusMessage.type === "success"
                ? "bg-[#1C3F35]/20 border-[#1C3F35] text-[#4EAA86]"
                : statusMessage.type === "error"
                ? "bg-red-950/30 border-red-900 text-red-300"
                : "bg-blue-950/30 border-blue-900 text-blue-300"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            <span className="truncate max-w-xs sm:max-w-md">{statusMessage.text}</span>
          </div>
        )}

        {/* Actions button group */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={onDownload}
            title="Export local configuration backup JSON"
            aria-label="Download JSON Archive"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#FAF8F5] bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span> Archive
          </button>

          <button
            type="button"
            onClick={onPurgeCache}
            disabled={isPurging}
            title="Purge Next.js on-demand ISR edge cache"
            aria-label="Purge Edge Cache"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#FAF8F5] bg-[#1C3F35] hover:bg-[#255246] border border-[#2A5C4F] transition-all disabled:opacity-50"
          >
            {isPurging ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4EAA86]" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-[#4EAA86]" />
            )}
            <span className="hidden sm:inline">Purge</span> Edge Cache
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-[#FAF8F5] bg-[#B85D36] hover:bg-[#A04D29] shadow-md shadow-[#B85D36]/20 transition-all disabled:opacity-50 active:scale-95"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save to Content Files</span>
          </button>

          <button
            type="button"
            onClick={onLock}
            title="Lock administrative session"
            className="p-1.5 text-[#71717A] hover:text-[#FAF8F5] hover:bg-[#27272A] rounded-lg transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
