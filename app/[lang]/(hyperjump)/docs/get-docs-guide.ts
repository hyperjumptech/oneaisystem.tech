import type { SupportedLanguage } from "@/locales/.generated/types";
import {
  docsClaudeCodeConfigureNote,
  docsClaudeCodeConfigureText,
  docsClaudeCodeConfigureTitle,
  docsClaudeCodeEnv0Name,
  docsClaudeCodeEnv0Text,
  docsClaudeCodeEnv1Name,
  docsClaudeCodeEnv1Text,
  docsClaudeCodeEnv2Name,
  docsClaudeCodeEnv2Text,
  docsClaudeCodeEnv3Name,
  docsClaudeCodeEnv3Text,
  docsClaudeCodeEnv4Name,
  docsClaudeCodeEnv4Text,
  docsClaudeCodeInstallNote,
  docsClaudeCodeInstallText,
  docsClaudeCodeInstallTitle,
  docsClaudeCodeModelsText,
  docsClaudeCodeModelsTitle,
  docsClaudeCodePrerequisites,
  docsClaudeCodeVerifyText,
  docsClaudeCodeVerifyTitle,
  docsCommonCopied,
  docsCommonCopy,
  docsCommonEnvironment,
  docsCommonImportant,
  docsCommonNote,
  docsCommonPrerequisites,
  docsCommonStep,
  docsCommonVerify,
  docsCommonVirtualKeyNote,
  docsCommonVirtualKeyText,
  docsCommonVirtualKeyTitle,
  docsOpencodeConfigureNote,
  docsOpencodeConfigureText,
  docsOpencodeConfigureTitle,
  docsOpencodeFields0Name,
  docsOpencodeFields0Text,
  docsOpencodeFields1Name,
  docsOpencodeFields1Text,
  docsOpencodeFields2Name,
  docsOpencodeFields2Text,
  docsOpencodeFields3Name,
  docsOpencodeFields3Text,
  docsOpencodeFields4Name,
  docsOpencodeFields4Text,
  docsOpencodeInstallNote,
  docsOpencodeInstallText,
  docsOpencodeInstallTitle,
  docsOpencodePrerequisites,
  docsOpencodeVerifyText,
  docsOpencodeVerifyTitle
} from "@/locales/.generated/strings";

import {
  type DocsHarness,
  type DocsHarnessSlug,
  getDocsHarness
} from "./docs-registry";
import { VERIFY_PROMPT_SNIPPET } from "./snippets";

/** A numbered setup step with an optional code block. */
export type DocsStep = {
  title: string;
  text: string;
  /** Optional note rendered as a callout under the step body. */
  note?: string;
  code?: string;
  codeLabel?: string;
  /** Language hint for the code block, e.g. bash or json. */
  codeLanguage?: "bash" | "json" | "jsonc";
};

/** A row in the environment variable / config field table. */
export type DocsField = {
  name: string;
  text: string;
};

export type DocsGuideLabels = {
  step: string;
  copy: string;
  copied: string;
  note: string;
  important: string;
  environment: string;
};

export type DocsGuide = {
  harness: DocsHarness;
  name: string;
  summary: string;
  prerequisitesLabel: string;
  prerequisites: string;
  steps: DocsStep[];
  /** Localized copy for the shared "create a virtual key" step. */
  keyStep: DocsStep;
  fieldsLabel: string;
  fields: DocsField[];
  verifyLabel: string;
  verifyText: string;
  verifyPrompt: string;
  /** Optional extra section between the field table and verification. */
  extra?: { title: string; text: string };
  labels: DocsGuideLabels;
};

type StringLoader = (lang: SupportedLanguage) => string;

type CopyLoaders = {
  prerequisites: StringLoader;
  installTitle: StringLoader;
  installText: StringLoader;
  installNote: StringLoader;
  configureTitle: StringLoader;
  configureText: StringLoader;
  configureNote: StringLoader;
  verifyTitle: StringLoader;
  verifyText: StringLoader;
  fieldsLabel: StringLoader;
  fields: Array<{ name: StringLoader; text: StringLoader }>;
  extra?: { title: StringLoader; text: StringLoader };
};

