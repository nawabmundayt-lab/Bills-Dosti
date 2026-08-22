#!/usr/bin/env node
/**
 * Phase 6 — HTTP smoke test (no browser needed; runs anywhere).
 * Usage: node scripts/smoke.mjs [baseUrl]   (default http://localhost:3000)
 */
const base = process.argv[2] ?? "http://localhost:3000";

const checks = [
  ["/", "redirect"], // root → locale redirect (307)
  ["/en", 200],
  ["/ur", 200],
  ["/hi", 200],
  ["/en/login", 200],
  ["/en/verify", 200],
  ["/en/home", 200],
  ["/en/groups", 200],
  ["/en/groups/new", 200],
  ["/en/groups/join", 200],
  ["/en/groups/chai", 200],
  ["/en/expense/new", 200],
  ["/en/settle/list", 200],
  ["/en/settle/chai__imran", 200],
  ["/en/settle/confirm/s2", 200],
  ["/en/activity", 200],
  ["/en/profile", 200],
  ["/en/pro", 200],
  ["/manifest.webmanifest", 200],
  ["/sw.js", 200],
  ["/api/health", 200],
];

let failed = 0;
for (const [path, expected] of checks) {
  try {
    const res = await fetch(base + path, { redirect: "manual" });
    const ok =
      expected === "redirect" ? res.status >= 300 && res.status < 400 : res.status === expected;
    console.log(`${ok ? "PASS" : "FAIL"} ${res.status} ${path}`);
    if (!ok) failed++;
  } catch (e) {
    console.log(`FAIL ERR ${path} — ${e.message}`);
    failed++;
  }
}

// Content checks
const ur = await fetch(base + "/ur").then((r) => r.text());
if (!ur.includes('dir="rtl"')) {
  console.log("FAIL /ur missing dir=rtl");
  failed++;
} else console.log("PASS /ur dir=rtl");

const manifest = await fetch(base + "/manifest.webmanifest").then((r) => r.json());
if (manifest.display !== "standalone" || !manifest.icons?.length) {
  console.log("FAIL manifest");
  failed++;
} else console.log("PASS manifest installable");

const health = await fetch(base + "/api/health").then((r) => r.json());
if (health.ok !== true) {
  console.log("FAIL health");
  failed++;
} else console.log("PASS api/health");

console.log(failed === 0 ? "\nSMOKE: ALL PASS ✓" : `\nSMOKE: ${failed} FAILURES ✗`);
process.exit(failed === 0 ? 0 : 1);
