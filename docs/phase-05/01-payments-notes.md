# 💳 Phase 5 — Payment Integration Notes

> Status: **Settlement state machine + Pro subscription scaffold done** · 35 unit tests green · build green
> Per plan v2 §5.1–5.3 (the "corrected" approach — **you never touch the money**).

## 5.1 Legal recap (why deep links, not aggregation)

Routing user money through your merchant account = becoming a **payment aggregator**:
- 🇮🇳 India: RBI PA authorization, ₹15–25 Cr net-worth, escrow-nodal account (Payment & Settlement Systems Act).
- 🇵🇰 Pakistan: SBP EMI/PSO licensing.

Both are out of reach for an MVP and illegal without a license. The deep-link model
(same as Splitwise) means **money moves bank-to-bank in the user's own app** — we never
hold, route, or touch funds. Pro subscription is the only money that flows to you, and
that's a normal merchant transaction (user → you) — no aggregator license needed.

## 5.2 Settlement state machine (implemented)

```
payer taps "Pay Now 💚"
   → deep link opens payer's OWN app (JazzCash/Easypaisa/Raast · UPI)
   → payer completes transfer (bank-to-bank)
   → "I've paid" → creates Settlement { status: "pending" }
   → receiver gets notification/activity item
   → receiver opens /settle/confirm/[id] → "Confirm received"
   → Settlement { status: "confirmed" } → debt cleared
```

**Key math (`lib/data/selectors.ts`):**
- `balancesAfterSettlements(balances, settlements)` — confirmed settlements offset
  the payer's net (+) and receiver's net (−); pending never counts.
- `netTransfersForUser(...)` / `totalsAfterSettlements(...)` — dashboard, group
  detail, settle list and settle page all show **post-settlement** numbers, so
  paying genuinely reduces what you owe.

**Screens:** `settle/list` (debts + payments-to-confirm), `settle/[debtId]` (deep-link
pay, "I've paid", QR/copy fallback), `settle/confirm/[id]` (receiver verification),
activity links pending payments to the confirm screen.

**Deep links (`lib/payments/deep-links.ts`):**
- PK: `raast://pay?receiver=+92…&amount=…` · `jazzcash://pay?...` · `easypaisa://pay?...`
- IN: `upi://pay?pa=…&am=…&cu=INR&tn=…`
- Fallbacks: QR + copy payment ID (deep-link schemes can change — risk R4).

## 5.3 Pro subscription (your revenue)

| | 🇵🇰 Pakistan | 🇮🇳 India |
|---|---|---|
| Provider | **Safepay** hosted checkout | **Razorpay** Checkout.js |
| Price | Rs 299/month | ₹299/month |
| Flow | Server creates session → redirect → webhook | Client modal → server verifies signature → webhook |
| Files | `app/api/checkout/safepay` + `app/api/webhooks/safepay` | `lib/payments/checkout.ts` + `app/api/webhooks/razorpay` |

- **Sandbox mode** (no keys): checkout simulates and unlocks Pro locally
  (`bsd-pro` flag in localStorage); webhooks return `501 not_configured`.
- **Real mode**: fill `.env` keys → Safepay redirect / Razorpay modal engage;
  webhooks verify **HMAC-SHA256 signatures** (timing-safe compare) before
  the entitlement write (TODO: Cloud Function via Admin SDK → `subscriptions/{uid}`;
  `firestore.rules` already deny client writes to that collection).
- UI: `(main)/pro` page (features, plan per region, compliance note),
  profile Pro card becomes "Pro active" after unlock.

## ⚠️ Gate before Phase 7 (risk R3)

Since the app ships as a TWA on Play Store, verify **current Play Billing policy**
on whether a "service" subscription may use external checkout (Safepay/Razorpay)
or must use Play Billing. Decision path: if required, gate Pro behind web-only for
now or integrate Play Billing via the TWA's `PlayBillingClient` (bubblewrap).

## Tests

`lib/data/selectors.test.ts` — settlement math (pending ignored, confirmed applied,
fully-settled pairs vanish, totals after settlements). Run: `npm test` → **35 passed**.
