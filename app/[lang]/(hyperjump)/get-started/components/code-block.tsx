"use client";

import { CheckIcon, CopyIcon, TriangleAlertIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import type { DocsCodeLanguage } from "../snippets";

type CopyStatus = "idle" | "copied" | "failed";

type CodeBlockProps = {
  /** Stable identifier used by tests, independent of the step order. */
  id?: string;
  code: string;
  label?: string;
  language?: DocsCodeLanguage;
  copyLabel: string;
  copiedLabel: string;
  copyFailedLabel: string;
  className?: string;
};

const LANGUAGE_LABELS: Record<
  NonNullable<CodeBlockProps["language"]>,
  string
> = {
  bash: "shell",
  json: "json",
  jsonc: "jsonc",
  text: "text"
};

/**
 * Dark code panel with a copy-to-clipboard button.
 *
 * The block scrolls horizontally on its own so long commands never widen the
 * page on small viewports. Copy results are announced through a polite live
 * region, since changing the button's own label is not reliably spoken.
 */
export function CodeBlock({
  id,
  code,
  label,
  language = "bash",
  copyLabel,
  copiedLabel,
  copyFailedLabel,
  className
}: CodeBlockProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const blockLabel = label ?? LANGUAGE_LABELS[language];
  const statusLabel =
    status === "copied"
      ? copiedLabel
      : status === "failed"
        ? copyFailedLabel
        : copyLabel;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setStatus("idle"), 2000);
  }, [code]);

  return (
    <figure
      className={cn(
        "bg-hyperjump-navy relative overflow-hidden rounded-xl border border-white/10",
        className
      )}
      data-testid="docs-code-block"
      data-code-id={id}>
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <span className="font-geist-mono truncate text-xs text-white/50">
          {blockLabel}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`${statusLabel} ${blockLabel}`}
          data-testid="docs-copy-button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white focus:ring-1 focus:ring-white/30 focus:outline-none">
          {status === "copied" ? (
            <CheckIcon className="h-3.5 w-3.5" aria-hidden />
          ) : status === "failed" ? (
            <TriangleAlertIcon className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" aria-hidden />
          )}
          {statusLabel}
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4">
        <code className="font-geist-mono block text-[13px] leading-relaxed text-white/90">
          {code}
        </code>
      </pre>
      <span className="sr-only" role="status" aria-live="polite">
        {status === "idle" ? "" : `${statusLabel} ${blockLabel}`}
      </span>
    </figure>
  );
}
