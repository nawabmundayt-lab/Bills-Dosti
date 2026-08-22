# 🕵️ Competitor Analysis — BillSplit Dost

> **Phase 1 deliverable · v1.0** — grounded in market scan (Jan 2026) and community feedback.

## 1. Landscape Snapshot

### Global / Cross-market players

| Competitor | Model | Strength | Weakness vs. us |
|---|---|---|---|
| **Splitwise** | Free tier + Pro (₹49/mo IN) | Brand, simplicity, group UX | Ad-heavy free tier complaints [1](https://www.reddit.com/r/IndiaTech/comments/18l3wet/splitwise_is_useless_now/); no Raast/UPI deep-link settlement; no Urdu/RTL |
| **Settle Up** | Free w/ ads, ₹119/mo ad-free | Feature-rich, offline, multi-currency | No integrated payment hand-off; cluttered |
| **Tricount** | Freemium (pay per group count) | Trip-focused, clean | No payment integration; limited split types |
| **Splid** | Free 1 group; ₹239 unlimited | Simple UI, PDF export | Basic; no payment hand-off |
| **Splitser / Splitkaro / SplitZ / Chippy / FairShare / Wesplit / SplitNest / Expenmo** | Free / freemium, mostly IN-built | Various niches (AI scan, minimalism) | None do **Raast** deep links; most are IN-only or global-generic; no Urdu/RTL; zero PK focus |

### The real competitor: **payment apps' built-in splitting**

- **GPay / PhonePe / Paytm (IN):** built-in "split bills" among UPI contacts [1](https://www.reddit.com/r/IndiaTech/comments/18l3wet/splitwise_is_useless_now/).
  - Gaps users report: can't add expense paid by someone else, no multiple payers, no shares/percentages, no decimal amounts, no debt simplification.
- **JazzCash / Easypaisa / Raast (PK):** money transfer only — **no splitting/tracking layer at all**.

**Insight:** Payment apps win on *payment*, but lose on *tracking & fairness*. Splitting is our wedge; payment hand-off is our unlock. We're not trying to be a payment app — we're the *hisaab* layer on top of everyone's existing payment app.

## 2. Positioning

```
PAYMENT APPS (GPay, JazzCash)          TRACKING APPS (Splitwise, Settle Up)
  money moves fast                        debts tracked well
  no fairness/history layer               money moves nowhere
        └──────────────┬─────────────────────┘
                        ▼
            BILLSPLIT DOST (the wedge)
   Tracks the hisaab → hands off to the
   user's OWN payment app via deep link
   PK: Raast/JazzCash/Easypaisa · IN: UPI
```

## 3. Feature Matrix (MVP vs competitors)

| Feature | Splitwise | Settle Up | GPay/PhonePe | **BillSplit Dost (MVP)** |
|---|---|---|---|---|
| Groups | ✅ | ✅ | ❌ | ✅ |
| Uneven splits (shares/%) | ✅ (Pro) | ✅ | ❌/partial | ✅ |
| Multiple payers | ✅ | ✅ | ❌ | ✅ |
| Debt simplification | ✅ | ✅ | ❌ | ✅ |
| **Raast deep link settle** | ❌ | ❌ | ❌ | ✅ **PK** |
| **UPI deep link settle** | ❌ | ❌ | ✅ (limited) | ✅ **IN** (any UPI app) |
| Urdu/RTL | ❌ | ❌ | ❌ | ✅ |
| Hindi | partial | ❌ | ❌ | ✅ |
| Invite via WhatsApp/SMS | ✅ | ✅ | ❌ | ✅ (primary flow) |
| Offline PWA | ❌ | ✅ (native) | ❌ | ✅ |
| Free core | partial | ads | ✅ | ✅ |
| No payment-data liability | ✅ | ✅ | ❌ | ✅ |

## 4. Differentiators (what we lead with in marketing)

1. **"Settle with one tap"** — deep link opens the friend's real payment app; money never touches us.
2. **Urdu + RTL** — first proper Urdu bill-splitter (PK market untouched by Splitwise's localization).
3. **WhatsApp-first invites** — no contacts permission, just a link.
4. **PWA, no install friction** — works in browser; Play Store later via TWA.

## 5. Threats & Response

| Threat | Response |
|---|---|
| GPay/PhonePe add full splitting | We're platform-agnostic (works across ALL UPI/Raast apps); they'll never do cross-app or PK+IN dual-market |
| Splitwise localizes to Urdu | First-mover + speed; PK market is small enough that focus beats their generic rollout |
| Free-clone apps appear (easy to copy) | Moat = settlement hand-off + local trust + WhatsApp growth loop, not just features |

## 6. Takeaways for Phase 2 (Design)

- Benchmark UX against **Settle Up's** group detail and **Splitwise's** add-expense flow (both are the de-facto UX patterns users know — don't reinvent).
- Differentiate visually with the **green/gold "Dost/Hisaab"** identity and Urdu typography — instantly local, unlike global apps.
- Keep add-expense to **≤ 3 taps** for the equal-split default; uneven splits behind an "Advanced" toggle.
