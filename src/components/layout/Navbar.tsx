"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Settings, Heart } from "lucide-react";
import type { NGOConfig } from "@/lib/schema/ngo.schema";

export interface NavbarProps {
  organization: NGOConfig["organization"];
  branding: NGOConfig["branding"];
  onOpenDonation?: () => void;
}

const NAV_LINKS = [
  { label: "Impact", href: "#impact" },
  { label: "FCT Map", href: "#fct-map" },
  { label: "Programs", href: "#pillars" },
  { label: "Governance", href: "#governance" },
  { label: "Stories", href: "#stories" },
];

export function Navbar({ organization, branding, onOpenDonation }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const crestPath = branding.crestSvgPath || "/branding/crest.svg";

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        scrolled
          ? "bg-[var(--color-parchment-ground)]/95 backdrop-blur-md border-[var(--color-parchment-border)] shadow-soft"
          : "bg-[var(--color-parchment-ground)]/80 backdrop-blur-sm border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand & Crest */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary)] rounded-lg p-1 -ml-1 transition-transform min-w-0 mr-2"
            aria-label={`${organization.tradingName} Home`}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-savannah-primary)] flex items-center justify-center p-1.5 sm:p-2 text-white shadow-soft transition-transform group-hover:scale-105 shrink-0">
              {/* Sacred Earth Crest or SVG */}
              <img
                src={crestPath}
                alt=""
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to inline SVG if image file is not found
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.classList.remove("hidden");
                }}
              />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 hidden text-[var(--color-ochre-accent)]"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="font-display font-bold text-sm sm:text-base md:text-lg leading-tight tracking-tight text-[var(--color-granite-deep)] truncate max-w-[125px] sm:max-w-[180px] lg:max-w-none">
                  {organization.tradingName}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-savannah-surface)] text-[var(--color-savannah-primary)] border border-[var(--color-savannah-primary)]/20 shrink-0">
                  {organization.acronym}
                </span>
              </div>
              <span className="hidden md:inline-block text-xs text-[var(--color-granite-muted)] font-medium truncate">
                Abuja Federal Capital Territory
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-1 lg:gap-2"
            aria-label="Main Navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-[var(--color-granite-deep)] hover:text-[var(--color-terracotta-primary)] rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Admin Studio discreet cog */}
            <Link
              href="/admin"
              className="p-2 text-[var(--color-granite-muted)] hover:text-[var(--color-granite-deep)] hover:bg-[var(--color-parchment-subtle)] rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary)]"
              title="Admin Studio"
              aria-label="Admin Studio"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* Donate CTA button */}
            <button
              type="button"
              onClick={onOpenDonation}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-[var(--color-terracotta-primary)] hover:bg-[var(--color-terracotta-link)] active:scale-[0.98] transition-all shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary)] focus-visible:ring-offset-2"
            >
              <Heart className="w-4 h-4 fill-white/20" />
              <span>Donate Now</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenDonation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white bg-[var(--color-terracotta-primary)] hover:bg-[var(--color-terracotta-link)] shadow-soft"
            >
              <Heart className="w-3.5 h-3.5 fill-white/20" />
              <span>Donate</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[var(--color-granite-deep)] hover:bg-[var(--color-parchment-subtle)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary)] transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden border-t border-[var(--color-parchment-border)] bg-[var(--color-parchment-ground)] px-4 pt-3 pb-6 space-y-3 shadow-card"
        >
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-md text-base font-medium text-[var(--color-granite-deep)] hover:bg-[var(--color-parchment-subtle)] hover:text-[var(--color-terracotta-primary)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[var(--color-parchment-border)] flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonation?.();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-base font-semibold text-white bg-[var(--color-terracotta-primary)] hover:bg-[var(--color-terracotta-link)] shadow-soft"
            >
              <Heart className="w-4 h-4 fill-white/20" />
              <span>Donate Now</span>
            </button>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-[var(--color-granite-muted)] hover:text-[var(--color-granite-deep)]"
            >
              <Settings className="w-4 h-4" />
              <span>Admin Studio Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
