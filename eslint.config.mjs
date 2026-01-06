import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import parser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

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
  },
  // {
  //   // Global configuration for all other TypeScript files
  //   files: ["**/*.ts", "**/*.tsx"],
  //   languageOptions: {
  //     parser,
  //     parserOptions: {
  //       projectService: true,
  //       tsconfigRootDir: import.meta.dirname,
  //     },
  //   },
  // },
  // Backend-specific configuration (NestJS)
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["backend/**/*.ts"],
  })),
  {
    files: ["backend/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },
  {
    files: ["mobile/**/*.ts", "mobile/**/*.tsx"],
    languageOptions: {
      parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        node: true,
      },
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Built-in imports (come from NodeJS)
            "external", // npm install packages
            "internal", // Imports from within the project
            "parent", // Imports from parent directory
            "sibling", // Imports from same directory
            "index", // Imports from index file
            "object", // Object imports
            "type", // Type imports
          ],
          pathGroups: [
            {
              pattern: "@lifter/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  }
);
