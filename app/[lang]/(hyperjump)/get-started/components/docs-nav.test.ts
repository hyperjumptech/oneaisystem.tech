import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { supportedLanguages } from "@/locales/.generated/types";
import {
  docsCommonNextGuide,
  docsCommonPreviousGuide
} from "@/locales/.generated/strings";

import { DOCS_HARNESSES } from "../docs-registry";
import { DocsNav, getDocsNavNeighbours } from "./docs-nav";

/**
 * Collects the /get-started/<slug> targets of a rendered nav, ignoring the
 * "all guides" link back to the hub.
 */
function getGuideTargets(html: string): string[] {
  return [...html.matchAll(/href="\/[^"]*\/get-started\/([^"]+)"/g)].map(
    (match) => match[1]
  );
}

/** Strips tags so only the visible text remains. */
function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ");
}

function renderNav(slug: string, lang: "en" | "id" = "en"): string {
  const current = DOCS_HARNESSES.find((harness) => harness.slug === slug)!;

  return renderToStaticMarkup(
    createElement(DocsNav, {
      lang,
      current,
      backLabel: "All guides",
      previousLabel: docsCommonPreviousGuide(lang),
      nextLabel: docsCommonNextGuide(lang)
    })
  );
}

describe("getDocsNavNeighbours", () => {
  it("never points at the current harness", () => {
    for (const harness of DOCS_HARNESSES) {
      const { previous, next } = getDocsNavNeighbours(harness);

      expect(previous?.slug).not.toBe(harness.slug);
      expect(next?.slug).not.toBe(harness.slug);
    }
  });

  it("never resolves previous and next to the same harness", () => {
    for (const harness of DOCS_HARNESSES) {
      const { previous, next } = getDocsNavNeighbours(harness);

      if (previous && next) {
        expect(previous.slug).not.toBe(next.slug);
      }
    }
  });

  it("has no previous on the first harness and no next on the last", () => {
    const first = DOCS_HARNESSES[0];
    const last = DOCS_HARNESSES[DOCS_HARNESSES.length - 1];

    expect(getDocsNavNeighbours(first).previous).toBeUndefined();
    expect(getDocsNavNeighbours(last).next).toBeUndefined();
  });

  it("returns no neighbours for an unknown harness", () => {
    const { previous, next } = getDocsNavNeighbours({
      ...DOCS_HARNESSES[0],
      slug: "not-a-harness" as never
    });

    expect(previous).toBeUndefined();
    expect(next).toBeUndefined();
  });
});

describe("DocsNav", () => {
  it("never links to the current page", () => {
    for (const harness of DOCS_HARNESSES) {
      const html = renderNav(harness.slug);

      expect(getGuideTargets(html)).not.toContain(harness.slug);
    }
  });

  it("never repeats a target", () => {
    for (const harness of DOCS_HARNESSES) {
      const targets = getGuideTargets(renderNav(harness.slug));

      expect(new Set(targets).size).toBe(targets.length);
    }
  });

  it("renders at most one card per neighbour", () => {
    for (const harness of DOCS_HARNESSES) {
      const targets = getGuideTargets(renderNav(harness.slug));

      expect(targets.length).toBeLessThanOrEqual(2);
    }
  });

  it("keeps the next guide right-aligned with an empty left cell", () => {
    const first = DOCS_HARNESSES[0];
    const html = renderNav(first.slug);

    expect(html).toContain('data-testid="docs-nav-spacer"');
    expect(html).toContain(`data-testid="docs-nav-next-`);
    expect(html).not.toContain("docs-nav-previous-");
  });

  it("renders the previous guide without a spacer on the last harness", () => {
    const last = DOCS_HARNESSES[DOCS_HARNESSES.length - 1];
    const html = renderNav(last.slug);

    expect(html).toContain("docs-nav-previous-");
    expect(html).not.toContain('data-testid="docs-nav-spacer"');
  });

  it("labels the cards with the localized previous and next copy", () => {
    for (const lang of supportedLanguages) {
      for (const harness of DOCS_HARNESSES) {
        const html = renderNav(harness.slug, lang);
        const { previous, next } = getDocsNavNeighbours(harness);

        if (previous) {
          expect(html).toContain(docsCommonPreviousGuide(lang));
        } else {
          expect(html).not.toContain(docsCommonPreviousGuide(lang));
        }

        if (next) {
          expect(html).toContain(docsCommonNextGuide(lang));
        } else {
          expect(html).not.toContain(docsCommonNextGuide(lang));
        }
      }
    }
  });

  it("does not show a raw slug above the guide name", () => {
    for (const lang of supportedLanguages) {
      for (const harness of DOCS_HARNESSES) {
        const text = stripTags(renderNav(harness.slug, lang));

        for (const target of getGuideTargets(renderNav(harness.slug, lang))) {
          expect(text).not.toContain(target);
        }
      }
    }
  });

  it("localizes the guide names in every locale", () => {
    for (const lang of supportedLanguages) {
      for (const harness of DOCS_HARNESSES) {
        const html = renderNav(harness.slug, lang);

        for (const target of getGuideTargets(html)) {
          const targetHarness = DOCS_HARNESSES.find(
            (candidate) => candidate.slug === target
          )!;

          expect(html).toContain(targetHarness.getName(lang));
        }
      }
    }
  });
});
