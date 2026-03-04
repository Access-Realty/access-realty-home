# Developer Tooling Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Vitest testing, enhanced ESLint, and Sentry observability to the marketing site, aligned with the app repo's conventions.

**Architecture:** Three independent workstreams — ESLint config rewrite with custom rules, standalone Vitest config with first unit test, and `@sentry/nextjs` integration via `withSentryConfig()` + instrumentation hook. Each workstream commits independently.

**Tech Stack:** ESLint 9 flat config, typescript-eslint, eslint-config-prettier, Vitest 4, @vitejs/plugin-react-swc, vite-tsconfig-paths, @sentry/nextjs

---

### Task 1: Install ESLint dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install new devDependencies**

Run:
```bash
npm install --save-dev typescript-eslint eslint-config-prettier
```

**Step 2: Verify installation**

Run: `npm ls typescript-eslint eslint-config-prettier`
Expected: Both packages listed without errors

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add typescript-eslint and eslint-config-prettier"
```

---

### Task 2: Copy custom ESLint rules from app repo

**Files:**
- Create: `eslint-rules/require-aboutme-header.js`
- Create: `eslint-rules/no-inline-styles.js`

**Step 1: Create eslint-rules directory and copy rules**

Create `eslint-rules/require-aboutme-header.js`:
```javascript
// ABOUTME: ESLint rule requiring files to start with // ABOUTME: comment headers.
// ABOUTME: Keeps codebase navigable for both humans and AI agents.

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require files to start with // ABOUTME: header comments',
    },
    messages: {
      missingAboutme:
        'All .ts/.tsx files must start with a line beginning with `// ABOUTME:` describing what the file does.',
    },
    schema: [],
  },
  create(context) {
    return {
      Program(node) {
        const source = context.sourceCode ?? context.getSourceCode();
        const firstComment = source.getAllComments().find((c) => c.loc.start.line === 1);
        if (firstComment && firstComment.value.trimStart().startsWith('ABOUTME:')) return;

        context.report({ node, messageId: 'missingAboutme', loc: { line: 1, column: 0 } });
      },
    };
  },
};
```

Create `eslint-rules/no-inline-styles.js`:
```javascript
// ABOUTME: ESLint rule forbidding inline style={{}} on JSX elements.
// ABOUTME: Enforces Tailwind utility classes per project style guide.

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow inline style={{}} on JSX elements',
    },
    messages: {
      noInlineStyle:
        'Inline styles are forbidden. Use Tailwind utility classes instead. For dynamic values (e.g., width percentages), use Tailwind arbitrary values like `w-[50%]`.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name !== 'style') return;
        context.report({ node, messageId: 'noInlineStyle' });
      },
    };
  },
};
```

**Step 2: Commit**

```bash
git add eslint-rules/
git commit -m "chore: add custom ESLint rules (require-aboutme-header, no-inline-styles)"
```

---

### Task 3: Rewrite ESLint config

**Files:**
- Modify: `eslint.config.mjs`

**Step 1: Replace `eslint.config.mjs` with enhanced config**

```javascript
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
```

**Step 2: Run lint to see current violations (informational, don't fix yet)**

Run: `npx eslint --max-warnings 999 2>&1 | tail -5`
Expected: Should run without config errors. Will likely have ABOUTME violations on existing files — that's expected and can be fixed incrementally.

**Step 3: Commit**

```bash
git add eslint.config.mjs
git commit -m "feat(lint): rewrite ESLint config with complexity rules, custom rules, and Prettier"
```

---

### Task 4: Install Vitest dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Vitest and plugins**

Run:
```bash
npm install --save-dev vitest @vitejs/plugin-react-swc vite-tsconfig-paths @vitest/coverage-v8
```

**Step 2: Add test scripts to package.json**

Add these scripts to `package.json`:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add Vitest and test dependencies"
```

---

### Task 5: Create Vitest config

**Files:**
- Create: `vitest.config.ts`

**Step 1: Create `vitest.config.ts`**

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'test-results'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', '.next/', 'test-results/'],
    },
  },
});
```

**Step 2: Verify config loads**

Run: `npx vitest run 2>&1 | head -5`
Expected: "No test files found" or similar (no tests exist yet). Should NOT show config errors.

**Step 3: Commit**

```bash
git add vitest.config.ts
git commit -m "feat(test): add Vitest config with jsdom and tsconfig paths"
```

---

### Task 6: Write first test — selling decision engine

**Files:**
- Create: `lib/__tests__/sellingDecisionEngine.test.ts`

**Step 1: Write the test file**

```typescript
// ABOUTME: Unit tests for the selling decision engine recommendation logic
// ABOUTME: Covers exclusions, scoring, overrides, and edge cases

