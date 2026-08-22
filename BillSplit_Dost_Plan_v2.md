# 🏗️ BillSplit Dost — Build & Launch Guide (v2)
### Next.js PWA → Google Play Store (via TWA) | Pakistan 🇵🇰 | India 🇮🇳

> **What changed from v1:** Tech stack moved from native Kotlin/Jetpack Compose to **Next.js as an installable PWA, wrapped for Play Store with a Trusted Web Activity (TWA)**. Payment flow was corrected to avoid needing an RBI/SBP money-transmitter license. SMS/contacts permission issues from v1 are resolved by design (a web app never requests those Android permissions).

---

## 🗺️ MASTER ROADMAP OVERVIEW

```
PHASE 1 → PLANNING & RESEARCH        (Week 1–2)
PHASE 2 → DESIGN & UI/UX             (Week 3–5)
PHASE 3 → DEVELOPMENT SETUP          (Week 6–7)
PHASE 4 → CORE DEVELOPMENT (MVP)     (Week 8–13)   ← 1 week shorter, web is faster to build
PHASE 5 → PAYMENT INTEGRATION        (Week 14–16)
PHASE 6 → TESTING & QA               (Week 17–19)
PHASE 7 → TWA WRAP + PLAY STORE      (Week 20–21)
PHASE 8 → LAUNCH & MARKETING         (Week 22–23)
PHASE 9 → POST-LAUNCH & GROWTH       (Month 3+)
```

---

# ✅ PHASE 1 — PLANNING & RESEARCH (unchanged)
## ⏱️ Week 1–2

Same as v1 — scope, competitor analysis, team structure. No changes needed here; these decisions are stack-independent.

---

# 🎨 PHASE 2 — UI/UX DESIGN
## ⏱️ Week 3–5

Same 30-screen list and cultural design decisions as v1 (RTL Urdu, "Hisaab"/"Dost" branding, green/gold palette). One addition:

```
🆕 PWA-SPECIFIC SCREENS TO DESIGN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
31. "Add to Home Screen" install prompt (custom, not browser default)
32. Offline / no-connection state screen
33. Update-available banner ("New version ready — tap to refresh")
```

Design in Figma at **mobile web viewport (390×844)**, not native Android component sizes — you're designing HTML/CSS layouts now, not XML layouts.

---

# 💻 PHASE 3 — DEVELOPMENT ENVIRONMENT SETUP
## ⏱️ Week 6–7

### 📋 Step 3.1 — Install Development Tools

```
🛠️ SETUP (much lighter than native Android):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Node.js 20 LTS + pnpm
STEP 2: npx create-next-app@latest billsplit-dost --typescript --tailwind --app
STEP 3: Firebase CLI → npm i -g firebase-tools
STEP 4: VS Code (or any editor) — no Android Studio needed for the web app itself
STEP 5: Bubblewrap CLI (only needed in Phase 7, for the Play Store wrap)
         → npm i -g @bubblewrap/cli
```

### 📋 Step 3.2 — Tech Stack Decision (UPDATED)

