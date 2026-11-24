import { describe, expect, it } from "vitest";

import { supportedLanguages } from "@/locales/.generated/types";

import { DOCS_HARNESS_SLUGS, getDocsHarness } from "./docs-registry";
import { DOCS_GUIDE_COPY, getDocsGuide } from "./get-docs-guide";
import {
  ONEAI_ANTHROPIC_BASE_URL,
  ONEAI_DEEPSEEK_FLASH_MODEL,
  ONEAI_DEEPSEEK_PRO_MODEL,
  ONEAI_OPENAI_BASE_URL,
  OPENCODE_PROVIDER_ID,
  VIRTUAL_KEY_PLACEHOLDER
} from "./snippets";

/** Code of the config block in step two, the one holding the settings file. */
function configCode(slug: "claude-code" | "opencode"): string {
  const step = getDocsGuide({ lang: "en", slug })?.steps[1];

  return step?.codes[0].code ?? "";
}

describe("getDocsGuide", () => {
  it("gives every step and code block a unique stable id", () => {
    for (const slug of DOCS_HARNESS_SLUGS) {
      const guide = getDocsGuide({ lang: "en", slug });
      const stepIds = [...guide!.keySteps, ...guide!.steps].map(
        (step) => step.id
      );
      const blockIds = guide!.steps.flatMap((step) =>
        step.codes.map((block) => block.id)
      );

      expect(new Set(stepIds).size).toBe(stepIds.length);
      expect(new Set(blockIds).size).toBe(blockIds.length);
    }
  });

  it("builds three steps for every harness in every locale", () => {
    for (const slug of DOCS_HARNESS_SLUGS) {
      for (const lang of supportedLanguages) {
        const guide = getDocsGuide({ lang, slug });

        expect(guide).toBeDefined();
        expect(guide?.steps).toHaveLength(3);
        for (const step of guide!.steps) {
          expect(step.title.length).toBeGreaterThan(0);
          expect(step.text.length).toBeGreaterThan(0);
          expect(step.codes.length).toBeGreaterThan(0);
          for (const block of step.codes) {
            expect(block.code.length).toBeGreaterThan(0);
            expect(block.label.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("explains virtual key creation for every harness and locale", () => {
    for (const slug of DOCS_HARNESS_SLUGS) {
      for (const lang of supportedLanguages) {
        const keySteps = getDocsGuide({ lang, slug })?.keySteps ?? [];
        const create = keySteps.find((step) => step.id === "key");

        expect(keySteps).toHaveLength(3);
        expect(create?.title.length).toBeGreaterThan(0);
        expect(create?.text).toContain("Virtual Keys");
        expect(create?.text).toContain("Create New Virtual Key");
        expect(keySteps.at(-1)?.note?.length).toBeGreaterThan(0);
      }
    }
  });

  it("shows the version check in the install step", () => {
    for (const slug of DOCS_HARNESS_SLUGS) {
      const harness = getDocsHarness(slug)!;
      const install = getDocsGuide({ lang: "en", slug })?.steps[0];

      expect(install?.codes[0].code).toBe(harness.installSnippet);
      expect(install?.codes[1].code).toBe(harness.versionSnippet);
    }
  });

  it("returns the Anthropic endpoint for Claude Code", () => {
    const guide = getDocsGuide({ lang: "en", slug: "claude-code" });

    expect(guide?.harness.protocol).toBe("anthropic");
    expect(configCode("claude-code")).toContain(ONEAI_ANTHROPIC_BASE_URL);
    expect(configCode("claude-code")).toContain("ANTHROPIC_AUTH_TOKEN");
  });

  it("returns the OpenAI-compatible endpoint for OpenCode", () => {
    const guide = getDocsGuide({ lang: "en", slug: "opencode" });

    expect(guide?.harness.protocol).toBe("openai-compatible");
    expect(configCode("opencode")).toContain(ONEAI_OPENAI_BASE_URL);
    expect(configCode("opencode")).toContain(
      "@opencode/ai/providers/openai-compatible"
    );
  });

  it("labels the config block with the harness file syntax", () => {
    for (const slug of DOCS_HARNESS_SLUGS) {
      const harness = getDocsHarness(slug)!;
      const config = getDocsGuide({ lang: "en", slug })?.steps[1].codes[0];

      expect(config?.language).toBe(harness.configLanguage);
      expect(config?.label).toBe(harness.configPath);
    }
  });

  it("exposes config fields for each harness", () => {
    const claudeCode = getDocsGuide({ lang: "en", slug: "claude-code" });
    const opencode = getDocsGuide({ lang: "en", slug: "opencode" });

    expect(claudeCode?.fields.map((field) => field.name)).toEqual([
      "ANTHROPIC_AUTH_TOKEN",
      "ANTHROPIC_BASE_URL",
      "ANTHROPIC_MODEL",
      "ANTHROPIC_DEFAULT_OPUS_MODEL",
      "ANTHROPIC_DEFAULT_SONNET_MODEL",
      "ANTHROPIC_DEFAULT_HAIKU_MODEL"
    ]);
    expect(opencode?.fields.map((field) => field.name)).toEqual([
      "package",
      "name",
      "settings.baseURL",
      "settings.apiKey",
      "models",
      "model"
    ]);
  });

  it("heads each field table with a label that matches its contents", () => {
    expect(getDocsGuide({ lang: "en", slug: "claude-code" })?.fieldsLabel).toBe(
      "Environment variables"
    );
    expect(getDocsGuide({ lang: "en", slug: "opencode" })?.fieldsLabel).toBe(
      "Config fields"
    );
  });

  it("labels the field table columns for every locale", () => {
    expect(
      getDocsGuide({ lang: "en", slug: "claude-code" })?.fieldColumns
    ).toEqual({ name: "Setting", description: "Description" });
    expect(
      getDocsGuide({ lang: "id", slug: "opencode" })?.fieldColumns
    ).toEqual({
      name: "Pengaturan",
      description: "Keterangan"
    });
  });

  it("points every Claude Code tier at a model the key allows", () => {
    const code = configCode("claude-code");

    expect(code).toContain(`"ANTHROPIC_MODEL": "${ONEAI_DEEPSEEK_PRO_MODEL}"`);
    expect(code).toContain(
      `"ANTHROPIC_DEFAULT_OPUS_MODEL": "${ONEAI_DEEPSEEK_PRO_MODEL}"`
    );
    expect(code).toContain(
      `"ANTHROPIC_DEFAULT_SONNET_MODEL": "${ONEAI_DEEPSEEK_PRO_MODEL}"`
    );
    expect(code).toContain(
      `"ANTHROPIC_DEFAULT_HAIKU_MODEL": "${ONEAI_DEEPSEEK_FLASH_MODEL}"`
    );
  });

  it("uses the OpenCode v2 provider shape", () => {
    const code = configCode("opencode");

    expect(code).toContain('"providers"');
    expect(code).not.toContain('"provider"');
    expect(code).not.toContain('"npm"');
    expect(code).not.toContain('"options"');
    expect(code).toContain(`"model": "${OPENCODE_PROVIDER_ID}/`);
    expect(code).toContain(`"${OPENCODE_PROVIDER_ID}": {`);
    expect(code).toContain('"name": "OneAI"');
  });

  it("stores the OpenCode API key in the config file", () => {
    const code = configCode("opencode");

    expect(code).toContain(`"apiKey": "${VIRTUAL_KEY_PLACEHOLDER}"`);
    expect(code).not.toContain("{env:");
  });

  it("verifies routing from OneAI logs instead of the model's self-report", () => {
    for (const slug of DOCS_HARNESS_SLUGS) {
      for (const lang of supportedLanguages) {
        const guide = getDocsGuide({ lang, slug });
        const verify = guide?.steps[2];

        expect(verify?.codes[1].code.length).toBeGreaterThan(0);
        expect(verify?.codes[1].language).toBe("text");
        expect(verify?.footer).toContain("LLM Logs");
        expect(verify?.footer).not.toMatch(/which model (it|are) you/i);
      }
    }
  });

  it("keeps the prompt in the step that asks for it", () => {
    for (const slug of DOCS_HARNESS_SLUGS) {
      const verify = getDocsGuide({ lang: "en", slug })?.steps[2];

      expect(verify?.codes.map((block) => block.label)).toEqual([
        "run",
        "prompt"
      ]);
      expect(verify?.text).toMatch(/prompt/i);
    }
  });

  it("translates the verify prompt for the Indonesian locale", () => {
    const en = getDocsGuide({ lang: "en", slug: "claude-code" })?.steps[2];
    const id = getDocsGuide({ lang: "id", slug: "claude-code" })?.steps[2];

    expect(id?.codes[1].code).not.toBe(en?.codes[1].code);
    expect(id?.footer).not.toBe(en?.footer);
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
