# Team Memory
Shared context across all agents. Read this at the start of every session. Write key decisions here when they are made.

---

## Product
- Core mechanic: prompt caching proxy — hash incoming prompts, check Redis, return cached or forward to LLM
- Stack: Python + FastAPI (backend), React + TypeScript + Tailwind (frontend), Redis (cache), Supabase (database)
- Status: deployed and live in production
- Two customer segments: startups (self-serve / PLG) and enterprise (sales-led)

## Company
- Name: Cachex
- [DECISION] Company name decided: Cachex (2026-03-21)
- [DECISION] Brand direction established (2026-03-21) — see brand-guidelines.md (pending file creation)
- Brand position: infrastructure layer that saves LLM API costs. Tone: Cloudflare/Datadog/Stripe tier — serious, technical, data-driven.
- Colors: Void `#0D1117` (bg) + Cache `#00C9A7` (brand teal accent)
- Typography: Inter (UI/headings) + JetBrains Mono (code/data)
- Logo: wordmark-only, "Cachex" Inter 700, "x" in teal. No icon mark yet.
- Voice: precise, direct, credible, dry. Lead with numbers. No buzzwords.
- Stage: pre-launch, no paying customers yet

## Pricing
- [DECISION] Model: tiered subscription on requests proxied, with monthly spend cap (overages capped at 2x tier price) (2026-03-21)
- Tiers: Free (50K req/mo) → Starter $49/mo (1M) → Growth $199/mo (10M) → Scale $799/mo (50M) → Enterprise custom
- Design partner offer: free for 6 months in exchange for feedback calls + case study + logo rights; grandfathered at 40% off after
- Sell with ROI framing: show payback based on customer's LLM spend + request volume
- Unit economics targets: gross margin >75%, LTV:CAC >10x self-serve, payback period <3 months
- GDPR flag for Magnus: billing must use only request/hit counts — never store prompt content for billing purposes

## Growth
- Goal: 10 design partners before optimizing anything else
- Wave 1 in-flight (2026-03-22) — 5 targets: Kapa.ai, Mendable, Lindy.ai, Dust.tt, Chaindesk. Warm intros welcome.
- All outreach blockers cleared (2026-03-22)
- [DECISION] Design partner ICP: AI-native startups (Series A or below) with $2k–$30k/month LLM spend, or mid-market with LLM workflows — outreach target is CTO/founding engineer (2026-03-21)
- [DECISION] Design partner deal: free for 6 months (per Nora's pricing) in exchange for weekly feedback syncs + public case study on launch (2026-03-21)
- [DECISION] Primary outreach channels: founder warm intros first, then X/Twitter (search LLM cost complaints), then LinkedIn cold outreach to AI startup CTOs (2026-03-21)
- [DECISION] Pipeline math: ~70 touches → 10+ calls → 10 signed design partners, target 5 weeks (2026-03-21)

## Technical Decisions
- Backend hosted on Railway at cachex-production.up.railway.app, frontend on Vercel at cachex-vc4x.vercel.app
- Multi-tenancy: API keys hashed with SHA-256, namespaced in Redis per tenant
- Cache TTL: 7 days
- [DECISION] Use CACHEX_SUPABASE_URL (not SUPABASE_URL) — Railway reserves that name (2026-03-22)
- [DECISION] Redis must be in same Railway project as backend — internal networking only works within same project (2026-03-22)
- [DECISION] Set FRONTEND_URL env var in Railway to the exact Vercel URL for CORS to work (2026-03-22)

## Legal
- Norwegian company — GDPR applies
- [DECISION] Legal entity: Cachex AS, Thorry Kiærs Veg 9, 7055 Trondheim, Norway (2026-03-22)
- [DECISION] Privacy policy drafted and live at /privacy — GDPR-compliant, covers data types, retention, sub-processors, user rights (2026-03-22)
- [DECISION] Terms of Service drafted and live at /terms — covers acceptable use, liability cap (12 months fees), governing law (Norway) (2026-03-22)
- [DECISION] Data retention: request metadata 90 days, account data 30 days post-deletion, billing records 5 years (Norwegian accounting law) (2026-03-22)
- [DECISION] Contact email for legal/privacy: privacy@cachex.dev (2026-03-22)
- Recommend professional legal review before first enterprise customer or significant revenue
- [RESOLVED] Google Fonts GDPR risk — fonts already self-hosted via @fontsource/inter + @fontsource/jetbrains-mono npm packages; no Google CDN requests (verified 2026-03-22)

## Current Sprint
**Sprint 1 — "First Paying Customer" | 2026-03-21 → 2026-04-04**
Sprint Definition of Done: A new user can sign up, pay, get an API key, and make a cached LLM request — without talking to anyone on the team.

### Goal 1: Production Deploy (Dag)
- [x] Deploy backend to Railway — live at cachex-production.up.railway.app
- [x] Connect Supabase + Redis in prod — cache hit/miss verified in production
- [x] Deploy frontend to Vercel — live at cachex-vc4x.vercel.app
- [x] End-to-end smoke test in prod — cache hit/miss + CORS verified (2026-03-22)
- [DECISION] Railway: set root dir=backend, port=8080, use CACHEX_SUPABASE_URL (not SUPABASE_URL), Redis must be in same project (2026-03-21)

### Goal 2: Self-Serve Onboarding (Arve + Ingrid) ✓ DONE
- [x] Sign-up / sign-in with Supabase Auth
- [x] Auth guard on dashboard
- [x] API key creation UI (generate, copy, revoke)
- [x] Quick-start snippet shown after key is created

**[DECISION] Onboarding UI direction (Ingrid, 2026-03-21):**
- 3-step wizard pattern (no sidebar nav, progress indicator only): Signup → Key Creation → Quick-Start
- Build order: 1) Signup/Login, 2) Key Creation modal + list, 3) Quick-start snippet tabs
- Signup: email + password + single ToS/Privacy checkbox (GDPR), no social auth in Sprint 1
- Key creation: modal flow, show full key once with copy button (Stripe pattern), never shown again warning
- Quick-start: 3 tabs (curl/Python/Node), actual key pre-filled, JetBrains Mono code blocks, teal accent on base_url
- Proxy base_url: `https://api.cachex.dev/v1` replacing `https://api.openai.com/v1`
- Colors: #0D1117 bg, #00C9A7 primary CTA, #161B22 code block bg