```
🏗️ COMPLETE TECH STACK FOR BILLSPLIT DOST v2:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRONTEND (Next.js PWA):
┌──────────────────┬────────────────────────────┐
│ Framework        │ Next.js 15 (App Router)     │
│ Language         │ TypeScript                  │
│ Styling          │ Tailwind CSS + shadcn/ui    │
│ State            │ Zustand + React Query       │
│ PWA / Offline    │ Serwist (next-pwa successor)│
│ Animations       │ Framer Motion + Lottie-web  │
│ i18n / RTL       │ next-intl (ur, hi, en)      │
│ Forms            │ React Hook Form + Zod       │
└──────────────────┴────────────────────────────┘

BACKEND (unchanged — Firebase works great with web):
┌──────────────────┬────────────────────────────┐
│ Database         │ Firebase Firestore          │
│ Authentication   │ Firebase Auth — Phone (web) │
│ Push Notifications│ Firebase Cloud Messaging   │
│                   │  (Web Push, service worker)│
│ File Storage     │ Firebase Storage            │
│ Functions        │ Firebase Cloud Functions    │
│ Analytics        │ Firebase Analytics (GA4)    │
└──────────────────┴────────────────────────────┘

PAYMENTS (CORRECTED — see Phase 5 for why):
┌──────────────────┬────────────────────────────┐
│ P2P Settlement   │ UPI / Raast / wallet deep   │
│ (bill splitting) │ links — money never touches │
│                   │ your servers                │
│ Pro Subscription │ Safepay (PK) / Razorpay (IN)│
│ (your revenue)   │ hosted checkout — this is   │
│                   │ YOUR merchant transaction   │
└──────────────────┴────────────────────────────┘

OTHER TOOLS:
┌──────────────────┬────────────────────────────┐
│ Receipt Scanner  │ Google Cloud Vision API     │
│                   │ (server-side, via Cloud Fn)│
│ Maps (location)  │ Google Maps JavaScript API  │
│ Deep Links       │ Standard web links + custom │
│                   │ URI scheme via TWA manifest│
│ Crash/Error      │ Sentry (web-native)         │
│ Hosting          │ Vercel or Firebase Hosting  │
└──────────────────┴────────────────────────────┘
```

**Why this is a genuinely good fit for you:** one codebase serves the website, the installable PWA, and the Play Store app. No separate iOS rebuild later either — same PWA can wrap in an iOS equivalent (or just work in Safari) with far less extra work than a second native codebase would need.

### 📋 Step 3.3 — Project Structure Setup (UPDATED)

```
📁 NEXT.JS PROJECT STRUCTURE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
billsplit-dost/
├── app/
│   ├── (auth)/
│   │   ├── login/            ← Phone entry
│   │   └── verify/            ← OTP screen
│   ├── (main)/
│   │   ├── home/               ← Dashboard
│   │   ├── groups/[id]/        ← Group detail
│   │   ├── expense/new/        ← Add expense
│   │   ├── settle/[debtId]/    ← Settlement flow
│   │   └── profile/
│   ├── api/                    ← Route handlers (webhooks, Cloud Vision proxy)
│   ├── manifest.ts             ← PWA manifest (installability)
│   └── layout.tsx
├── components/
│   ├── ui/                     ← shadcn components
│   └── shared/
├── lib/
│   ├── firebase/
│   ├── payments/                ← UPI/Raast deep-link builders
│   └── debt-simplification.ts   ← Core splitting algorithm
├── messages/
│   ├── en.json / ur.json / hi.json
├── public/
│   ├── icons/                   ← PWA icons, all sizes
│   └── .well-known/
│       └── assetlinks.json      ← Required for TWA (Phase 7)
├── next.config.ts
└── package.json
```

---

# 📱 PHASE 4 — CORE APP DEVELOPMENT (MVP)
## ⏱️ Week 8–13

Same 6 modules as v1, but code examples are now TypeScript/React instead of Kotlin. Split-calculation logic, debt-simplification algorithm, dashboard, notifications, and history all carry over conceptually unchanged — only the implementation language changes.

#### 🔐 MODULE 1: AUTHENTICATION (Week 8)

```
✅ WHAT TO BUILD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Firebase Auth Phone provider + invisible reCAPTCHA
→ No SMS permission needed at all — this is the biggest
  win of the web approach. The browser's own OTP
  autofill (WebOTP API) handles auto-read on Android
  Chrome, zero permission dialogs.
→ Supports Pakistan (+92) & India (+91)

✅ Code Example (TypeScript):
━━━━━━━━━━━━━━━━━━━━━━━━━
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });

export async function sendOtp(phoneNumber: string) {
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
}

export async function verifyOtp(confirmationResult: ConfirmationResult, code: string) {
  return confirmationResult.confirm(code);
}
```

