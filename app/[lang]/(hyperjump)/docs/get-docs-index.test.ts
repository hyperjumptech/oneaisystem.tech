import { describe, expect, it } from "vitest";

import { supportedLanguages } from "@/locales/.generated/types";

import { DOCS_HARNESSES, DOCS_HARNESS_SLUGS } from "./docs-registry";
import { getDocsIndex } from "./get-docs-index";

describe("getDocsIndex", () => {
  it("returns one card and one endpoint row per harness", () => {
    const { cards, endpoints } = getDocsIndex({ lang: "en" });

    expect(cards).toHaveLength(DOCS_HARNESSES.length);
    expect(endpoints).toHaveLength(DOCS_HARNESSES.length);
  });

  it("links each card to its locale-scoped guide", () => {
    const { cards } = getDocsIndex({ lang: "id" });

    for (const card of cards) {
      expect(card.href).toBe(`/id/docs/${card.slug}`);
    }
  });

  it("labels the protocol for each endpoint row", () => {
    const { endpoints } = getDocsIndex({ lang: "en" });
    const protocols = endpoints.map((row) => row.protocol);

    expect(protocols).toContain("Anthropic Messages API");
    expect(protocols).toContain("OpenAI-compatible");
  });

  it("labels the protocol on each card too", () => {
    const { cards } = getDocsIndex({ lang: "en" });
    const protocols = cards.map((card) => card.protocol);

    expect(protocols).toContain("Anthropic Messages API");
    expect(protocols).toContain("OpenAI-compatible");
  });

  it("returns localized quickstart steps", () => {
    const { quickstart } = getDocsIndex({ lang: "en" });

    expect(quickstart).toHaveLength(3);
    expect(quickstart[0].title).toBe("Open the OneAI console");
  });

  it("covers every harness slug", () => {
    const { cards } = getDocsIndex({ lang: "en" });

    expect(cards.map((card) => card.slug).sort()).toEqual(
      [...DOCS_HARNESS_SLUGS].sort()
    );
  });

  it("returns an empty hub when no harnesses are provided", () => {
    const { cards, endpoints } = getDocsIndex({ lang: "en", harnesses: [] });

    expect(cards).toEqual([]);
    expect(endpoints).toEqual([]);
  });

  it("localizes every locale without empty copy", () => {
    for (const lang of supportedLanguages) {
      const { cards, quickstart } = getDocsIndex({ lang });

      for (const card of cards) {
        expect(card.name.length).toBeGreaterThan(0);
        expect(card.summary.length).toBeGreaterThan(0);
      }
      for (const step of quickstart) {
        expect(step.title.length).toBeGreaterThan(0);
        expect(step.text.length).toBeGreaterThan(0);
      }
    }
  });
});
