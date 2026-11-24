import { describe, expect, it } from "vitest";

import {
  CONSOLE_DOMAIN,
  CONSOLE_TOKEN,
  splitConsoleTokens
} from "./console-token";

describe("splitConsoleTokens", () => {
  it("keeps copy without a token as a single text part", () => {
    expect(splitConsoleTokens("Sign in at the console.")).toEqual([
      { type: "text", value: "Sign in at the console." }
    ]);
  });

  it("splits copy around a console token", () => {
    expect(splitConsoleTokens(`Sign in at ${CONSOLE_TOKEN}.`)).toEqual([
      { type: "text", value: "Sign in at " },
      { type: "console" },
      { type: "text", value: "." }
    ]);
  });

  it("keeps several tokens in reading order", () => {
    expect(splitConsoleTokens(`${CONSOLE_TOKEN} and ${CONSOLE_TOKEN}`)).toEqual(
      [
        { type: "console" },
        { type: "text", value: " and " },
        { type: "console" }
      ]
    );
  });

  it("drops the text around a lone token", () => {
    expect(splitConsoleTokens(CONSOLE_TOKEN)).toEqual([{ type: "console" }]);
  });

  it("leaves an endpoint URL untouched", () => {
    const url = "https://app.avenu.hyperjump.tech/v1";
    expect(splitConsoleTokens(`Requests go to ${url}.`)).toEqual([
      { type: "text", value: `Requests go to ${url}.` }
    ]);
  });

  it("derives the link text from the console URL", () => {
    expect(CONSOLE_DOMAIN).toBe("app.avenu.hyperjump.tech");
  });
});
