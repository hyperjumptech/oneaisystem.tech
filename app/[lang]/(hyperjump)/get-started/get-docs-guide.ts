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
  docsClaudeCodeEnv5Name,
  docsClaudeCodeEnv5Text,
  docsClaudeCodeInstallNote,
  docsClaudeCodeInstallText,
  docsClaudeCodeInstallTitle,
  docsClaudeCodeModelsText,
  docsClaudeCodeModelsTitle,
  docsClaudeCodePrerequisites,
  docsClaudeCodeVerifyCheck,
  docsClaudeCodeVerifyPrompt,
  docsClaudeCodeVerifyText,
  docsClaudeCodeVerifyTitle,
  docsCommonConfigFields,
  docsCommonColumnsDescription,
  docsCommonColumnsVariable,
  docsCommonCopied,
  docsCommonCopy,
  docsCommonCopyFailed,
  docsCommonEnvironment,
  docsCommonNote,
  docsCommonPrerequisites,
  docsCommonSetup,
  docsCommonStep,
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
  docsOpencodeFields5Name,
  docsOpencodeFields5Text,
  docsOpencodeInstallNote,
  docsOpencodeInstallText,
  docsOpencodeInstallTitle,
  docsOpencodePrerequisites,
  docsOpencodeVerifyCheck,
  docsOpencodeVerifyPrompt,
  docsOpencodeVerifyText,
  docsOpencodeVerifyTitle,
  docsPiConfigureNote,
  docsPiConfigureText,
  docsPiConfigureTitle,
  docsPiFields0Name,
  docsPiFields0Text,
  docsPiFields1Name,
  docsPiFields1Text,
  docsPiFields2Name,
  docsPiFields2Text,
  docsPiFields3Name,
  docsPiFields3Text,
  docsPiFields4Name,
  docsPiFields4Text,
  docsPiInstallNote,
  docsPiInstallText,
  docsPiInstallTitle,
  docsPiPrerequisites,
  docsPiVerifyCheck,
  docsPiVerifyPrompt,
  docsPiVerifyText,
  docsPiVerifyTitle
} from "@/locales/.generated/strings";

import {
  getDocsKeyFlow,
  type DocsKeyFlowStep,
  type DocsKeyFlowStepLoader
} from "./docs-key-flow";
import {
  type DocsHarness,
  type DocsHarnessSlug,
  getDocsHarness
} from "./docs-registry";
import type { DocsCodeLanguage } from "./snippets";

/** One code block inside a setup step. */
export type DocsCodeBlock = {
  /** Stable identifier used by tests, independent of the step order. */
  id: string;
  code: string;
  label: string;
  language: DocsCodeLanguage;
};

/** A numbered setup step with optional code blocks. */
export type DocsStep = {
  /** Stable identifier used by tests, independent of the step order. */
  id: string;
  title: string;
  text: string;
  /** Optional note rendered as a callout under the step body. */
  note?: string;
  /** Code blocks rendered under the step, in order. */
  codes: DocsCodeBlock[];
  /** Optional paragraph rendered under the code blocks. */
  footer?: string;
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
  copyFailed: string;
  note: string;
};

export type DocsGuide = {
  harness: DocsHarness;
  name: string;
  summary: string;
  /** Heading above the numbered setup steps. */
  setupLabel: string;
  prerequisitesLabel: string;
  prerequisites: string;
  steps: DocsStep[];
  /** Opening steps for the shared "create a virtual key" flow. */
  keySteps: DocsKeyFlowStep[];
  fieldsLabel: string;
  fields: DocsField[];
  /** Column headers for the field table. */
  fieldColumns: { name: string; description: string };
  /** Optional extra section after the field table. */
  extra?: { title: string; text: string };
  labels: DocsGuideLabels;
};

/**
 * Localized copy loader. Copy that names the OneAI endpoint carries a
 * {{oneai_api_url}} placeholder, so every loader also receives the URL;
 * loaders without a placeholder ignore the second argument.
 */
