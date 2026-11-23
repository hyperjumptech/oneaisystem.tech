/**
 * Copy-paste code shown on the OneAI docs pages.
 *
 * Snippets are intentionally untranslated: commands, file paths, and
 * environment variable names must stay byte-identical across locales.
 */
export const ONEAI_CONSOLE_URL = "https://app.avenu.hyperjump.tech/";
export const ONEAI_ANTHROPIC_BASE_URL =
  "https://app.avenu.hyperjump.tech/anthropic";
export const ONEAI_OPENAI_BASE_URL = "https://app.avenu.hyperjump.tech/v1";

/** Placeholder the reader replaces with the key they copied from OneAI. */
export const VIRTUAL_KEY_PLACEHOLDER = "YOUR_VIRTUAL_KEY";

export const CLAUDE_CODE_INSTALL_SNIPPET = `curl -fsSL https://claude.ai/install.sh | bash`;

export const CLAUDE_CODE_VERSION_SNIPPET = `claude --version`;

export const CLAUDE_CODE_CONFIG_PATH = "~/.claude/settings.json";

export const CLAUDE_CODE_SETTINGS_SNIPPET = `{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "${VIRTUAL_KEY_PLACEHOLDER}",
    "ANTHROPIC_BASE_URL": "${ONEAI_ANTHROPIC_BASE_URL}",
    "ANTHROPIC_MODEL": "openrouter/deepseek/deepseek-v4.1-flash",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "openrouter/deepseek/deepseek-v4-pro",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "openrouter/deepseek/deepseek-v4.1-flash"
  }
}`;

export const OPENCODE_INSTALL_SNIPPET = `curl -fsSL https://opencode.ai/v2/install | bash`;

export const OPENCODE_VERSION_SNIPPET = `opencode --version`;

export const OPENCODE_CONFIG_PATH = "~/.config/opencode/opencode.jsonc";

export const OPENCODE_CONFIG_SNIPPET = `{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "OneAI": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "OneAI",
      "options": {
        "baseURL": "${ONEAI_OPENAI_BASE_URL}",
        "apiKey": "${VIRTUAL_KEY_PLACEHOLDER}"
      },
      "models": {
        "openrouter/deepseek/deepseek-v4.1-flash": {
          "name": "DeepSeek: DeepSeek V4.1 Flash"
        }
      }
    }
  }
}`;

export const VERIFY_PROMPT_SNIPPET = `Hello, what model are you running on?`;

/** Shell snippet that opens the agent in the current project directory. */
export function getRunSnippet(command: string): string {
  return `cd /path/to/your/project\n${command}`;
}
