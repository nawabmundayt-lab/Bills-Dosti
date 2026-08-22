# 📊 Phase 9 — Post-Launch Growth & Maintenance

> Status: **plan ready** · executes Month 3+.

## 1. KPI dashboard (define once, review weekly)

| KPI | Definition | Target (M3) |
|---|---|---|
| Activation | Completed phone auth / installs | ≥ 60% |
| Group creation | New groups / active user / wk | ≥ 0.5 |
| Core action | Users who add ≥ 1 expense in 7 days | ≥ 50% |
| Engagement | Expenses per active user / month | ≥ 12 |
| Retention | D30 (PWA) | ≥ 25% |
| Settlement rate | Settlements started / outstanding debts | ≥ 30% |
| Revenue | Pro conversion | 2–5% |

**Sources:** Firebase Analytics (GA4) events: `signup_complete`, `group_created`,
`expense_added`, `settlement_started`, `settlement_confirmed`, `pro_checkout_open`,
`pro_subscribed`. Event names reserved now — implement in the first update.

## 2. Update cadence (PWA superpower)

- **Instant web deploys** for most fixes/features — no store review cycle.
- **Play Store re-submission ONLY** for icon/manifest/package changes.
- Cadence: 2-week feature sprints + hotfix anytime.

## 3. Post-MVP feature roadmap (priority order)

| # | Feature | Why | Effort |
|---|---|---|---|
| 1 | **Receipt scanner** (Google Cloud Vision via Cloud Function) | Pro unlock driver | M |
| 2 | Recurring expenses (rent/utilities auto-split monthly) | Retention hook | M |
| 3 | Budgets & monthly reports PDF | Pro value | M |
| 4 | Multi-currency trips (PKR↔INR at fixed rate) | Travel use case | M |
| 5 | Group chat (WhatsApp-deep links only) | Stickiness | S |
| 6 | Export to Excel / Splitwise import | Migration win | S |
| 7 | Settlement reminders automation | Settlement rate ↑ | S |
| 8 | iOS PWA wrapper (or Safari guidance) | IN/PK iOS users | S |

## 4. Growth experiments (quarterly)

- **Referral loop:** "Invite 3 doston → 1 month Pro free" (growth mechanic #1)
- **Seasonal pushes:** Eid dinners, rent week, summer trips — themed templates
- **University ambassador program** (PK: LUMS/FAST/NUST; IN: colleges in blr/del)
- **Landing-page A/B:** install CTA vs "try in browser"
- **Pro A/B pricing:** Rs 299 vs Rs 199 annual (PK), ₹299 vs ₹199 (IN)

## 5. Compliance maintenance

- Keep Data Safety form in sync with any new data collection
- Re-verify Play Billing policy on every Android release (gate R3)
- Annual privacy policy review; keep `subscriptions` server-only (rules)

## 6. Escalation (when to do what)

- **Crash rate > 0.5%** → stop rollout, hotfix, resume
- **D30 < 15%** → double down on retention features (recurring, reminders) before growth spend
- **Settlement rate < 15%** → survey users; likely trust/UX issue in deep-link flow
- **Pro conversion < 1%** → re-price or bundle scanner earlier in onboarding
