"use client";

import React, { useEffect, useRef, useState } from "react";
import { resolveMediaUrl } from "@/lib/media/resolver";
import { useMediaOptimization } from "@/lib/media/use-media-optimization";

export interface VideoModalItem {
  id: string;
  title: string;
  councilName?: string;
  mediaPath: string;
  captionSummary: string;
  duration?: string;
  posterPath?: string;
}

interface VideoModalPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoModalItem | null;
}

export function VideoModalPlayer({ isOpen, onClose, video }: VideoModalPlayerProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isDataSaver, isSlowConnection } = useMediaOptimization();
  const [hasError, setHasError] = useState(false);

  // Focus trap & Escape key handler
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setHasError(false);

    // Save previous active element to restore later
    const prevActive = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    // Prevent body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), video'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      prevActive?.focus();
    };
  }, [isOpen, onClose]);

  // Pause video on close
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen || !video) {
    return null;
  }

  const resolvedVideoSrc = resolveMediaUrl(video.mediaPath, { video: true });
  const resolvedPosterSrc = video.posterPath ? resolveMediaUrl(video.posterPath) : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      aria-describedby="video-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#111113]/85 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-[var(--color-granite-card,#1E1E22)] border border-[var(--color-granite-border,#2D2D34)] shadow-modal text-[#FAF8F5] flex flex-col max-h-[92vh] animate-scaleUp"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-granite-border,#2D2D34)] bg-[#17171A]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-[var(--color-terracotta-primary,#B85D36)]/20 text-[#E08A63] border border-[var(--color-terracotta-primary,#B85D36)]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta-primary,#B85D36)] animate-pulse" />
              FCT Field Reel
            </span>

            {video.councilName && (
              <span className="text-xs text-[var(--color-granite-muted,#7A736B)] font-medium">
                {video.councilName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Low-bandwidth / Data Saver Pill */}
            {(isDataSaver || isSlowConnection) && (
              <span
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded bg-[var(--color-ochre-accent,#D49B35)]/20 text-[var(--color-ochre-accent,#D49B35)] border border-[var(--color-ochre-accent,#D49B35)]/30"
                title="Optimized for low-bandwidth FCT network environments"
              >
                Data Saver Mode
              </span>
            )}

            {/* Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#FAF8F5]/70 hover:text-[#FAF8F5] hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary,#B85D36)]"
              aria-label="Close documentary player"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Video Surface */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={resolvedVideoSrc}
            poster={resolvedPosterSrc}
            controls
            autoPlay
            playsInline
            preload="metadata"
            onError={() => setHasError(true)}
            className={`w-full h-full object-contain ${hasError ? "opacity-0 pointer-events-none" : ""}`}
          >
            Your browser does not support HTML5 video playback.
          </video>
          {hasError && (
            <div className="absolute inset-0 p-8 text-center max-w-md mx-auto flex flex-col items-center justify-center">
              <svg className="w-12 h-12 mx-auto text-[var(--color-terracotta-primary,#B85D36)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="text-lg font-bold text-white mb-1">Field Stream Standby</h4>
              <p className="text-sm text-[#FAF8F5]/70 mb-4">
                The high-definition video archive is synchronizing. High-fidelity visual transcripts and field reports remain available.
              </p>
              <button
                type="button"
                onClick={() => {
                  setHasError(false);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-terracotta-primary,#B85D36)] text-white hover:opacity-90 transition"
              >
                Retry Stream
              </button>
            </div>
          )}
        </div>

        {/* Caption & Metadata Footer */}
        <div className="p-5 sm:p-6 bg-[var(--color-granite-card,#1E1E22)] border-t border-[var(--color-granite-border,#2D2D34)]">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
            <div>
              <h3 id="video-modal-title" className="text-lg sm:text-xl font-bold font-display text-[#FAF8F5] tracking-tight">
                {video.title}
              </h3>
              {video.duration && (
                <p className="text-xs text-[var(--color-ochre-accent,#D49B35)] font-medium mt-0.5">
                  Runtime: {video.duration}
                </p>
              )}
            </div>
          </div>
          <p id="video-modal-desc" className="text-sm text-[#FAF8F5]/80 leading-relaxed max-w-3xl">
            {video.captionSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
