import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, MailIcon, ShieldAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import data from "@/data.json";
import { dynamicOpengraph } from "@/lib/default-metadata";
import {
  supportedLanguages,
  type SupportedLanguage
} from "@/locales/.generated/types";
import {
  docsIndexCta,
  docsIndexCtaDesc,
  docsIndexCtaHeading,
  docsIndexEndpointsColumnsBaseUrl,
  docsIndexEndpointsColumnsHarness,
  docsIndexEndpointsColumnsProtocol,
  docsIndexEndpointsDesc,
  docsIndexEndpointsHeading,
  docsIndexEndpointsLabel,
  docsIndexEyebrow,
  docsIndexHarnessesLabel,
  docsIndexHeading,
  docsIndexLede,
  docsIndexQuickstartHeading,
  docsIndexQuickstartLabel,
  docsIndexSecurityHeading,
  docsIndexSecurityText,
  docsMetaDescription,
  docsMetaTitle
} from "@/locales/.generated/strings";

import { buildOneaiMailto } from "../oneai/build-oneai-mailto";
import {
  SectionReveal,
  StaggerContainer,
  StaggerItem
} from "../components/motion-wrappers";
import { ConsoleLinkText } from "./components/console-link";
import { ONEAI_CONSOLE_URL } from "./snippets";
import { getDocsIndex } from "./get-docs-index";

const { siteUrl } = data;
const OG_IMAGE = `${siteUrl}/images/oneai/og.png`;

type DocsPageProps = { params: Promise<{ lang: SupportedLanguage }> };

export const generateStaticParams = async () =>
  supportedLanguages.map((lang) => ({ lang }));

/**
 * Builds canonical and alternate metadata for the docs hub.
 */
