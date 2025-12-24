// @ts-nocheck - This is necessary to disable the type errors for the eslint-plugin-drizzle package
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import drizzle from "eslint-plugin-drizzle";
import parser from "@typescript-eslint/parser";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  {
    ignores: [
      "**/node_modules",
      "**/dist",
      "**/build",
      "**/scripts",
      "**/coverage",
      "**/*.config.mjs",
      "**/*.config.ts",
      "**/*.config.js",
      /**
       * The backend module utilizes its own eslint config as
       * recommended by NestJS.
       */
      "backend/**",
    ],
  },
  {
    // Global configuration for all other TypeScript files
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Drizzle-specific rules only for db package
    files: ["packages/db/src/**/*.ts"],
    plugins: {
      drizzle,
    },
    rules: {
      ...drizzle.configs.all.rules,
    },
  }
);
