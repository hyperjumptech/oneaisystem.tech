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
  docsOpencodeVerifyTitle
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

  return {
    harness,
    name: harness.getName(lang),
    summary: harness.getSummary(lang),
    setupLabel: docsCommonSetup(lang),
    prerequisitesLabel: docsCommonPrerequisites(lang),
    prerequisites: copy.prerequisites(lang),
    keySteps: getDocsKeyFlow(lang, keyFlowLoaders),
    steps: [
      {
        id: "install",
        title: copy.installTitle(lang),
        text: copy.installText(lang),
        note: copy.installNote(lang),
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
        title: copy.configureTitle(lang),
        text: copy.configureText(lang),
        note: copy.configureNote(lang),
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
        title: copy.verifyTitle(lang),
        text: copy.verifyText(lang),
        codes: [
          {
            id: "run",
            code: harness.runSnippet,
            label: "run",
            language: "bash"
          },
          {
            id: "prompt",
            code: copy.verifyPrompt(lang),
            label: "prompt",
            language: "text"
          }
        ],
        footer: copy.verifyCheck(lang)
      }
    ],
    fieldsLabel: copy.fieldsLabel(lang),
    fields: copy.fields.map(({ name, text }) => ({
      name: name(lang),
      text: text(lang)
    })),
    fieldColumns: {
      name: docsCommonColumnsVariable(lang),
      description: docsCommonColumnsDescription(lang)
    },
    extra: copy.extra
      ? { title: copy.extra.title(lang), text: copy.extra.text(lang) }
      : undefined,
    labels: {
      step: labelLoaders.step(lang),
      copy: labelLoaders.copy(lang),
      copied: labelLoaders.copied(lang),
      copyFailed: labelLoaders.copyFailed(lang),
      note: labelLoaders.note(lang)
    }
  };
}