type StringLoader = (
  lang: SupportedLanguage,
  data: { oneai_api_url: string }
) => string;

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
  /** Natural-language prompt the reader pastes into the harness. */
  verifyPrompt: StringLoader;
  /** How to confirm from OneAI's own logs, not the model's self-report. */
  verifyCheck: StringLoader;
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
    verifyPrompt: docsClaudeCodeVerifyPrompt,
    verifyCheck: docsClaudeCodeVerifyCheck,
    fieldsLabel: docsCommonEnvironment,
    fields: [
      { name: docsClaudeCodeEnv0Name, text: docsClaudeCodeEnv0Text },
      { name: docsClaudeCodeEnv1Name, text: docsClaudeCodeEnv1Text },
      { name: docsClaudeCodeEnv2Name, text: docsClaudeCodeEnv2Text },
      { name: docsClaudeCodeEnv3Name, text: docsClaudeCodeEnv3Text },
      { name: docsClaudeCodeEnv4Name, text: docsClaudeCodeEnv4Text },
      { name: docsClaudeCodeEnv5Name, text: docsClaudeCodeEnv5Text }
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
    verifyPrompt: docsOpencodeVerifyPrompt,
    verifyCheck: docsOpencodeVerifyCheck,
    fieldsLabel: docsCommonConfigFields,
    fields: [
      { name: docsOpencodeFields0Name, text: docsOpencodeFields0Text },
      { name: docsOpencodeFields1Name, text: docsOpencodeFields1Text },
      { name: docsOpencodeFields2Name, text: docsOpencodeFields2Text },
      { name: docsOpencodeFields3Name, text: docsOpencodeFields3Text },
      { name: docsOpencodeFields4Name, text: docsOpencodeFields4Text },
      { name: docsOpencodeFields5Name, text: docsOpencodeFields5Text }
    ]
  },
  pi: {
    prerequisites: docsPiPrerequisites,
    installTitle: docsPiInstallTitle,
    installText: docsPiInstallText,
    installNote: docsPiInstallNote,
    configureTitle: docsPiConfigureTitle,
    configureText: docsPiConfigureText,
    configureNote: docsPiConfigureNote,
    verifyTitle: docsPiVerifyTitle,
    verifyText: docsPiVerifyText,
    verifyPrompt: docsPiVerifyPrompt,
    verifyCheck: docsPiVerifyCheck,
    fieldsLabel: docsCommonConfigFields,
    fields: [
      { name: docsPiFields0Name, text: docsPiFields0Text },
      { name: docsPiFields1Name, text: docsPiFields1Text },
      { name: docsPiFields2Name, text: docsPiFields2Text },
      { name: docsPiFields3Name, text: docsPiFields3Text },
      { name: docsPiFields4Name, text: docsPiFields4Text }
    ]
  }
};

const DEFAULT_LABELS: Record<keyof DocsGuideLabels, StringLoader> = {
  step: docsCommonStep,
  copy: docsCommonCopy,
  copied: docsCommonCopied,
  copyFailed: docsCommonCopyFailed,
  note: docsCommonNote
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
  /** Key flow loaders for tests */
  keyFlowLoaders?: DocsKeyFlowStepLoader[];
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
  labelLoaders = DEFAULT_LABELS,
  keyFlowLoaders
}: GetDocsGuideOptions): DocsGuide | undefined {
  if (!harness || !copy) {
    return undefined;
  }

  // Copy that names the OneAI endpoint reads {{oneai_api_url}}; other loaders ignore it.
  const t = (loader: StringLoader) =>
    loader(lang, { oneai_api_url: harness.baseUrl });

  return {
    harness,
    name: harness.getName(lang),
    summary: harness.getSummary(lang),
    setupLabel: docsCommonSetup(lang),
    prerequisitesLabel: docsCommonPrerequisites(lang),
    prerequisites: t(copy.prerequisites),
    keySteps: getDocsKeyFlow(lang, keyFlowLoaders),
    steps: [
      {
        id: "install",
        title: t(copy.installTitle),
        text: t(copy.installText),
        note: t(copy.installNote),
        codes: [
          {
            id: "install",
            code: harness.installSnippet,
            label: "install",
            language: "bash"
          },
          {
            id: "version",
            code: harness.versionSnippet,
            label: "version",
            language: "bash"
          }
        ]
      },
      {
        id: "configure",
        title: t(copy.configureTitle),
        text: t(copy.configureText),
        note: t(copy.configureNote),
        codes: [
          {
            id: "config",
            code: harness.configSnippet,
            label: harness.configPath,
            language: harness.configLanguage
          }
        ]
      },
      {
        id: "verify",
        title: t(copy.verifyTitle),
        text: t(copy.verifyText),
        codes: [
          {
            id: "run",
            code: harness.runSnippet,
            label: "run",
            language: "bash"
          },
          {
            id: "prompt",
            code: t(copy.verifyPrompt),
            label: "prompt",
            language: "text"
          }
        ],
        footer: t(copy.verifyCheck)
      }
    ],
    fieldsLabel: t(copy.fieldsLabel),
    fields: copy.fields.map(({ name, text }) => ({
      name: t(name),
      text: t(text)
    })),
    fieldColumns: {
      name: docsCommonColumnsVariable(lang),
      description: docsCommonColumnsDescription(lang)
    },
    extra: copy.extra
      ? { title: t(copy.extra.title), text: t(copy.extra.text) }
      : undefined,
    labels: {
      step: t(labelLoaders.step),
      copy: t(labelLoaders.copy),
      copied: t(labelLoaders.copied),
      copyFailed: t(labelLoaders.copyFailed),
      note: t(labelLoaders.note)
    }
  };
}
