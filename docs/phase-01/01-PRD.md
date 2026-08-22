# 📄 PRD — BillSplit Dost (Product Requirements Document)

> **Phase 1 deliverable · v1.0 · Source plan:** [`BillSplit_Dost_Plan_v2.md`](../../BillSplit_Dost_Plan_v2.md)
> **Status:** ✅ Approved — freeze date TBD (reviewed by founder, pending 5+ user interviews)

---

## 1. Product Vision

**One-line vision:** *"Dosto ke saath hisaab, bina jhanjhat"* — split bills with friends, without the awkwardness.

BillSplit Dost is a bill-splitting and group-expense tracker for **Pakistan 🇵🇰 and India 🇮🇳** that runs as a Next.js PWA (installable from the browser, wrappable to the Play Store via TWA). It tracks who owes whom, simplifies debts, and sends each user straight to their own **Raast/JazzCash/Easypaisa (PK)** or **UPI (IN)** app to settle — money never passes through our servers.

## 2. Problem Statement

- Friends and roommates in PK/IN regularly share expenses (rent, food, trips, utilities, chai/food runs) but tracking who paid what breaks down fast.
- Existing global tools (Splitwise, Settle Up, Tricount) work, but:
  - Have **no native payment hand-off** to Raast/JazzCash/Easypaisa/UPI — users still reconcile externally.
  - Don't support **Urdu/Hindi + RTL** and PK/IN cultural patterns (e.g. "bhai ka hisaab", group WhatsApp dynamics).
  - Splitwise's free tier is increasingly ad-heavy/paywalled ([1](https://www.reddit.com/r/IndiaTech/comments/18l3wet/splitwise_is_useless_now/)).
- In-app payment integration (the "send money for them" model) is **legally impossible at MVP scale** — it requires RBI PA authorization (₹15–25 Cr net worth) in India or SBP EMI/PSO licensing in Pakistan. The deep-link model avoids this entirely.

## 3. Target Users (Personas)

### 🇵🇰 Persona A — "The Host" (Karachi/Lahore, age 22–30)
- Male/female professional or student, shares a flat or hangs out in a group of 4–6.
- Pays for dinners, cabs, Netflix, chai at the dhaba. Gets annoyed asking friends for money.
- Uses **JazzCash or Easypaisa** daily; some use bank apps (Meezan, HBL).
- Pain: "I always end up paying and then it's awkward to ask."

### 🇮🇳 Persona B — "The Roommate" (Bengaluru/Delhi, age 22–30)
- Shares an apartment with 2–3 others; monthly rent + groceries + electricity.
- Pays via **GPay/PhonePe/Paytm (UPI)** multiple times a day.
- Pain: "We use a notebook/WhatsApp messages; there's always a fight at month-end."

### 🇵🇰/🇮🇳 Persona C — "The Trip Organizer" (age 20–28)
- Plans 3–7 day trips with friends (northern areas PK / Himachal-Goa IN).
- Needs per-item splitting (hotel, fuel, food, entry tickets) and a final settle-up summary.

## 4. Goals & Success Metrics

| Goal | Metric | Target (Month 3) |
|---|---|---|
| Activation | Users who complete phone auth | > 60% of installs |
| Core action | Users who create/join a group within 7 days | > 50% |
| Engagement | Expenses logged per active user / month | ≥ 12 |
| Retention | D30 retention (PWA) | ≥ 25% |
| Settlement | Settlements started via deep link / month | ≥ 30% of outstanding debts |
| Quality | Lighthouse PWA score | ≥ 90 |
| Revenue (Phase 5+) | Pro conversion | 2–5% |

## 5. Scope

