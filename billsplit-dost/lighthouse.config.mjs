/**
 * Phase 6 §4 — Lighthouse CI config (plan: installability, offline, <2s load).
 * Run: `npx lighthouse <url> --config-path=lighthouse.config.mjs` or via CI.
 */
const config = {
  ci: {
    collect: {
      url: ["http://localhost:3000/en"],
      numberOfRuns: 3,
      settings: {
        onlyCategories: ["performance", "pwa", "best-practices", "accessibility"],
        formFactor: "mobile",
        screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2 },
        throttling: { rttMs: 150, throughputKbps: 1638 },
      },
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "categories:performance": ["error", { minScore: 0.8 }],
        "categories:pwa": ["error", { minScore: 0.9 }], // plan: 90+ before TWA wrap
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "service-worker": "error",
        "installable-manifest": "error",
        "maskable-icon": "warn",
        "themed-omnibox": "warn",
        "first-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};

export default config;
