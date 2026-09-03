"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useMediaOptimization } from "@/lib/media/use-media-optimization";
import { resolveMediaUrl } from "@/lib/media/resolver";
import type { NGOConfig } from "@/lib/schema/ngo.schema";

export interface HeroVideoPlayerProps {
  className?: string;
  videoSrc?: string;
  posterSrc?: string;
  config?: NGOConfig;
  captionSummary?: string;
}

export function HeroVideoPlayer({
  className = "",
  videoSrc,
  posterSrc,
  config,
  captionSummary = "Abuja FCT community resilience and civic empowerment overview",
}: HeroVideoPlayerProps) {
  const mediaOptimization = useMediaOptimization();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [isPlayingManual, setIsPlayingManual] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Fallback defaults if not supplied
  const rawVideo = videoSrc || config?.media?.heroBackgroundVideo || "/media/video-fct-overview.mp4";
  const rawPoster = posterSrc || config?.media?.heroFallbackPoster || "/media/image-monolith-civic.svg";

  const resolvedVideoUrl = resolveMediaUrl(rawVideo, { video: true }, config);
  const resolvedPosterUrl = resolveMediaUrl(rawPoster, { format: mediaOptimization.preferredFormat }, config);

  const isLowBandwidth = mediaOptimization.isDataSaver || mediaOptimization.isSlowConnection;
  const allowAutoplay = mediaOptimization.shouldAutoplayVideo && !isLowBandwidth;

  // Handle manual video play trigger when in data saver mode
  const handleManualPlay = async () => {
    if (!videoRef.current) return;
    try {
      setIsPlayingManual(true);
      videoRef.current.muted = true;
      await videoRef.current.play();
    } catch {
      setIsPlayingManual(false);
    }
  };

  useEffect(() => {
    if (allowAutoplay && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked by browser policy; poster remains gracefully visible
      });
    }
  }, [allowAutoplay]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[var(--color-granite-deep)] ${className}`}
      aria-label="Hero visual media player"
    >
      {/* 1. Poster Still Layer (Visible during loading, slow connections, or error) */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out z-10 ${
          isVideoLoaded && (allowAutoplay || isPlayingManual) ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <Image
          src={resolvedPosterUrl}
          alt="Abuja civic landscape monolith"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-[1.02]"
        />
      </div>

      {/* 2. HTML5 Video Stream Layer */}
      {!hasError && (
        <video
          ref={videoRef}
          src={resolvedVideoUrl}
          poster={resolvedPosterUrl}
          autoPlay={allowAutoplay}
          muted
          loop
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setHasError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
      )}

      {/* 3. Cinematic Warm Vignette & Afro-Modernist Organic Texture Layer */}
      <div
        className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-[var(--color-granite-deep)] via-[var(--color-granite-deep)]/40 to-black/30"
        aria-hidden="true"
      />

      {/* 4. Subtle Organic Texture & Noise Overlay */}
      <div
        className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:16px_16px]"
        aria-hidden="true"
      />

      {/* 5. Data Saver / Manual Play Pill Overlay (When autoplay is inhibited) */}
      {isLowBandwidth && !isPlayingManual && (
        <div className="absolute bottom-6 right-6 z-30">
          <button
            type="button"
            onClick={handleManualPlay}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium tracking-wide bg-[var(--color-parchment-ground)]/90 backdrop-blur-xs text-[var(--color-granite-deep)] border border-[var(--color-parchment-border)] shadow-soft hover:bg-[var(--color-parchment-ground)] hover:border-[var(--color-terracotta-primary)] transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary)]"
            aria-label="Play ambient background video stream"
          >
            <svg
              className="w-3.5 h-3.5 text-[var(--color-terracotta-primary)] fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Play Ambient Stream</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-[var(--color-ochre-accent)]/15 text-[var(--color-granite-deep)] font-semibold uppercase">
              Data Saver
            </span>
          </button>
        </div>
      )}

      {/* Screen Reader Caption Description */}
      <div className="sr-only">
        {captionSummary}
      </div>
    </div>
  );
}
