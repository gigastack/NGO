"use client";

import React, { useState } from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/media/resolver";
import { VideoModalPlayer, type VideoModalItem } from "./VideoModalPlayer";

export interface MiniDocReel {
  id: string;
  title: string;
  actLabel: string;
  duration: string;
  councilTag: string;
  thumbnailPath: string;
  videoPath: string;
  captionSummary: string;
  tagline: string;
}

const DOCUMENTARY_REELS: MiniDocReel[] = [
  {
    id: "monolith-margin",
    title: "The Monolith & The Margin",
    actLabel: "Act I · Civic Horizon",
    duration: "60s Reel",
    councilTag: "AMAC / Bwari",
    thumbnailPath: "https://images.unsplash.com/photo-1589824783837-6169889fa20f?auto=format&fit=crop&w=1200&q=80",
    videoPath: "https://res.cloudinary.com/demo/video/upload/dog.mp4",
    captionSummary:
      "A cinematic investigation into grassroots community health workers and informal settlements thriving under the monolithic gaze of Abuja's federal architecture.",
    tagline: "Bridging the divide between civic centers and frontline settlements.",
  },
  {
    id: "clean-water-maternal",
    title: "Clean Water & Maternal Care",
    actLabel: "Act II · Rural Aquifers",
    duration: "60s Reel",
    councilTag: "Kwali & Kuje",
    thumbnailPath: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
    videoPath: "https://res.cloudinary.com/demo/video/upload/rafting.mp4",
    captionSummary:
      "Deep aquifer solar drilling powering localized maternal health clinics across rural agrarian belts, ensuring sterile water security during critical deliveries.",
    tagline: "Solar boreholes powering uninterrupted maternal clinical care.",
  },
  {
    id: "solar-code-ancestral",
    title: "Solar Code & Ancestral Clay",
    actLabel: "Act III · Youth Innovation",
    duration: "60s Reel",
    councilTag: "Bwari / AMAC",
    thumbnailPath: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
    videoPath: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
    captionSummary:
      "Ushafa pottery traditions synthesized with solar-powered STEM micro-labs, equipping next-generation youth with digital fabrication and agritech telemetry.",
    tagline: "Ancestral craftsmanship meets decentralized clean tech training.",
  },
];

export function MiniDocumentaryHub() {
  const [selectedVideo, setSelectedVideo] = useState<VideoModalItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenVideo = (reel: MiniDocReel) => {
    setSelectedVideo({
      id: reel.id,
      title: reel.title,
      councilName: reel.councilTag,
      mediaPath: reel.videoPath,
      captionSummary: reel.captionSummary,
      duration: reel.duration,
      posterPath: reel.thumbnailPath,
    });
    setIsModalOpen(true);
  };

  return (
    <section
      id="stories"
      aria-labelledby="stories-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--color-parchment-border,#E5DFD5)]"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[var(--color-savannah-surface,#E8F0ED)] text-[var(--color-savannah-primary,#1C3F35)] border border-[var(--color-savannah-primary,#1C3F35)]/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--color-savannah-primary,#1C3F35)]" />
            Field Dispatch Visuals
          </div>
          <h2
            id="stories-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-[var(--color-granite-deep,#111113)] leading-[1.15]"
          >
            Living Narratives from the 6 Area Councils
          </h2>
        </div>
        <p className="text-base sm:text-lg text-[var(--color-granite-muted,#7A736B)] max-w-md leading-relaxed">
          Three short-form field reels documenting community-led water resilience, maternal health outposts, and solar digital fabrication across the FCT.
        </p>
      </div>

      {/* 3-Reel Documentary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {DOCUMENTARY_REELS.map((reel) => {
          const resolvedThumbnail = resolveMediaUrl(reel.thumbnailPath);

          return (
            <article
              key={reel.id}
              onClick={() => handleOpenVideo(reel)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenVideo(reel);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Watch mini-documentary: ${reel.title} (${reel.duration})`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[var(--color-parchment-border,#E5DFD5)] shadow-soft hover:shadow-card hover:border-[var(--color-terracotta-primary,#B85D36)]/40 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary,#B85D36)] focus-visible:ring-offset-2"
            >
              {/* Media Thumbnail Container with Play Trigger */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-parchment-subtle,#F3EFEA)]">
                <Image
                  src={resolvedThumbnail}
                  alt={reel.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {reel.actLabel}
                  </span>
                  <span className="px-2 py-1 text-[11px] font-bold rounded-md bg-[var(--color-terracotta-primary,#B85D36)] text-white shadow-sm">
                    {reel.duration}
                  </span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FAF8F5]/90 text-[var(--color-granite-deep,#111113)] flex items-center justify-center shadow-md group-hover:bg-[var(--color-terracotta-primary,#B85D36)] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Council Tag */}
                <div className="absolute bottom-3 left-3.5 pointer-events-none">
                  <span className="text-xs font-semibold text-white/90 drop-shadow-sm flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[var(--color-ochre-accent,#D49B35)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {reel.councilTag}
                  </span>
                </div>
              </div>

              {/* Story Content Block */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold text-[var(--color-granite-deep,#111113)] mb-2 group-hover:text-[var(--color-terracotta-primary,#B85D36)] transition-colors">
                    {reel.title}
                  </h3>
                  <p className="text-sm text-[var(--color-granite-muted,#7A736B)] line-clamp-3 leading-relaxed mb-4">
                    {reel.captionSummary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--color-parchment-border,#E5DFD5)] flex items-center justify-between text-xs font-semibold text-[var(--color-terracotta-primary,#B85D36)]">
                  <span>Watch Field Reel</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Video Modal Player */}
      <VideoModalPlayer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        video={selectedVideo}
      />
    </section>
  );
}
