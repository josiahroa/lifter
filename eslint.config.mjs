import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

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
    ],
  }
);
