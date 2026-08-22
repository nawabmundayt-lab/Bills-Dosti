# 🔀 Key-Flow Specs — BillSplit Dost

> **Phase 2 deliverable · v1.0** — the 6 money-critical flows, step by step. Input for Figma flows + Playwright E2E (Phase 6).

## Flow A — Auth (login → OTP)

```
1. Welcome (s1) → Language (s2) → Login (s3)
2. User picks +92/+91, enters 10-digit number  → validation: /^[0-9]{10}$/
3. Tap Continue → invisible reCAPTCHA → Firebase sends OTP
4. OTP screen (s4): 4 boxes, autocomplete="one-time-code"
   → WebOTP auto-fills on Android Chrome (no SMS permission)
   → fallback: manual entry + "Resend in 30s" timer
5. Confirm → first-time user → Onboarding (s5); returning → Home (s6)
```
**Errors:** invalid number · OTP wrong (3 attempts → re-send) · network (offline screen s32).

## Flow B — Invite members (primary growth loop)

```
1. In Group detail (s8) → "Invite" → sheet (s10)
2. Show invite link (https://billsplitdost.pk/g/join/XXXXXX)
3. Targets: WhatsApp | SMS | Copy link  → navigator.share() where available
4. Friend opens link → landing → if no account: login (s3) → auto-join group
   → if account: "Join 'Chai Gang'?" confirm → in
5. Group detail updates member list + "X joined via link 🎉" activity item
```
**Why links:** Contact Picker API is Android-Chrome-only and gesture-gated; links work everywhere and are a shareable growth mechanic (plan Phase 4 note).

## Flow C — Add expense (must be ≤ 3 taps for equal split)

```
FAB (+) → sheet s12
1. Amount (numeric pad, defaults "Paid by You") + optional title + category
2. [Advanced] members multi-select, split mode, payer change
3. Save → Firestore write → push notification to members → activity feed
Default: EQUAL split among ALL group members, paid by current user — 3 taps.
```

### Split modes (engine input, Phase 4)

| Mode | Input | Compute |
|---|---|---|
| Equal | n members | amount / n (rounding: largest remainder to cent) |
| Percent | % per member (must sum 100) | amount × % |
| Shares | ratio per member (e.g. 2:1:1) | amount × share/Σshares |
| Exact | amount per member | no compute; sum must equal total |

Multi-payer: expense total = Σ payer amounts; each payer's portion split per mode among the rest.

## Flow D — Balances & simplification

```
Per expense: payer gets credit (+), others debit (−)
Per group: sum per member → net balance per pair
Simplify: min # transfers (greedy pair-off; exact optimal for ≤ ~10 members)
Output: list "Ali → Imran Rs 350" (screen s11)
```
→ `lib/debt-simplification.ts` (Phase 4), unit-tested with Vitest (Phase 6).

## Flow E — Settle via deep link ⭐ (money never touches us)

```
1. Home "Settle up" or Balances (s11) → Settle list (s16) → pick debt
2. Settlement pay (s17): amount, "You owe Ali Rs 1,500"
3. App chooser (auto by region): PK → JazzCash/Easypaisa/Raast · IN → GPay/PhonePe/Paytm
4. Pay Now 💚 → builds deep link:
     PK: raast://pay?receiver=+923001234567&amount=1500
         jazzcash://pay?receiver=…&amount=…
         easypaisa://pay?receiver=…&amount=…
     IN: upi://pay?pa=ali@okhdfc&am=1500&cu=INR
   → intent fallback: https://upi-lite/… or QR + "Copy UPI ID"
5. External app opens ON THE SAME PHONE → user pays there (bank-to-bank)
6. Return → "I've paid" (s18) → counterpart notified
7. Counterpart confirms (s19) → debt marked SETTLED in Firestore
8. Activity: "Ali paid you Rs 1,500 — settled ✓"
```
**Fallbacks (risk R4):** if deep link fails to open → show QR + payment ID copy; settlement still recorded manually.

## Flow F — Pro subscription (Phase 5, designed now)

```
Profile → Pro (s20) → choose plan (Rs/₹299 monthly) →
PK: Safepay hosted checkout · IN: Razorpay Checkout.js →
webhook verifies → Firestore unlock → gold "PRO" badge
⚠ Play Billing policy check before Phase 7 (risk R3)
```

---

## Wireframe sketches (key screens)

### s6 Home
```
┌────────────────────────────┐
│ 👋 Assalam-o-Alaikum, Ali  │  top bar
│ ┌────────────────────────┐ │
│ │ You owe        Rs 2,450│ │  owe card
│ │ You're owed    Rs 1,280│ │
│ │ [Settle up →]          │ │
│ └────────────────────────┘ │
│ [ + Expense ] [ Settle ]   │  quick actions
│ 🏠 Flat 302 · owed 1,100   │  group chips
│ 🍵 Chai Gang · owe 450     │
│ ── Recent activity ──      │
│ ✓ Ali paid you 1,500 · 2h  │
│ ➕ Imran added Dinner 850   │
│ ────────────────────────── │
│ 🏠   👥   🧾   👤          │  bottom nav
└────────────────────────────┘
```

### s17 Settlement pay
```
┌────────────────────────────┐
│     Settle with Ali ✕      │  sheet
│ ┌────────────────────────┐ │
│ │ You owe Ali            │ │
│ │  Rs 1,500              │ │  big amount
│ └────────────────────────┘ │
│ Choose your payment app    │
│ [JazzCash] [Easypaisa]     │  chips (PK)
│ [Raast]                    │
│ 🛡 Money goes bank-to-bank │
│   — we never touch it      │
│ ┌────────────────────────┐ │
│ │      Pay Now 💚        │ │  primary
│ └────────────────────────┘ │
│  or show QR / copy UPI ID  │  fallback
└────────────────────────────┘
```
