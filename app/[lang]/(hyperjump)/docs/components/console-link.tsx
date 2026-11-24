import { ONEAI_CONSOLE_URL } from "../snippets";
import { CONSOLE_DOMAIN, splitConsoleTokens } from "./console-token";

type ConsoleLinkTextProps = {
  text: string;
  className?: string;
};

/**
 * Renders copy where a `{console}` token becomes a link to the OneAI console.
 *
 * The link text is the console host, so readers see which address they sign
 * in to and can spot a look-alike domain. Translations opt in explicitly by
 * writing the token, so a mistyped token leaves visible copy instead of
 * silently dropping the link.
 */
export function ConsoleLinkText({ text, className }: ConsoleLinkTextProps) {
  return (
    <span className={className}>
      {splitConsoleTokens(text).map((part, index) =>
        part.type === "text" ? (
          <span key={index}>{part.value}</span>
        ) : (
          <a
            key={index}
            href={ONEAI_CONSOLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-hyperjump-blue font-semibold hover:underline"
            data-testid="docs-console-link">
            {CONSOLE_DOMAIN}
          </a>
        )
      )}
    </span>
  );
}
