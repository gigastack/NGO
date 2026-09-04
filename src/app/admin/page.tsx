"use client";

import React, { useState, useEffect } from "react";
import { NGOConfig, safeValidateNGOConfig } from "@/lib/schema/ngo.schema";
import { AdminPassphraseGate } from "@/components/admin/AdminPassphraseGate";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { IdentityTab } from "@/components/admin/IdentityTab";
import { BrandingTab } from "@/components/admin/BrandingTab";
import { MediaStorageTab } from "@/components/admin/MediaStorageTab";
import { CouncilsProjectsTab } from "@/components/admin/CouncilsProjectsTab";
import { BankingWireTab } from "@/components/admin/BankingWireTab";
import { GovernanceTab } from "@/components/admin/GovernanceTab";
import {
  Building,
  Palette,
  HardDrive,
  FolderKanban,
  Landmark,
  Scale,
  Loader2,
} from "lucide-react";

const DEFAULT_PASSPHRASE =
  process.env.NEXT_PUBLIC_ADMIN_PASSPHRASE || "abuja-resilience-2025";

type ActiveTab =
  | "identity"
  | "branding"
  | "media"
  | "councils"
  | "banking"
  | "governance";

export default function AdminStudioPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPassphrase, setCurrentPassphrase] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>("identity");
  const [config, setConfig] = useState<NGOConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Check sessionStorage auth on mount
  useEffect(() => {
    const storedAuth = typeof window !== "undefined" ? sessionStorage.getItem("ngo_admin_auth") : null;
    const storedPass = typeof window !== "undefined" ? sessionStorage.getItem("ngo_admin_pass") : null;

    if (storedAuth === "true" && storedPass) {
      setIsAuthenticated(true);
      setCurrentPassphrase(storedPass);
    }
  }, []);

  // Fetch initial configuration from /api/admin/config
  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/config");
        if (!res.ok) throw new Error("Failed to load portal configuration.");
        const data = await res.json();
        setConfig(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error loading config";
        setStatusMessage({
          type: "error",
          text: message,
        });
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  // Handle Passphrase Unlock
  const handleUnlock = (passphraseInput: string) => {
    if (passphraseInput === DEFAULT_PASSPHRASE) {
      setIsAuthenticated(true);
      setCurrentPassphrase(passphraseInput);
      setAuthError(null);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ngo_admin_auth", "true");
        sessionStorage.setItem("ngo_admin_pass", passphraseInput);
      }
    } else {
      setAuthError("Invalid administrative passphrase. Please check your credentials.");
    }
  };

  // Handle Lock
  const handleLock = () => {
    setIsAuthenticated(false);
    setCurrentPassphrase("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ngo_admin_auth");
      sessionStorage.removeItem("ngo_admin_pass");
    }
  };

  // Update Config Slice
  const updateConfigSlice = <K extends keyof NGOConfig>(sliceKey: K, value: NGOConfig[K]) => {
    if (!config) return;
    setConfig({
      ...config,
      [sliceKey]: value,
    });
    setHasUnsavedChanges(true);
  };

  // Action: Save to Content Files
  const handleSave = async () => {
    if (!config) return;

    // Validate config with zod before saving
    const validation = safeValidateNGOConfig(config);
    if (!validation.success) {
      const issueMsg = validation.error.issues[0]?.message || "Validation failed";
      setStatusMessage({
        type: "error",
        text: `Schema validation failed: ${issueMsg}`,
      });
      return;
    }

    try {
      setIsSaving(true);
      setStatusMessage(null);

      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passphrase": currentPassphrase || DEFAULT_PASSPHRASE,
        },
        body: JSON.stringify(config),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save configuration.");
      if (json.readOnly) {
        setStatusMessage({
          type: "info",
          text: json.message || "Vercel serverless environment is read-only. Please use 'Download JSON Archive' to export and commit changes.",
        });
      } else {
        setHasUnsavedChanges(false);
        setStatusMessage({
          type: "success",
          text: "Configuration saved and updated successfully.",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Save failed";
      setStatusMessage({
        type: "error",
        text: message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Action: Download JSON Archive
  const handleDownload = () => {
    if (!config) return;
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `abuja-ngo-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Action: Purge Edge Cache
  const handlePurgeCache = async () => {
    try {
      setIsPurging(true);
      setStatusMessage(null);

      const res = await fetch(
        "/api/revalidate?secret=abuja-resilience-revalidate-2025"
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to purge edge cache.");

      setStatusMessage({
        type: "success",
        text: `Edge cache purged on-demand at ${new Date(data.now || Date.now()).toLocaleTimeString()}.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Purge cache failed";
      setStatusMessage({
        type: "error",
        text: message,
      });
    } finally {
      setIsPurging(false);
    }
  };

  if (!isAuthenticated) {
    return <AdminPassphraseGate onUnlock={handleUnlock} error={authError} />;
  }

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-[#111113] text-[#FAF8F5] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#B85D36] mb-3" />
        <p className="text-sm text-[#A1A1AA] font-mono">Loading Content Studio Configuration...</p>
      </div>
    );
  }

  const TABS = [
    { id: "identity", label: "General Identity", icon: Building },
    { id: "branding", label: "Branding & Theme", icon: Palette },
    { id: "media", label: "Media & Storage", icon: HardDrive },
    { id: "councils", label: "Councils & Projects", icon: FolderKanban },
    { id: "banking", label: "Banking & Wire", icon: Landmark },
    { id: "governance", label: "Governance & Trust", icon: Scale },
  ] as const;

  return (
    <div className="min-h-screen bg-[#111113] text-[#FAF8F5] flex flex-col selection:bg-[#B85D36] selection:text-[#FAF8F5]">
      {/* Top Fixed Toolbar */}
      <AdminToolbar
        onSave={handleSave}
        onDownload={handleDownload}
        onPurgeCache={handlePurgeCache}
        onLock={handleLock}
        isSaving={isSaving}
        isPurging={isPurging}
        hasUnsavedChanges={hasUnsavedChanges}
        statusMessage={statusMessage}
      />

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#27272A] scrollbar-thin">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-t border-x ${
                  isSelected
                    ? "bg-[#18181B] border-[#27272A] text-[#FAF8F5] shadow-sm"
                    : "bg-transparent border-transparent text-[#71717A] hover:text-[#A1A1AA]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? "text-[#B85D36]" : "text-[#71717A]"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Viewport */}
        <div className="pt-2">
          {activeTab === "identity" && (
            <IdentityTab
              data={config.organization}
              onChange={(updated) => updateConfigSlice("organization", updated)}
            />
          )}

          {activeTab === "branding" && (
            <BrandingTab
              data={config.branding}
              onChange={(updated) => updateConfigSlice("branding", updated)}
            />
          )}

          {activeTab === "media" && (
            <MediaStorageTab
              data={config.media}
              onChange={(updated) => updateConfigSlice("media", updated)}
            />
          )}

          {activeTab === "councils" && (
            <CouncilsProjectsTab
              councils={config.councils}
              onChange={(updated) => updateConfigSlice("councils", updated)}
            />
          )}

          {activeTab === "banking" && (
            <BankingWireTab
              data={config.banking}
              onChange={(updated) => updateConfigSlice("banking", updated)}
            />
          )}

          {activeTab === "governance" && (
            <GovernanceTab
              data={config.governance}
              onChange={(updated) => updateConfigSlice("governance", updated)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
