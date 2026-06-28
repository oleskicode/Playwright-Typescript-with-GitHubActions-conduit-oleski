import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  // type-aware rules — this is what gives you no-floating-promises
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Playwright-specific rules, scoped to your test files
  {
    files: ["**/*.spec.ts", "**/tests/**/*.ts", "**/e2e/**/*.ts"],
    ...playwright.configs["flat/recommended"],
  },
]);
