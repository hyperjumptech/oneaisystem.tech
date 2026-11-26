import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { oneaiNavGetStarted } from "@/locales/.generated/server";
import {
  docsIndexSidebarCodingAgents,
  docsIndexSidebarOverview
} from "@/locales/.generated/strings";
import type { SupportedLanguage } from "@/locales/.generated/types";

import { DOCS_HARNESSES, type DocsHarnessSlug } from "../docs-registry";

type DocsSidebarProps = {
  lang: SupportedLanguage;
  /** Slug of the guide being viewed; omit on the overview page. */
  current?: DocsHarnessSlug;
  className?: string;
};

/**
 * Documentation sidebar: the overview page plus one link per harness guide.
 *
 * The overview is current when no slug is given; on a guide page the active
 * harness is highlighted instead.
 */
export function DocsSidebar({ lang, current, className }: DocsSidebarProps) {
  const overviewCurrent = !current;

  return (
    <nav
      aria-label={oneaiNavGetStarted(lang)}
      className={cn("text-sm", className)}>
      <Link
        href={`/${lang}/get-started`}
        aria-current={overviewCurrent ? "page" : undefined}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 font-medium transition-colors",
          overviewCurrent
            ? "text-hyperjump-black bg-black/[0.04]"
            : "text-hyperjump-gray hover:text-hyperjump-black hover:bg-black/[0.03]"
        )}>
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            overviewCurrent ? "bg-hyperjump-blue" : "bg-black/20"
          )}
          aria-hidden
        />
        {docsIndexSidebarOverview(lang)}
      </Link>

      <div className="mt-7">
        <p className="text-hyperjump-muted mb-2 px-3 text-[11px] font-bold tracking-[0.12em] uppercase">
          {docsIndexSidebarCodingAgents(lang)}
        </p>
        <ul className="space-y-0.5">
          {DOCS_HARNESSES.map((harness) => {
            const isCurrent = current === harness.slug;

            return (
              <li key={harness.slug}>
                <Link
                  href={`/${lang}/get-started/${harness.slug}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "group flex items-center justify-between gap-2 rounded-lg px-3 py-2 transition-colors",
                    isCurrent
                      ? "text-hyperjump-black bg-black/[0.04] font-medium"
                      : "text-hyperjump-gray hover:text-hyperjump-black hover:bg-black/[0.03]"
                  )}>
                  {harness.getName(lang)}
                  <ChevronRightIcon
                    className={cn(
                      "h-3.5 w-3.5 transition-colors",
                      isCurrent
                        ? "text-hyperjump-blue"
                        : "text-hyperjump-muted group-hover:text-hyperjump-blue"
                    )}
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