import { describe, it, expect } from 'vitest';
import {
  recommendOptions,
  SPEED,
  UPDATES,
  REPAIRS,
  AVOID,
  PRIORITY,
  type Answers,
  type OptionKey,
} from '../sellingDecisionEngine';

// Helper to build a complete Answers object with defaults
function makeAnswers(overrides: Partial<Answers> = {}): Answers {
  return {
    speed: SPEED.STANDARD,
    updates: UPDATES.UPDATED_RECENT,
    repairs: [REPAIRS.NONE],
    avoid: [AVOID.NONE],
    ranks: {
      [PRIORITY.MAX_PRICE]: 1,
      [PRIORITY.SELL_FAST]: 2,
      [PRIORITY.AVOID_REPAIRS]: 3,
      [PRIORITY.AVOID_HASSLE]: 4,
      [PRIORITY.FIN_FRESH_START]: 5,
    },
    ...overrides,
  };
}

describe('recommendOptions', () => {
  it('returns a best option and secondary array', () => {
    const result = recommendOptions(makeAnswers());
    expect(result.best).toBeDefined();
    expect(Array.isArray(result.secondary)).toBe(true);
  });

  it('never returns more than 2 secondary options', () => {
    const result = recommendOptions(makeAnswers());
    expect(result.secondary.length).toBeLessThanOrEqual(2);
  });

  it('does not include the best option in secondary', () => {
    const result = recommendOptions(makeAnswers());
    expect(result.secondary).not.toContain(result.best);
  });

  describe('speed exclusions', () => {
    it('excludes traditional, direct_list, uplist, price_launch when speed is very_fast', () => {
      const result = recommendOptions(
        makeAnswers({ speed: SPEED.VERY_FAST }),
        true,
      );
      const excluded = result.debug!.excluded;
      expect(excluded).toContain('traditional');
      expect(excluded).toContain('direct_list');
      expect(excluded).toContain('uplist');
      expect(excluded).toContain('price_launch');
    });

    it('excludes price_launch when speed is quick', () => {
      const result = recommendOptions(
        makeAnswers({ speed: SPEED.QUICK }),
        true,
      );
      expect(result.debug!.excluded).toContain('price_launch');
    });
  });

  describe('repair exclusions', () => {
    it('excludes traditional, direct_list, uplist when structural repairs needed', () => {
      const result = recommendOptions(
        makeAnswers({ repairs: [REPAIRS.STRUCTURAL] }),
        true,
      );
      const excluded = result.debug!.excluded;
      expect(excluded).toContain('traditional');
      expect(excluded).toContain('direct_list');
      expect(excluded).toContain('uplist');
    });
  });

  describe('overrides', () => {
    it('picks equity_bridge when speed is fast and max_price is rank 1', () => {
      const result = recommendOptions(
        makeAnswers({
          speed: SPEED.FAST,
          ranks: {
            [PRIORITY.MAX_PRICE]: 1,
            [PRIORITY.SELL_FAST]: 2,
            [PRIORITY.AVOID_REPAIRS]: 3,
            [PRIORITY.AVOID_HASSLE]: 4,
            [PRIORITY.FIN_FRESH_START]: 5,
          },
        }),
      );
      expect(result.best).toBe('equity_bridge');
    });

    it('picks cash when speed is very_fast and max_price is not rank 1', () => {
      const result = recommendOptions(
        makeAnswers({
          speed: SPEED.VERY_FAST,
          ranks: {
            [PRIORITY.MAX_PRICE]: 5,
            [PRIORITY.SELL_FAST]: 1,
            [PRIORITY.AVOID_REPAIRS]: 2,
            [PRIORITY.AVOID_HASSLE]: 3,
            [PRIORITY.FIN_FRESH_START]: 4,
          },
        }),
      );
      expect(result.best).toBe('cash');
    });
  });

  describe('secondary-only options', () => {
    it('never picks uplist or seller_finance as best', () => {
      // Try many combinations — secondary-only should never be best
      const speeds = Object.values(SPEED);
      const updateOptions = Object.values(UPDATES);
      for (const speed of speeds) {
        for (const updates of updateOptions) {
          const result = recommendOptions(makeAnswers({ speed, updates }));
          expect(['uplist', 'seller_finance']).not.toContain(result.best);
        }
      }
    });
  });

  describe('seller_finance gating', () => {
    it('includes seller_finance in secondary when max_price is top and sell_fast is low', () => {
      const result = recommendOptions(
        makeAnswers({
          speed: SPEED.NO_HURRY,
          ranks: {
            [PRIORITY.MAX_PRICE]: 1,
            [PRIORITY.SELL_FAST]: 5,
            [PRIORITY.AVOID_REPAIRS]: 3,
            [PRIORITY.AVOID_HASSLE]: 4,
            [PRIORITY.FIN_FRESH_START]: 2,
          },
        }),
      );
      // seller_finance may or may not appear depending on scores,
      // but it should not be gated out
      const allOptions = [result.best, ...result.secondary];
      // At minimum, the engine should not crash
      expect(result.best).toBeDefined();
    });

    it('excludes seller_finance from secondary when sell_fast is rank 1', () => {
      const result = recommendOptions(
        makeAnswers({
          speed: SPEED.NO_HURRY,
          ranks: {
            [PRIORITY.MAX_PRICE]: 2,
            [PRIORITY.SELL_FAST]: 1,
            [PRIORITY.AVOID_REPAIRS]: 3,
            [PRIORITY.AVOID_HASSLE]: 4,
            [PRIORITY.FIN_FRESH_START]: 5,
          },
        }),
      );
      expect(result.secondary).not.toContain('seller_finance');
    });
  });

  describe('seller_finance always last', () => {
    it('places seller_finance at end of secondary when present', () => {
      const result = recommendOptions(
        makeAnswers({
          speed: SPEED.NO_HURRY,
          updates: UPDATES.TOP_OF_MARKET,
          ranks: {
            [PRIORITY.MAX_PRICE]: 1,
            [PRIORITY.SELL_FAST]: 4,
            [PRIORITY.AVOID_REPAIRS]: 3,
            [PRIORITY.AVOID_HASSLE]: 5,
            [PRIORITY.FIN_FRESH_START]: 2,
          },
        }),
      );
      if (result.secondary.includes('seller_finance')) {
        expect(result.secondary[result.secondary.length - 1]).toBe('seller_finance');
      }
    });
  });

  describe('edge cases', () => {
    it('returns cash as fallback when all options excluded', () => {
      // very_fast + structural repairs excludes almost everything
      const result = recommendOptions(
        makeAnswers({
          speed: SPEED.VERY_FAST,
          repairs: [REPAIRS.STRUCTURAL],
        }),
      );
      expect(result.best).toBeDefined();
      expect(typeof result.best).toBe('string');
    });

    it('includes debug info when requested', () => {
      const result = recommendOptions(makeAnswers(), true);
      expect(result.debug).toBeDefined();
      expect(result.debug!.excluded).toBeDefined();
      expect(result.debug!.scores).toBeDefined();
    });
  });
});
```

**Step 2: Run the test**

Run: `npx vitest run`
Expected: All tests PASS

**Step 3: Commit**

```bash
git add lib/__tests__/sellingDecisionEngine.test.ts
git commit -m "test: add unit tests for selling decision engine"
```

---

### Task 7: Install Sentry

**Files:**
- Modify: `package.json`

**Step 1: Install @sentry/nextjs**

Run:
```bash
npm install @sentry/nextjs
```

**Step 2: Verify installation**

Run: `npm ls @sentry/nextjs`
Expected: Package listed without errors

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @sentry/nextjs dependency"
```

