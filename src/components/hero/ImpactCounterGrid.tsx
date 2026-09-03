"use client";

import React, { useEffect, useState, useRef } from "react";
import type { NGOConfig } from "@/lib/schema/ngo.schema";

export interface ImpactCounterGridProps {
  className?: string;
  config?: NGOConfig;
}

interface CounterMetric {
  id: string;
  targetValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  sublabel: string;
  contextPill: string;
  accentColor: "terracotta" | "savannah" | "ochre";
}

export function ImpactCounterGrid({ className = "", config }: ImpactCounterGridProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Default Audited Metrics matching Afro-Modernism portal specs
  const metrics: CounterMetric[] = [
    {
      id: "lives-touched",
      targetValue: 28000,
      suffix: "+",
      label: "Lives Directly Touched",
      sublabel: "Grassroots beneficiaries across settlements",
      contextPill: "Verified Reach",
      accentColor: "terracotta",
    },
    {
      id: "area-councils",
      targetValue: 6,
      prefix: "6 / ",
      label: "FCT Area Councils",
      sublabel: "Full active coverage in AMAC, Bwari, Kuje...",
      contextPill: "100% Corridors",
      accentColor: "savannah",
    },
    {
      id: "direct-disbursal",
      targetValue: config?.governance?.financialAllocation?.programsPercent ?? 84,
      suffix: "%",
      label: "Direct Program Disbursal",
      sublabel: "Audited program spend vs administrative overhead",
      contextPill: "SCUML Compliant",
      accentColor: "ochre",
    },
  ];

  // Intersection Observer for viewport trigger
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-6xl mx-auto ${className}`}
      aria-label="Audited impact indicators"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {metrics.map((metric) => (
          <CounterCard
            key={metric.id}
            metric={metric}
            animate={isVisible}
          />
        ))}
      </div>
    </div>
  );
}

interface CounterCardProps {
  metric: CounterMetric;
  animate: boolean;
}

function CounterCard({ metric, animate }: CounterCardProps) {
  const [currentValue, setCurrentValue] = useState<number>(0);

  useEffect(() => {
    if (!animate) return;

    let startTime: number | null = null;
    const duration = 1800; // 1.8s smooth count-up

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Quartic ease out curve: 1 - pow(1 - x, 4)
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const val = Math.round(easedProgress * metric.targetValue);
      setCurrentValue(val);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [animate, metric.targetValue]);

  // Format count display
  const formattedNumber = currentValue.toLocaleString("en-US");

  // Accent badge styling
  const pillStyle =
    metric.accentColor === "terracotta"
      ? "bg-[var(--color-terracotta-surface)] text-[var(--color-terracotta-primary)] border-[var(--color-terracotta-primary)]/20"
      : metric.accentColor === "savannah"
      ? "bg-[var(--color-savannah-surface)] text-[var(--color-savannah-primary)] border-[var(--color-savannah-primary)]/20"
      : "bg-amber-50 text-[var(--color-ochre-accent)] border-[var(--color-ochre-accent)]/30";

  return (
    <div className="group relative rounded-2xl p-6 lg:p-7 bg-[var(--color-parchment-ground)]/95 backdrop-blur-xs border border-[var(--color-parchment-border)] shadow-soft hover:shadow-card hover:border-[var(--color-terracotta-primary)]/40 transition-all duration-300 flex flex-col justify-between">
      {/* Top row: Badge and Decorative Indicator */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border uppercase ${pillStyle}`}
        >
          {metric.contextPill}
        </span>
        <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-granite-muted)]/40 group-hover:scale-150 group-hover:bg-[var(--color-terracotta-primary)] transition-all duration-300" />
      </div>

      {/* Metric Main Numeric Value */}
      <div className="my-2">
        <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-granite-deep)] font-display flex items-baseline">
          {metric.prefix && (
            <span className="text-2xl sm:text-3xl text-[var(--color-granite-muted)] font-normal mr-0.5">
              {metric.prefix}
            </span>
          )}
          <span>{animate ? formattedNumber : metric.targetValue.toLocaleString("en-US")}</span>
          {metric.suffix && (
            <span className="text-2xl sm:text-3xl font-semibold text-[var(--color-terracotta-primary)] ml-0.5">
              {metric.suffix}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-2 text-base sm:text-lg font-bold text-[var(--color-granite-deep)] tracking-tight">
          {metric.label}
        </h3>
      </div>

      {/* Sublabel / Footnote */}
      <p className="mt-2 text-xs sm:text-sm text-[var(--color-granite-muted)] leading-relaxed">
        {metric.sublabel}
      </p>
    </div>
  );
}
