import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Phase 3 — Development Setup
 * - Serwist: PWA service worker (compiles app/sw.ts → public/sw.js)
 * - next-intl: i18n request config (en / ur / hi)
 * - allowedDevOrigins: allow Arena live-preview hosts in dev
 */
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Register SW in prod builds; dev uses HMR instead
  disable: process.env.NODE_ENV === "development",
});

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["*.e2b.app"],
};

export default withNextIntl(withSerwist(nextConfig));