export async function generateMetadata({
  params
}: DocsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const pageUrl = `${siteUrl}/${lang}/docs`;
  const title = docsMetaTitle(lang);
  const description = docsMetaDescription(lang);

  return dynamicOpengraph({
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: supportedLanguages.reduce(
        (acc, locale) => {
          acc[locale] = `${siteUrl}/${locale}/docs`;
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
 * Docs hub: create a virtual key, then pick a coding harness.
 */
export default async function DocsPage({ params }: DocsPageProps) {
  const { lang } = await params;
  const { cards, endpoints, quickstart } = getDocsIndex({ lang });
  const mailtoHref = buildOneaiMailto({
    subject: docsIndexCtaHeading(lang),
    body: docsIndexCtaDesc(lang)
  });

  return (
    <main className="bg-white pb-24">
      <section className="bg-hero-premium relative overflow-hidden text-white">
        <div className="hero-glow animate-glow top-[12%] left-1/2 -translate-x-1/2" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-36 pb-16 md:px-8 md:pt-44 md:pb-20">
          <SectionReveal>
            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-yellow-300 uppercase">
              {docsIndexEyebrow(lang)}
            </p>
            <h1 className="mb-5 max-w-3xl text-4xl leading-[1.1] font-semibold tracking-tight md:text-5xl">
              {docsIndexHeading(lang)}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed font-medium text-white/60">
              {docsIndexLede(lang)}
            </p>
          </SectionReveal>
        </div>
      </section>

      <section className="bg-[#F6F8F9] py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <SectionReveal>
            <p className="text-hyperjump-blue mb-2 text-xs font-bold tracking-[0.16em] uppercase">
              {docsIndexQuickstartLabel(lang)}
            </p>
            <h2 className="text-hyperjump-black mb-8 text-2xl font-semibold md:text-3xl">
              {docsIndexQuickstartHeading(lang)}
            </h2>
          </SectionReveal>
          <StaggerContainer className="grid gap-5 md:grid-cols-3">
            {quickstart.map(({ text, title }, index) => (
              <StaggerItem key={title}>
                <article className="h-full rounded-2xl border border-black/6 bg-white p-6 shadow-sm">
                  <span className="bg-hyperjump-blue mb-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="text-hyperjump-black mb-2 text-base font-semibold">
                    {title}
                  </h3>
                  <p className="text-hyperjump-gray text-sm leading-relaxed">
                    <ConsoleLinkText text={text} />
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <p className="mt-6">
            <Link
              href={ONEAI_CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-hyperjump-blue inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
              OneAI
              <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section id="harnesses" className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <SectionReveal>
            <h2 className="text-hyperjump-black mb-8 text-2xl font-semibold md:text-3xl">
              {docsIndexHarnessesLabel(lang)}
            </h2>
          </SectionReveal>
          <StaggerContainer className="grid gap-5 sm:grid-cols-2">
            {cards.map(({ href, name, protocol, summary, slug }) => (
              <StaggerItem key={slug}>
                <Link
                  href={href}
                  data-testid={`docs-harness-card-${slug}`}
                  className="group hover:border-hyperjump-blue/40 flex h-full flex-col rounded-2xl border border-black/8 p-6 transition-colors hover:bg-black/[0.02]">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-hyperjump-black text-xl font-semibold">
                      {name}
                    </h3>
                    <ArrowRightIcon
                      className="text-hyperjump-muted group-hover:text-hyperjump-blue h-4 w-4 transition-colors"
                      aria-hidden
                    />
                  </div>
                  <p className="text-hyperjump-gray mb-4 text-[15px] leading-relaxed">
                    {summary}
                  </p>
                  <span className="text-hyperjump-muted mt-auto font-mono text-xs">
                    {protocol}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-[#F6F8F9] py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <SectionReveal>
            <p className="text-hyperjump-blue mb-2 text-xs font-bold tracking-[0.16em] uppercase">
              {docsIndexEndpointsLabel(lang)}
            </p>
            <h2 className="text-hyperjump-black mb-3 text-2xl font-semibold md:text-3xl">
              {docsIndexEndpointsHeading(lang)}
            </h2>
            <p className="text-hyperjump-gray mb-8 max-w-2xl text-base leading-relaxed">
              {docsIndexEndpointsDesc(lang)}
            </p>
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <div className="overflow-x-auto rounded-xl border border-black/8 bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/8">
                    <th className="text-hyperjump-muted px-5 py-3 text-xs font-bold tracking-[0.12em] uppercase">
                      {docsIndexEndpointsColumnsHarness(lang)}
                    </th>
                    <th className="text-hyperjump-muted px-5 py-3 text-xs font-bold tracking-[0.12em] uppercase">
                      {docsIndexEndpointsColumnsProtocol(lang)}
                    </th>
                    <th className="text-hyperjump-muted px-5 py-3 text-xs font-bold tracking-[0.12em] uppercase">
                      {docsIndexEndpointsColumnsBaseUrl(lang)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map(({ baseUrl, href, name, protocol }) => (
                    <tr
                      key={href}
                      className="border-b border-black/6 last:border-0">
                      <td className="text-hyperjump-black px-5 py-3 font-medium">
                        <Link href={href} className="hover:underline">
                          {name}
                        </Link>
                      </td>
                      <td className="text-hyperjump-gray px-5 py-3">
                        {protocol}
                      </td>
                      <td className="text-hyperjump-gray px-5 py-3 font-mono text-xs break-all">
                        {baseUrl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <SectionReveal>
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 md:p-8">
              <div className="mb-3 flex items-center gap-2.5">
                <ShieldAlertIcon
                  className="h-5 w-5 shrink-0 text-amber-600"
                  aria-hidden
                />
                <h2 className="text-hyperjump-black text-xl font-semibold">
                  {docsIndexSecurityHeading(lang)}
                </h2>
              </div>
              <p className="text-hyperjump-gray text-[15px] leading-relaxed">
                {docsIndexSecurityText(lang)}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="bg-[#F6F8F9] px-4 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionReveal>
            <h2 className="text-hyperjump-black mb-3 text-2xl font-semibold md:text-3xl">
              {docsIndexCtaHeading(lang)}
            </h2>
            <p className="text-hyperjump-gray mx-auto mb-8 max-w-xl text-base">
              {docsIndexCtaDesc(lang)}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-hyperjump-blue hover:bg-hyperjump-blue/90 h-12 rounded-full px-8 text-base font-semibold">
              <Link href={mailtoHref} data-testid="docs-cta">
                <MailIcon className="mr-2 h-4 w-4" aria-hidden />
                {docsIndexCta(lang)}
              </Link>
            </Button>
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
