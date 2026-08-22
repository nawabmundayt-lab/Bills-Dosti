#!/usr/bin/env node
/**
 * Phase 6 §5 — Static Firestore Security Rules validator.
 * Verifies the critical invariants without needing the emulator (no Java here).
 * Full behavior tests run in CI via `firebase emulators:exec` (see workflow).
 *
 * Usage: node scripts/check-rules.mjs
 */
import fs from "node:fs";

const rules = fs.readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");

const mustInclude = [
  ["signedIn() helper", "function signedIn()"],
  ["isMember() helper", "function isMember("],
  ["users: read gated by auth", "allow read: if signedIn()"],
  ["users: self-only writes", "request.auth.uid == uid"],
  ["groups: membership-gated reads", "request.auth.uid in resource.data.memberIds"],
  ["groups: creator writes", "resource.data.createdBy == request.auth.uid"],
  ["expenses: member-only create", "allow create: if isMember(gid)"],
  ["expenses: payer must be self", "request.resource.data.paidByUserId == request.auth.uid"],
  ["expenses: amount sanity", "request.resource.data.amount > 0"],
  ["expenses: shares sum to amount", "shares.values().sum() - request.resource.data.amount"],
  ["settlements: payer records only", "request.resource.data.fromUserId == request.auth.uid"],
  ["settlements: receiver confirms only", "resource.data.toUserId == request.auth.uid"],
  ["subscriptions: clients cannot update", "allow update: if false"],
];

let failed = 0;
for (const [label, needle] of mustInclude) {
  const ok = rules.includes(needle);
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failed++;
}

// Deny-by-default sanity: no blanket `if true` allows (explicit `if false`
// denies are legitimate and expected)
if (/allow (read|write|get|list|create|update|delete)[^:]*: if true\b/.test(rules)) {
  console.log("FAIL found a blanket allow (if true)");
  failed++;
} else {
  console.log("PASS no blanket allows");
}

console.log(failed === 0 ? "\nRULES: ALL CHECKS PASS ✓" : `\nRULES: ${failed} FAILURES ✗`);
process.exit(failed === 0 ? 0 : 1);
