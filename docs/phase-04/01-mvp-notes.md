# 📱 Phase 4 — MVP Development Notes

> Status: **M1–M6 implemented in demo mode** · 28 unit tests green · prod build green
> Firebase keys pending → real OTP/Firestore/push activate automatically once `.env.local` is filled.

## What was built (module by module)

| Module | Files | Notes |
|---|---|---|
| M1 Auth | `lib/firebase/auth.ts`, `auth-lifecycle.ts`, `(auth)/login`, `(auth)/verify`, `components/shared/auth-guard.tsx` | Real phone auth when configured; demo mode = any 4-digit OTP. WebOTP via `autoComplete="one-time-code"`. Route guard on `(main)`. |
| M2 Groups | `(main)/groups/*` (list, new, join, [id]) | Create with emoji + members; join via invite code; share sheet (`navigator.share`) with deep link; member chips. |
| M3 Engine | `lib/debt-simplification.ts` + tests | Equal/percent/shares/exact splits (largest-remainder rounding), `expenseToBalances`, `mergeBalances`, `simplifyDebts`. **Bugs found by tests:** payer's own share wasn't deducted; rounding precedence. |
| M4 Dashboard | `(main)/home` | Owe/owed totals, per-group chips, settle-up target, activity feed — all from repository data via React Query. |
| M5 Notifications | `lib/firebase/messaging.ts` (removed in cleanup — unused until FCM keys land) | FCM web-push ready; will be re-added with VAPID key + service-worker token. In-app notifications inbox (`/notifications`) is live. |
| M6 History | `(main)/activity` | Group filters, 30-day summary, CSV export (expenses + settlements). |
| Data layer | `lib/data/*` | `Repository` interface; `DemoRepository` (localStorage, seeded); `FirestoreRepository` (subcollections `groups/{g}/expenses`, `groups/{g}/settlements`); selectors; React Query hooks. |
| Security | `firestore.rules`, `firestore.indexes.json` | Rules: membership-gated reads, payer-only expense creates, receiver-only confirmations, shares-must-sum-to-amount, subscriptions only via Cloud Functions. |

## To activate production mode (founder actions)

1. Firebase console → create project (Blaze) → add web app → copy config to `billsplit-dost/.env.local` (see `.env.example`).
2. Enable **Phone** auth (PK +92 / IN +91).
3. `npx firebase-tools deploy --only firestore:rules,firestore:indexes` (or paste via console).
4. Add FCM VAPID key for push (M5) — Web Push certificates.
5. Deploy to Vercel/Firebase Hosting; register domain.

## Test & build

```bash
cd billsplit-dost
npm test        # 28 tests (engine, deep links, data layer)
npm run build   # prod build — green (39 static pages)
```

## Demo flow (works today in the preview)

Welcome → Login (+92 demo) → OTP (any 4 digits) → Home shows seeded groups/balances →
Add expense (live split preview) → group balances update → Settle up → Pay via deep link →
"I've paid" → settlement appears in Activity → CSV export.