### MVP (Phase 4 — in scope)
1. **Auth:** Phone + OTP (Firebase Auth, PK +92 / IN +91, WebOTP autofill, invisible reCAPTCHA).
2. **Groups:** Create, join via **shareable invite link** (WhatsApp/SMS share sheet — primary flow), leave, member list.
3. **Expenses:** Add expense (title, amount, payer, date, category), split **equally / by shares / by percentage / exact amounts**, multiple payers support.
4. **Debt engine:** Per-group balances, **debt simplification** (`lib/debt-simplification.ts`) — minimum number of transfers.
5. **Dashboard:** "You owe X / X owes you" totals, per-group breakdown, recent activity feed.
6. **Settle flow:** "Pay" → generates **deep link** (`raast://`, `jazzcash://`, `easypaisa://`, `upi://`) or QR → user confirms paid → counterpart confirms → marked settled.
7. **History:** Expense list, filters, monthly summary, export (CSV) — export optional in MVP.
8. **Notifications:** Push via FCM (Web Push) for new expenses, reminders, settlement confirmations.
9. **i18n:** English + Urdu (RTL) + Hindi.
10. **PWA:** Installable, offline-first shell, update banner.

### Out of scope (MVP)
- ❌ Receipt scanning via Google Cloud Vision (post-MVP)
- ❌ Budgets, recurring-expense automation
- ❌ Multi-currency
- ❌ Any money movement through our servers
- ❌ iOS native app (PWA works in Safari; TWA wrap is Android-only)

## 6. User Stories (MVP)

| ID | Story | Priority |
|---|---|---|
| US-01 | As a new user, I can sign up with my phone number and verify with OTP so I can start tracking. | P0 |
| US-02 | As a user, I can create a group and invite friends via WhatsApp/SMS link. | P0 |
| US-03 | As a user, I can join a group from an invite link. | P0 |
| US-04 | As a user, I can add an expense with equal/uneven splits and mark who paid. | P0 |
| US-05 | As a user, I can see who owes whom (simplified) in a group. | P0 |
| US-06 | As a user, I can settle a debt via a deep link to my Raast/UPI app and mark it paid. | P0 |
| US-07 | As a user, I can confirm a payment someone made to me. | P0 |
| US-08 | As a user, I get a push notification when someone adds an expense or settles. | P1 |
| US-09 | As a user, I can switch the app to Urdu (RTL) or Hindi. | P1 |
| US-10 | As a user, I can install the app on my home screen and use it offline. | P1 |
| US-11 | As a user, I can see my full history with filters. | P2 |

## 7. Key Constraints & Decisions (locked)

| # | Decision | Rationale |
|---|---|---|
| D1 | **Next.js 15 + TypeScript + Tailwind + shadcn/ui** | Single codebase → web + PWA + TWA |
| D2 | **Firebase** (Auth, Firestore, FCM, Storage, Functions) | Serverless, cheap at MVP scale |
| D3 | **Money never touches our servers** — deep links only | No RBI/SBP aggregator license needed |
| D4 | **Invite-link flow** instead of contact access | Contact Picker API unreliable on iOS; links are a growth mechanic |
| D5 | **WebOTP** instead of SMS permission | No Play Store permission scrutiny |
| D6 | **Zustand + React Query** state | Lightweight, testable |
| D7 | **Serwist** for PWA/offline | Active successor to next-pwa |
| D8 | **next-intl** (ur, hi, en) with RTL | Core market differentiation |

## 8. Open Questions (to resolve before Phase 4)

1. **Play Billing policy** for "BillSplit Dost Pro" subscription inside a TWA — external checkout vs Play Billing (Phase 5.3 of plan). Verify before Phase 7.
2. Domain name registration (plan suggests `billsplitdost.pk` — confirm availability + budget Rs. 3,000).
3. Whether **receipt scanning** (Vision API) should move into MVP — decision pending beta feedback.
4. Deep-link URI schemes for Raast: confirm current scheme with JazzCash/Easypaisa/Raast docs (falls back to QR + copy-paste).

## 9. Phase 1 Exit Criteria

- [x] Product vision, personas, scope frozen (this doc)
- [x] Competitor analysis complete → `02-competitor-analysis.md`
- [x] Team structure & roles defined → `03-team-structure.md`
- [x] Risk register reviewed → `04-risk-register.md`
- [ ] PRD validated with 5+ target users (founder action item)
