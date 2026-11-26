import type { SupportedLanguage } from "@/locales/.generated/types";
import {
  docsCommonKeyFlow0Text,
  docsCommonKeyFlow0Title,
  docsCommonKeyFlow1Text,
  docsCommonKeyFlow1Title,
  docsCommonKeyFlow2Text,
  docsCommonKeyFlow2Title,
  docsCommonKeyFlowNote
} from "@/locales/.generated/strings";

/** One step of the shared "create a virtual key" console flow. */
export type DocsKeyFlowStep = {
  /** Stable identifier used by tests, independent of the step order. */
  id: string;
  title: string;
  text: string;
  /** Optional note rendered as a callout under the step body. */
  note?: string;
};

/** Localized loaders for one key flow step. */
export type DocsKeyFlowStepLoader = {
  id: string;
  title: (lang: SupportedLanguage) => string;
  text: (lang: SupportedLanguage) => string;
  note?: (lang: SupportedLanguage) => string;
};

/**
 * The console flow that creates a virtual key, in order.
 *
 * This is the single source of truth for the flow: the docs hub renders it as
 * the quickstart cards and every setup guide renders it as the opening steps.
 * Change the console and this list is the only place to edit.
 */
export const DOCS_KEY_FLOW: DocsKeyFlowStepLoader[] = [
  {
    id: "key-signin",
    title: docsCommonKeyFlow0Title,
    text: docsCommonKeyFlow0Text
  },
  {
    id: "key",
    title: docsCommonKeyFlow1Title,
    text: docsCommonKeyFlow1Text
  },
  {
    id: "key-save",
    title: docsCommonKeyFlow2Title,
    text: docsCommonKeyFlow2Text,
    note: docsCommonKeyFlowNote
  }
];

/**
 * Builds the shared key creation flow for one locale.
 *
 * @param lang - Locale to translate the flow into
 * @param loaders - Step loaders for tests
 * @returns Ordered key flow steps
 */
export function getDocsKeyFlow(
  lang: SupportedLanguage,
  loaders: DocsKeyFlowStepLoader[] = DOCS_KEY_FLOW
): DocsKeyFlowStep[] {
  return loaders.map(({ id, title, text, note }) => ({
    id,
    title: title(lang),
    text: text(lang),
    note: note?.(lang)
  }));
}
