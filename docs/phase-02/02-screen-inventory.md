# 📱 Screen Inventory — 33 Screens (390×844)

> **Phase 2 deliverable · v1.0** — 30 app screens + 3 PWA-specific screens (🆕, per plan v2 Phase 2).
> Each screen lists its key elements; detailed layouts live in `03-key-flow-specs.md`.

## A. Auth & Onboarding (5)

| # | Screen | Key elements |
|---|---|---|
| 1 | **Splash / Welcome** | Logo mark, tagline ("Dosto ke saath hisaab, bina jhanjhat"), language pills (EN/اردو/हिंदी), Continue button |
| 2 | **Language select** | 3 large option cards w/ native script preview, "Continue" |
| 3 | **Login (phone)** | Country code selector (+92 PK / +91 IN), phone input, "We'll send an OTP" note, Terms link, Continue |
| 4 | **Verify OTP** | 4–6 digit code boxes (`autocomplete="one-time-code"`), auto-read spinner, resend timer, "Change number" |
| 5 | **Onboarding — profile** | Name input, avatar picker (emoji/initials), Notifications opt-in card, "Start using BillSplit Dost" |

## B. Home & Groups (8)

| # | Screen | Key elements |
|---|---|---|
| 6 | **Home dashboard** | Greeting, owe/owed summary card (green/gold), quick actions (Add expense, Settle up), group chips, recent activity |
| 7 | **Groups tab** | Group list w/ avatar stacks, per-group balance ("You owe 450" / "You're owed 1,100" / "All settled"), FAB |
| 8 | **Group detail** | Header (name, avatar stack, member count), member chips, simplified balances card, expense list, "Add expense" |
| 9 | **Group settings** | Edit name, edit members, leave group (danger), delete group (admin only) |
| 10 | **Invite members** 🆕 flow | Share card w/ WhatsApp/SMS/email/copy-link targets, invite-link preview, "who has joined" list |
| 11 | **Balances (who owes whom)** | Simplified transfer list ("Ali → Imran: Rs 350"), full per-person breakdown, settle CTA |
| 12 | **Add expense — details** | Amount (numeric keypad), title, paid-by picker (multi-payer support), date, category grid |
| 13 | **Add expense — split** | Mode tabs (Equal / Percent / Shares / Exact), per-member toggles + inputs, live "each pays" preview, Save |

## C. Expenses & Settlement (7)

| # | Screen | Key elements |
|---|---|---|
| 14 | **Expense detail** | Title, amount, payer, date, category, split summary list, "Edit" / "Delete" (creator) |
| 15 | **Edit expense** | Same form as 12–13, pre-filled; audit note "edited by X on date" |
| 16 | **Settle list** | All debts (in + out) with "Pay" / "Request" buttons, grouped by person |
| 17 | **Settlement pay** ⭐ | Deep-link pay card: "You owe Ali Rs 1,500", payment-app chips (JazzCash/Easypaisa/Raast · GPay/PhonePe/Paytm), shield note, "Pay Now 💚", QR + copy fallback |
| 18 | **Mark paid (sender)** | Success state: "Payment sent! Waiting for Ali to confirm", transaction ref input (optional), "Done" |
| 19 | **Confirm receipt (receiver)** | "Ali sent you Rs 1,500 — Confirm received?" w/ amount + date, Confirm / Not yet |
| 20 | **Pro subscription** | Gold card, feature list, Rs 299/mo (PK) / ₹299/mo (IN), Safepay/Razorpay checkout note, restore purchase |

## D. History, Stats & Notifications (5)

| # | Screen | Key elements |
|---|---|---|
| 21 | **Activity / History** | Timeline of expenses + settlements, per-item expand, filter icon |
| 22 | **History filters** | Group, month, category, person, type (expense/settlement) |
| 23 | **Monthly summary** | Total spent, per-category bars, biggest expense, "this month vs last" |
| 24 | **Notifications** | Push events grouped by day: new expense, payment sent, payment confirmed, reminder; tap → deep link to item |
| 25 | **Help & FAQ** | "How does settlement work?", "Is my money safe?", privacy policy link, contact |

## E. Profile & Settings (5)

| # | Screen | Key elements |
|---|---|---|
| 26 | **Profile** | Avatar, name, phone (+92 masked), stats (groups, expenses, settled), settings links |
| 27 | **Settings** | Language, currency (PKR/INR), notifications toggles, theme (auto/light/dark), data & privacy |
| 28 | **Region/currency setup** | PK vs IN selection → sets +92/+91, PKR/INR, payment apps shown |
| 29 | **Edit profile** | Name, avatar, phone (re-verify on change) |
| 30 | **About / Privacy** | Version, licenses, privacy policy, terms, Play Store Data Safety mirror |

## 🆕 PWA-Specific Screens (3)

| # | Screen | Key elements |
|---|---|---|
| 31 | **Install prompt (custom A2HS)** | Dismissable card after "Add expense" #2 or Day 2: app preview + "Install — works offline" + "Not now" (fires `beforeinstallprompt`) |
| 32 | **Offline / no-connection** | Friendly disconnected state with cached-group access note, retry button, "You can still add expenses — they'll sync later" |
| 33 | **Update-available banner** | Slim top banner: "New version ready — tap to refresh" (from service-worker update event), refresh CTA |

---

## Design review checklist (before Phase 3)

- [ ] All 33 screens drafted in Figma @ 390×844
- [ ] Urdu RTL variants for screens 1–8, 12–13, 17
- [ ] 5+ user review on screens 6, 8, 12–13, 17 (the money screens)
- [ ] Prototype exported → `prototype/` for dev handoff
