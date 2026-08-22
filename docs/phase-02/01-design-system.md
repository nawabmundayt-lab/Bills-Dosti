# 🎨 Design System — BillSplit Dost

> **Phase 2 deliverable · v1.0** · Design at **mobile web viewport 390×844** (HTML/CSS, not native Android sizes).
> Built for **Figma → Tailwind tokens** handoff in Phase 3.

---

## 1. Brand pillars

| Pillar | Meaning | How it shows |
|---|---|---|
| **Dosti (دوستی)** | Friendship first, money second | Warm copy ("Chai pe hisaab karo"), friendly microcopy, no guilt-trip tones |
| **Hisaab (حساب)** | Transparent, fair accounting | Every rupee traceable, simplified debts, clear "who owes whom" |
| **Easy** | 3 taps to add an expense | Big touch targets, FAB-first, minimal forms |
| **Local** | PK + IN, Urdu/RTL, Hindi | Green/gold palette, local payment apps, Urdu typography |
| **Trustworthy** | Money never touches us | Deep-link pay cards explain "money goes bank-to-bank" |

## 2. Color tokens

### Light (default)

| Token | Hex | Usage |
|---|---|---|
| `--green-600` **primary** | `#0E7A3D` | Primary buttons, active nav, links, success accents |
| `--green-700` | `#0B5D33` | Pressed states, gradients |
| `--green-100` | `#D9F2E3` | Tinted chips, backgrounds, icons |
| `--gold-500` **accent** | `#E8A800` | Pro, "you're owed" money, highlights, star badges |
| `--gold-100` | `#FCF3D4` | Gold chips/backgrounds |
| `--ink` | `#16211B` | Primary text (green-tinted near-black) |
| `--muted` | `#5C6B62` | Secondary text |
| `--bg` | `#F6F8F6` | App background |
| `--surface` | `#FFFFFF` | Cards, sheets |
| `--border` | `#E2E9E3` | Hairlines, inputs |
| `--danger` | `#D64545` | Errors, delete, "you owe" in critical states |
| `--success` | `#1E9E5A` | Settled/confirmed states |
| `--overlay` | `rgba(22,33,27,0.5)` | Scrims |

### Dark (Phase 4, after light ships)

`--bg:#101612` · `--surface:#1A231D` · `--ink:#EAF2EC` · `--muted:#9AA99F` · borders `#2A362E`. Green/gold stay, slightly desaturated.

### Rules
- **Money semantics:** "You owe" always **ink/muted** (neutral, not shaming) · "You are owed" uses **green** · amounts that need attention use **gold**. Red reserved for errors/deletes — never for debts.
- Text on primary green = white; on gold = ink.

## 3. Typography

| Token | Size/Weight | Usage |
|---|---|---|
| Display | 34 / 800 | Hero numerals, empty states |
| H1 | 28 / 700 | Screen titles |
| H2 | 22 / 700 | Section titles |
| Title | 18 / 600 | Card titles |
| Body | 16 / 400 | Default text |
| Body-S | 14 / 400 | Secondary, timestamps |
| Caption | 12 / 500 | Labels, badges |
| **Money** | Tabular-nums, `font-variant-numeric: tabular-nums` | All amounts — never let digits jitter |

- **Latin/English:** Inter (system fallback: Roboto/SF).
- **Urdu:** Noto Nastaliq Urdu for display; Noto Naskh Arabic for UI body at 16–18 (Nastaliq is hard to read small). Urdu base size ≥ Latin base +2px.
- **Hindi:** Noto Sans Devanagari.
- **RTL rules:** `dir="rtl"` mirrors layout; numbers/currency stay LTR (`unicode-bidi: plaintext` on amount strings); icons that imply direction (arrows, chevrons) flip.

## 4. Spacing, radius, elevation

- **Spacing:** 4-pt grid — 4/8/12/16/24/32/48. Page gutters 20px. Card padding 16px. Bottom-sheet padding 24/20.
- **Radius:** sm 8 (inputs, chips) · md 12 (cards) · lg 16 (sheets, FAB) · full (pills, avatars).
- **Elevation (shadows):** card `0 1px 2px rgba(22,33,27,.06)`, floating (FAB/sheets) `0 8px 24px rgba(22,33,27,.14)`. Sheets get a 12px top radius + scrim.
- **Touch targets:** ≥ 44×44px always (PWA = browsers; be forgiving).

## 5. Components

| Component | Spec notes |
|---|---|
| **Top bar** | 56px, title left (RTL: right), actions right; transparent over hero, surface on scroll |
| **Bottom nav** | 64px + safe-area inset; 4 tabs: Home, Groups, Activity, Profile; active = green icon + label, pill indicator |
| **FAB** | 56px, green, "+" icon; primary global action (Add expense) |
| **Primary button** | 52px height, green, white 16/600 label, radius 12; states: pressed `--green-700`, disabled 40% opacity |
| **Secondary button** | Outline 1.5px border, ink text |
| **Ghost / danger text** | For "Leave group", "Delete expense" |
| **Input** | 52px, bg `--bg`, border `--border`, radius 12, focus ring 2px green |
| **Chips** | Height 36, radius full; selected = green-100 bg + green-700 text |
| **Card** | Surface, radius 12, hairline border |
| **Bottom sheet** | Radius 16 top, grab handle 40×4, drag to dismiss, scrim `--overlay` |
| **Snackbar/Toast** | Radius 12, ink bg, white text, bottom above nav, auto-dismiss 4s |
| **Badges** | 20px min-height, green-100/gold-100 variants |
| **Deep-link pay card** | Green-100 bg, app chips, shield icon + line: "Money goes bank-to-bank. We never touch it." |
| **Empty states** | Illustration + title + body + one CTA (e.g. "No expenses yet — add the first one") |
| **Skeleton** | shimmer blocks for loading lists |

## 6. Iconography & illustration

- **Icons:** Lucide-style, 24px grid, 1.75px stroke, rounded caps. Money = coin/split motifs; friendship = people/handshake.
- **Category icons** (28px in filled tint circles): 🍔 Food · 🛒 Groceries · 🏠 Rent · ⚡ Utilities · ⛽ Fuel · 🎉 Fun · 🧳 Trip · 📱 Subscriptions · ➕ Other.
- **Illustrations:** flat, rounded, green/gold duotone on tint backgrounds; used in empty states, welcome, offline, install prompt.

## 7. Motion (Framer Motion in dev)

| Pattern | Duration/ease | Notes |
|---|---|---|
| Screen enter | 220ms ease-out, 8px slide+fade | Respect reduced-motion |
| Sheet up | 280ms spring | Never bounce >4% |
| Press feedback | 80ms scale .98 | Buttons only |
| Number tick | 300ms | Amounts on settle; optional |

## 8. Accessibility

- Contrast: all text combos pass WCAG AA (green-600 on white = 5.4:1 ✅).
- Focus rings 2px green on all interactive elements.
- `prefers-reduced-motion` disables all motion.
- Labels for icons via `aria-label`; sheets trap focus; nav has `role="tablist"`.

## 9. Handoff → Phase 3 (Tailwind)

Map tokens 1:1 into `tailwind.config` (`brand.green.600` etc.) and CSS vars in `:root`. Fonts: load `Inter`, `Noto Nastaliq Urdu`, `Noto Sans Devanagari` via `next/font`.
