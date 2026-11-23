"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  label?: string;
  language?: "bash" | "json" | "jsonc";
  copyLabel: string;
  copiedLabel: string;
  className?: string;
};

const LANGUAGE_LABELS: Record<
  NonNullable<CodeBlockProps["language"]>,
  string
> = {
  bash: "shell",
  json: "json",
  jsonc: "jsonc"
};

/**
 * Dark code panel with a copy-to-clipboard button.
 *
 * The block scrolls horizontally on its own so long commands never widen the
 * page on small viewports.
 */
export function CodeBlock({
  code,
  label,
  language = "bash",
  copyLabel,
  copiedLabel,
  className
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      setCopied(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [code]);

  return (
    <figure
      className={cn(
        "bg-hyperjump-navy relative overflow-hidden rounded-xl border border-white/10",
        className
      )}
      data-testid="docs-code-block">
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <span className="font-geist-mono truncate text-xs text-white/50">
          {label ?? LANGUAGE_LABELS[language]}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? copiedLabel : copyLabel}
          data-testid="docs-copy-button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white focus:ring-1 focus:ring-white/30 focus:outline-none">
          {copied ? (
            <CheckIcon className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" aria-hidden />
          )}
          {copied ? copiedLabel : copyLabel}
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-4">
        <code className="font-geist-mono block text-[13px] leading-relaxed text-white/90">
          {code}
        </code>
      </pre>
    </figure>
  );
}
