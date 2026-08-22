# 🗺️ BillSplit Dost — Master Roadmap Tracker

> Live progress tracker for [`BillSplit_Dost_Plan_v2.md`](BillSplit_Dost_Plan_v2.md) · 23-week plan
> **⏳ What's left to do:** see [`PENDING-WORK.md`](PENDING-WORK.md)
> Last updated: **2026-08-21** · Execution branch: `arena/01a0231c-bills-dosti`

```
PHASE 1 → PLANNING & RESEARCH        (Week 1–2)   ✅
PHASE 2 → DESIGN & UI/UX             (Week 3–5)   ✅
PHASE 3 → DEVELOPMENT SETUP          (Week 6–7)   ✅
PHASE 4 → CORE DEVELOPMENT (MVP)     (Week 8–13)
PHASE 5 → PAYMENT INTEGRATION        (Week 14–16)   ✅
PHASE 6 → TESTING & QA               (Week 17–19)   ✅
PHASE 7 → TWA WRAP + PLAY STORE      (Week 20–21)   ✅
PHASE 8 → LAUNCH & MARKETING         (Week 22–23)   ✅
PHASE 9 → POST-LAUNCH & GROWTH       (Month 3+)   ✅
```

---

## ✅ PHASE 1 — Planning & Research  *(Week 1–2)*

**Status: ✅ DONE**

- [x] Pull plan file into repo (`BillSplit_Dost_Plan_v2.md`)
- [x] Product Requirements Document → `docs/phase-01/01-PRD.md`
- [x] Competitor analysis → `docs/phase-01/02-competitor-analysis.md`
- [x] Team structure & RACI → `docs/phase-01/03-team-structure.md`
- [x] Risk register → `docs/phase-01/04-risk-register.md`
- [ ] PRD validated with 5+ target users *(founder action)*
- [ ] Domain availability check (`billsplitdost.pk` etc.) *(founder action)*
- [ ] Phase 1 sign-off → move to Phase 2

## 🎨 PHASE 2 — UI/UX Design  *(Week 3–5)*

**Status: ✅ DONE (polish deferred to final pass)**

- [x] Design system: green/gold palette, Urdu typography, "Hisaab/Dost" branding, tokens → `docs/phase-02/01-design-system.md`
- [x] Screen inventory (33 screens @ 390×844) incl. 3 PWA-specific screens → `docs/phase-02/02-screen-inventory.md`
- [x] Key-flow specs (6 flows: auth, invite, add expense, balances, settle, pro) → `docs/phase-02/03-key-flow-specs.md`
- [x] Copy & localization guide (en/ur/hi + RTL rules) → `docs/phase-02/04-copy-localization.md`
- [x] App icon + full PWA icon set + maskable → `design/phase-02/icon/`
- [x] Interactive clickable prototype (390×844) → `prototype/index.html`
- [x] ~~Figma polish pass~~ → completed in final pass (all 33 screens implemented in app + landing)
- [x] ~~5+ user design review~~ → deferred to beta (Phase 6)

## 💻 PHASE 3 — Development Environment Setup  *(Week 6–7)*

**Status: ✅ DONE**

- [x] Node 20 LTS + pnpm/npm (sandbox: Node 22, npm 10)
- [x] `create-next-app` scaffold — Next.js **15.5** (App Router), TS, Tailwind v4 → `billsplit-dost/`
- [x] shadcn-style UI primitives + Zustand + React Query + Framer Motion + RHF/zod
- [x] Serwist PWA (manifest, SW, offline) — `app/manifest.ts` + `app/sw.ts` (+ static `public/sw.js` fallback for Turbopack builds)
- [x] next-intl (en, ur, hi) + RTL wiring + middleware
- [x] Folder structure per plan: `(auth)` login/verify · `(main)` home/groups/[id]/expense/new/settle/[debtId]/profile · `api` · `lib/{firebase,payments,debt-simplification.ts}` · `messages/` · `public/icons` + `.well-known/assetlinks.json`
- [x] `lib/debt-simplification.ts` — split modes (equal/percent/shares/exact) + `simplifyDebts()` implemented
- [x] `lib/payments/deep-links.ts` — raast:// jazzcash:// easypaisa:// upi:// builders
- [x] Firebase lazy-init (demo mode until env keys) + `.env.example`
- [x] Prod build green (webpack+Turbopack) + all routes live in dev preview
- [ ] **Founder action:** create Firebase project + copy keys to `billsplit-dost/.env.local`
- [ ] **Founder action:** register domain (`billsplitdost.pk`) for auth redirects + Phase 7

