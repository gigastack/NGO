"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  Heart,
  Repeat2,
  Eye,
  Radio,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import type { SocialFeedItem, SocialPlatform } from "@/lib/schema/ngo.schema";
import { resolveMediaUrl } from "@/lib/media/resolver";

interface SocialActivityWallProps {
  initialItems?: SocialFeedItem[];
  title?: string;
  subtitle?: string;
}

// Crisp SVG Icons for the platforms
function TwitterXIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.26c-.95 0-1.72.78-1.72 1.73a1.73 1.73 0 0 0 1.72 1.73 1.73 1.73 0 0 0 1.72-1.73c0-.95-.77-1.73-1.72-1.73z" />
    </svg>
  );
}

function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

interface PlatformConfig {
  name: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: React.ReactNode;
  accentDot: string;
}

const PLATFORM_CONFIG: Record<SocialPlatform, PlatformConfig> = {
  x: {
    name: "X (Twitter)",
    badgeBg: "bg-[var(--color-granite-deep)]",
    badgeText: "text-white",
    badgeBorder: "border-[var(--color-granite-deep)]",
    icon: <TwitterXIcon className="w-3.5 h-3.5" />,
    accentDot: "bg-[var(--color-granite-deep)]",
  },
  instagram: {
    name: "Instagram",
    badgeBg: "bg-[var(--color-terracotta-surface)]",
    badgeText: "text-[var(--color-terracotta-link)]",
    badgeBorder: "border-[var(--color-terracotta-primary)]/20",
    icon: <InstagramIcon className="w-3.5 h-3.5" />,
    accentDot: "bg-[var(--color-terracotta-primary)]",
  },
  linkedin: {
    name: "LinkedIn",
    badgeBg: "bg-[#EBF3FB]",
    badgeText: "text-[#0A66C2]",
    badgeBorder: "border-[#0A66C2]/20",
    icon: <LinkedInIcon className="w-3.5 h-3.5" />,
    accentDot: "bg-[#0A66C2]",
  },
  youtube: {
    name: "YouTube",
    badgeBg: "bg-[#FDECEC]",
    badgeText: "text-[#C4302B]",
    badgeBorder: "border-[#C4302B]/20",
    icon: <YouTubeIcon className="w-3.5 h-3.5" />,
    accentDot: "bg-[#C4302B]",
  },
};

function formatSocialTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 0) {
      if (diffHours <= 1) return "Just now";
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }

    return new Intl.DateTimeFormat("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return isoString;
  }
}

