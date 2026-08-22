# 💻 Phase 3 — Setup Notes (BillSplit Dost)

> Stack locked per plan v2 §3.2. Completed **2026-08-21** in sandbox; reproducible locally with the commands below.

## Versions installed

| Package | Version | Note |
|---|---|---|
| Next.js | 15.5.23 (App Router) | Plan pins Next 15 |
| React | 19.1.0 | |
| TypeScript | 5.x | |
| Tailwind CSS | 4.x | CSS-first config (`@theme` in `app/globals.css`) |
| Serwist / @serwist/next | 9.5.12 | PWA service worker (`app/sw.ts` → `public/sw.js`) |
| next-intl | 4.13.7 | en / ur / hi + RTL |
| Firebase SDK | 12.18 | Auth, Firestore, FCM wired via `lib/firebase/` |
| Zustand | 5.0 | Client state (`lib/store/app-store.ts`) |
| TanStack React Query | 5.101 | Server-state (`components/providers.tsx`) |
| zod + react-hook-form | 4.4 / 7.85 | Form validation (login uses zod already) |
| framer-motion | 13.1 | Animations (used from Phase 4) |
| cva + clsx + tailwind-merge | — | shadcn-style UI primitives (`components/ui/`) |
| lucide-react | 1.33 | Icons |

## Project structure (matches plan §3.3)

```
billsplit-dost/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/login, (auth)/verify      ← Phone entry + OTP (demo mode)
│   │   ├── (main)/home, groups, groups/[id],
│   │   │   expense/new, settle/[debtId], profile, activity
│   │   ├── page.tsx                          ← Welcome + language picker
│   │   └── layout.tsx                        ← dir/lang, providers, SW
│   ├── api/health                            ← health check route
│   ├── manifest.ts                           ← PWA manifest
│   ├── sw.ts                                 ← Serwist worker
│   └── globals.css                           ← design tokens (@theme)
├── components/{ui,shared}/                   ← Button, Input, Card, BottomNav, SW register
├── lib/
│   ├── firebase/{config,auth}.ts             ← lazy init, demo-mode safe
│   ├── payments/deep-links.ts                ← raast:// jazzcash:// easypaisa:// upi://
│   ├── debt-simplification.ts                ← split modes + simplifyDebts (implemented)
│   ├── store/app-store.ts                    ← Zustand
│   └── utils.ts                              ← cn(), formatMoney()
├── i18n/{routing,request}.ts + middleware.ts
├── messages/{en,ur,hi}.json
├── public/icons/*, apple-touch-icon.png, .well-known/assetlinks.json (placeholder)
├── .env.example
└── next.config.ts
```

## Demo mode

Firebase env vars are intentionally unset → `getFirebaseApp()` returns `null`, login/OTP run in demo mode (any 4-digit OTP proceeds). Add keys to `.env.local` to switch on real auth. This lets Phase 4 UI development proceed without waiting for backend keys.

## Run

```bash
cd billsplit-dost
npm install
npm run dev          # http://localhost:3000 → /en
npm run build && npm run start   # prod (registers service worker)
```

## Still to do in Phase 3 (human/account steps)

- [ ] Create Firebase project (Blaze) + web app; copy keys to `.env.local`
- [ ] Enable **Phone** auth provider (PK +92 / IN +91) in Firebase Console
- [ ] Enable Firestore + FCM (VAPID key) when reaching Phase 4 M1/M5
- [ ] Register domain (e.g. `billsplitdost.pk`) — needed for real auth redirects + Phase 7
- [ ] `npm i -g firebase-tools` when ready to deploy rules
- [ ] Bubblewrap CLI only in Phase 7
- [ ] CI: add lint + typecheck + Vitest (Phase 6 adds the test runner)
