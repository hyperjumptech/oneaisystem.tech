import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { ConsoleLinkText } from "./console-link";

type DocStepProps = {
  index: number;
  stepLabel: string;
  title: string;
  text: string;
  noteLabel: string;
  note?: string;
  children?: ReactNode;
};

/**
 * One numbered setup step: heading, body, optional note callout, and code.
 */
export function DocStep({
  index,
  stepLabel,
  title,
  text,
  noteLabel,
  note,
  children
}: DocStepProps) {
  return (
    <li className="relative pl-12" data-testid="docs-step">
      <span
        aria-hidden
        className="bg-hyperjump-blue absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white">
        {index + 1}
      </span>
      <p className="text-hyperjump-blue mb-1 text-xs font-bold tracking-[0.16em] uppercase">
        {stepLabel} {index + 1}
      </p>
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
    </li>
  );
}