```
🆕 WebOTP for auto-fill (add to the OTP <input>):
<input autoComplete="one-time-code" ... />
navigator.credentials.get({ otp: { transport: ["sms"] } })
```

#### 👥 MODULE 2–6: Group Management, Expense Splitting Engine, Dashboard, Notifications, History

Logic and Firestore schema are **identical to v1** — this part of the plan doesn't need to change. One adjustment:

```
⚠️ CONTACTS ACCESS IS LIMITED ON WEB:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ The Contact Picker API exists on Chrome Android but
  is NOT available on iOS Safari and requires a user
  gesture each time (no persistent access, by design).
→ Don't rely on it as your only add-member flow.
→ Primary flow: user shares an invite link via
  WhatsApp/SMS share sheet (navigator.share()) —
  works everywhere, no permission needed, and is
  honestly a better growth mechanic anyway.
```

---

# 💳 PHASE 5 — PAYMENT INTEGRATION (CORRECTED)
## ⏱️ Week 14–16

### 📋 Step 5.1 — Why the v1 approach was a legal risk

The original plan had money flow: *user pays into your Safepay/Razorpay merchant account → your backend forwards it to the other user.* That pattern makes you a **payment aggregator**, and in India that requires RBI authorization with a ₹15–25 crore net-worth requirement and an escrow-nodal bank account — completely out of reach for an MVP, and operating without it is a violation of the Payment & Settlement Systems Act. Pakistan has an equivalent EMI/PSO licensing requirement via SBP for anyone routing customer funds.

### 📋 Step 5.2 — The corrected approach: you never touch the money

```
💸 CORRECTED SETTLEMENT FLOW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER TAPS "Settle with Ali"
    ↓
App shows: "You owe Ali Rs. 1,500"
    ↓
User taps "Pay Now 💚"
    ↓
App generates a DEEP LINK (not a payment sheet):
   Pakistan → raast://pay?receiver=+923001234567&amount=1500
             or jazzcash://pay?... / easypaisa://pay?...
   India    → upi://pay?pa=ali@okhdfc&am=1500&cu=INR
    ↓
This opens Ali's actual bank/wallet app on the SAME phone
(or shows a QR if scanning another device)
    ↓
Ali's own JazzCash/GPay/PhonePe app handles the transfer —
money moves bank-to-bank, never through your servers
    ↓
User taps "I've paid" in your app → other user confirms
receipt → debt marked SETTLED in Firestore
```

```
✅ WHY THIS IS BETTER, NOT JUST SAFER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ No merchant account, no PA/PSO license, no escrow
→ No transaction fees eating your margins on every settle
→ Faster to build — no payment gateway SDK integration
  needed for the core feature at all
→ Matches how Splitwise itself works — it never moves
  money either, it just recommends who pays whom
```

### 📋 Step 5.3 — Where Safepay / Razorpay DO belong

```
💰 USE PAYMENT AGGREGATORS ONLY FOR YOUR OWN REVENUE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ "BillSplit Dost Pro" subscription (₨299/month etc.)
→ This is a normal merchant transaction: user → you.
  No aggregator license issue here — you ARE the
  merchant, you're not routing funds to a third party.

🇵🇰 Safepay hosted checkout (web, not native SDK):
STEP 1: Register on sandbox.safepay.pk, get API keys
STEP 2: Server-side: create a checkout session via API
STEP 3: Redirect user to Safepay's hosted payment page
STEP 4: Webhook confirms payment → unlock Pro in Firestore

🇮🇳 Razorpay Checkout.js (drop-in web widget):
STEP 1: dashboard.razorpay.com → KYC → test keys
STEP 2: Load checkout.js, open Razorpay modal client-side
STEP 3: Verify signature server-side on your webhook
STEP 4: Unlock Pro in Firestore

⚠️ ONE THING TO VERIFY BEFORE BUILDING:
→ Since the app is wrapped for Play Store via TWA, check
  current Play Billing policy on whether a "service"
  subscription like this can use external checkout, or
  whether Google requires Play Billing for in-app digital
  subscriptions. This has specific carve-outs for real-world
  services — confirm your case against Play's current
  Billing policy before Phase 7 submission, not after.
```