### Goal 3: Revenue-Ready (Arve + Magnus) ✓ DONE
- [x] Stripe Checkout integration — Starter $49, Growth $199, Scale $799/mo (2026-03-22)
- [x] Stripe webhook handler — activates plan on checkout.session.completed (2026-03-22)
- [x] Enforce paywall: proxy returns 402 if over plan limit (2026-03-22)
- [x] Privacy policy published at /privacy, GDPR-compliant, linked from signup (Magnus) (2026-03-22)
- [x] ToS published at /terms, accepted on signup (Magnus) (2026-03-22)
- [DECISION] Stripe in test mode — switch to live keys before real launch (2026-03-22)
- Stripe live checklist (Arve to execute): (1) verify Stripe account — Norwegian business details, bank account, VAT/org number; (2) replace STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET in Railway env vars with live-mode keys; (3) re-register webhook endpoint in Stripe live mode dashboard (test webhooks don't carry over); (4) smoke test with real card before first outreach converts

### Goal 4: Design Partner Outreach (Halvard)
- [x] Identify 10 target companies with high LLM usage (2026-03-22)
- [x] Draft outreach email — 3-sentence format, 2 variants (LinkedIn + X DM) (2026-03-22)
- [~] Send first wave — 5 targets: Kapa.ai, Mendable, Lindy.ai, Dust.tt, Chaindesk (in-flight)
- [DECISION] Wave 1 targets chosen for repeat-prompt fit + founder reachability (2026-03-22)
- [DECISION] Reply rate target: >15% on wave 1 before scaling wave 2 (2026-03-22)

Previously completed:
- [x] Pick company name (Jorunn) — Cachex ✓
- [x] Brand direction, tone of voice, visual guidelines (Jorunn) ✓
- [x] Decide pricing model (Nora) ✓
- [x] Design system + full auth/dashboard UI scaffold (2026-03-21) ✓
  - [DECISION] Brand tokens encoded in tailwind.config.js (void, surface, elevated, stroke, teal, danger, ink palette) (2026-03-21)
  - [DECISION] Supabase Auth used for sign-up/sign-in; JWT passed as Bearer token to backend (2026-03-21)
  - [DECISION] API client uses Supabase session interceptor — no separate API key env var needed for auth (2026-03-21)
  - Components delivered: Button, Input, Badge, Card, Modal, Tabs, CodeBlock, AuthLayout, DashboardLayout
  - Pages delivered: SignUp, SignIn, Dashboard, ApiKeys, QuickStart
  - Proxy base_url in Quick-start snippets: https://api.cachex.dev/v1

---
_Last updated: 2026-03-22 (Sprint 1 complete. One pre-launch blocker remaining: Arve/Nora switch Stripe to live keys)_
