# ⚠️ Risk Register — BillSplit Dost

> **Phase 1 deliverable · v1.0** — owned by Product Owner; reviewed weekly from Phase 4 onward.

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R1 | **Payment aggregator trap** — building money-routing = RBI/SBP license requirement | Med (if scope creeps) | **Critical** (legal) | Hard rule: money never touches our servers. Deep links only (D3 in PRD). Code-review gate on any payment code path. | Developer + PO |
| R2 | **Play Store rejects TWA** (Digital Asset Links misconfigured, URL bar shows, PWA not installable) | Med | High (launch blocked) | assetlinks.json planned in P3; Lighthouse ≥90 gate in P6; verify DAL with tester account before submission (P7) | Developer |
| R3 | **Play Billing policy conflict** for Pro subscription in TWA (external checkout vs Play Billing) | Med | High (revenue blocked) | Verify against current Play policy during Phase 5, NOT at P7; fallback: gate Pro behind web-only for now | PO |
| R4 | **Deep-link schemes change/break** (raast://, jazzcash://, easypaisa://, upi://) | High | Medium | Abstract behind `lib/payments` builders; QR + copy-UPI-ID fallback for every payment method | Developer |
| R5 | **WebOTP fails / reCAPTCHA friction** on older Android browsers | Med | Medium (auth drop-off) | Manual OTP entry fallback; test on Chrome Android + Samsung Internet in BrowserStack | Developer |
| R6 | **User adoption stalls** (apps are social: one empty group = churn) | High | High | Invite-link onboarding with WhatsApp share sheet; "import from WhatsApp" style prompts; group-first activation metric | PO |
| R7 | **Settlement trust gap** — "I paid" without counterpart confirmation leads to disputes | Med | High | Confirmation flow on both sides; transaction log; dispute = manual override by group admin; design clear statuses | PO + Designer |
| R8 | **Firestore cost blow-up** (chatty reads, hot documents) | Med | Medium | Security rules + indexes; React Query caching; Firestore usage alerts at 50% budget | Developer |
| R9 | **Urdu RTL rendering bugs** | High | Medium | RTL tested from day 1 in P4; dedicated QA pass (P6); use system Urdu fonts, avoid mixing LTR numbers | Designer + Developer |
| R10 | **Number spoofing / SIM-swap on phone auth** | Low | Med | Firebase phone auth safeguards; keep user data low-sensitivity (no PII beyond phone + name) | Developer |
| R11 | **Competitor copies the wedge fast** | Med | Med | Speed + local trust + WhatsApp growth loop; brand "Dost" identity early (P2) | PO |
| R12 | **Solo-dev burnout / timeline slip** | Med | Med | 23-week plan with 2-week buffer baked in; scope discipline (MVP list is hard-locked) | PO |

## Severity matrix summary

```
CRITICAL: R1  → mitigate by architecture (done, D3)
HIGH:     R2, R3, R6, R7 → each has an owner + a phase-gated check
MEDIUM:   R4, R5, R8, R9, R11, R12 → standard practices
LOW:      R10 → accepted
```

## Phase-gated checks

- [ ] **End of Phase 3:** Firebase project live, env vars secured, domain + assetlinks plan confirmed → closes R2 (partial)
- [ ] **End of Phase 5:** Play Billing policy verified in writing → closes R3
- [ ] **End of Phase 6:** deep links tested on real JazzCash/Easypaisa/GPay/PhonePe devices → closes R4
- [ ] **End of Phase 6:** RTL + Urdu QA pass completed → closes R9
