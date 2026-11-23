import { ONEAI_CONSOLE_URL } from "../snippets";

/** Domain in locale copy that renders as a link to the OneAI console. */
const CONSOLE_DOMAIN = "app.avenu.hyperjump.tech";

type ConsoleLinkTextProps = {
  text: string;
  className?: string;
};

/**
 * Renders copy where a bare `app.avenu.hyperjump.tech` mention becomes a link
 * labelled OneAI that opens the console in a new tab.
 *
 * A mention already inside a URL (`https://app.avenu.hyperjump.tech/...`) is
 * left untouched, so endpoint copy keeps its literal address. Copy stays in
 * the locale files with the plain domain, so translations read naturally and
 * no markup leaks into JSON.
 */
export function ConsoleLinkText({ text, className }: ConsoleLinkTextProps) {
  const parts = text.split(CONSOLE_DOMAIN);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isLast = index === parts.length - 1;
        const insideUrl = /(?:https?:\/\/|\/\/)$/.test(part);

        return (
          <span key={index}>
            {part}
            {!isLast &&
              (insideUrl ? (
                CONSOLE_DOMAIN
              ) : (
                <a
                  href={ONEAI_CONSOLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-hyperjump-blue font-semibold hover:underline"
                  data-testid="docs-console-link">
                  OneAI
                </a>
              ))}
          </span>
        );
      })}
    </span>
  );
}
