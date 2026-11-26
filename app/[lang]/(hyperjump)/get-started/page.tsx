import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, MailIcon, ShieldAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import data from "@/data.json";
import { dynamicOpengraph } from "@/lib/default-metadata";
import { oneaiNavGetStarted } from "@/locales/.generated/server";
import {
  docsIndexConsoleCta,
  docsIndexCta,
  docsIndexCtaDesc,
  docsIndexCtaHeading,
  docsIndexEndpointsColumnsBaseUrl,
  docsIndexEndpointsColumnsHarness,
  docsIndexEndpointsColumnsProtocol,
  docsIndexEndpointsDesc,
  docsIndexEndpointsHeading,
  docsIndexEyebrow,
  docsIndexHarnessesHeading,
  docsIndexHeading,
  docsIndexLede,
  docsIndexQuickstartHeading,
  docsIndexQuickstartLabel,
  docsIndexSecurityHeading,
  docsIndexSecurityText,
  docsIndexTocCodingAgents,
  docsIndexTocEndpoints,
  docsIndexTocLabel,
  docsIndexTocSecurity,
  docsIndexTocSupport,
  docsIndexTocVirtualKey,
  docsMailtoBody,
  docsMailtoSubject,
  docsMetaDescription,
  docsMetaTitle
} from "@/locales/.generated/strings";
import {
  supportedLanguages,
  type SupportedLanguage
} from "@/locales/.generated/types";

import {
  buildOneaiMailto,
  ONEAI_CONTACT_EMAIL
} from "../oneai/build-oneai-mailto";
import { DocsShell } from "./components/docs-shell";
import { type DocsTocItem } from "./components/docs-toc";
import { getDocsIndex } from "./get-docs-index";
import { ONEAI_CONSOLE_URL } from "./snippets";

const { siteUrl } = data;
const OG_IMAGE = `${siteUrl}/images/oneai/og.png`;

type DocsPageProps = { params: Promise<{ lang: SupportedLanguage }> };

export const generateStaticParams = async () =>
  supportedLanguages.map((lang) => ({ lang }));

/**
 * Builds canonical and alternate metadata for the get-started hub.
 */