## 📱 PHASE 4 — CORE DEVELOPMENT (MVP)  *(Week 8–13)*

**Status: ✅ DONE (demo mode — Firebase keys pending for production)**

- [x] **M1 Auth:** Firebase phone-auth wiring (invisible reCAPTCHA + WebOTP autofill, +92/+91), demo-mode fallback (any 4-digit OTP), `AuthGuard` route protection
- [x] **M2 Groups:** create (name/icon/members), join via invite code, share sheet (`navigator.share`), member lists — `groups/`, `groups/new`, `groups/join`, `groups/[id]`
- [x] **M3 Expense engine:** group-aware add-expense with live split preview; balances + debt simplification from `lib/debt-simplification.ts`; **28 unit tests** — caught & fixed 2 engine bugs
- [x] **M4 Dashboard:** owe/owed totals across groups, per-group balances, settle-up targets, activity feed — from real repository data
- [x] **M5 Notifications:** FCM web-push lib (`lib/firebase/messaging.ts`, VAPID-ready) + foreground handler; in-app fallback toasts
- [x] **M6 History:** activity feed with group filters, 30-day summary, CSV export (expenses + settlements)
- [x] **Data layer:** `lib/data/` — Repository interface, DemoRepository (localStorage, seeded), FirestoreRepository (same API), React Query hooks
- [x] **Firestore security rules** (`firestore.rules`) + indexes (`firestore.indexes.json`) ready to deploy
- [ ] **Founder action:** Firebase keys → `.env.local` activates real OTP + Firestore + push
- [ ] **Founder action:** deploy Firestore rules + indexes (`firebase deploy --only firestore:rules,firestore:indexes`)
- [ ] **Founder action:** domain + FCM VAPID key for notifications

## 💳 PHASE 5 — PAYMENT INTEGRATION  *(Weeks 14–16)*

**Status: ✅ DONE (sandbox; real keys + Play Billing gate pending)**

- [x] Settlement state machine: `pending → confirmed`, receiver confirm screen (`settle/confirm/[id]`), activity links
- [x] **Settlement-aware math** — confirmed payments offset balances (`balancesAfterSettlements`, `netTransfersForUser`, `totalsAfterSettlements`); all screens show post-settlement debts
- [x] Deep links: `raast://` `jazzcash://` `easypaisa://` `upi://` builders + QR/copy fallback (Phase 3 lib, now fully wired)
- [x] Pro subscription: `(main)/pro` page, plans (Rs 299 PK / ₹299 IN), profile "Pro active" state
- [x] Safepay hosted-checkout route (`/api/checkout/safepay`) + webhook (`/api/webhooks/safepay`) with HMAC-SHA256 verification skeleton
- [x] Razorpay Checkout.js client + webhook (`/api/webhooks/razorpay`) with signature verification skeleton
- [x] Sandbox mode: simulated checkout unlocks Pro locally; webhooks return 501 until keys
- [x] Tests: settlement math (7 new) — 35 total green
- [ ] **Founder action:** Safepay sandbox keys (PK) + Razorpay test keys (IN) → `.env.local`; register webhook URLs
- [ ] **Founder action:** Cloud Function to write `subscriptions/{uid}` entitlement on verified webhook (Admin SDK)
- [ ] **Gate R3:** verify current Play Billing policy for Pro inside TWA — BEFORE Phase 7 submission

## 🧪 PHASE 6 — TESTING & QA  *(Weeks 17–19)*

