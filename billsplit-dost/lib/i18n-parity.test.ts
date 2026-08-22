import { describe, it, expect } from "vitest";
import en from "../messages/en.json";
import ur from "../messages/ur.json";
import hi from "../messages/hi.json";

/**
 * Phase 6 §6 — Localization QA (automated):
 * all three message catalogs must have identical key structure,
 * and interpolation params must match across locales.
 */

type Messages = Record<string, unknown>;

function flatten(obj: Messages, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" && v !== null
      ? flatten(v as Messages, `${prefix}${k}.`)
      : [`${prefix}${k}`]
  );
}

function getPath(obj: Messages, path: string): string {
  return path.split(".").reduce<unknown>((o, k) => (o as Messages)[k], obj) as string;
}

const catalogs: Record<string, Messages> = { en, ur, hi };

describe("message catalogs", () => {
  it("en, ur, hi have identical key sets", () => {
    const keys = Object.fromEntries(
      Object.entries(catalogs).map(([lang, cat]) => [lang, flatten(cat).sort()])
    );
    expect(keys.ur).toEqual(keys.en);
    expect(keys.hi).toEqual(keys.en);
  });

  it("catalogs are non-trivial", () => {
    expect(flatten(catalogs.en).length).toBeGreaterThan(20);
    expect(flatten(catalogs.ur).length).toBeGreaterThan(20);
    expect(flatten(catalogs.hi).length).toBeGreaterThan(20);
  });

  it("interpolation params are consistent across locales", () => {
    const extract = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    for (const key of flatten(catalogs.en)) {
      const enVal = getPath(catalogs.en, key);
      const urVal = getPath(catalogs.ur, key);
      const hiVal = getPath(catalogs.hi, key);
      expect(extract(urVal), `ur param mismatch at ${key}`).toEqual(extract(enVal));
      expect(extract(hiVal), `hi param mismatch at ${key}`).toEqual(extract(enVal));
    }
  });

  it("Urdu values are actually Urdu script", () => {
    const urduish = flatten(catalogs.ur).filter(
      (key) => !key.includes("category") // category ids are shared tokens
    );
    const latin = urduish.filter((key) => !/[\u0600-\u06FF]/.test(getPath(catalogs.ur, key)));
    expect(latin).toEqual([]);
  });
});
