# 📦 TWA — Trusted Web Activity wrap (Phase 7)

> Status: **config ready** · requires: deployed PWA (Lighthouse ≥90), domain with assetlinks, Java/Android SDK on the build machine.

## Prereqs

```bash
npm i -g @bubblewrap/cli        # TWA generator
node -v                         # ≥ 18
# Java 11+ and Android SDK (bubblewrap needs them to build the AAB)
```

## Steps

1. **Deploy the PWA** to `https://billsplitdost.pk` (Vercel or Firebase Hosting).
   Confirm `/manifest.webmanifest` + `/sw.js` + `/icons/*` are live.

2. **Host Digital Asset Links** — the app must prove it owns the domain.
   Fill the real fingerprint in `billsplit-dost/public/.well-known/assetlinks.json`:
   ```json
   {
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.billsplitdost.app",
       "sha256_cert_fingerprints": ["<RELEASE_KEYSTORE_SHA256>"]
     }
   }
   ```
   Verify with: `curl https://billsplitdost.pk/.well-known/assetlinks.json`

3. **Generate the Android project:**
   ```bash
   cd twa
   bubblewrap init --manifest https://billsplitdost.pk/manifest.webmanifest
   # answers come from twa-manifest.json — keep packageId com.billsplitdost.app
   ```

4. **Keystore (DO NOT LOSE THIS):**
   ```bash
   keytool -genkey -v -keystore ../keystore/billsplitdost-release.keystore \
     -alias billsplitdost -keyalg RSA -keysize 2048 -validity 10000
   keytool -list -v -keystore ../keystore/billsplitdost-release.keystore \
     -alias billsplitdost | grep SHA256   # → paste into assetlinks.json
   ```
   Store the keystore + passwords in a password manager AND offline backup.
   Losing it = permanent loss of the Play identity.

5. **Build & sign the AAB:**
   ```bash
   bubblewrap build
   # → twa/app-release-bundle.aab  (signed Android App Bundle for Play)
   ```

6. **Install on a device for testing:** `bubblewrap install` (via adb).

## Permissions declared

| Permission | Why | Notes |
|---|---|---|
| Camera | Receipt scanner (browser `getUserMedia`) | Low-friction |
| Notifications | Expense/payment push | Low-friction |
| — SMS | **None** | WebOTP handles OTP |
| — Contacts | **None** | Invite-link flow |

## Data Safety form (short version)

- **Phone number** — collected (auth), not shared, encrypted in transit.
- **Financial info** — NOT collected. Payments happen in third-party apps via
  deep links; we only record user-confirmed settlement statuses.
- **Photos** — camera only when user scans a receipt (Pro), stored in Firebase Storage.
- **Messages** — not collected.

See `docs/phase-07/01-play-store-submission.md` for the full checklist.