---

# 🧪 PHASE 6 — TESTING & QA
## ⏱️ Week 17–19

```
🧪 UPDATED TOOLING (web-native, not Android-native):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ UNIT TESTING           → Vitest (split logic, debt algorithm)
2️⃣ INTEGRATION/E2E        → Playwright (auth flow, add expense, settle)
3️⃣ DEVICE/BROWSER TESTING → BrowserStack (real Android Chrome + Safari iOS)
4️⃣ PWA / PERFORMANCE      → Lighthouse CI (installability, offline, <2s load)
5️⃣ SECURITY               → Firebase Security Rules unit tests + OWASP checks
6️⃣ LOCALIZATION           → Manual pass on Urdu RTL, Hindi rendering, DD/MM/YYYY
```

Beta testing plan (internal → closed → open) is unchanged from v1, just distribute the PWA install link instead of an APK for early rounds — testers can install straight from the browser before you've even wrapped it for Play.

---

# 🏪 PHASE 7 — TWA WRAP + PLAY STORE SETUP
## ⏱️ Week 20–21

This replaces v1's "App Bundle Preparation" — you're not compiling native code, you're wrapping your deployed PWA.

```
📦 WRAPPING YOUR PWA AS AN ANDROID APP (TWA):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Deploy the Next.js PWA to production
   → Your manifest.json + service worker must be live
   → Lighthouse PWA score should be 90+ before wrapping

STEP 2: Host Digital Asset Links file
   → public/.well-known/assetlinks.json on your domain
   → This proves YOU own both the domain and the app —
     without it, the TWA shows a browser URL bar (bad UX)

STEP 3: Generate the Android project with Bubblewrap
   → bubblewrap init --manifest https://billsplitdost.pk/manifest.json
   → Answer prompts: package name, colors, icon

STEP 4: Build & sign the AAB
   → bubblewrap build
   → This produces a signed Android App Bundle — same
     file format Google Play expects, just built from
     your PWA instead of Gradle/Kotlin compilation
   → Store the keystore safely, same rule as v1

STEP 5: Everything else is IDENTICAL to v1's Phase 7:
   → $25 one-time Play Console fee
   → Data Safety form (phone number, financial info via
     3rd-party deep link — note you do NOT collect
     payment data directly, which is a genuinely simpler
     declaration than v1's approach)
   → Privacy Policy, screenshots, ASO listing
   → Closed testing (14 days, 12 testers) → Production
   → Staged rollout 10% → 50% → 100%
```

```
✅ PERMISSIONS DECLARATION IS SHORTER NOW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ No SMS permission (WebOTP handles it)
→ No Contacts permission (share-link invite flow)
→ Only Camera (receipt scanner, via browser getUserMedia)
  and Notifications — both low-friction, well-understood
  permissions that don't trigger extra Play review scrutiny
```

---

# 📣 PHASE 8 — LAUNCH & MARKETING
## ⏱️ Week 22–23

Unchanged from v1 — the pre-launch social campaign, launch day plan, and micro-influencer budget don't depend on tech stack. One addition: since it's a PWA, you can drive installs from **any** channel (Instagram bio link, WhatsApp, SMS) straight to an "Add to Home Screen" prompt — you're not fully gated behind the Play Store listing for your early access group.

---

# 📊 PHASE 9 — POST-LAUNCH GROWTH & MAINTENANCE
## Month 3 onwards

Unchanged from v1 — same KPIs, same update cadence. Ship updates via web deploy (instant for the PWA/web users) and note that TWA users get updates automatically too since it's just loading your live site — **no separate Play Store re-submission needed for most updates**, only for icon/manifest changes. This alone will save you real time over the native-app update cycle in v1.

