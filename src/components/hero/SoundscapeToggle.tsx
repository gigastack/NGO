"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export interface SoundscapeToggleProps {
  className?: string;
  audioUrl?: string;
}

export function SoundscapeToggle({ className = "", audioUrl }: SoundscapeToggleProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.35);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const oscillatorNodesRef = useRef<Array<AudioNode>>([]);
  const animationFrameRef = useRef<number | null>(null);
  const [waveHeights, setWaveHeights] = useState<number[]>([40, 65, 30, 85, 45]);

  // Check SSR & Web Audio availability
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsSupported(false);
      return;
    }
    const hasAudioContext = Boolean(
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    );
    setIsSupported(hasAudioContext);

    return () => {
      stopAudio();
    };
  }, []);

  // Ambient procedural synthesis fallback (gentle warm wind + subtle harmonic acoustic drone)
  const startProceduralSynth = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    const nodes: AudioNode[] = [];

    // 1. Dual Harmonic Drone: 108Hz fundamental (warm low-mid drone) & 162Hz (fifth)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(108, ctx.currentTime);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(162, ctx.currentTime);

    oscGain.gain.setValueAtTime(0.08, ctx.currentTime);

    osc1.connect(oscGain);
    osc2.connect(oscGain);
    oscGain.connect(masterGain);

    osc1.start();
    osc2.start();
    nodes.push(osc1, osc2, oscGain);

    // 2. Procedural Wind / Grassland Ambient Buffer (filtered white noise)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate warm breeze rustling through savannah foliage
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    // Subtle LFO modulation for breathing wind effect
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // slow breathing sweep (5s period)
    lfoGain.gain.setValueAtTime(140, ctx.currentTime);

    lfo.connect(filter.frequency);
    lfo.start();

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.04, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    whiteNoise.start();
    nodes.push(whiteNoise, filter, lfo, lfoGain, noiseGain);

    oscillatorNodesRef.current = nodes;
  }, []);

  const stopAudio = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }

    if (gainNodeRef.current && audioCtxRef.current) {
      // Smooth fade out
      const now = audioCtxRef.current.currentTime;
      gainNodeRef.current.gain.cancelScheduledValues(now);
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, now);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    }

    setTimeout(() => {
      oscillatorNodesRef.current.forEach((node) => {
        try {
          if ("stop" in node && typeof (node as AudioScheduledSourceNode).stop === "function") {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // Ignore if already stopped
        }
      });
      oscillatorNodesRef.current = [];

      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.suspend().catch(() => {});
      }
    }, 450);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const startAudio = useCallback(async () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;

      // Master Gain setup
      const masterGain = ctx.createGain();
      const now = ctx.currentTime;
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(volume, now + 0.6);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // If dedicated audio file provided, play it; otherwise run procedural synthesis
      if (audioUrl) {
        if (!audioElementRef.current) {
          const el = new Audio(audioUrl);
          el.loop = true;
          el.crossOrigin = "anonymous";
          audioElementRef.current = el;
        }
        audioElementRef.current.volume = volume;
        await audioElementRef.current.play();
      } else {
        startProceduralSynth(ctx, masterGain);
      }
    } catch {
      // Audio playback failed (e.g. autoplay blocked or unmounted)
      setIsPlaying(false);
    }
  }, [audioUrl, volume, startProceduralSynth]);

  // Wave bar animation loop when active
  useEffect(() => {
    if (!isPlaying) {
      setWaveHeights([25, 25, 25, 25, 25]);
      return;
    }

    let t = 0;
    const updateWaves = () => {
      t += 0.08;
      setWaveHeights([
        Math.max(20, Math.sin(t * 1.2) * 50 + 45),
        Math.max(25, Math.sin(t * 0.9 + 1.2) * 45 + 50),
        Math.max(18, Math.sin(t * 1.5 + 2.4) * 55 + 40),
        Math.max(30, Math.sin(t * 0.7 + 0.8) * 40 + 55),
        Math.max(22, Math.sin(t * 1.1 + 3.1) * 48 + 48),
      ]);
      animationFrameRef.current = requestAnimationFrame(updateWaves);
    };

    animationFrameRef.current = requestAnimationFrame(updateWaves);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const toggleSound = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio();
      setIsPlaying(true);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Mute Savannah Ambient Soundscape" : "Play Savannah Ambient Soundscape"}
        className={`group relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 select-none ${
          isPlaying
            ? "bg-[var(--color-savannah-primary)] text-white shadow-soft ring-1 ring-[var(--color-savannah-primary)]/40 hover:bg-[var(--color-savannah-primary)]/90"
            : "bg-[var(--color-parchment-ground)]/90 backdrop-blur-xs text-[var(--color-granite-deep)] border border-[var(--color-parchment-border)] hover:bg-[var(--color-parchment-subtle)] hover:border-[var(--color-terracotta-primary)]/40"
        } focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta-primary)] focus-visible:ring-offset-2`}
      >
        {/* Animated Sound Wave Bars */}
        <div className="flex items-center gap-0.5 h-3.5 w-4 justify-center" aria-hidden="true">
          {waveHeights.map((h, idx) => (
            <span
              key={idx}
              className={`w-0.5 rounded-full transition-all duration-75 ${
                isPlaying
                  ? "bg-[var(--color-ochre-accent)]"
                  : "bg-[var(--color-granite-muted)] group-hover:bg-[var(--color-granite-deep)]"
              }`}
              style={{
                height: `${h}%`,
              }}
            />
          ))}
        </div>

        {/* Label */}
        <span className="text-[11px] uppercase tracking-wider font-semibold">
          {isPlaying ? "Ambient On" : "Soundscape"}
        </span>

        {/* Pulsing indicator when active */}
        {isPlaying && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-ochre-accent)] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-ochre-accent)]" />
          </span>
        )}
      </button>
    </div>
  );
}
