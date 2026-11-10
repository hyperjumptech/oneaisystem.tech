import type { SupportedLanguage } from "@/locales/.generated/types";
import {
  oneaiCapabilities0Text,
  oneaiCapabilities0Title,
  oneaiCapabilities1Text,
  oneaiCapabilities1Title,
  oneaiCapabilities2Text,
  oneaiCapabilities2Title,
  oneaiCapabilities3Text,
  oneaiCapabilities3Title,
  oneaiCapabilities4Text,
  oneaiCapabilities4Title,
  oneaiCapabilities5Text,
  oneaiCapabilities5Title,
  oneaiCapabilities6Text,
  oneaiCapabilities6Title,
  oneaiCapabilities7Text,
  oneaiCapabilities7Title
} from "@/locales/.generated/strings";

export type OneaiCapability = {
  title: string;
  text: string;
};

type CapabilityLoader = {
  title: (lang: SupportedLanguage) => string;
  text: (lang: SupportedLanguage) => string;
};

export type GetOneaiCapabilitiesOptions = {
  lang: SupportedLanguage;
  /** Capability loaders for tests */
  capabilityLoaders?: CapabilityLoader[];
};

const DEFAULT_CAPABILITY_LOADERS: CapabilityLoader[] = [
  { title: oneaiCapabilities0Title, text: oneaiCapabilities0Text },
  { title: oneaiCapabilities1Title, text: oneaiCapabilities1Text },
  { title: oneaiCapabilities2Title, text: oneaiCapabilities2Text },
  { title: oneaiCapabilities3Title, text: oneaiCapabilities3Text },
  { title: oneaiCapabilities4Title, text: oneaiCapabilities4Text },
  { title: oneaiCapabilities5Title, text: oneaiCapabilities5Text },
  { title: oneaiCapabilities6Title, text: oneaiCapabilities6Text },
  { title: oneaiCapabilities7Title, text: oneaiCapabilities7Text }
];

/**
 * Loads localized "what your team can do" cards for the OneAI landing page.
 *
 * @param options - Locale and optional capability loaders for DI
 * @returns Ordered title and text pairs for the capabilities grid
 */
export function getOneaiCapabilities({
  lang,
  capabilityLoaders = DEFAULT_CAPABILITY_LOADERS
}: GetOneaiCapabilitiesOptions): OneaiCapability[] {
  return capabilityLoaders.map(({ text, title }) => ({
    title: title(lang),
    text: text(lang)
  }));
}
