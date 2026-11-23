import type { SupportedLanguage } from "@/locales/.generated/types";
import {
  docsClaudeCodeName,
  docsClaudeCodeSummary,
  docsOpencodeName,
  docsOpencodeSummary
} from "@/locales/.generated/strings";

import {
  CLAUDE_CODE_CONFIG_PATH,
  CLAUDE_CODE_INSTALL_SNIPPET,
  CLAUDE_CODE_SETTINGS_SNIPPET,
  CLAUDE_CODE_VERSION_SNIPPET,
  getRunSnippet,
  ONEAI_ANTHROPIC_BASE_URL,
  ONEAI_OPENAI_BASE_URL,
  OPENCODE_CONFIG_PATH,
  OPENCODE_CONFIG_SNIPPET,
  OPENCODE_INSTALL_SNIPPET,
  OPENCODE_VERSION_SNIPPET
} from "./snippets";

/** Harness slugs that have a guide page under /[lang]/docs/[slug]. */
export type DocsHarnessSlug = "claude-code" | "opencode";

/** Protocol family the harness speaks, which decides the OneAI base URL. */
export type DocsProtocol = "anthropic" | "openai-compatible";

export type DocsHarness = {
  slug: DocsHarnessSlug;
  /** Static product name. Never translated. */
  command: string;
  protocol: DocsProtocol;
  baseUrl: string;
  configPath: string;
  installSnippet: string;
  versionSnippet: string;
  configSnippet: string;
  runSnippet: string;
  /** Localized product name shown in headings and cards. */
  getName: (lang: SupportedLanguage) => string;
  /** Localized one-line description used on the docs hub. */
  getSummary: (lang: SupportedLanguage) => string;
};

/**
 * Every harness that can route through OneAI, with its copy-paste snippets.
 *
 * Adding a harness means appending one entry here plus its locale strings;
 * the hub, guide pages, and navigation all read from this list.
 */
export const DOCS_HARNESSES: DocsHarness[] = [
  {
    slug: "claude-code",
    command: "claude",
    protocol: "anthropic",
    baseUrl: ONEAI_ANTHROPIC_BASE_URL,
    configPath: CLAUDE_CODE_CONFIG_PATH,
    installSnippet: CLAUDE_CODE_INSTALL_SNIPPET,
    versionSnippet: CLAUDE_CODE_VERSION_SNIPPET,
    configSnippet: CLAUDE_CODE_SETTINGS_SNIPPET,
    runSnippet: getRunSnippet("claude"),
    getName: docsClaudeCodeName,
    getSummary: docsClaudeCodeSummary
  },
  {
    slug: "opencode",
    command: "opencode",
    protocol: "openai-compatible",
    baseUrl: ONEAI_OPENAI_BASE_URL,
    configPath: OPENCODE_CONFIG_PATH,
    installSnippet: OPENCODE_INSTALL_SNIPPET,
    versionSnippet: OPENCODE_VERSION_SNIPPET,
    configSnippet: OPENCODE_CONFIG_SNIPPET,
    runSnippet: getRunSnippet("opencode"),
    getName: docsOpencodeName,
    getSummary: docsOpencodeSummary
  }
];

/** Ordered slug list for generateStaticParams. */
export const DOCS_HARNESS_SLUGS: DocsHarnessSlug[] = DOCS_HARNESSES.map(
  ({ slug }) => slug
);

/**
 * Looks up a harness by slug.
 *
 * @param slug - Route segment from /[lang]/docs/[slug]
 * @param harnesses - Harness list for DI
 * @returns Matching harness, or undefined when the slug is unknown
 */
export function getDocsHarness(
  slug: string,
  harnesses: DocsHarness[] = DOCS_HARNESSES
): DocsHarness | undefined {
  return harnesses.find((harness) => harness.slug === slug);
}