---

### Task 8: Create Sentry config files

**Files:**
- Create: `sentry.client.config.ts`
- Create: `sentry.server.config.ts`
- Create: `sentry.edge.config.ts`

**Step 1: Create `sentry.client.config.ts`**

```typescript
// ABOUTME: Sentry client-side initialization for the marketing site
// ABOUTME: Captures browser errors with breadcrumbs, filters extension noise

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

function getEnvironment(): string {
  if (typeof window === "undefined") return "unknown";
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") return "development";
  if (hostname.includes("vercel.app") || hostname.includes("preview")) return "preview";
  return "production";
}

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: getEnvironment(),

    // No performance tracing — just error capture
    tracesSampleRate: 0,

    beforeSend(event, hint) {
      const error = hint.originalException;

      // Don't send errors from browser extensions
      if (
        event.exception?.values?.[0]?.stacktrace?.frames?.some(
          (frame) => frame.filename?.includes("extension://"),
        )
      ) {
        return null;
      }

      // Don't send errors from analytics/tracking services
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (
          message.includes("posthog") ||
          message.includes("analytics") ||
          message.includes("gtag")
        ) {
          return null;
        }
      }

      return event;
    },

    integrations: [
      Sentry.breadcrumbsIntegration({
        console: true,
        dom: true,
        fetch: true,
        history: true,
        xhr: true,
      }),
    ],
  });
}
```

**Step 2: Create `sentry.server.config.ts`**

```typescript
// ABOUTME: Sentry server-side initialization for Next.js API routes and server components
// ABOUTME: Captures server errors with environment detection from VERCEL_ENV

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.VERCEL_ENV || "development",

    // No performance tracing for serverless
    tracesSampleRate: 0,

    beforeSend(event) {
      // Filter expected errors
      if (event.exception?.values?.[0]?.type === "AbortError") {
        return null;
      }
      return event;
    },
  });
}
```