/** Per-harness localized copy, keyed by slug. */
export const DOCS_GUIDE_COPY: Record<DocsHarnessSlug, CopyLoaders> = {
  "claude-code": {
    prerequisites: docsClaudeCodePrerequisites,
    installTitle: docsClaudeCodeInstallTitle,
    installText: docsClaudeCodeInstallText,
    installNote: docsClaudeCodeInstallNote,
    configureTitle: docsClaudeCodeConfigureTitle,
    configureText: docsClaudeCodeConfigureText,
    configureNote: docsClaudeCodeConfigureNote,
    verifyTitle: docsClaudeCodeVerifyTitle,
    verifyText: docsClaudeCodeVerifyText,
    fieldsLabel: docsCommonEnvironment,
    fields: [
      { name: docsClaudeCodeEnv0Name, text: docsClaudeCodeEnv0Text },
      { name: docsClaudeCodeEnv1Name, text: docsClaudeCodeEnv1Text },
      { name: docsClaudeCodeEnv2Name, text: docsClaudeCodeEnv2Text },
      { name: docsClaudeCodeEnv3Name, text: docsClaudeCodeEnv3Text },
      { name: docsClaudeCodeEnv4Name, text: docsClaudeCodeEnv4Text }
    ],
    extra: {
      title: docsClaudeCodeModelsTitle,
      text: docsClaudeCodeModelsText
    }
  },
  opencode: {
    prerequisites: docsOpencodePrerequisites,
    installTitle: docsOpencodeInstallTitle,
    installText: docsOpencodeInstallText,
    installNote: docsOpencodeInstallNote,
    configureTitle: docsOpencodeConfigureTitle,
    configureText: docsOpencodeConfigureText,
    configureNote: docsOpencodeConfigureNote,
    verifyTitle: docsOpencodeVerifyTitle,
    verifyText: docsOpencodeVerifyText,
    fieldsLabel: docsCommonEnvironment,
    fields: [
      { name: docsOpencodeFields0Name, text: docsOpencodeFields0Text },
      { name: docsOpencodeFields1Name, text: docsOpencodeFields1Text },
      { name: docsOpencodeFields2Name, text: docsOpencodeFields2Text },
      { name: docsOpencodeFields3Name, text: docsOpencodeFields3Text },
      { name: docsOpencodeFields4Name, text: docsOpencodeFields4Text }
    ]
  }
};

const DEFAULT_LABELS: Record<keyof DocsGuideLabels, StringLoader> = {
  step: docsCommonStep,
  copy: docsCommonCopy,
  copied: docsCommonCopied,
  note: docsCommonNote,
  important: docsCommonImportant,
  environment: docsCommonEnvironment
};

export type GetDocsGuideOptions = {
  lang: SupportedLanguage;
  slug: DocsHarnessSlug;
  /** Harness lookup for tests */
  harness?: DocsHarness;
  /** Copy loader for tests */
  copy?: CopyLoaders;
  /** Shared label loaders for tests */
  labelLoaders?: Record<keyof DocsGuideLabels, StringLoader>;
};

/**
 * Assembles one harness guide: prerequisites, ordered steps with snippets,
 * a field table, and verification copy.
 *
 * @param options - Locale, harness slug, and optional loaders for DI
 * @returns Guide view model, or undefined when the slug is unknown
 */
export function getDocsGuide({
  lang,
  slug,
  harness = getDocsHarness(slug),
  copy = DOCS_GUIDE_COPY[slug],
  labelLoaders = DEFAULT_LABELS
}: GetDocsGuideOptions): DocsGuide | undefined {
  if (!harness || !copy) {
    return undefined;
  }

  return {
    harness,
    name: harness.getName(lang),
    summary: harness.getSummary(lang),
    prerequisitesLabel: docsCommonPrerequisites(lang),
    prerequisites: copy.prerequisites(lang),
    keyStep: {
      title: docsCommonVirtualKeyTitle(lang),
      text: docsCommonVirtualKeyText(lang),
      note: docsCommonVirtualKeyNote(lang)
    },
    steps: [
      {
        title: copy.installTitle(lang),
        text: copy.installText(lang),
        note: copy.installNote(lang),
        code: harness.installSnippet,
        codeLabel: "install",
        codeLanguage: "bash"
      },
      {
        title: copy.configureTitle(lang),
        text: copy.configureText(lang),
        note: copy.configureNote(lang),
        code: harness.configSnippet,
        codeLabel: harness.configPath,
        codeLanguage: harness.protocol === "anthropic" ? "json" : "jsonc"
      },
      {
        title: copy.verifyTitle(lang),
        text: copy.verifyText(lang),
        code: harness.runSnippet,
        codeLabel: "run",
        codeLanguage: "bash"
      }
    ],
    fieldsLabel: copy.fieldsLabel(lang),
    fields: copy.fields.map(({ name, text }) => ({
      name: name(lang),
      text: text(lang)
    })),
    verifyLabel: docsCommonVerify(lang),
    verifyText: VERIFY_PROMPT_SNIPPET,
    verifyPrompt: VERIFY_PROMPT_SNIPPET,
    extra: copy.extra
      ? { title: copy.extra.title(lang), text: copy.extra.text(lang) }
      : undefined,
    labels: {
      step: labelLoaders.step(lang),
      copy: labelLoaders.copy(lang),
      copied: labelLoaders.copied(lang),
      note: labelLoaders.note(lang),
      important: labelLoaders.important(lang),
      environment: labelLoaders.environment(lang)
    }
  };
}
