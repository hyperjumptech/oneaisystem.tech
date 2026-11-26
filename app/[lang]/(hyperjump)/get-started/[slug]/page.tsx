import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import data from "@/data.json";
import { dynamicOpengraph } from "@/lib/default-metadata";
import {
  supportedLanguages,
  type SupportedLanguage
} from "@/locales/.generated/types";
import {
  docsCommonAllGuides,
  docsCommonBackToDocs,
  docsCommonNextGuide,
  docsCommonPreviousGuide,
  docsIndexEyebrow,
  docsIndexTocLabel
} from "@/locales/.generated/strings";
import { oneaiNavGetStarted } from "@/locales/.generated/server";

import { CodeBlock } from "../components/code-block";
import { DocStep } from "../components/doc-step";
import { DocsNav } from "../components/docs-nav";
import { DocsShell } from "../components/docs-shell";
import type { DocsTocItem } from "../components/docs-toc";
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
  const pageUrl = `${siteUrl}/${lang}/get-started/${slug}`;

  return dynamicOpengraph({
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: supportedLanguages.reduce(
        (acc, locale) => {
          acc[locale] = `${siteUrl}/${locale}/get-started/${slug}`;
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
 *
 * It renders through the same documentation shell as the get-started hub:
 * sticky guide list, breadcrumb header, and an "on this page" table of
 * contents. Only the article body is specific to the harness.
 */
export default async function DocsGuidePage({ params }: GuidePageProps) {
  const { lang, slug } = await params;
  const guide = getDocsGuide({ lang, slug });

  if (!guide) {
    notFound();
  }

  const { harness, labels } = guide;

  const tocItems: DocsTocItem[] = [
    { id: "prerequisites", label: guide.prerequisitesLabel },
    { id: "setup", label: guide.setupLabel },
    { id: "fields", label: guide.fieldsLabel },
    ...(guide.extra ? [{ id: "models", label: guide.extra.title }] : [])
  ];

  return (
    <DocsShell
      lang={lang}
      current={harness.slug}
      sidebarEyebrow={docsIndexEyebrow(lang)}
      tocLabel={docsIndexTocLabel(lang)}
      tocItems={tocItems}>
      <header className="mb-12">
        <nav
          aria-label="Breadcrumb"
          className="text-hyperjump-muted mb-5 flex flex-wrap items-center gap-2 text-xs">
          <span>{docsIndexEyebrow(lang)}</span>
          <span aria-hidden>/</span>
          <Link href={`/${lang}/get-started`} className="hover:underline">
            {oneaiNavGetStarted(lang)}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-hyperjump-black font-medium">{guide.name}</span>
        </nav>
        <h1 className="text-hyperjump-black mb-4 text-4xl leading-[1.1] font-semibold tracking-tight md:text-5xl">
          {guide.name}
        </h1>
        <p className="text-hyperjump-gray text-lg leading-relaxed">
          {guide.summary}
        </p>
      </header>

      <section
        id="prerequisites"
        className="scroll-mt-24 border-t border-black/8 py-10">
        <div className="rounded-xl border border-black/8 bg-[#F6F8F9] p-5">
          <p className="text-hyperjump-blue mb-2 text-xs font-bold tracking-[0.16em] uppercase">
            {guide.prerequisitesLabel}
          </p>
          <p className="text-hyperjump-gray text-sm leading-relaxed">
            {guide.prerequisites}
          </p>
        </div>
      </section>

      <section
        id="setup"
        className="scroll-mt-24 border-t border-black/8 py-10">
        <h2 className="text-hyperjump-black mb-8 text-2xl font-semibold tracking-tight">
          {guide.setupLabel}
        </h2>
        <ol className="space-y-10 sm:space-y-12">
          {guide.keySteps.map((step, index) => (
            <DocStep
              key={step.id}
              id={step.id}
              index={index}
              stepLabel={labels.step}
              title={step.title}
              text={step.text}
              noteLabel={labels.note}
              note={step.note}
            />
          ))}
          {guide.steps.map((step, index) => (
            <DocStep
              key={step.title}
              id={step.id}
              index={index + guide.keySteps.length}
              stepLabel={labels.step}
              title={step.title}
              text={step.text}
              noteLabel={labels.note}
              note={step.note}
              footer={step.footer}>
              {step.codes.length > 0 && (
                <div className="space-y-4">
                  {step.codes.map((block) => (
                    <CodeBlock
                      key={block.id}
                      id={block.id}
                      code={block.code}
                      label={block.label}
                      language={block.language}
                      copyLabel={labels.copy}
                      copiedLabel={labels.copied}
                      copyFailedLabel={labels.copyFailed}
                    />
                  ))}
                </div>
              )}
            </DocStep>
          ))}
        </ol>
      </section>

      <section
        id="fields"
        className="scroll-mt-24 border-t border-black/8 py-10">
        <h2 className="text-hyperjump-black mb-4 text-2xl font-semibold tracking-tight">
          {guide.fieldsLabel}
        </h2>
        <div
          data-testid="docs-fields"
          className="rounded-xl border border-black/8">
          <table className="w-full text-left text-sm">
            <thead className="sr-only sm:not-sr-only">
              <tr className="border-b border-black/6">
                <th
                  scope="col"
                  className="text-hyperjump-muted px-5 pt-4 pb-2 text-xs font-medium tracking-[0.08em] uppercase sm:table-cell sm:w-1/3 sm:py-3">
                  {guide.fieldColumns.name}
                </th>
                <th
                  scope="col"
                  className="text-hyperjump-muted px-5 pt-4 pb-2 text-xs font-medium tracking-[0.08em] uppercase sm:table-cell sm:py-3">
                  {guide.fieldColumns.description}
                </th>
              </tr>
            </thead>
            <tbody>
              {guide.fields.map(({ name, text }) => (
                <tr
                  key={name}
                  className="block border-b border-black/6 last:border-0 sm:table-row">
                  <th
                    scope="row"
                    className="text-hyperjump-black font-geist-mono block w-full px-5 pt-4 pb-0 align-top text-xs font-medium break-all sm:table-cell sm:w-1/3 sm:py-3.5 sm:pb-3.5">
                    {name}
                  </th>
                  <td className="text-hyperjump-gray block px-5 pt-1 pb-4 leading-relaxed sm:table-cell sm:py-3.5">
                    {text}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {guide.extra && (
        <section
          id="models"
          className="scroll-mt-24 border-t border-black/8 py-10">
          <div className="rounded-xl border border-black/8 bg-[#F6F8F9] p-6">
            <h2 className="text-hyperjump-black mb-2 text-lg font-semibold">
              {guide.extra.title}
            </h2>
            <p className="text-hyperjump-gray text-sm leading-relaxed">
              {guide.extra.text}
            </p>
          </div>
        </section>
      )}

      <DocsNav
        lang={lang}
        current={harness}
        backLabel={docsCommonAllGuides(lang)}
        previousLabel={docsCommonPreviousGuide(lang)}
        nextLabel={docsCommonNextGuide(lang)}
      />
    </DocsShell>
  );
}
