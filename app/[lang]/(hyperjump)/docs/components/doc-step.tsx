import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { ConsoleLinkText } from "./console-link";

type DocStepProps = {
  /** Stable identifier used by tests, independent of the step order. */
  id: string;
  index: number;
  stepLabel: string;
  title: string;
  text: string;
  noteLabel: string;
  note?: string;
  /** Optional paragraph rendered after the code blocks. */
  footer?: string;
  children?: ReactNode;
};

/**
 * One numbered setup step: heading, body, optional note callout, code, and
 * an optional closing paragraph.
 */
export function DocStep({
  id,
  index,
  stepLabel,
  title,
  text,
  noteLabel,
  note,
  footer,
  children
}: DocStepProps) {
  return (
    <li className="relative pl-12" data-testid="docs-step" data-step-id={id}>
      <span
        aria-hidden
        className="bg-hyperjump-blue absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white">
        {index + 1}
      </span>
      <span className="sr-only">
        {stepLabel} {index + 1}
      </span>
      <h3 className="text-hyperjump-black mb-2 text-xl font-semibold">
        {title}
      </h3>
      <p className="text-hyperjump-gray mb-4 text-[15px] leading-relaxed">
        <ConsoleLinkText text={text} />
      </p>
      {note && (
        <p
          className={cn(
            "mb-4 rounded-lg border-l-2 border-yellow-400 bg-yellow-50 px-4 py-3",
            "text-hyperjump-gray text-sm leading-relaxed"
          )}>
          <span className="text-hyperjump-black font-semibold">
            {noteLabel}:{" "}
          </span>
          <ConsoleLinkText text={note} />
        </p>
      )}
      {children}
      {footer && (
        <p className="text-hyperjump-gray mt-4 text-sm leading-relaxed">
          <ConsoleLinkText text={footer} />
        </p>
      )}
    </li>
  );
}
