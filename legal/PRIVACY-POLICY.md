# Visora — Privacy Policy

**Effective date:** [DATE BEFORE SUBMISSION] · **Last updated:** [DATE]

Visora is a daily ritual + vision-board app made by Essea Labs Pty Ltd ("we", "us"). This policy explains what we collect, why, and the choices you have. It is written to be readable — if anything is unclear, email [privacy@tryvisora.com](mailto:privacy@tryvisora.com).

---

## 1. What we collect and where it lives

### On your device (never leaves)
The following are stored locally on your device and **never transmitted to our servers**:

- **Vision photos** — images you pick from your camera roll for your vision board.
- **Win photos** — images you attach when capturing a win.
- **Vision text** — names, identity statements, customisation of vision areas.
- **Win text** — what you type when capturing a win.
- **Daily intention text** — what you write at the end of the ritual.
- **Ritual completion timestamps** — used to show streaks and roll the daily intention.

These are stored using your device's local storage (AsyncStorage on iOS). Uninstalling the app deletes them.

### On our servers (only when authenticated)
Once you sign in with Apple (planned feature — not yet active at MVP launch):

- **Your Apple user identifier** (a stable opaque ID — not your Apple email).
- **A sync copy of your visions, wins, and ritual sessions** so you can use Visora on a new device.

Server-side data lives in **Supabase** (hosted in [REGION TO CONFIRM, e.g. Sydney, AU]) and is encrypted in transit (TLS) and at rest.

### From your subscription
If you subscribe via the App Store, **Apple** processes payment. We do not see your credit card. We receive a subscription status (active / cancelled / lapsed) via **RevenueCat** so we can grant/revoke premium features.

### Crash & performance data
We use **Sentry** to collect crash reports and basic performance traces. Reports include:
- App version, OS version, device model.
- The line of code that crashed.
- A short trail of actions leading to the crash (no text content from your visions/wins/intentions).

This is opt-out at the OS level (Settings → Privacy & Security → Analytics & Improvements).

### What we do NOT collect

- Your location.
- Your contacts.
- Your microphone (we play audio; we don't record).
- Your camera roll beyond the photos you explicitly pick.
- Behavioural tracking for advertising.
- Identifiers for tracking across other apps.

---

## 2. Why we collect what we collect

- **To make the app work.** Your visions, wins, and intentions are the app.
- **To sync across devices** (when you sign in).
- **To verify your subscription** (Apple gives us a yes/no, nothing more).
- **To fix crashes** so we can improve the app for everyone.

We do not sell your data. We do not run ads. We do not share data with brokers.

---

## 3. Permissions we request

| Permission | When | Why |
|---|---|---|
| **Photos library — read** | When you tap "Pick photos" on a vision or win | To let you choose which photos go on your vision board / accompany a win. We access only the photos you pick. |
| **Photos library — write** (optional) | If we ever offer "Save this win as a photo" | Currently unused. |
| **Notifications** (planned) | When you opt in to morning ritual reminders | To remind you to do your daily ritual. |
| **Background audio** | While the ritual is playing | To let the ritual audio keep playing if you lock your phone or switch apps. |

You can revoke any of these at any time in your device's Settings.

---

## 4. Children

Visora is rated 4+ but is designed for adults practising self-reflection. We do not knowingly collect data from children under 13. If you believe a child has provided data to us, email [privacy@tryvisora.com](mailto:privacy@tryvisora.com) and we will delete it.

---

## 5. Your rights

You can:
- **Delete your account and all server data** — once auth is live, via Settings → Delete account (or email us).
- **Export your data** — once auth is live, your data will be exportable as JSON.
- **Stop crash reporting** — iOS Settings → Privacy & Security → Analytics & Improvements → toggle off Share with App Developers.
- **Withdraw photo access** — iOS Settings → Visora → Photos.

Residents of the EU/UK/California: you have additional rights under GDPR/CCPA (access, rectification, erasure, portability, objection). Email us to exercise them.

---

## 6. Data retention

- **Local data** — until you delete the app.
- **Server data** — until you delete your account.
- **Crash reports** — 90 days, then auto-purged by Sentry.

---

## 7. Third-party services we use

| Service | Purpose | Data sent |
|---|---|---|
| **Apple App Store** | Distribution + payment | Your Apple ID (not visible to us), payment details (not visible to us) |
| **Supabase** | Sync + auth backend | Apple user ID, visions, wins, ritual sessions (after Phase B.7) |
| **RevenueCat** | Subscription management | Anonymous subscriber ID, App Store receipt |
| **Sentry** | Crash & performance reporting | App version, OS, device, stack traces |
| **PostHog** | Anonymous product analytics (which features get used) | Anonymous session ID, screen views, app version, OS, device — no text content from your visions/wins/intentions |
| **ElevenLabs** | Generates the ritual voice (one-off, at build time) | Not used at runtime. No personal data sent. |

Each has its own privacy policy. We've chosen them because they have strong privacy track records.

---

## 8. Changes to this policy

If we make material changes, we'll update the "Effective date" and notify you in-app. Continued use after an update means you accept the changes.

---

## 9. Contact

**Essea Labs Pty Ltd**
[REGISTERED ADDRESS HERE]
Email: [privacy@tryvisora.com](mailto:privacy@tryvisora.com)

For data-protection enquiries (GDPR/CCPA): [dpo@tryvisora.com](mailto:dpo@tryvisora.com)
