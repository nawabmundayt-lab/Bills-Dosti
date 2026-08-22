# 🧪 Phase 6 — Testing & QA Plan

> Status: **tooling + automated suites in place** · 35 unit tests + 10 E2E specs + smoke + rules checks
> Browser execution (Playwright/Lighthouse) runs in CI (browser CDNs are blocked in the dev sandbox).

## 1. Test pyramid

| Layer | Tool | Scope | Status |
|---|---|---|---|
| Unit | Vitest | Split engine, deep links, settlement math, data layer, i18n parity | ✅ 35 tests green |
| E2E | Playwright (Chromium + Pixel 7) | Auth flow, add expense, settle, confirm, PWA/i18n | ✅ suite written (runs in CI) |
| HTTP smoke | `scripts/smoke.mjs` | All routes 200, manifest, SW, RTL, health | ✅ runs anywhere |
| Rules static | `scripts/check-rules.mjs` | Firestore rules invariants | ✅ runs anywhere |
| Rules behavior | Firebase emulator + `@firebase/rules-unit-testing` | Simulated requests vs rules | ⏸ needs Java — CI job scaffolded (disabled) |
| Perf/PWA | Lighthouse CI | installability, offline, <2s load, a11y | ✅ config + CI job |
| Device matrix | BrowserStack (manual) | Real Android Chrome + iOS Safari | 📋 checklist below |
| Localization | Vitest parity + Playwright | ur RTL, hi, DD MMM dates | ✅ automated |

## 2. E2E specs (`tests/e2e/`)

- `auth.spec.ts` — welcome → login → OTP → home; bad-phone validation; +91 toggle
- `expense.spec.ts` — add expense → appears in group; live split preview math
- `settle.spec.ts` — settle list; deep-link pay → "I've paid"; receiver confirm → settles
- `pwa-i18n.spec.ts` — manifest installable + maskable icon; SW served; ur `dir=rtl`; hi text; DD MMM dates

Run: `npx playwright test` (CI installs browsers via `npx playwright install --with-deps chromium`).

## 3. Manual device checklist (BrowserStack / real devices — founder)

- [ ] Android Chrome: OTP autofill (WebOTP) end-to-end
- [ ] Android Chrome: Add to Home Screen install prompt + offline open
- [ ] iOS Safari: PWA install via Share sheet, RTL Urdu rendering
- [ ] JazzCash/Easypaisa/Raast deep link opens on real PK devices (gate R4)
- [ ] GPay/PhonePe/Paytm UPI deep link opens on real IN devices
- [ ] Samsung Internet + older Android WebView (Firestore SDK support)
- [ ] Receipt of confirmation push (FCM) when counterpart confirms

## 4. Security (OWASP-lite pass)

- [x] Firestore rules: membership gating, payer-only expense create, receiver-only confirm, shares-sum invariant, subscriptions server-only
- [x] Webhook HMAC-SHA256 verification (timing-safe) — Safepay + Razorpay
- [x] No secrets client-side (all keys server-only except NEXT_PUBLIC_* placeholders)
- [ ] Deploy rules + run emulator behavior tests (CI job `rules-emulator`, enable with Java)
- [ ] Headers review: CSP, X-Frame-Options on prod (Vercel config) — Phase 7 prep
- [ ] reCAPTCHA invisible verifier stays server-verified in prod (Firebase handles)

## 5. Beta plan (internal → closed → open)

1. **Internal (1 week):** 5–8 people (founder network) — PWA link on Vercel preview; daily bug triage in repo Issues; watch: auth drop-off, add-expense success, settlement completion.
2. **Closed (2 weeks):** 12 testers (plan v2 requires 12 for Play closed testing later) — distribute install link + feedback form (WhatsApp group); measure D7 retention ≥ 25%, activation ≥ 60%.
3. **Open (post-Play submission):** staged rollout 10% → 50% → 100%.

**Beta gates:** Lighthouse PWA ≥ 90 · no P0/P1 bugs open · settlement flow confirmed on real payment apps (PK + IN) · Urdu RTL pass.

## 6. How to run everything

```bash
cd billsplit-dost
npm test                    # unit + parity (35)
node scripts/check-rules.mjs
npm run build && npm start &  # or keep dev running
node scripts/smoke.mjs
npx playwright test         # needs browsers (CI does this)
npx lighthouse http://localhost:3000/en --config-path=lighthouse.config.mjs
```
