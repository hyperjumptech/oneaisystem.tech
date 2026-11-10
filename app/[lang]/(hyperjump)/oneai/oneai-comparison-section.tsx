import type { SupportedLanguage } from "@/locales/.generated/types";
import {
  oneaiComparisonTableLabel,
  oneaiComparisonWhySectionDesc,
  oneaiComparisonWhySectionHeading,
  oneaiComparisonWhySectionLabel
} from "@/locales/.generated/strings";

import {
  SectionReveal,
  StaggerContainer,
  StaggerItem
} from "../components/motion-wrappers";
import { getOneaiComparisonWhy } from "./get-oneai-comparison-rows";
import { OneaiComparisonTable } from "./oneai-comparison-table";
import { OneaiPdfDownload } from "./oneai-pdf-download";

type OneaiComparisonSectionProps = {
  lang: SupportedLanguage;
};

/**
 * Capability comparison table for OneAI against stipends, ChatGPT, and Copilot.
 *
 * @param props - Active locale for copy and table rows
 */
export function OneaiComparisonSection({ lang }: OneaiComparisonSectionProps) {
  const whyColumns = getOneaiComparisonWhy({ lang });

  return (
    <section
      id="comparison"
      data-testid="oneai-comparison-section"
      className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-20 xl:px-0">
        <SectionReveal>
          <h2
            className="text-hyperjump-black mb-10 text-3xl font-semibold tracking-tight md:text-4xl"
            data-testid="oneai-comparison-heading">
            {oneaiComparisonTableLabel(lang)}
          </h2>
        </SectionReveal>

        <OneaiComparisonTable lang={lang} />

        <SectionReveal delay={0.08}>
          <div
            className="mt-12 max-w-3xl"
            data-testid="oneai-comparison-why-intro">
            <p className="text-hyperjump-blue mb-2 text-xs font-bold tracking-[0.16em] uppercase">
              {oneaiComparisonWhySectionLabel(lang)}
            </p>
            <h3 className="text-hyperjump-black mb-3 text-xl font-semibold md:text-2xl">
              {oneaiComparisonWhySectionHeading(lang)}
            </h3>
            <p
              className="text-hyperjump-gray text-[15px] leading-relaxed md:text-base"
              dangerouslySetInnerHTML={{
                __html: oneaiComparisonWhySectionDesc(lang)
              }}
            />
          </div>
        </SectionReveal>

        <StaggerContainer className="mt-8 grid gap-6 md:grid-cols-3">
          {whyColumns.map(({ text, title }) => (
            <StaggerItem key={title}>
              <article className="h-full rounded-2xl border border-black/6 bg-[#F6F8F9] p-6">
                <h3
                  className="text-hyperjump-black mb-2 text-base font-semibold"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
                <p
                  className="text-hyperjump-gray text-[15px] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <OneaiPdfDownload lang={lang} />
      </div>
    </section>
  );
}