export async function generateMetadata({
  params
}: DocsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const pageUrl = `${siteUrl}/${lang}/get-started`;
  const title = docsMetaTitle(lang);
  const description = docsMetaDescription(lang);

  return dynamicOpengraph({
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: supportedLanguages.reduce(
        (acc, locale) => {
          acc[locale] = `${siteUrl}/${locale}/get-started`;
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
 * Get-started hub: create a virtual key, then pick a coding harness.
 *
 * Rendered with a documentation shell: a sticky sidebar of guides, the
 * article, and an "on this page" table of contents on wide screens.
 */
export default async function GetStartedPage({ params }: DocsPageProps) {
  const { lang } = await params;
  const { cards, endpoints, quickstart } = getDocsIndex({ lang });
  const mailtoHref = buildOneaiMailto({
    subject: docsMailtoSubject(lang),
    body: docsMailtoBody(lang)
  });

  const tocItems: DocsTocItem[] = [
    { id: "virtual-key", label: docsIndexTocVirtualKey(lang) },
    { id: "coding-agents", label: docsIndexTocCodingAgents(lang) },
    { id: "endpoints", label: docsIndexTocEndpoints(lang) },
    { id: "security", label: docsIndexTocSecurity(lang) },
    { id: "support", label: docsIndexTocSupport(lang) }
  ];

  return (
    <DocsShell
      lang={lang}
      sidebarEyebrow={docsIndexEyebrow(lang)}
      tocLabel={docsIndexTocLabel(lang)}
      tocItems={tocItems}>
      <header className="mb-12">
        <nav
          aria-label="Breadcrumb"
          className="text-hyperjump-muted mb-5 flex items-center gap-2 text-xs">
          <span>{docsIndexEyebrow(lang)}</span>
          <span aria-hidden>/</span>
          <span className="text-hyperjump-black font-medium">
            {oneaiNavGetStarted(lang)}
          </span>
        </nav>
        <h1 className="text-hyperjump-black mb-4 text-4xl leading-[1.1] font-semibold tracking-tight md:text-5xl">
          {docsIndexHeading(lang)}
        </h1>
        <p className="text-hyperjump-gray text-lg leading-relaxed">
          {docsIndexLede(lang)}
        </p>
      </header>

      <section
        id="virtual-key"
        className="scroll-mt-24 border-t border-black/8 py-10">
        <p className="text-hyperjump-blue mb-2 text-xs font-bold tracking-[0.16em] uppercase">
          {docsIndexQuickstartLabel(lang)}
        </p>
        <h2 className="text-hyperjump-black mb-6 text-2xl font-semibold tracking-tight">
          {docsIndexQuickstartHeading(lang)}
        </h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {quickstart.map(({ text, title }, index) => (
            <li
              key={title}
              className="rounded-xl border border-black/8 bg-white p-5">
              <span className="bg-hyperjump-blue mb-4 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="text-hyperjump-black mb-2 text-sm font-semibold">
                {title}
              </h3>
              <p className="text-hyperjump-gray text-[13px] leading-relaxed">
                {text}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-5">
          <a
            href={ONEAI_CONSOLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="docs-console-cta"
            className="text-hyperjump-blue inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
            {docsIndexConsoleCta(lang)}
            <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden />
          </a>
        </p>
      </section>

      <section
        id="coding-agents"
        className="scroll-mt-24 border-t border-black/8 py-10">
        <h2 className="text-hyperjump-black mb-6 text-2xl font-semibold tracking-tight">
          {docsIndexHarnessesHeading(lang)}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map(({ href, name, protocol, summary, slug }) => (
            <Link
              key={slug}
              href={href}
              data-testid={`docs-harness-card-${slug}`}
              className="group hover:border-hyperjump-blue/40 flex h-full flex-col rounded-xl border border-black/8 p-5 transition-colors hover:bg-black/[0.02]">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-hyperjump-black text-base font-semibold">
                  {name}
                </h3>
                <ArrowRightIcon
                  className="text-hyperjump-muted group-hover:text-hyperjump-blue h-4 w-4 transition-colors"
                  aria-hidden
                />
              </div>
              <p className="text-hyperjump-gray mb-4 text-sm leading-relaxed">
                {summary}
              </p>
              <span className="text-hyperjump-muted font-geist-mono mt-auto text-xs">
                {protocol}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="endpoints"
        className="scroll-mt-24 border-t border-black/8 py-10">
        <h2 className="text-hyperjump-black mb-3 text-2xl font-semibold tracking-tight">
          {docsIndexEndpointsHeading(lang)}
        </h2>
        <p className="text-hyperjump-gray mb-6 text-sm leading-relaxed">
          {docsIndexEndpointsDesc(lang)}
        </p>
        <div className="overflow-x-auto rounded-xl border border-black/8">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F6F8F9]">
              <tr className="border-b border-black/8">
                <th className="text-hyperjump-muted px-4 py-3 text-xs font-bold tracking-[0.1em] uppercase">
                  {docsIndexEndpointsColumnsHarness(lang)}
                </th>
                <th className="text-hyperjump-muted px-4 py-3 text-xs font-bold tracking-[0.1em] uppercase">
                  {docsIndexEndpointsColumnsProtocol(lang)}
                </th>
                <th className="text-hyperjump-muted px-4 py-3 text-xs font-bold tracking-[0.1em] uppercase">
                  {docsIndexEndpointsColumnsBaseUrl(lang)}
                </th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map(({ baseUrl, href, name, protocol }) => (
                <tr
                  key={href}
                  className="border-b border-black/6 last:border-0">
                  <td className="text-hyperjump-black px-4 py-3 font-medium">
                    <Link href={href} className="hover:underline">
                      {name}
                    </Link>
                  </td>
                  <td className="text-hyperjump-gray px-4 py-3">{protocol}</td>
                  <td className="text-hyperjump-gray font-geist-mono px-4 py-3 text-xs break-all">
                    {baseUrl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        id="security"
        className="scroll-mt-24 border-t border-black/8 py-10">
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5">
          <div className="mb-2 flex items-center gap-2.5">
            <ShieldAlertIcon
              className="h-5 w-5 shrink-0 text-amber-600"
              aria-hidden
            />
            <h2 className="text-hyperjump-black text-base font-semibold">
              {docsIndexSecurityHeading(lang)}
            </h2>
          </div>
          <p className="text-hyperjump-gray text-sm leading-relaxed">
            {docsIndexSecurityText(lang)}
          </p>
        </div>
      </section>

      <section
        id="support"
        className="scroll-mt-24 border-t border-black/8 py-10">
        <div className="rounded-xl border border-black/8 bg-[#F6F8F9] p-6">
          <h2 className="text-hyperjump-black mb-2 text-lg font-semibold">
            {docsIndexCtaHeading(lang)}
          </h2>
          <p className="text-hyperjump-gray mb-5 text-sm leading-relaxed">
            {docsIndexCtaDesc(lang)}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-hyperjump-blue hover:bg-hyperjump-blue/90 h-11 rounded-full px-6 text-sm font-semibold">
            <a href={mailtoHref} data-testid="docs-cta">
              <MailIcon className="mr-2 h-4 w-4" aria-hidden />
              {docsIndexCta(lang, { email: ONEAI_CONTACT_EMAIL })}
            </a>
          </Button>
        </div>
      </section>
    </DocsShell>
  );
}