---

# 💰 UPDATED COST BREAKDOWN

```
💸 TOTAL INVESTMENT NEEDED (v2):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌──────────────────────────────┬────────────┐
│ Expense                      │ Cost (PKR) │
├──────────────────────────────┼────────────┤
│ Google Play Developer Account│ Rs. 7,000  │
│ Firebase (Blaze plan/month)  │ Rs. 5,000  │
│ Vercel Pro (or Firebase      │ Rs. 3,000  │
│   Hosting — often free tier  │            │
│   is enough at MVP scale)    │            │
│ Figma Pro (optional)         │ Rs. 3,500  │
│ Domain + SSL                 │ Rs. 3,000  │
│ Safepay merchant setup       │ FREE       │
│   (used only for Pro subs)   │            │
│ Razorpay merchant setup      │ FREE       │
│ App Icon Design (Fiverr)     │ Rs. 5,000  │
│ Marketing (month 1)          │ Rs. 50,000 │
│ Developer (if outsourcing)   │ Rs. 120K+  │
├──────────────────────────────┼────────────┤
│ TOTAL (Self-build)           │ ~Rs. 68K   │
│ TOTAL (With developer)       │ ~Rs. 260K+ │
└──────────────────────────────┴────────────┘
```

Lower than v1 mainly because there's no Android Studio machine requirement, less native SDK integration work, and no payment-aggregator compliance overhead.

---

# 🏆 UPDATED TIMELINE SUMMARY

```
📅 MASTER TIMELINE — 23 WEEKS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 01–02 → 📋 Planning, Research, Team Setup
Week 03–05 → 🎨 UI/UX Design in Figma (33 screens, web viewport)
Week 06–07 → 💻 Next.js + Firebase Project Setup
Week 08–09 → 🔐 Auth (WebOTP) + Group Module
Week 10–11 → 💸 Expense Splitting Engine (Core)
Week 12–13 → 🏠 Dashboard + Notifications + History
Week 14–16 → 💳 Deep-Link Settlement + Pro Subscription Checkout
Week 17–18 → 🧪 Internal + Closed Beta Testing
Week 19    → 🐛 Bug Fixes + Lighthouse Performance Tuning
Week 20    → 📦 TWA Wrap (Bubblewrap) + Asset Links
Week 21    → 🏪 Play Store Submission + Compliance
Week 22    → 📣 Pre-Launch Marketing
Week 23    → 🚀 PUBLIC LAUNCH DAY! 🎉
Month 3+   → 📈 Growth, Updates & Expansion
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

> ## 🏅 FINAL CHECKLIST (v2)

```
✅ BEFORE YOU START CODING — VERIFY:
□ Figma designs approved by 5+ real users (web viewport)
□ Firebase project created & configured
□ Domain registered + assetlinks.json plan in place
□ Google Play Developer account created
□ Privacy Policy page live online
□ Confirmed Play Billing policy re: Pro subscription checkout

✅ BEFORE YOU SUBMIT TO PLAY STORE:
□ Lighthouse PWA score 90+
□ Digital Asset Links verified (no URL bar showing)
□ Closed beta completed (14 days, 12 testers)
□ Deep-link settlement tested on real JazzCash/Easypaisa/UPI apps
□ Data Safety form completed (note: no payment data collected directly)
□ App rating from beta > 4.0 stars

✅ BEFORE GOING 100% PUBLIC:
□ Staged rollout at 10% first
□ Customer support WhatsApp ready
□ Social media accounts active
□ First influencer content scheduled
```

> **💡 GOLDEN RULE (unchanged):** Build → Test → Launch Small → Listen to Users → Improve → Scale Big!

**Next up, if useful:** I can write the actual `debt-simplification.ts` algorithm, the Firestore security rules, or the Bubblewrap/TWA config file.
