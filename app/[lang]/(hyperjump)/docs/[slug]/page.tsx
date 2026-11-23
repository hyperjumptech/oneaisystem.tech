import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import data from "@/data.json";
import { dynamicOpengraph } from "@/lib/default-metadata";
import {
  supportedLanguages,
  type SupportedLanguage
} from "@/locales/.generated/types";
import { docsCommonAllGuides } from "@/locales/.generated/strings";

import { AnimatedLines } from "../../components/animated-lines";
import { SectionReveal } from "../../components/motion-wrappers";
import { CodeBlock } from "../components/code-block";
import { DocStep } from "../components/doc-step";
import { DocsNav } from "../components/docs-nav";
import {
  DOCS_HARNESS_SLUGS,
  getDocsHarness,
  type DocsHarnessSlug
} from "../docs-registry";
import { getDocsGuide } from "../get-docs-guide";

const { siteUrl } = data;
const OG_IMAGE = `${siteUrl}/images/oneai/og.png`;

type GuidePageProps = {
  params: Promise<{ lang: SupportedLanguage; slug: DocsHarnessSlug }>;
};

export const generateStaticParams = async () =>
  supportedLanguages.flatMap((lang) =>
    DOCS_HARNESS_SLUGS.map((slug) => ({ lang, slug }))
  );

export async function generateMetadata({
  params
}: GuidePageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const harness = getDocsHarness(slug);

  if (!harness) {
    return {};
  }

  const name = harness.getName(lang);
  const title = `${name} + OneAI | Hyperjump`;
  const description = harness.getSummary(lang);
  const pageUrl = `${siteUrl}/${lang}/docs/${slug}`;

  return dynamicOpengraph({
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: supportedLanguages.reduce(
        (acc, locale) => {
          acc[locale] = `${siteUrl}/${locale}/docs/${slug}`;
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
      url: OG_IMAGE,
      width: 1200,
      height: 630,
      alt: title
    }
  });
}

/**
 * Setup guide that routes one coding harness through OneAI.
 */
export default async function DocsGuidePage({ params }: GuidePageProps) {
  const { lang, slug } = await params;
  const guide = getDocsGuide({ lang, slug });

  if (!guide) {
    notFound();
  }

  const { harness, labels } = guide;

  return (
    <main className="bg-white pb-24">
      <section className="bg-hero-premium relative overflow-hidden text-white">
        <div className="hero-glow animate-glow top-[12%] left-1/2 -translate-x-1/2" />
        <div className="hero-glow animate-glow -top-32 right-0 [animation-delay:1.5s]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />
        <AnimatedLines className="pointer-events-none absolute inset-0 h-full w-full opacity-30" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 pt-32 pb-14 md:px-8 md:pt-40 md:pb-16">
          <SectionReveal>
            <Link
              href={`/${lang}/docs`}
              className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-white hover:underline">
              <ArrowLeftIcon className="h-4 w-4" aria-hidden />
              {docsCommonAllGuides(lang)}
            </Link>

            <p className="mb-3 text-xs font-bold tracking-[0.16em] text-yellow-300 uppercase">
              {guide.harness.protocol === "anthropic"
                ? "Anthropic Messages API"
                : "OpenAI-compatible"}
            </p>
            <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
              {guide.name}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed font-medium text-white/60">
              {guide.summary}
            </p>
          </SectionReveal>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pt-14 md:px-8">
        <SectionReveal>
          <aside className="mb-12 rounded-xl border border-black/8 bg-[#F6F8F9] px-5 py-4">
            <p className="text-hyperjump-black mb-1.5 text-xs font-bold tracking-[0.16em] uppercase">
              {guide.prerequisitesLabel}
            </p>
            <p className="text-hyperjump-gray text-sm leading-relaxed">
              {guide.prerequisites}
            </p>
          </aside>
        </SectionReveal>

        <SectionReveal>
          <ol className="space-y-12">
            <DocStep
              index={0}
              stepLabel={labels.step}
              title={guide.keyStep.title}
              text={guide.keyStep.text}
              noteLabel={labels.note}
              note={guide.keyStep.note}
            />
            {guide.steps.map((step, index) => (
              <DocStep
                key={step.title}
                index={index + 1}
                stepLabel={labels.step}
                title={step.title}
                text={step.text}
                noteLabel={labels.note}
                note={step.note}>
                {step.code && (
                  <CodeBlock
                    code={step.code}
                    label={step.codeLabel}
                    language={step.codeLanguage}
                    copyLabel={labels.copy}
                    copiedLabel={labels.copied}
                  />
                )}
              </DocStep>
            ))}
          </ol>
        </SectionReveal>

        <SectionReveal>
          <section className="mt-16">
            <h2 className="text-hyperjump-black mb-4 text-2xl font-semibold">
              {guide.fieldsLabel}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-black/8">
              <table className="w-full text-left text-sm">
                <tbody>
                  {guide.fields.map(({ name, text }) => (
                    <tr
                      key={name}
                      className="border-b border-black/6 last:border-0">
                      <th className="text-hyperjump-black w-1/3 px-5 py-3.5 align-top font-mono text-xs font-medium">
                        {name}
                      </th>
                      <td className="text-hyperjump-gray px-5 py-3.5 leading-relaxed">
                        {text}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </SectionReveal>

        {guide.extra && (
          <SectionReveal>
            <section className="mt-12 rounded-xl border border-black/8 bg-[#F6F8F9] px-5 py-4">
              <h2 className="text-hyperjump-black mb-2 text-lg font-semibold">
                {guide.extra.title}
              </h2>
              <p className="text-hyperjump-gray text-sm leading-relaxed">
                {guide.extra.text}
              </p>
            </section>
          </SectionReveal>
        )}

        <SectionReveal>
          <section className="mt-16">
            <h2 className="text-hyperjump-black mb-3 text-2xl font-semibold">
              {guide.verifyLabel}
            </h2>
            <CodeBlock
              code={guide.verifyPrompt}
              label="prompt"
              language="bash"
              copyLabel={labels.copy}
              copiedLabel={labels.copied}
            />
          </section>
        </SectionReveal>

        <DocsNav
          lang={lang}
          current={harness}
          backLabel={docsCommonAllGuides(lang)}
        />
      </div>
    </main>
  );
}
