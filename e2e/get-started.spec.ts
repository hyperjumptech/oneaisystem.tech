import { test, expect } from "@playwright/test";

import {
  DOCS_HARNESSES,
  DOCS_HARNESS_SLUGS
} from "@/app/[lang]/(hyperjump)/get-started/docs-registry";
import {
  ONEAI_ANTHROPIC_BASE_URL,
  ONEAI_CONSOLE_URL,
  ONEAI_OPENAI_BASE_URL
} from "@/app/[lang]/(hyperjump)/get-started/snippets";
import {
  docsCommonCopied,
  docsCommonCopy,
  docsCommonCopyFailed,
  docsCommonKeyFlow0Text,
  docsIndexConsoleCta,
  docsIndexHeading,
  docsIndexTocLabel,
  docsMailtoBody,
  docsMailtoSubject
} from "@/locales/.generated/strings";
import { oneaiNavGetStarted } from "@/locales/.generated/server";
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
  test.describe(`OneAI Get Started - ${locale.toUpperCase()}`, () => {
    test.describe("Get Started hub", () => {
      test.beforeEach(async ({ page }) => {
        await gotoAndWait(page, `${BASE_URL}/${locale}/get-started`);
      });

      test.describe("Header", headerTest(locale));
      test.describe("Footer", footerTest());
      test.describe("Meta title and description should exist", metaTest());

      test("renders the localized hub heading", async ({ page }) => {
        await expect(page.locator("h1")).toHaveText(docsIndexHeading(locale));
      });

      test("nav uses the static scrolled design without transitions", async ({
        page
      }) => {
        const header = page.locator("header").first();

        await expect(header).toHaveClass(/bg-white/);
        await expect(header).not.toHaveClass(/transition/);
        await expect(header.locator('img[src*="logo-on-light"]')).toBeVisible();
      });

      test("links every harness card to its guide", async ({ page }) => {
        for (const { slug } of DOCS_HARNESSES) {
          const card = page.getByTestId(`docs-harness-card-${slug}`);
          await expect(card).toBeVisible();
          await expect(card).toHaveAttribute(
            "href",
            `/${locale}/get-started/${slug}`
          );
        }
      });

      test("shows the Anthropic and OpenAI-compatible endpoints", async ({
        page
      }) => {
        const table = page.locator("table").first();

        for (const harness of DOCS_HARNESSES) {
          const row = table.getByRole("row").filter({
            has: page.locator(
              `a[href='/${locale}/get-started/${harness.slug}']`
            )
          });

          await expect(row).toContainText(harness.baseUrl);
        }

        const countFor = (baseUrl: string) =>
          DOCS_HARNESSES.filter((harness) => harness.baseUrl === baseUrl)
            .length;

        await expect(
          table.getByRole("row").filter({ hasText: ONEAI_ANTHROPIC_BASE_URL })
        ).toHaveCount(countFor(ONEAI_ANTHROPIC_BASE_URL));
        await expect(
          table.getByRole("row").filter({ hasText: ONEAI_OPENAI_BASE_URL })
        ).toHaveCount(countFor(ONEAI_OPENAI_BASE_URL));
      });

      test("names the console as the OneAI dashboard without a domain link", async ({
        page
      }) => {
        await expect(page.locator("article")).toContainText(
          docsCommonKeyFlow0Text(locale)
        );
        await expect(
          page.getByRole("link", { name: /app\.avenu\.hyperjump\.tech/ })
        ).toHaveCount(0);
      });

      test("offers an explicit console CTA under the quickstart", async ({
        page
      }) => {
        const cta = page.getByTestId("docs-console-cta");
        await expect(cta).toHaveText(docsIndexConsoleCta(locale));
        await expect(cta).toHaveAttribute("href", ONEAI_CONSOLE_URL);
      });

      test("mailto CTA uses the dedicated subject and body", async ({
        page
      }) => {
        const href = await page.getByTestId("docs-cta").getAttribute("href");

        expect(href).toContain(encodeURIComponent(docsMailtoSubject(locale)));
        expect(href).toContain(encodeURIComponent(docsMailtoBody(locale)));
      });

      test("nav exposes the get-started entry", async ({ page }) => {
        const header = page.locator("header, nav").first();
        await expect(
          header.locator(`a[href='/${locale}/get-started']`).first()
        ).toBeVisible();
        await expect(
          header.getByText(oneaiNavGetStarted(locale), { exact: true }).first()
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

      test.describe(`Get Started guide: ${name}`, () => {
        test.beforeEach(async ({ page }) => {
          await gotoAndWait(page, `${BASE_URL}/${locale}/get-started/${slug}`);
        });

        test("renders the harness name as the page heading", async ({
          page
        }) => {
          await expect(page.locator("h1")).toHaveText(name);
        });

        test("nav uses the static scrolled design without transitions", async ({
          page
        }) => {
          const header = page.locator("header").first();

          await expect(header).toHaveClass(/bg-white/);
          await expect(header).not.toHaveClass(/transition/);
          await expect(
            header.locator('img[src*="logo-on-light"]')
          ).toBeVisible();
        });

        test("uses the same sidebar and on-this-page shell as the hub", async ({
          page
        }) => {
          const sidebar = page
            .getByRole("navigation", { name: oneaiNavGetStarted(locale) })
            .first();

          await expect(
            sidebar.locator(`a[href='/${locale}/get-started/${slug}']`)
          ).toHaveAttribute("aria-current", "page");
          await expect(
            page.getByRole("navigation", { name: docsIndexTocLabel(locale) })
          ).toBeVisible();
        });

        test("shows the key flow and three numbered setup steps", async ({
          page
        }) => {
          await expect(page.getByTestId("docs-step")).toHaveCount(6);
          await expect(
            page.getByTestId("docs-step").getByTestId("docs-code-block")
          ).toHaveCount(5);
          await expect(page.getByTestId("docs-code-block")).toHaveCount(5);
        });

        test("field table stays readable on mobile", async ({ page }) => {
          await page.setViewportSize({ width: 390, height: 844 });
          const table = page.getByTestId("docs-fields");
          const overflow = await table.evaluate(
            (el) => el.scrollWidth - el.clientWidth
          );

          expect(overflow).toBeLessThanOrEqual(1);
        });

        test("explains how to create the virtual key", async ({ page }) => {
          const keyStep = page.locator('[data-step-id="key"]');
          const text = await keyStep.innerText();

          expect(text).toContain("Virtual Keys");
          expect(text).toContain("Create New Virtual Key");
        });

        test("install snippet is a working command, not markdown", async ({
          page
        }) => {
          const installBlock = page.locator('[data-code-id="install"]');
          const text = await installBlock.locator("code").innerText();

          expect(text.trim()).toBe(harness.installSnippet);
          expect(text).not.toContain("](");
        });

        test("install step shows how to check the version", async ({
          page
        }) => {
          const versionBlock = page.locator('[data-code-id="version"]');
          const text = await versionBlock.locator("code").innerText();

          expect(text.trim()).toBe(harness.versionSnippet);
        });

        test("shows the test prompt inside the verify step", async ({
          page
        }) => {
          const verifyStep = page.locator('[data-step-id="verify"]');
          const promptBlock = page.locator('[data-code-id="prompt"]');
          const text = await promptBlock.locator("code").innerText();

          expect(text.length).toBeGreaterThan(0);
          await expect(verifyStep).toContainText("LLM Logs");
        });

        test("config snippet points at the matching OneAI endpoint", async ({
          page
        }) => {
          const configBlock = page.locator('[data-code-id="config"]');
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

          const configBlock = page.locator('[data-code-id="config"]');
          await configBlock.getByTestId("docs-copy-button").click();

          const clipboard = await page.evaluate(
            () =>
              (window as unknown as { __clipboardStore: { text: string } })
                .__clipboardStore.text
          );
          expect(clipboard).toContain(harness.baseUrl);
          await expect(configBlock.getByTestId("docs-copy-button")).toHaveText(
            docsCommonCopied(locale)
          );
        });

        test("copy button names the block it copies", async ({ page }) => {
          const configBlock = page.locator('[data-code-id="config"]');
          const button = configBlock.getByTestId("docs-copy-button");

          await expect(button).toHaveAttribute(
            "aria-label",
            `${docsCommonCopy(locale)} ${harness.configPath}`
          );
        });

        test("copy button reports a failure", async ({ page }) => {
          await waitForHydration(page);

          await page.evaluate(() => {
            Object.defineProperty(navigator, "clipboard", {
              configurable: true,
              value: {
                writeText: async () => {
                  throw new Error("clipboard blocked");
                }
              }
            });
          });

          const configBlock = page.locator('[data-code-id="config"]');
          await configBlock.getByTestId("docs-copy-button").click();

          await expect(configBlock.getByTestId("docs-copy-button")).toHaveText(
            docsCommonCopyFailed(locale)
          );
        });

        test("keeps the locale when switching language", async ({ page }) => {
          const footer = page.getByRole("contentinfo");
          const select = footer.getByRole("combobox");
          const changed = locale === "en" ? "id" : "en";

          await waitForHydration(page);
          await select.selectOption(changed);
          await page.waitForURL(new RegExp(`/${changed}/get-started/${slug}$`));
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

        test("returns to the get-started hub", async ({ page }) => {
          await page.getByTestId("docs-nav-back").click();
          await page.waitForURL(new RegExp(`/${locale}/get-started$`));
        });
      });
    }
  });
}
