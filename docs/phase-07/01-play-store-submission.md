# 🏪 Phase 7 — Play Store Submission Guide

> Status: **assets & checklist ready** · submission happens after Phase 6 gates pass.

## 0. Pre-submission gates (from plan's Final Checklist)

- [ ] Lighthouse PWA ≥ 90 (Phase 6 job)
- [ ] Closed beta complete: 14 days, 12 testers, rating > 4.0
- [ ] Deep-link settlement tested on real JazzCash/Easypaisa/Raast/UPI apps
- [ ] Digital Asset Links verified (no URL bar in TWA)
- [ ] **Gate R3:** Play Billing policy confirmed for Pro subscription (external checkout vs Play Billing) — decide BEFORE submission
- [ ] Privacy policy live at `billsplitdost.pk/en/privacy`

## 1. Account & console

1. Play Console → create developer account → **$25 one-time** (≈ Rs 7,000).
2. Create app: name **BillSplit Dost**, default language English, app type "App".
3. Upload the signed AAB from `twa/app-release-bundle.aab`.
4. Fill content rating questionnaire (IARC — Finance; no violence/sex; privacy answers per Data Safety).

## 2. Store listing (copy-paste ready)

**Short description (80 chars):**
> Split bills & track hisaab with friends in PK & IN. Settle via JazzCash, UPI & more.

**Full description:**
```
Split expenses with friends, roommates and family in Pakistan & India — without the awkwardness.

🇵🇰 🇮🇳 BillSplit Dost is the hisaab app for your group:
• Add expenses in 3 taps — dinners, rent, trips, chai runs
• Split equally, by %, by shares or exact amounts
• Automatic debt simplification: minimum transfers, nobody pays twice
• Settle with one tap — we open YOUR own payment app (JazzCash, Easypaisa, Raast in PK; GPay, PhonePe, Paytm in IN). Money goes bank-to-bank; we never touch it.
• Works offline · installable PWA · push notifications
• Full Urdu (RTL), Hindi and English support

Free forever for groups up to 50. No ads.

Settlement advice: BillSplit Dost is a tracking & reminder tool. It does not process, hold or transfer payments — those happen inside your own bank or wallet app.
```

**Graphics:** icon (512) · feature graphic 1024×500 (see `design/phase-08/`) · 8 screenshots (390×844): Welcome, Home dashboard, Add expense, Group detail, Balances, Settle pay, Confirm receipt, Pro.

## 3. Data Safety form

| Question | Answer |
|---|---|
| Does your app collect personal data? | Yes — phone number (auth), name, expense records |
| Financial info? | **No** (deep links only; we never see payment credentials) |
| SMS / Contacts? | **No** |
| Is data encrypted in transit? | Yes (HTTPS) |
| Can users request deletion? | Yes — in-app delete + help chat |
| Data shared with third parties? | Payment processors (Safepay/Razorpay) only for Pro billing |

## 4. Testing track

1. **Closed testing** — 14 days, 12 testers (plan requires this for Production access).
   - TWA testers install via Play link; confirm no URL bar (assetlinks OK).
   - Watch crash reports (Sentry) + Firebase Analytics activation.
2. Fix P0/P1 → re-upload AAB → **Promote to Production**.
3. **Staged rollout: 10% → 50% → 100%** (Monitor: crash rate, ANRs, 1-star themes).

## 5. Keystore & updates

- Keystore backup: password manager + offline USB. Never share.
- **Most updates ship via web deploy** (TWA loads the live site) — no Play
  resubmission needed unless icon/manifest/package changes.
- Play re-submission needed only for: icon change, theme color, shortcuts,
  new permissions.

## 6. Play Billing policy (Gate R3) — action items

- [ ] Read current Play "Subscriptions" policy for TWA-wrapped apps
- [ ] If external checkout allowed for real-world services → keep Safepay/Razorpay
- [ ] If Play Billing required → integrate via TWA `PlayBillingClient` (bubblewrap)
      and route Pro through Play for Android users (web keeps Safepay/Razorpay)