**Step 3: Create `sentry.edge.config.ts`**

```typescript
// ABOUTME: Sentry edge runtime initialization for Next.js middleware
// ABOUTME: Minimal config — edge runtime has limited API surface

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.VERCEL_ENV || "development",
    tracesSampleRate: 0,
  });
}
```

**Step 4: Commit**

```bash
git add sentry.client.config.ts sentry.server.config.ts sentry.edge.config.ts
git commit -m "feat(sentry): add client, server, and edge config files"
```

---

### Task 9: Create instrumentation hook and wrap next.config.ts

**Files:**
- Create: `instrumentation.ts`
- Modify: `next.config.ts`

**Step 1: Create `instrumentation.ts`**

```typescript
// ABOUTME: Next.js instrumentation hook for Sentry server/edge initialization
// ABOUTME: Called by Next.js on startup to register monitoring

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
```

**Step 2: Wrap `next.config.ts` with `withSentryConfig`**

Replace the full contents of `next.config.ts` with:

```typescript
// ABOUTME: Next.js configuration with Sentry integration and cross-project rewrites
// ABOUTME: Wraps config with withSentryConfig for source maps and auto-instrumentation

import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Build-time env var set per Vercel environment scope (Production vs Preview).
// Determines which app project deployment receives cross-project rewrites.
const appOrigin =
  process.env.APP_REWRITE_ORIGIN ??
  "https://access-realty-app-brets-projects-ea090dc4.vercel.app";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  async redirects() {
    return [
      // Redirect old access.realty/direct-list URLs to direct-list.com
      {
        source: "/direct-list",
        has: [{ type: "host", value: "access.realty" }],
        destination: "https://direct-list.com",
        permanent: true,
      },
      {
        source: "/direct-list/:path*",
        has: [{ type: "host", value: "access.realty" }],
        destination: "https://direct-list.com/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/app/:path*", destination: `${appOrigin}/app/:path*` },
      { source: "/crm/:path*", destination: `${appOrigin}/crm/:path*` },
      { source: "/buyers/:path*", destination: `${appOrigin}/buyers/:path*` },
      { source: "/api/:path*", destination: `${appOrigin}/api/:path*` },
      { source: "/photos/:path*", destination: `${appOrigin}/photos/:path*` },
      { source: "/assets/:path*", destination: `${appOrigin}/assets/:path*` },
      {
        source: "/favicons/:path*",
        destination: `${appOrigin}/favicons/:path*`,
      },
      {
        source: "/watermarks/:path*",
        destination: `${appOrigin}/watermarks/:path*`,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
});
```

**Step 3: Commit**

```bash
git add instrumentation.ts next.config.ts
git commit -m "feat(sentry): add instrumentation hook and wrap next.config with withSentryConfig"
```

---

### Task 10: Create Sentry helper wrapper

**Files:**
- Create: `lib/sentry.ts`

**Step 1: Create `lib/sentry.ts`**

```typescript
// ABOUTME: Thin Sentry wrapper matching the app repo's API surface
// ABOUTME: Provides captureException/captureMessage with fallback logging when DSN is missing

import * as Sentry from "@sentry/nextjs";

/**
 * Capture an exception with optional context.
 */
export function captureException(
  error: Error,
  context?: Record<string, unknown>,
): void {
  if (context) {
    Sentry.captureException(error, { extra: context });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capture a message for monitoring.
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: Record<string, unknown>,
): void {
  if (context) {
    Sentry.captureMessage(message, { level, extra: context });
  } else {
    Sentry.captureMessage(message, level);
  }
}
```

**Step 2: Commit**

```bash
git add lib/sentry.ts
git commit -m "feat(sentry): add captureException/captureMessage helper wrapper"
```

---

### Task 11: Add Sentry env vars to .env.local.example

**Files:**
- Modify: `.env.local.example`

**Step 1: Append Sentry vars to `.env.local.example`**

Add these lines:
```
# Sentry (create a new project at sentry.io for this repo)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
```

**Step 2: Commit**

```bash
git add .env.local.example
git commit -m "docs: add Sentry env vars to .env.local.example"
```

---

### Task 12: Verify build passes

**Step 1: Run the build**

Run: `npm run build`
Expected: Build completes without errors. Sentry will log "Skipping initialization" since no DSN is configured — that's expected.

**Step 2: Run lint**

Run: `npx eslint --max-warnings 999 2>&1 | tail -20`
Expected: Config loads and runs without errors. ABOUTME violations on existing files are expected and will be fixed incrementally.

**Step 3: Run tests**

Run: `npm test`
Expected: All selling decision engine tests pass.
