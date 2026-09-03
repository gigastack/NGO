"use client";

import React, { useState } from "react";
import { Shield, Key, ArrowRight, Lock } from "lucide-react";

interface AdminPassphraseGateProps {
  onUnlock: (passphrase: string) => void;
  error?: string | null;
}

export const AdminPassphraseGate: React.FC<AdminPassphraseGateProps> = ({
  onUnlock,
  error,
}) => {
  const [passphrase, setPassphrase] = useState("abuja-resilience-2025");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;
    setSubmitting(true);
    onUnlock(passphrase.trim());
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#111113] text-[#FAF8F5] flex flex-col items-center justify-center p-4 selection:bg-[#B85D36] selection:text-[#FAF8F5]">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B85D36] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#1C3F35] rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#B85D36]/10 border border-[#B85D36]/30 flex items-center justify-center text-[#B85D36] shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
          </div>

          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1C3F35]/30 text-[#4EAA86] border border-[#1C3F35]/60 mb-3 tracking-wide uppercase">
              <Lock className="w-3.5 h-3.5" /> Abuja Resilience Studio
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#FAF8F5] font-serif">
              Visual Content Studio
            </h1>
            <p className="text-sm text-[#A1A1AA] mt-2">
              Enter the authorized administrative passphrase to manage Abuja NGO portal configuration, projects, and edge deployment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="passphrase"
                className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-2"
              >
                Passphrase
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  id="passphrase"
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter studio passphrase"
                  className="w-full pl-10 pr-4 py-3 bg-[#111113] border border-[#27272A] rounded-xl text-[#FAF8F5] placeholder-[#52525B] text-sm focus:outline-none focus:ring-2 focus:ring-[#B85D36] focus:border-transparent transition-all"
                  autoFocus
                  required
                />
              </div>
              {error && (
                <p className="mt-2 text-xs text-red-400 font-medium">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#B85D36] hover:bg-[#A04D29] text-[#FAF8F5] font-medium text-sm transition-all duration-200 shadow-lg shadow-[#B85D36]/20 active:scale-[0.99] disabled:opacity-50"
            >
              <span>Unlock Content Studio</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#27272A] flex items-center justify-between text-xs text-[#71717A]">
            <span>Security Layer v1.0</span>
            <span className="font-mono text-[11px] text-[#A1A1AA]">
              FCT Field Operations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
