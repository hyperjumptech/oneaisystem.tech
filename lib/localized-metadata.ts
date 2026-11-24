import type { Metadata } from "next";

import data from "@/data.json";
import {
  supportedLanguages,
  type SupportedLanguage
} from "@/locales/.generated/types";

import { dynamicOpengraph } from "./default-metadata";

const { siteUrl } = data;

/** Open Graph image used by the OneAI landing page and the docs. */
export const ONEAI_OG_IMAGE_PATH = "/images/oneai/og.png";

export type BuildLocalizedMetadataOptions = {
  /** Active locale. */
  lang: SupportedLanguage;
  /** Path below the locale segment, e.g. "/docs/claude-code". */
  path?: string;
  title: string;
  description: string;
};

/**
 * Builds metadata for a locale-scoped page: canonical URL, alternate
 * languages, and the Open Graph locale mapping.
 *
 * Every locale variant of a page sits at the same path below its locale
 * segment, so one `path` describes the whole set.
 *
 * @param options - Locale, path, title, and description
 * @returns Metadata object with canonical, alternates, and OG tags
 */
export function buildLocalizedMetadata({
  lang,
  path = "",
  title,
  description
}: BuildLocalizedMetadataOptions): Metadata {
  const pageUrl = `${siteUrl}/${lang}${path}`;

  return dynamicOpengraph({
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: supportedLanguages.reduce(
        (acc, locale) => {
          acc[locale] = `${siteUrl}/${locale}${path}`;
          return acc;
        },
        {} as Record<string, string>
      )
    },
    openGraph: {
      url: pageUrl,
      locale: lang === "id" ? "id_ID" : "en_US",
      alternateLocale: lang === "id" ? ["en_US"] : ["id_ID"]
    },
    image: {
      url: `${siteUrl}${ONEAI_OG_IMAGE_PATH}`,
      width: 1200,
      height: 630,
      alt: title
    }
  });
}