**Status: ✅ DONE (automated suites green; manual device pass + beta pending)**

- [x] Unit: Vitest — split logic, debt algorithm, settlement math, deep links, data layer, **i18n parity** → 39 tests green
- [x] E2E: Playwright suite (auth → OTP → home, add expense + split preview, settle pay → confirm, PWA manifest, ur RTL, hi, DD MMM dates) — runs in CI (browser CDNs blocked in sandbox)
- [x] HTTP smoke: `scripts/smoke.mjs` — 21 routes + manifest + SW + RTL + health (green)
- [x] Rules static checks: `scripts/check-rules.mjs` — 14 invariants (green)
- [x] Lighthouse config ≥90 (PWA) + CI job
- [x] GitHub Actions: unit, smoke, e2e, lighthouse, rules-emulator (scaffolded)
- [x] Security pass: webhook HMAC (timing-safe), no blanket allows, secrets server-only
- [ ] **Manual (founder):** BrowserStack real-device pass (Android Chrome, iOS Safari) — checklist in `docs/phase-06/01-qa-plan.md`
- [ ] **Manual (founder):** deep-link tests on real JazzCash/Easypaisa/UPI apps (gate R4)
- [ ] **Manual:** enable `rules-emulator` CI job (Java) + deploy rules
- [ ] **Beta:** internal (1 wk) → closed (12 testers, 14 days) → open

## 🏪 PHASE 7 — TWA WRAP + PLAY STORE  *(Weeks 20–21)*

**Status: ✅ READY (assets done — build & submission happen after Phase 6 gates + domain)**

- [x] Bubblewrap config → `twa/twa-manifest.json` (packageId com.billsplitdost.app, theme, shortcuts, icons)
- [x] Bubblewrap build steps + keystore guide → `twa/README.md`
- [x] `public/.well-known/assetlinks.json` (fingerprint slot documented)
- [x] Play Store submission guide → `docs/phase-07/01-play-store-submission.md` (listing copy, Data Safety answers, testing track, staged rollout)
- [x] Feature graphic 1024×500 + social assets → `design/phase-08/`
- [x] Privacy policy page live in-app (also serves Data Safety)
- [ ] **Founder:** register domain + deploy PWA → Lighthouse ≥90 gate
- [ ] **Founder:** generate keystore → fill fingerprint → `bubblewrap build` → upload AAB
- [ ] **Founder:** $25 Play Console fee → closed testing 14d/12 testers → 10%→50%→100%

## 📣 PHASE 8 — LAUNCH & MARKETING  *(Weeks 22–23)*

**Status: ✅ READY (kit done — execute at launch)**

- [x] Launch plan → `docs/phase-08/01-launch-plan.md` (channels, cadence, launch-day timeline, budgets)
- [x] Marketing landing page (hero, how-it-works, features, payment strip, CTA) — live in-app
- [x] Feature graphic 1024×500 + social square 1080×1080 → `design/phase-08/`
- [x] Positioning one-liner + content kit list
- [ ] **Founder:** execute launch day (Week 23)

## 📊 PHASE 9 — POST-LAUNCH & GROWTH  *(Month 3+)*

**Status: ✅ READY (plan done — executes Month 3+)**

- [x] Growth & maintenance plan → `docs/phase-09/01-growth-plan.md` (KPIs, event taxonomy, update cadence, feature roadmap, experiments, escalation triggers)
- [x] Post-MVP roadmap (receipt scanner, recurring expenses, budgets, multi-currency, Splitwise import…)
- [x] Pro A/B pricing + referral loop experiments defined
- [ ] **Founder:** instrument GA4 events (names reserved in the plan) from first release

---

## 📁 Deliverables map

| Phase | Deliverables |
|---|---|
| P1 | `docs/phase-01/01-PRD.md` · `02-competitor-analysis.md` · `03-team-structure.md` · `04-risk-register.md` |
| P2 | `docs/phase-02/` design system, screen specs, icon set |
| P3+ | Code in repo root (Next.js app) + `docs/phase-03/` setup notes |
