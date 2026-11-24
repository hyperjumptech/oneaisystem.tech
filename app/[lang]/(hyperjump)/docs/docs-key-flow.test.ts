import { describe, expect, it } from "vitest";

import { supportedLanguages } from "@/locales/.generated/types";

import { DOCS_KEY_FLOW, getDocsKeyFlow } from "./docs-key-flow";
import { DOCS_HARNESS_SLUGS } from "./docs-registry";
import { getDocsGuide } from "./get-docs-guide";
import { getDocsIndex } from "./get-docs-index";

describe("getDocsKeyFlow", () => {
  it("describes the console flow in three steps", () => {
    expect(DOCS_KEY_FLOW).toHaveLength(3);
    expect(DOCS_KEY_FLOW.map((step) => step.id)).toEqual([
      "key-signin",
      "key",
      "key-save"
    ]);
  });

  it("localizes every step for every locale", () => {
    for (const lang of supportedLanguages) {
      for (const step of getDocsKeyFlow(lang)) {
        expect(step.title.length).toBeGreaterThan(0);
        expect(step.text.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps the hub quickstart and the guide steps on the same copy", () => {
    for (const lang of supportedLanguages) {
      const { quickstart } = getDocsIndex({ lang });

      for (const slug of DOCS_HARNESS_SLUGS) {
        const { keySteps } = getDocsGuide({ lang, slug })!;

        expect(keySteps.map((step) => step.title)).toEqual(
          quickstart.map((step) => step.title)
        );
        expect(keySteps.map((step) => step.text)).toEqual(
          quickstart.map((step) => step.text)
        );
      }
    }
  });
});
