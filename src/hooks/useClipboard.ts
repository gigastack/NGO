"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface UseClipboardOptions {
  timeout?: number;
}

export interface UseClipboardResult {
  copy: (text: string) => Promise<boolean>;
  copiedText: string | null;
  isCopied: boolean;
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardResult {
  const { timeout = 2000 } = options;
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current ?? undefined);
    };
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) return false;

      let successful = false;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          successful = true;
        } else {
          // Fallback to document.execCommand
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          textArea.setAttribute("readonly", "");
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            successful = document.execCommand("copy");
          } catch (execErr) {
            console.warn("Fallback execCommand copy failed:", execErr);
            successful = false;
          } finally {
            document.body.removeChild(textArea);
          }
        }
      } catch (err) {
        console.warn("Failed to copy text using Clipboard API, trying fallback:", err);
        try {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          textArea.setAttribute("readonly", "");
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          successful = document.execCommand("copy");
          document.body.removeChild(textArea);
        } catch (fallbackErr) {
          console.error("All copy attempts failed:", fallbackErr);
          successful = false;
        }
      }

      if (successful) {
        setCopiedText(text);
        setIsCopied(true);

        clearTimeout(timerRef.current ?? undefined);

        timerRef.current = setTimeout(() => {
          setIsCopied(false);
          setCopiedText(null);
        }, timeout);
      }

      return successful;
    },
    [timeout]
  );

  return { copy, copiedText, isCopied };
}
