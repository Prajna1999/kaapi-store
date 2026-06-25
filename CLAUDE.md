@AGENTS.md
Kaapi App Store — PRD
v0.1 · Frontend / Container Scope · Draft
1. Problem
Kaapi's current GTM is B2B/B2B2C SaaS: long-cycle contracts sold to NGOs and government programs. Two structural gaps:
Cost gate: many social-sector orgs can't commit to subscriptions, even when interested. We lose the low-commitment-but-curious segment entirely.
Build gate: niche, high-value tools (e.g. alphabet learning for differently-abled kids, Marathi transliteration for ASHA workers) are too narrow to justify native SaaS build cycles, but are individually cheap to build with agentic coding.
Both point to the same fix: a low-friction container where narrow, single-task apps can be discovered, used, and paid for in small increments — independent of the sales cycle.
2. What we're building
A web container (the “App Store”) that lists unitary AI apps, gates usage behind login, meters consumption in a prepaid credit unit (“beans”), and converts paid usage into a sales lead for the main Kaapi contract. This PRD covers 
This PRD covers only the container — login, app listing/discovery, wallet, metering UI, and the upsell path. Individual apps are separate PRDs and are treated as plug-ins here.
Reference model
Apple/Play Store: a landing page + login that gateways discovery, with downloads/IAP as the validation signal.
I Love PDF: single-task tools, free tier → metered paid tier → API/enterprise tier. Proof that narrow utility tools have standalone PMF.
3. Goals (v1)
Goal
Metric
Lower the cost barrier to trying Kaapi
# of free-tier signups with zero prior Kaapi contact
Generate clean per-app usage signal
DAU/MAU and beans-burned, segmented by app
Validate willingness to pay
Free → paid conversion rate, per app
Create a contract pipeline
# of users who hit usage volume that triggers a sales handoff


Non-goals for v1: building new apps, multi-tenant org accounts, complex RBAC, white-labeling. The container should work with as few as 2–3 stub/mock apps to validate the shell.
4. Core user flows
4.1 Discovery → Signup
User lands on store homepage (public, no login) — sees app tiles, descriptions, ratings/usage counts.
Tapping “Install/Open” on any app prompts login (email or phone OTP — low friction, no enterprise SSO for v1).
On first login, user is granted a free beans balance (configurable; e.g. 100 beans).
4.2 Using an app
Each app is a single-task screen embedded in the store shell (own route, shared header/wallet widget).
Before a metered action runs, show cost in beans; deduct on completion, not on attempt (no charge for failed/errored runs).
Wallet balance is always visible in the header.
4.3 Running low → Top-up
At low-balance threshold, show in-context nudge (not a hard block) with a “Top up beans” CTA.
At zero balance, block the metered action with a paywall modal, not the whole app shell.
Top-up via real-money payment (Razorpay/Stripe — confirm regional split); fixed bean packs, no custom amounts in v1.
4.4 High-usage → Sales handoff
When a user/org crosses a configurable usage threshold (e.g. beans burned/month, or specific app's repeat usage), surface a “Talk to us about embedding this in your workflow” CTA and fire an internal lead-notification (Slack/email) with usage context attached.
This is the funnel's actual purpose: usage data on a free/cheap tool becomes the qualification signal for a full Kaapi contract, replacing cold outbound.
5. Information architecture
Screen
Auth
Key elements
Home / Store front
Public
Featured app, app grid/shelves, category filters, ratings
App detail
Public (view) / Login (use)
Description, screenshots, pricing-in-beans, reviews
App runtime (per app)
Login required
Single-task UI, cost-per-action indicator, result output
Wallet
Login required
Balance, transaction history, top-up packs
Account
Login required
Profile, login method, usage history across apps

6. Data model (indicative)
Entity
Key fields
User
id, contact (email/phone), created_at, org_hint (nullable, inferred from email domain)
App
id, slug, title, description, category, cost_per_action (beans), status (live/beta)
Wallet
user_id, balance, lifetime_purchased, lifetime_spent
Transaction
id, user_id, type (credit/debit/topup), app_id (nullable), beans, created_at
UsageEvent
id, user_id, app_id, action_type, beans_charged, success (bool), created_at
LeadSignal
id, user_id, trigger_reason, usage_snapshot, status (new/contacted/converted)


UsageEvent is the system's actual product: it's the dataset the “which app gets generalized into Kaapi” decision will be made from later. Log it even for free-tier, zero-cost actions.
7. Pricing mechanics
Unit: “Beans” — single platform-wide credit currency across all apps (not per-app currencies). Keeps the wallet mental model simple.
Free grant: fixed beans on signup, no recurring free refill in v1 (avoids gaming via re-signup — needs basic abuse check on email/phone reuse).
Top-up packs: 2–3 fixed price points only. No subscriptions in v1 — that's the SaaS motion this product exists to avoid.
Per-app cost: set per action type by the app owner (internal), not user-configurable.
8. Out of scope for v1
Org/team accounts and shared wallets
Per-app custom currencies or pricing experiments beyond a single global rate card
Public app submission / third-party developer onboarding
Localization beyond English (revisit once an app like the Marathi transliteration tool ships)
9. Open questions
Payment rails for low-value top-ups in India (UPI micropayments vs. card) — affects minimum viable pack size.
Does “org_hint” (email-domain inference) feed the sales handoff, or is that manual triage for v1?
Where does this live relative to kaapi.dev — subdomain, separate domain, or path?
