/**
 * Copy-paste code shown on the OneAI docs pages.
 *
 * Snippets are intentionally untranslated: commands, file paths, and
 * environment variable names must stay byte-identical across locales.
 */

/** Syntax hint for a code block, matching the file it came from. */
export type DocsCodeLanguage = "bash" | "json" | "jsonc" | "text";

export const ONEAI_CONSOLE_URL = "https://app.avenu.hyperjump.tech/";
export const ONEAI_ANTHROPIC_BASE_URL =
  "https://app.avenu.hyperjump.tech/anthropic";
export const ONEAI_OPENAI_BASE_URL = "https://app.avenu.hyperjump.tech/v1";

/** Placeholder the reader replaces with the key they copied from OneAI. */
export const VIRTUAL_KEY_PLACEHOLDER = "YOUR_VIRTUAL_KEY";

/**
 * Model that does the main work: the session model plus the opus and sonnet
 * aliases. Point it at a model your virtual key allows.
 */
export const ONEAI_DEEPSEEK_PRO_MODEL = "default/deepseek/deepseek-v4-pro";

/**
 * Cheaper model for the haiku tier, which Claude Code uses for background
 * work such as conversation titles and summaries.
 */
export const ONEAI_DEEPSEEK_FLASH_MODEL =
  "default/deepseek/deepseek-v4.1-flash";

export const CLAUDE_CODE_INSTALL_SNIPPET = `curl -fsSL https://claude.ai/install.sh | bash`;

/** CLI binary Claude Code installs and the reader runs. */
export const CLAUDE_CODE_COMMAND = "claude";

export const CLAUDE_CODE_CONFIG_PATH = "~/.claude/settings.json";

/**
 * Claude Code resolves four model names: the session model, then the opus,
 * sonnet, and haiku aliases behind /model and the opusplan mode. Every one of
 * them has to be a model the virtual key allows, otherwise the request fails
 * with a model-not-allowed error.
 */
export const CLAUDE_CODE_SETTINGS_SNIPPET = `{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "${VIRTUAL_KEY_PLACEHOLDER}",
    "ANTHROPIC_BASE_URL": "${ONEAI_ANTHROPIC_BASE_URL}",
    "ANTHROPIC_MODEL": "${ONEAI_DEEPSEEK_PRO_MODEL}",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "${ONEAI_DEEPSEEK_PRO_MODEL}",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "${ONEAI_DEEPSEEK_PRO_MODEL}",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "${ONEAI_DEEPSEEK_FLASH_MODEL}"
  }
}`;

export const OPENCODE_INSTALL_SNIPPET = `curl -fsSL https://opencode.ai/v2/install | bash`;

/** CLI binary OpenCode installs and the reader runs. */
export const OPENCODE_COMMAND = "opencode";

export const OPENCODE_CONFIG_PATH = "~/.config/opencode/opencode.jsonc";

/** OpenCode v2 provider key. It becomes the prefix of every model ID. */
export const OPENCODE_PROVIDER_ID = "oneai";

/**
 * OpenCode v2 configuration. The `provider` key is deprecated in v2: custom
 * providers live under `providers`, the runtime adapter is named by
 * `package`, and provider options live in `settings`. The virtual key is
 * stored in the config file, so the file must stay out of version control.
 */
export const OPENCODE_CONFIG_SNIPPET = `{
  "$schema": "https://opencode.ai/config.json",
  "model": "${OPENCODE_PROVIDER_ID}/${ONEAI_DEEPSEEK_FLASH_MODEL}",
  "providers": {
    "${OPENCODE_PROVIDER_ID}": {
      "name": "OneAI",
      "package": "@opencode/ai/providers/openai-compatible",
      "settings": {
        "baseURL": "${ONEAI_OPENAI_BASE_URL}",
        "apiKey": "${VIRTUAL_KEY_PLACEHOLDER}"
      },
      "models": {
        "${ONEAI_DEEPSEEK_FLASH_MODEL}": {
          "name": "DeepSeek V4.1 Flash"
        }
      }
    }
  }
}`;

/** Shell snippet that opens the agent in the current project directory. */
export function getRunSnippet(command: string): string {
  return `cd /path/to/your/project\n${command}`;
}

/** Shell snippet that prints the installed version of a CLI. */
export function getVersionSnippet(command: string): string {
  return `${command} --version`;
}
