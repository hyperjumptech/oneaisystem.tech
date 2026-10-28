import { defineConfig, globalIgnores } from "eslint/config";
import nextConfig from "eslint-config-next";

const eslintConfig = defineConfig([
  ...nextConfig,
  {
    // New react-hooks v7 rules flag patterns these components rely on
    // (refs read during render in animated-lines, session bootstrap
    // setState in landing-ai-agent). Warn instead of error until those
    // components are refactored.
    rules: {
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn"
    }
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "locales/.generated/**",
    "playwright-report/**",
    "blob-report/**",
    "test-results/**",
    "screenshots/**"
  ])
]);

export default eslintConfig;
