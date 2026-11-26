import { describe, expect, it } from "vitest";

import { supportedLanguages } from "@/locales/.generated/types";

import {
  DOCS_HARNESSES,
  DOCS_HARNESS_SLUGS,
  getDocsHarness
} from "./docs-registry";
import {
  ONEAI_ANTHROPIC_BASE_URL,
  ONEAI_OPENAI_BASE_URL,
  VIRTUAL_KEY_PLACEHOLDER
} from "./snippets";

describe("DOCS_HARNESSES", () => {
  it("has unique slugs", () => {
    expect(new Set(DOCS_HARNESS_SLUGS).size).toBe(DOCS_HARNESSES.length);
  });

  it("exposes every harness slug through getDocsHarness", () => {
    for (const slug of DOCS_HARNESS_SLUGS) {
      expect(getDocsHarness(slug)?.slug).toBe(slug);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getDocsHarness("not-a-harness")).toBeUndefined();
  });

  it("returns undefined when the harness list is empty", () => {
    expect(getDocsHarness("claude-code", [])).toBeUndefined();
  });

  it("maps the protocol to the matching OneAI base URL", () => {
    for (const harness of DOCS_HARNESSES) {
      expect(harness.baseUrl).toBe(
        harness.protocol === "anthropic"
          ? ONEAI_ANTHROPIC_BASE_URL
          : ONEAI_OPENAI_BASE_URL
      );
    }
  });

  it("embeds the base URL in the config snippet", () => {
    for (const harness of DOCS_HARNESSES) {
      expect(harness.configSnippet).toContain(harness.baseUrl);
    }
  });

  it("stores the OpenCode key in the config file", () => {
    const opencode = DOCS_HARNESSES.find(
      (harness) => harness.slug === "opencode"
    );

    expect(opencode?.configSnippet).toContain(
      `"apiKey": "${VIRTUAL_KEY_PLACEHOLDER}"`
    );
    expect(opencode?.configSnippet).not.toContain("{env:");
    expect(opencode?.runSnippet).not.toContain("export");
  });

  it("uses the key placeholder only where the tool needs it in the file", () => {
    const claudeCode = DOCS_HARNESSES.find(
      (harness) => harness.slug === "claude-code"
    );

    expect(claudeCode?.configSnippet).toContain(VIRTUAL_KEY_PLACEHOLDER);
  });

  it("never contains markdown link syntax inside snippets", () => {
    for (const harness of DOCS_HARNESSES) {
      for (const snippet of [
        harness.installSnippet,
        harness.versionSnippet,
        harness.configSnippet,
        harness.runSnippet
      ]) {
        expect(snippet).not.toContain("](");
      }
    }
  });

  it("derives the version and run snippets from the CLI command", () => {
    for (const harness of DOCS_HARNESSES) {
      expect(harness.versionSnippet).toBe(`${harness.command} --version`);
      expect(harness.runSnippet).toContain(harness.command);
    }
  });

  it("has a localized name and summary in every locale", () => {
    for (const harness of DOCS_HARNESSES) {
      for (const lang of supportedLanguages) {
        expect(harness.getName(lang).length).toBeGreaterThan(0);
        expect(harness.getSummary(lang).length).toBeGreaterThan(0);
      }
    }
  });
});
