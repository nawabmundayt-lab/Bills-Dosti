# 👥 Team Structure & Roles — BillSplit Dost

> **Phase 1 deliverable · v1.0** — for a solo founder or a lean team; phases mark when a role is needed.

## 1. Recommended Team (lean, 3 people ideal)

| Role | Full/Part | Needed from | Responsibility |
|---|---|---|---|
| **Product Owner / Founder** | Full | Phase 1 | Vision, scope, user interviews, legal checks, Play Store account, marketing |
| **Full-stack Developer** | Full | Phase 3 | Next.js app, Firebase, PWA, TWA wrap, tests, deploys |
| **UI/UX Designer** | Part (contract/Fiverr) | Phase 2 | Figma 33 screens @ 390×844, design system, app icon, Urdu typography |

> Solo-founder path: you cover Product + Dev; hire the designer for Phase 2 only (or use the design system from Phase 2 of this repo as a starting point).

## 2. Phase-wise role engagement

| Phase | Product Owner | Developer | Designer | External |
|---|---|---|---|---|
| P1 Planning & Research | ⭐ lead | review | — | 5+ user interviews |
| P2 Design | review | review | ⭐ lead | — |
| P3 Dev Setup | — | ⭐ lead | — | — |
| P4 Core Dev | review weekly | ⭐ lead | handoff support | — |
| P5 Payments | verify legal + Play Billing | ⭐ lead | — | Safepay/Razorpay sandbox support |
| P6 Testing | beta testers mgmt | ⭐ lead | — | 12 closed-beta testers |
| P7 TWA + Play | Play Console owner | ⭐ lead | icon/listing assets | Google Play review |
| P8 Launch | ⭐ lead | on-call | social assets | micro-influencers |
| P9 Growth | ⭐ lead | maintenance | — | support channels |

## 3. RACI for critical decisions

| Decision | R | A | C | I |
|---|---|---|---|---|
| MVP scope freeze | Developer | Product Owner | Designer | Testers |
| Firebase project config | Developer | Product Owner | — | — |
| Deep-link settlement UX | Designer | Product Owner | Developer | — |
| Play Billing vs external checkout | Developer | Product Owner | — | Google/legal |
| Pro pricing (Rs 299/mo etc.) | — | Product Owner | Designer | Beta testers |
| Go/No-Go for Play submission | Developer | Product Owner | — | QA/beta reports |

## 4. Tools & Accounts register (keep in a password manager)

| Tool | Owner | Phase |
|---|---|---|
| GitHub org (`nawabmundayt-lab/Bills-Dosti`) | Founder | now ✅ |
| Figma (or Figma Pro ₹3,500) | Designer | P2 |
| Firebase project (Blaze) | Developer | P3 |
| Vercel / Firebase Hosting | Developer | P3 |
| Safepay sandbox / Razorpay test | Product Owner | P5 |
| Play Console ($25 one-time ≈ Rs. 7,000) | Product Owner | P7 |
| BrowserStack | Developer | P6 |
| Sentry | Developer | P4 |

## 5. Cadence

- **Daily:** dev log in repo (`docs/phase-XX/devlog.md`) — one line per day.
- **Weekly:** founder/dev sync — 30 min: blockers, scope changes, metrics.
- **Milestone:** demo after each module in Phase 4.
