import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import type { SupportedLanguage } from "@/locales/.generated/types";

import { DOCS_HARNESSES, type DocsHarness } from "../docs-registry";

type DocsNavProps = {
  lang: SupportedLanguage;
  current: DocsHarness;
  backLabel: string;
  /** Localized label for the previous-guide card. */
  previousLabel: string;
  /** Localized label for the next-guide card. */
  nextLabel: string;
};

type DocsNavDirection = "previous" | "next";

/**
 * Neighbouring harnesses around the current guide in registry order.
 *
 * There is no wrap-around: the first guide has no previous and the last has
 * no next, so a guide never links to itself and never links twice to the
 * same harness.
 */
export function getDocsNavNeighbours(current: DocsHarness): {
  previous: DocsHarness | undefined;
  next: DocsHarness | undefined;
} {
  const index = DOCS_HARNESSES.findIndex(({ slug }) => slug === current.slug);

  if (index < 0) {
    return { previous: undefined, next: undefined };
  }

  return {
    previous: index > 0 ? DOCS_HARNESSES[index - 1] : undefined,
    next:
      index < DOCS_HARNESSES.length - 1 ? DOCS_HARNESSES[index + 1] : undefined
  };
}

/**
 * Prev/next links between harness guides.
 *
 * Only neighbours that exist are rendered. When the previous guide is
 * missing, an empty cell keeps the next guide in the right-hand column.
 */
export function DocsNav({
  lang,
  current,
  backLabel,
  previousLabel,
  nextLabel
}: DocsNavProps) {
  const { previous, next } = getDocsNavNeighbours(current);

  return (
    <nav className="mt-16 border-t border-black/6 pt-8">
      <Link
        href={`/${lang}/docs`}
        data-testid="docs-nav-back"
        className="text-hyperjump-blue mb-6 inline-flex items-center gap-1.5 text-sm font-medium hover:underline">
        <ArrowLeftIcon className="h-4 w-4" aria-hidden />
        {backLabel}
      </Link>
      <div className="grid gap-4 sm:grid-cols-2">
        {previous ? (
          <DocsNavCard
            harness={previous}
            lang={lang}
            direction="previous"
            label={previousLabel}
          />
        ) : (
          <div
            data-testid="docs-nav-spacer"
            aria-hidden
            className="hidden sm:block"
          />
        )}
        {next ? (
          <DocsNavCard
            harness={next}
            lang={lang}
            direction="next"
            label={nextLabel}
          />
        ) : null}
      </div>
    </nav>
  );
}

function DocsNavCard({
  harness,
  lang,
  direction,
  label
}: {
  harness: DocsHarness;
  lang: SupportedLanguage;
  direction: DocsNavDirection;
  /** Localized "Previous" / "Next" label shown above the guide name. */
  label: string;
}) {
  const isPrevious = direction === "previous";

  return (
    <Link
      data-testid={`docs-nav-${direction}-${harness.slug}`}
      href={`/${lang}/docs/${harness.slug}`}
      className="group hover:border-hyperjump-blue/40 flex flex-col rounded-xl border border-black/8 px-5 py-4 transition-colors hover:bg-black/[0.02]">
      <span className="text-hyperjump-muted mb-1 inline-flex items-center gap-1.5 text-xs font-medium">
        {isPrevious ? (
          <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <ArrowRightIcon className="order-2 h-3.5 w-3.5" aria-hidden />
        )}
        {label}
      </span>
      <span className="text-hyperjump-black text-base font-semibold">
        {harness.getName(lang)}
      </span>
    </Link>
  );
}
