import type { ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";

import { oneaiNavGetStarted } from "@/locales/.generated/server";
import type { SupportedLanguage } from "@/locales/.generated/types";

import type { DocsHarnessSlug } from "../docs-registry";
import { DocsSidebar } from "./docs-sidebar";
import { DocsToc, type DocsTocItem } from "./docs-toc";

type DocsShellProps = {
  lang: SupportedLanguage;
  /** Active guide slug; omit on the overview page. */
  current?: DocsHarnessSlug;
  sidebarEyebrow: string;
  tocLabel: string;
  tocItems: DocsTocItem[];
  children: ReactNode;
};

/**
 * Shared documentation layout: a collapsible guide list on small screens,
 * a sticky sidebar on wide screens, the article, and an "on this page" TOC.
 *
 * The hub and every guide render through this shell so they keep the same
 * spacing, borders, and navigation behaviour.
 */
export function DocsShell({
  lang,
  current,
  sidebarEyebrow,
  tocLabel,
  tocItems,
  children
}: DocsShellProps) {
  return (
    <main className="bg-white">
      <div className="border-b border-black/8 px-4 py-3 md:px-8 lg:hidden">
        <details className="group">
          <summary className="text-hyperjump-black flex cursor-pointer list-none items-center justify-between rounded-lg text-sm font-semibold [&::-webkit-details-marker]:hidden">
            {oneaiNavGetStarted(lang)}
            <ChevronDownIcon
              className="text-hyperjump-muted h-4 w-4 transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <DocsSidebar
            lang={lang}
            current={current}
            className="mt-3 border-t border-black/6 pt-4"
          />
        </details>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside className="hidden w-60 shrink-0 border-r border-black/8 px-6 py-12 md:py-16 lg:block">
          <div className="sticky top-24">
            <p className="text-hyperjump-muted mb-4 text-[11px] font-bold tracking-[0.14em] uppercase">
              {sidebarEyebrow}
            </p>
            <DocsSidebar lang={lang} current={current} />
          </div>
        </aside>

        <article className="mx-auto max-w-3xl min-w-0 flex-1 px-4 pt-12 pb-12 md:px-8 md:pt-24 md:pb-16">
          {children}
        </article>

        <aside className="hidden w-56 shrink-0 px-6 py-12 md:py-16 xl:block">
          <DocsToc
            label={tocLabel}
            items={tocItems}
            className="sticky top-24"
          />
        </aside>
      </div>
    </main>
  );
}
