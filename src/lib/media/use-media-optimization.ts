"use client";

import { useState, useEffect } from "react";

export interface MediaOptimizationState {
  isDataSaver: boolean;
  isSlowConnection: boolean;
  shouldAutoplayVideo: boolean;
  preferredFormat: "webp" | "avif";
}

interface NetworkInformation extends EventTarget {
  saveData?: boolean;
  effectiveType?: "2g" | "3g" | "4g" | "slow-2g";
  addEventListener(type: "change", listener: EventListener): void;
  removeEventListener(type: "change", listener: EventListener): void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

const DEFAULT_STATE: MediaOptimizationState = {
  isDataSaver: false,
  isSlowConnection: false,
  shouldAutoplayVideo: true,
  preferredFormat: "webp",
};

/**
 * SSR-safe hook detecting client connection constraints:
 * - `navigator.connection.saveData`
 * - 2G / 3G slow connections
 * - Autoplay policy recommendations
 * - Preferred image format (webp vs avif)
 */
export function useMediaOptimization(): MediaOptimizationState {
  const [state, setState] = useState<MediaOptimizationState>(DEFAULT_STATE);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nav = navigator as NavigatorWithConnection;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;

    function evaluateConnection(): void {
      const isDataSaver = Boolean(conn?.saveData);
      const effectiveType = conn?.effectiveType;
      const isSlow = effectiveType === "2g" || effectiveType === "3g" || effectiveType === "slow-2g";

      // AVIF format check support in modern browser canvas/image check if available, or fallback to webp on slow/saver
      const prefersAvif = !isSlow && !isDataSaver;

      setState({
        isDataSaver,
        isSlowConnection: isSlow,
        shouldAutoplayVideo: !isDataSaver && !isSlow,
        preferredFormat: prefersAvif ? "avif" : "webp",
      });
    }

    evaluateConnection();

    if (conn) {
      conn.addEventListener("change", evaluateConnection);
      return () => {
        conn.removeEventListener("change", evaluateConnection);
      };
    }
  }, []);

  return state;
}
