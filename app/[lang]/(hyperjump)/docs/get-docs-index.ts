import type { SupportedLanguage } from "@/locales/.generated/types";

import {
  DOCS_HARNESSES,
  PROTOCOL_LABELS,
  type DocsHarness
} from "./docs-registry";
import {
  getDocsKeyFlow,
  type DocsKeyFlowStep,
  type DocsKeyFlowStepLoader
} from "./docs-key-flow";

export type DocsQuickstartStep = DocsKeyFlowStep;

export type DocsEndpointRow = {
  name: string;
  protocol: string;
  baseUrl: string;
  href: string;
};

type QuickstartLoaders = DocsKeyFlowStepLoader[];

export type GetDocsIndexOptions = {
  lang: SupportedLanguage;
  /** Harness list for tests */
  harnesses?: DocsHarness[];
  /** Key flow loaders for tests */
  quickstartLoaders?: QuickstartLoaders;
};

/**
 * Builds the docs hub view model: harness cards and the endpoint table.
 *
 * @param options - Locale and optional loaders for DI
 * @returns Ordered harness cards and endpoint rows
 */
export function getDocsIndex({
  lang,
  harnesses = DOCS_HARNESSES,
  quickstartLoaders
}: GetDocsIndexOptions) {
  const cards = harnesses.map((harness) => ({
    slug: harness.slug,
    name: harness.getName(lang),
    summary: harness.getSummary(lang),
    protocol: PROTOCOL_LABELS[harness.protocol],
    href: `/${lang}/docs/${harness.slug}`
  }));

  const endpoints: DocsEndpointRow[] = harnesses.map((harness) => ({
    name: harness.getName(lang),
    protocol: PROTOCOL_LABELS[harness.protocol],
    baseUrl: harness.baseUrl,
    href: `/${lang}/docs/${harness.slug}`
  }));

  const quickstart: DocsQuickstartStep[] = getDocsKeyFlow(
    lang,
    quickstartLoaders
  );

  return { cards, endpoints, quickstart };
}
