// ABOUTME: ESLint flat config for Next.js TypeScript marketing site
// ABOUTME: Extends recommended rules with React hooks, Prettier, and custom project rules

import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";
import requireAboutmeHeader from "./eslint-rules/require-aboutme-header.js";
import noInlineStyles from "./eslint-rules/no-inline-styles.js";

export default tseslint.config(
  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "reference/**",
      "**/*.config.js",
      "**/*.config.ts",
      "**/*.config.mjs",
      "eslint-rules/**",
      "test-results/**",
    ],
  },

  // Base JS recommended rules
  ...tseslint.configs.recommended,

  // React + Next.js configuration
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": hooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Next.js rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // React rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",

      // General rules
      "no-console": ["warn", { allow: ["warn"] }],
      "prefer-const": "error",
      "no-var": "error",

      // Cyclomatic complexity
      complexity: ["warn", { max: 20 }],
      "max-depth": ["warn", { max: 4 }],
      "max-lines-per-function": [
        "warn",
        { max: 200, skipBlankLines: true, skipComments: true },
      ],
      "max-nested-callbacks": ["warn", { max: 4 }],
      "max-params": ["warn", { max: 5 }],
    },
  },

  // Custom project rules - plugin registration
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "access-realty": {
        rules: {
          "require-aboutme-header": requireAboutmeHeader,
          "no-inline-styles": noInlineStyles,
        },
      },
    },
  },

  // ABOUTME header required on all TS/TSX files
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.d.ts"],
    rules: {
      "access-realty/require-aboutme-header": "error",
    },
  },

  // No inline styles in TSX files
  {
    files: ["**/*.tsx"],
    rules: {
      "access-realty/no-inline-styles": "warn",
    },
  },

  // File size limit
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "max-lines": ["warn", { max: 400, skipBlankLines: true, skipComments: true }],
    },
  },

  // Prettier compatibility (must be last)
  prettierConfig,
);
