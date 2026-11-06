import { defineConfig, globalIgnores } from "eslint/config";
import nextConfig from "eslint-config-next";

const eslintConfig = defineConfig([
  ...nextConfig,
  {
    // New react-hooks v7 rules flag patterns animated-lines relies on
    // (refs read during render). Warn instead of error until that
    // component is refactored.
    rules: {
      "react-hooks/refs": "warn"
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
