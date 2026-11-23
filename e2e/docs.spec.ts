import { test, expect } from "@playwright/test";

import {
  DOCS_HARNESSES,
  DOCS_HARNESS_SLUGS
} from "@/app/[lang]/(hyperjump)/docs/docs-registry";
import {
  docsCommonCopied,
  docsIndexHeading
} from "@/locales/.generated/strings";
import { oneaiNavDocs } from "@/locales/.generated/server";
import { supportedLanguages } from "@/locales/.generated/types";

import {
  BASE_URL,
  footerTest,
  gotoAndWait,
  headerTest,
  metaTest,
  waitForHydration
} from "./shared-test";

for (const locale of supportedLanguages) {
  test.describe(`OneAI Docs - ${locale.toUpperCase()}`, () => {
    test.describe("Docs hub", () => {
      test.beforeEach(async ({ page }) => {
        await gotoAndWait(page, `${BASE_URL}/${locale}/docs`);
      });

      test.describe("Header", headerTest(locale));
      test.describe("Footer", footerTest());
      test.describe("Meta title and description should exist", metaTest());

      test("renders the localized hub heading", async ({ page }) => {
        await expect(page.locator("h1")).toHaveText(docsIndexHeading(locale));
      });

      test("links every harness card to its guide", async ({ page }) => {
        for (const { slug } of DOCS_HARNESSES) {
          const card = page.getByTestId(`docs-harness-card-${slug}`);
          await expect(card).toBeVisible();
          await expect(card).toHaveAttribute("href", `/${locale}/docs/${slug}`);
        }
      });

      test("shows the Anthropic and OpenAI-compatible endpoints", async ({
        page
      }) => {
        const table = page.locator("table").first();
        await expect(
          table.getByText("https://app.avenu.hyperjump.tech/anthropic")
        ).toBeVisible();
        await expect(
          table.getByText("https://app.avenu.hyperjump.tech/v1")
        ).toBeVisible();
      });

      test("links the console domain to the OneAI app", async ({ page }) => {
        const link = page.getByTestId("docs-console-link").first();
        await expect(link).toBeVisible();
        await expect(link).toHaveText("OneAI");
        await expect(link).toHaveAttribute(
          "href",
          "https://app.avenu.hyperjump.tech/"
        );
        await expect(page.getByText("at app.avenu.hyperjump.tech")).toHaveCount(
          0
        );
      });

      test("nav exposes the docs entry", async ({ page }) => {
        const header = page.locator("header, nav").first();
        await expect(
          header.locator(`a[href='/${locale}/docs']`).first()
        ).toBeVisible();
        await expect(
          header.getByText(oneaiNavDocs(locale), { exact: true }).first()
        ).toBeVisible();
      });

      test("does not scroll the page horizontally on mobile", async ({
        page
      }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth
        );
        expect(overflow).toBeLessThanOrEqual(1);
      });
    });

    for (const slug of DOCS_HARNESS_SLUGS) {
      const harness = DOCS_HARNESSES.find((item) => item.slug === slug)!;
      const name = harness.getName(locale);

      test.describe(`Docs guide: ${name}`, () => {
        test.beforeEach(async ({ page }) => {
          await gotoAndWait(page, `${BASE_URL}/${locale}/docs/${slug}`);
        });

        test("renders the harness name as the page heading", async ({
          page
        }) => {
          await expect(page.locator("h1")).toHaveText(name);
        });

        test("shows the key step and three numbered setup steps", async ({
          page
        }) => {
          await expect(page.getByTestId("docs-step")).toHaveCount(4);
          await expect(
            page.getByTestId("docs-step").getByTestId("docs-code-block")
          ).toHaveCount(3);
          await expect(page.getByTestId("docs-code-block")).toHaveCount(4);
        });

        test("explains how to create the virtual key", async ({ page }) => {
          const keyStep = page.getByTestId("docs-step").first();
          const text = await keyStep.innerText();

          expect(text).toContain("Virtual Keys");
          expect(text).toContain("Create New Virtual Key");
        });

        test("install snippet is a working command, not markdown", async ({
          page
        }) => {
          const installBlock = page.getByTestId("docs-code-block").first();
          const text = await installBlock.locator("code").innerText();

          expect(text).toContain("curl -fsSL");
          expect(text).toContain(harness.installSnippet.split(" ")[2]);
          expect(text).not.toContain("](");
        });

        test("config snippet points at the matching OneAI endpoint", async ({
          page
        }) => {
          const configBlock = page.getByTestId("docs-code-block").nth(1);
          const text = await configBlock.locator("code").innerText();

          expect(text).toContain(harness.baseUrl);
          expect(text).not.toContain("](");
        });

        test("copy button copies the snippet to the clipboard", async ({
          page
        }) => {
          await waitForHydration(page);

          await page.evaluate(() => {
            const store = { text: "" };
            (
              window as unknown as { __clipboardStore: typeof store }
            ).__clipboardStore = store;
            Object.defineProperty(navigator, "clipboard", {
              configurable: true,
              value: {
                writeText: async (text: string) => {
                  store.text = text;
                },
                readText: async () => store.text
              }
            });
          });

          const configBlock = page.getByTestId("docs-code-block").nth(1);
          await configBlock.getByTestId("docs-copy-button").click();

          const clipboard = await page.evaluate(
            () =>
              (window as unknown as { __clipboardStore: { text: string } })
                .__clipboardStore.text
          );
          expect(clipboard).toContain(harness.baseUrl);
          await expect(
            configBlock.getByText(docsCommonCopied(locale))
          ).toBeVisible();
        });

        test("keeps the locale when switching language", async ({ page }) => {
          const footer = page.getByRole("contentinfo");
          const select = footer.getByRole("combobox");
          const changed = locale === "en" ? "id" : "en";

          await waitForHydration(page);
          await select.selectOption(changed);
          await page.waitForURL(new RegExp(`/${changed}/docs/${slug}$`));
        });

        test("does not scroll the page horizontally on mobile", async ({
          page
        }) => {
          await page.setViewportSize({ width: 390, height: 844 });
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - window.innerWidth
          );
          expect(overflow).toBeLessThanOrEqual(1);
        });

        test("returns to the docs hub", async ({ page }) => {
          await page.locator(`a[href='/${locale}/docs']`).first().click();
          await page.waitForURL(new RegExp(`/${locale}/docs$`));
        });
      });
    }
  });
}
