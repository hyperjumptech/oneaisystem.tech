import type { SupportedLanguage } from "@/locales/.generated/types";
import {
  docsClaudeCodeName,
  docsClaudeCodeSummary,
  docsOpencodeName,
  docsOpencodeSummary,
  docsPiName,
  docsPiSummary
} from "@/locales/.generated/strings";

import {
  CLAUDE_CODE_COMMAND,
  CLAUDE_CODE_CONFIG_PATH,
  CLAUDE_CODE_INSTALL_SNIPPET,
  CLAUDE_CODE_SETTINGS_SNIPPET,
  type DocsCodeLanguage,
  getRunSnippet,
  getVersionSnippet,
  ONEAI_ANTHROPIC_BASE_URL,
  ONEAI_OPENAI_BASE_URL,
  OPENCODE_COMMAND,
  OPENCODE_CONFIG_PATH,
  OPENCODE_CONFIG_SNIPPET,
  OPENCODE_INSTALL_SNIPPET,
  PI_COMMAND,
  PI_CONFIG_PATH,
  PI_INSTALL_SNIPPET,
  PI_MODELS_SNIPPET
} from "./snippets";

/** Harness slugs that have a guide page under /[lang]/get-started/[slug]. */
export type DocsHarnessSlug = "claude-code" | "opencode" | "pi";

/** Protocol family the harness speaks, which decides the OneAI base URL. */
export type DocsProtocol = "anthropic" | "openai-compatible";

/** Human-readable protocol names shown on the hub and on guide pages. */
export const PROTOCOL_LABELS: Record<DocsProtocol, string> = {
  anthropic: "Anthropic Messages API",
  "openai-compatible": "OpenAI-compatible"
};

export type DocsHarness = {
  slug: DocsHarnessSlug;
  /** CLI binary the reader runs. Never translated. */
  command: string;
  protocol: DocsProtocol;
  baseUrl: string;
  configPath: string;
  /**
   * Syntax of the config file at configPath. It follows the file extension,
   * not the protocol: Claude Code's settings.json is JSON, OpenCode's
   * opencode.jsonc is JSON with comments.
   */
  configLanguage: DocsCodeLanguage;
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
    command: CLAUDE_CODE_COMMAND,
    protocol: "anthropic",
    baseUrl: ONEAI_ANTHROPIC_BASE_URL,
    configPath: CLAUDE_CODE_CONFIG_PATH,
    configLanguage: "json",
    installSnippet: CLAUDE_CODE_INSTALL_SNIPPET,
    versionSnippet: getVersionSnippet(CLAUDE_CODE_COMMAND),
    configSnippet: CLAUDE_CODE_SETTINGS_SNIPPET,
    runSnippet: getRunSnippet(CLAUDE_CODE_COMMAND),
    getName: docsClaudeCodeName,
    getSummary: docsClaudeCodeSummary
  },
  {
    slug: "opencode",
    command: OPENCODE_COMMAND,
    protocol: "openai-compatible",
    baseUrl: ONEAI_OPENAI_BASE_URL,
    configPath: OPENCODE_CONFIG_PATH,
    configLanguage: "jsonc",
    installSnippet: OPENCODE_INSTALL_SNIPPET,
    versionSnippet: getVersionSnippet(OPENCODE_COMMAND),
    configSnippet: OPENCODE_CONFIG_SNIPPET,
    runSnippet: getRunSnippet(OPENCODE_COMMAND),
    getName: docsOpencodeName,
    getSummary: docsOpencodeSummary
  },
  {
    slug: "pi",
    command: PI_COMMAND,
    protocol: "openai-compatible",
    baseUrl: ONEAI_OPENAI_BASE_URL,
    configPath: PI_CONFIG_PATH,
    configLanguage: "json",
    installSnippet: PI_INSTALL_SNIPPET,
    versionSnippet: getVersionSnippet(PI_COMMAND),
    configSnippet: PI_MODELS_SNIPPET,
    runSnippet: getRunSnippet(PI_COMMAND),
    getName: docsPiName,
    getSummary: docsPiSummary
  }
];

/** Ordered slug list for generateStaticParams. */
export const DOCS_HARNESS_SLUGS: DocsHarnessSlug[] = DOCS_HARNESSES.map(
  ({ slug }) => slug
);

/**
 * Looks up a harness by slug.
 *
 * @param slug - Route segment from /[lang]/get-started/[slug]
 * @param harnesses - Harness list for DI
 * @returns Matching harness, or undefined when the slug is unknown
 */
export function getDocsHarness(
  slug: string,
  harnesses: DocsHarness[] = DOCS_HARNESSES
): DocsHarness | undefined {
  return harnesses.find((harness) => harness.slug === slug);
}
