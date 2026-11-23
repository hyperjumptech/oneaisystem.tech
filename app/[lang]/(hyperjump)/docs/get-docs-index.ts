import type { SupportedLanguage } from "@/locales/.generated/types";
import {
  docsIndexQuickstartSteps0Text,
  docsIndexQuickstartSteps0Title,
  docsIndexQuickstartSteps1Text,
  docsIndexQuickstartSteps1Title,
  docsIndexQuickstartSteps2Text,
  docsIndexQuickstartSteps2Title
} from "@/locales/.generated/strings";

import { DOCS_HARNESSES, type DocsHarness } from "./docs-registry";

export type DocsQuickstartStep = { title: string; text: string };

export type DocsEndpointRow = {
  name: string;
  protocol: string;
  baseUrl: string;
  href: string;
};

type QuickstartLoaders = Array<{
  title: (lang: SupportedLanguage) => string;
  text: (lang: SupportedLanguage) => string;
}>;

const DEFAULT_QUICKSTART_LOADERS: QuickstartLoaders = [
  {
    title: docsIndexQuickstartSteps0Title,
    text: docsIndexQuickstartSteps0Text
  },
  {
    title: docsIndexQuickstartSteps1Title,
    text: docsIndexQuickstartSteps1Text
  },
  {
    title: docsIndexQuickstartSteps2Title,
    text: docsIndexQuickstartSteps2Text
  }
];

const PROTOCOL_LABELS: Record<DocsHarness["protocol"], string> = {
  anthropic: "Anthropic Messages API",
  "openai-compatible": "OpenAI-compatible"
};

export type GetDocsIndexOptions = {
  lang: SupportedLanguage;
  /** Harness list for tests */
  harnesses?: DocsHarness[];
  /** Quickstart loaders for tests */
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
  quickstartLoaders = DEFAULT_QUICKSTART_LOADERS
}: GetDocsIndexOptions) {
  const cards = harnesses.map((harness) => ({
    slug: harness.slug,
    name: harness.getName(lang),
    summary: harness.getSummary(lang),
    protocol: harness.protocol,
    href: `/${lang}/docs/${harness.slug}`
  }));

  const endpoints: DocsEndpointRow[] = harnesses.map((harness) => ({
    name: harness.getName(lang),
    protocol: PROTOCOL_LABELS[harness.protocol],
    baseUrl: harness.baseUrl,
    href: `/${lang}/docs/${harness.slug}`
  }));

  const quickstart: DocsQuickstartStep[] = quickstartLoaders.map(
    ({ title, text }) => ({ title: title(lang), text: text(lang) })
  );

  return { cards, endpoints, quickstart };
}
