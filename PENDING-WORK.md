# ⏳ Pending Work — BillSplit Dost

> **Last updated:** 2026-08-21 · **Branch:** `arena/01a0231c-bills-dost`
> **Code status:** ✅ Complete & tested — 37 unit tests · lint 0 errors · prod build 60 pages · all routes live.
> **This file is the single source of truth for what's left.** Track progress by ticking boxes.

---

## 🧭 Quick status

```
✅ DONE        → Code complete (Phases 1–9 deliverables built & verified)
⏳ FOUNDER     → 10 actions needing your accounts/keys (nothing to code)
📱 MANUAL QA   → Real-device testing + beta (needs phones)
🐣 CODE GAPS   → Small nice-to-have features (can build anytime)
```

---

## 1️⃣ 🔑 Founder Actions (blocked on your accounts & keys — critical path first)

### Critical path to launch (do in this order)

- [ ] **F-1. Firebase project + keys**
  - Create Firebase project (Blaze) → add web app → copy config to `billsplit-dost/.env.local`
  - Enable **Phone auth** (+92 PK / +91 IN)
  - Guide: `docs/phase-03/01-setup-notes.md` · template: `billsplit-dost/.env.example`
  - *Unlocks:* real OTP auth, Firestore persistence, push notifications (app leaves demo mode)

- [ ] **F-2. Deploy Firestore rules + indexes**
  - `npx firebase-tools deploy --only firestore:rules,firestore:indexes` (or paste via console)
  - Files: `billsplit-dost/firestore.rules` · `billsplit-dost/firestore.indexes.json`
  - *Unlocks:* production-grade security (membership gating, receiver-only confirms, shares-sum invariant)

- [ ] **F-3. Register domain** (`billsplitdost.pk` or similar)
  - Needed for: auth redirects, TWA Digital Asset Links, Play Store listing
  - Budget: ~Rs 3,000 (plan v2 cost table)

- [ ] **F-4. Deploy app + pass Lighthouse gate**
  - Deploy to Vercel or Firebase Hosting
  - Run `npx lighthouse http://localhost:3000/en --config-path=lighthouse.config.mjs` → **PWA ≥ 90**
  - Guide: `docs/phase-06/01-qa-plan.md` §6

- [ ] **F-5. Play Billing policy check (gate R3)**
  - Verify current Play policy: Pro subscription inside a TWA — external checkout (Safepay/Razorpay) vs Play Billing
  - Guide: `docs/phase-07/01-play-store-submission.md` §6
  - *Decide BEFORE Play submission, not after*

- [ ] **F-6. Keystore + TWA build**
  - Generate keystore → get SHA256 fingerprint → paste into `billsplit-dost/public/.well-known/assetlinks.json`
  - `bubblewrap build` → signed AAB
  - Guide: `twa/README.md` · config: `twa/twa-manifest.json`
  - ⚠️ **Back up keystore** — losing it = losing the Play identity forever

- [ ] **F-7. Play Console submission**
  - $25 one-time fee (≈ Rs 7,000) → upload AAB → Data Safety form (answers ready in guide) → listing copy
  - Closed testing: 14 days / 12 testers → Production → staged rollout 10% → 50% → 100%
  - Guide: `docs/phase-07/01-play-store-submission.md`

### Revenue & operations (parallel)

- [ ] **F-8. Real payment keys (Pro subscription)**
  - 🇵🇰 Safepay sandbox → production keys · 🇮🇳 Razorpay test → live keys
  - Set webhook URLs; write Cloud Function (Admin SDK) → `subscriptions/{uid}` entitlement
  - Files: `app/api/checkout/safepay/route.ts` · `app/api/webhooks/{safepay,razorpay}/route.ts` · `.env.example`

- [ ] **F-9. Enable CI**
  - Commit `.github/workflows/ci.yml` yourself (GitHub app token lacks `workflows` permission — I couldn't push it)
  - *Unlocks:* auto unit tests, Playwright E2E, Lighthouse audit on every push

- [ ] **F-10. Launch execution (Week 23)**
  - Follow `docs/phase-08/01-launch-plan.md` (channels, launch-day timeline, influencer budget Rs 50k)
  - Assets ready: `design/phase-08/feature-graphic-1024x500.png` · `social-square-1080.png` · landing page live in-app

---

## 2️⃣ 📱 Manual QA & Beta (needs real devices)

- [ ] **M-1. BrowserStack device matrix** — Android Chrome, iOS Safari, Samsung Internet
  - Checklist: `docs/phase-06/01-qa-plan.md` §3
- [ ] **M-2. Real deep-link tests (gate R4)** — JazzCash/Easypaisa/Raast on PK devices · GPay/PhonePe/Paytm on IN devices
- [ ] **M-3. FCM push verification** — needs VAPID key (F-1); in-app notifications inbox already live
- [ ] **M-4. Beta program** — internal (1 wk) → closed (12 testers, 14 days, rating > 4.0) → open
- [ ] **M-5. Urdu RTL + Hindi visual pass** on real devices (automated parity tests already green)

---

## 3️⃣ 🐣 Small Code Gaps (nice-to-have — can be built anytime, no blocker)

| # | Gap | Where | Priority |
|---|---|---|---|
| G-1 | **Edit expense** (currently delete + re-add) | `app/[locale]/(main)/expense/[id]/page.tsx` | Medium |
| G-2 | **Real QR code rendering** on settle screen (currently copy-link fallback) | `app/[locale]/(main)/settle/[debtId]/page.tsx` | Medium |
| G-3 | **Onboarding profile screen** (name/avatar picker — screen 5 of inventory) | `docs/phase-02/02-screen-inventory.md` | Low |
| G-4 | **Edit profile** (name/avatar — screen 29) | `app/[locale]/(main)/profile/page.tsx` | Low |
| G-5 | **Deeper history filters** (month/category/type — currently group filter + CSV) | `app/[locale]/(main)/activity/page.tsx` | Low |
| G-6 | **Receipt scanner** (Google Cloud Vision via Cloud Function) — Pro driver, post-MVP | `docs/phase-09/01-growth-plan.md` §3 | Post-MVP |
| G-7 | **Sentry crash reporting** | `.env.example` slot ready | Low |
| G-8 | **FCM service-worker push tokens** (re-add `lib/firebase/messaging.ts` when VAPID key exists) | `docs/phase-04/01-mvp-notes.md` | After F-1 |
| G-9 | **GA4 event instrumentation** (names reserved in growth plan) | `docs/phase-09/01-growth-plan.md` §1 | First prod release |

---

## 📎 Where everything lives

| Item | Location |
|---|---|
| Master roadmap with checkboxes | `ROADMAP.md` |
| Final audit (33-screen coverage, test results) | `docs/audit/01-final-audit.md` |
| Setup + Firebase guide | `docs/phase-03/01-setup-notes.md` |
| MVP notes / demo mode | `docs/phase-04/01-mvp-notes.md` |
| Payments + Pro keys | `docs/phase-05/01-payments-notes.md` |
| QA + beta plan | `docs/phase-06/01-qa-plan.md` |
| TWA wrap guide | `twa/README.md` |
| Play Store submission guide | `docs/phase-07/01-play-store-submission.md` |
| Launch plan + assets | `docs/phase-08/01-launch-plan.md` · `design/phase-08/` |
| Growth plan | `docs/phase-09/01-growth-plan.md` |

---

> 💡 **Golden rule:** Build → Test → Launch Small → Listen to Users → Improve → Scale Big!
> Critical path when you're ready: **F-1 → F-2 → F-3 → F-4 → F-6 → F-7**.