function formatEngagementMetric(val?: number): string {
  if (val === undefined || val === null) return "0";
  if (val >= 1_000_000) {
    return (val / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (val >= 1_000) {
    return (val / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return val.toLocaleString("en-US");
}

export function SocialActivityWall({
  initialItems = [],
  title = "Field Dispatches & Community Voice",
  subtitle = "Direct, uncurated transmissions and verified impact narratives from community champions across the six Area Councils.",
}: SocialActivityWallProps) {
  const [items, setItems] = useState<SocialFeedItem[]>(initialItems);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | "all">("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  // Client-side feed fetch with graceful fallback to initialItems
  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/social-feed");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          if (data.cachedAt) {
            setLastRefreshed(new Date(data.cachedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch latest social feed, falling back to initial data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      fetchFeed();
    }
  }, []);

  const filteredItems = selectedPlatform === "all"
    ? items
    : items.filter((item) => item.platform === selectedPlatform);

  return (
    <section
      id="social"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-parchment-ground)] border-t border-[var(--color-parchment-border)] overflow-hidden"
      aria-label="Field Dispatches & Community Voice"
    >
      {/* Decorative ambient background accents */}
      <div
        className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-[var(--color-terracotta-primary)]/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -left-40 w-96 h-96 rounded-full bg-[var(--color-savannah-primary)]/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-[var(--color-terracotta-surface)] text-[var(--color-terracotta-primary)] border border-[var(--color-terracotta-primary)]/20 mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[var(--color-terracotta-primary)]" />
              Live Transmissions & Impact
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-granite-deep)] tracking-tight">
              {title}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[var(--color-granite-muted)] leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Right Action & Status */}
          <div className="flex flex-wrap items-center gap-3">
            {lastRefreshed && (
              <span className="text-xs text-[var(--color-granite-muted)]">
                Updated {lastRefreshed}
              </span>
            )}
            <button
              type="button"
              onClick={fetchFeed}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-parchment-subtle)] hover:bg-[var(--color-parchment-border)] text-[var(--color-granite-deep)] border border-[var(--color-parchment-border)] transition-colors disabled:opacity-50"
              title="Refresh feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[var(--color-terracotta-primary)]" : ""}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => setSelectedPlatform("all")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              selectedPlatform === "all"
                ? "bg-[var(--color-savannah-primary)] text-white shadow-soft"
                : "bg-white text-[var(--color-granite-muted)] hover:text-[var(--color-granite-deep)] border border-[var(--color-parchment-border)]"
            }`}
          >
            All Channels ({items.length})
          </button>
          {(["x", "instagram", "linkedin", "youtube"] as SocialPlatform[]).map((platform) => {
            const count = items.filter((i) => i.platform === platform).length;
            if (count === 0 && selectedPlatform !== platform) return null;
            const config = PLATFORM_CONFIG[platform];
            const isSelected = selectedPlatform === platform;

            return (
              <button
                key={platform}
                type="button"
                onClick={() => setSelectedPlatform(platform)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-[var(--color-savannah-primary)] text-white shadow-soft"
                    : "bg-white text-[var(--color-granite-muted)] hover:text-[var(--color-granite-deep)] border border-[var(--color-parchment-border)]"
                }`}
              >
                <span>{config.icon}</span>
                <span>{config.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-[var(--color-parchment-subtle)] text-[var(--color-granite-muted)]"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Social Feed Grid */}
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-16 text-center rounded-2xl border border-dashed border-[var(--color-parchment-border)] bg-white/40"
            >
              <Sparkles className="w-8 h-8 mx-auto text-[var(--color-granite-muted)] opacity-50 mb-3" />
              <p className="text-base text-[var(--color-granite-muted)]">
                No dispatches found for this channel.
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start"
            >
              {filteredItems.map((item, index) => {
                const config = PLATFORM_CONFIG[item.platform];
                const resolvedMedia = item.mediaUrl ? resolveMediaUrl(item.mediaUrl) : null;

                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="flex flex-col justify-between h-full bg-white rounded-2xl border border-[var(--color-parchment-border)] shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden group hover:border-[var(--color-terracotta-primary)]/30"
                  >
                    <div>
                      {/* Optional Media Thumbnail */}
                      {resolvedMedia && (
                        <div className="relative w-full aspect-video sm:aspect-[16/10] overflow-hidden bg-[var(--color-parchment-subtle)] border-b border-[var(--color-parchment-border)]">
                          <Image
                            src={resolvedMedia}
                            alt={`Media from ${item.authorName}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Platform Badge Overlay */}
                          <div className="absolute top-3 left-3 z-10">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${config.badgeBg} ${config.badgeText} border ${config.badgeBorder}`}
                            >
                              {config.icon}
                              <span>{config.name}</span>
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-5 sm:p-6">
                        {/* Header if no media thumbnail */}
                        {!resolvedMedia && (
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.badgeBg} ${config.badgeText} border ${config.badgeBorder}`}
                            >
                              {config.icon}
                              <span>{config.name}</span>
                            </span>
                            <span className="text-xs text-[var(--color-granite-muted)] font-medium">
                              {formatSocialTimestamp(item.timestamp)}
                            </span>
                          </div>
                        )}

                        {/* Author Info */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-[var(--color-granite-deep)] truncate group-hover:text-[var(--color-terracotta-primary)] transition-colors">
                              {item.authorName}
                            </h3>
                            <p className="text-xs text-[var(--color-granite-muted)] truncate">
                              {item.authorHandle}
                            </p>
                          </div>
                          {resolvedMedia && (
                            <span className="text-xs text-[var(--color-granite-muted)] font-medium shrink-0">
                              {formatSocialTimestamp(item.timestamp)}
                            </span>
                          )}
                        </div>

                        {/* Content text */}
                        <p className="text-sm text-[var(--color-granite-deep)]/90 leading-relaxed line-clamp-4 whitespace-pre-line">
                          {item.content}
                        </p>
                      </div>
                    </div>

                    {/* Footer / Engagement & Action */}
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-[var(--color-parchment-border)]/60 bg-[var(--color-parchment-ground)]/40 flex items-center justify-between gap-3">
                      {/* Metrics */}
                      <div className="flex items-center gap-3.5 text-xs text-[var(--color-granite-muted)] font-medium">
                        {item.engagement?.likes !== undefined && (
                          <span
                            className="inline-flex items-center gap-1 hover:text-[var(--color-terracotta-primary)] transition-colors"
                            title="Likes"
                          >
                            <Heart className="w-3.5 h-3.5" />
                            {formatEngagementMetric(item.engagement.likes)}
                          </span>
                        )}
                        {item.engagement?.shares !== undefined && (
                          <span
                            className="inline-flex items-center gap-1 hover:text-[var(--color-savannah-primary)] transition-colors"
                            title="Shares / Reposts"
                          >
                            <Repeat2 className="w-3.5 h-3.5" />
                            {formatEngagementMetric(item.engagement.shares)}
                          </span>
                        )}
                        {item.engagement?.views !== undefined && (
                          <span
                            className="inline-flex items-center gap-1 hover:text-[var(--color-granite-deep)] transition-colors"
                            title="Impressions / Views"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {formatEngagementMetric(item.engagement.views)}
                          </span>
                        )}
                      </div>

                      {/* External Link */}
                      <a
                        href={item.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-terracotta-link)] hover:text-[var(--color-terracotta-primary)] transition-colors shrink-0 group/link"
                        aria-label={`View dispatch from ${item.authorName} on ${config.name} in a new tab`}
                      >
                        <span>Dispatch</span>
                        <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
