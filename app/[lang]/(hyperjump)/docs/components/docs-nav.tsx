import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import type { SupportedLanguage } from "@/locales/.generated/types";

import { DOCS_HARNESSES, type DocsHarness } from "../docs-registry";

type DocsNavProps = {
  lang: SupportedLanguage;
  current: DocsHarness;
  backLabel: string;
};

/**
 * Prev/next links between harness guides, wrapping around the registry order.
 */
export function DocsNav({ lang, current, backLabel }: DocsNavProps) {
  const index = DOCS_HARNESSES.findIndex(({ slug }) => slug === current.slug);
  const previous =
    DOCS_HARNESSES[(index - 1 + DOCS_HARNESSES.length) % DOCS_HARNESSES.length];
  const next = DOCS_HARNESSES[(index + 1) % DOCS_HARNESSES.length];

  return (
    <nav className="mt-16 border-t border-black/6 pt-8">
      <Link
        href={`/${lang}/docs`}
        className="text-hyperjump-blue mb-6 inline-flex items-center gap-1.5 text-sm font-medium hover:underline">
        <ArrowLeftIcon className="h-4 w-4" aria-hidden />
        {backLabel}
      </Link>
      <div className="grid gap-4 sm:grid-cols-2">
        {[previous, next].map((harness, position) => {
          const isPrevious = position === 0;
          return (
            <Link
              key={`${harness.slug}-${position}`}
              href={`/${lang}/docs/${harness.slug}`}
              className="group hover:border-hyperjump-blue/40 flex flex-col rounded-xl border border-black/8 px-5 py-4 transition-colors hover:bg-black/[0.02]">
              <span className="text-hyperjump-muted mb-1 inline-flex items-center gap-1.5 text-xs font-medium">
                {isPrevious ? (
                  <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <ArrowRightIcon className="order-2 h-3.5 w-3.5" aria-hidden />
                )}
                {isPrevious ? previous.slug : next.slug}
              </span>
              <span className="text-hyperjump-black text-base font-semibold">
                {harness.getName(lang)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
