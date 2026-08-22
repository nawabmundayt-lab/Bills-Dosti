import { defineRouting } from "next-intl/routing";

/**
 * Phase 3 — Locales: English (default), Urdu (RTL), Hindi.
 * PK/IN markets per plan v2 Phase 3.2.
 */
export const routing = defineRouting({
  locales: ["en", "ur", "hi"],
  defaultLocale: "en",
});

export type AppLocale = (typeof routing.locales)[number];

export function isRtl(locale: string): boolean {
  return locale === "ur";
}
