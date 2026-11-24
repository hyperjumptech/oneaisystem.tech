import { ONEAI_CONSOLE_URL } from "../snippets";

/**
 * Token translators put in copy where the console should be a link.
 *
 * The copy keeps the address visible to readers: the token renders as the
 * console host, linked to the console. Copy that mentions an endpoint URL
 * (`https://app.avenu.hyperjump.tech/v1`) stays literal, because that string
 * is the value the reader has to type.
 */
export const CONSOLE_TOKEN = "{console}";

/** Host shown as the link text, derived from the console URL. */
export const CONSOLE_DOMAIN = new URL(ONEAI_CONSOLE_URL).host;

export type ConsoleTokenPart =
  | { type: "text"; value: string }
  | { type: "console" };

/**
 * Splits copy into plain text and console tokens.
 *
 * @param text - Localized copy that may contain `{console}` tokens
 * @returns Parts in reading order, without empty text parts
 */
export function splitConsoleTokens(text: string): ConsoleTokenPart[] {
  const chunks = text.split(CONSOLE_TOKEN);
  const parts: ConsoleTokenPart[] = [];

  chunks.forEach((chunk, index) => {
    if (chunk) {
      parts.push({ type: "text", value: chunk });
    }
    if (index < chunks.length - 1) {
      parts.push({ type: "console" });
    }
  });

  return parts;
}
