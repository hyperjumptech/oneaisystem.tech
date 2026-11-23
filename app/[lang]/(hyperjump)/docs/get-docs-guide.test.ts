import { describe, expect, it } from "vitest";

import { supportedLanguages } from "@/locales/.generated/types";

import { DOCS_HARNESS_SLUGS, getDocsHarness } from "./docs-registry";
import { DOCS_GUIDE_COPY, getDocsGuide } from "./get-docs-guide";
import { ONEAI_ANTHROPIC_BASE_URL, ONEAI_OPENAI_BASE_URL } from "./snippets";

describe("getDocsGuide", () => {
  it("builds three steps for every harness in every locale", () => {
    for (const slug of DOCS_HARNESS_SLUGS) {
      for (const lang of supportedLanguages) {
        const guide = getDocsGuide({ lang, slug });

        expect(guide).toBeDefined();
        expect(guide?.steps).toHaveLength(3);
        for (const step of guide!.steps) {
          expect(step.title.length).toBeGreaterThan(0);
          expect(step.text.length).toBeGreaterThan(0);
          expect(step.code?.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("explains virtual key creation for every harness and locale", () => {
    for (const slug of DOCS_HARNESS_SLUGS) {
      for (const lang of supportedLanguages) {
        const keyStep = getDocsGuide({ lang, slug })?.keyStep;

        expect(keyStep?.title.length).toBeGreaterThan(0);
        expect(keyStep?.text).toContain("Virtual Keys");
        expect(keyStep?.text).toContain("Create New Virtual Key");
        expect(keyStep?.note?.length).toBeGreaterThan(0);
      }
    }
  });

  it("returns the Anthropic endpoint for Claude Code", () => {
    const guide = getDocsGuide({ lang: "en", slug: "claude-code" });

    expect(guide?.harness.protocol).toBe("anthropic");
    expect(guide?.steps[1].code).toContain(ONEAI_ANTHROPIC_BASE_URL);
    expect(guide?.steps[1].code).toContain("ANTHROPIC_AUTH_TOKEN");
  });

  it("returns the OpenAI-compatible endpoint for OpenCode", () => {
    const guide = getDocsGuide({ lang: "en", slug: "opencode" });

    expect(guide?.harness.protocol).toBe("openai-compatible");
    expect(guide?.steps[1].code).toContain(ONEAI_OPENAI_BASE_URL);
    expect(guide?.steps[1].code).toContain("@ai-sdk/openai-compatible");
  });

  it("exposes config fields for each harness", () => {
    const claudeCode = getDocsGuide({ lang: "en", slug: "claude-code" });
    const opencode = getDocsGuide({ lang: "en", slug: "opencode" });

    expect(claudeCode?.fields.map((field) => field.name)).toEqual([
      "ANTHROPIC_AUTH_TOKEN",
      "ANTHROPIC_BASE_URL",
      "ANTHROPIC_MODEL",
      "ANTHROPIC_DEFAULT_SONNET_MODEL",
      "ANTHROPIC_DEFAULT_HAIKU_MODEL"
    ]);
    expect(opencode?.fields.map((field) => field.name)).toContain(
      "options.baseURL"
    );
  });

  it("adds a model ID explainer only for Claude Code", () => {
    expect(
      getDocsGuide({ lang: "en", slug: "claude-code" })?.extra?.title.length
    ).toBeGreaterThan(0);
    expect(
      getDocsGuide({ lang: "en", slug: "opencode" })?.extra
    ).toBeUndefined();
  });

  it("translates the guide for the Indonesian locale", () => {
    const en = getDocsGuide({ lang: "en", slug: "opencode" });
    const id = getDocsGuide({ lang: "id", slug: "opencode" });

    expect(id?.prerequisitesLabel).toBe("Prasyarat");
    expect(id?.steps[0].title).not.toBe(en?.steps[0].title);
    expect(id?.labels.copy).toBe("Salin");
  });

  it("returns undefined for an unknown slug", () => {
    expect(
      getDocsGuide({ lang: "en", slug: "unknown" as never })
    ).toBeUndefined();
  });

  it("uses injected copy when provided", () => {
    const harness = getDocsHarness("claude-code")!;
    const copy = {
      ...DOCS_GUIDE_COPY["claude-code"],
      installTitle: () => "Injected install"
    };

    const guide = getDocsGuide({
      lang: "en",
      slug: "claude-code",
      harness,
      copy
    });

    expect(guide?.steps[0].title).toBe("Injected install");
  });
});
