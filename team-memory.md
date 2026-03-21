# Team Memory
Shared context across all agents. Read this at the start of every session. Write key decisions here when they are made.

---

## Product
- Core mechanic: prompt caching proxy — hash incoming prompts, check Redis, return cached or forward to LLM
- Stack: Python + FastAPI (backend), React + TypeScript + Tailwind (frontend), Redis (cache), Supabase (database)
- Status: working locally, not yet deployed
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
- No outreach started yet
- [DECISION] Design partner ICP: AI-native startups (Series A or below) with $2k–$30k/month LLM spend, or mid-market with LLM workflows — outreach target is CTO/founding engineer (2026-03-21)
- [DECISION] Design partner deal: free for 6 months (per Nora's pricing) in exchange for weekly feedback syncs + public case study on launch (2026-03-21)
- [DECISION] Primary outreach channels: founder warm intros first, then X/Twitter (search LLM cost complaints), then LinkedIn cold outreach to AI startup CTOs (2026-03-21)
- [DECISION] Outreach blocked on: live demo environment, landing page/1-pager, pricing placeholder, privacy policy — must come before outreach starts (2026-03-21)
- [DECISION] Pipeline math: ~70 touches → 10+ calls → 10 signed design partners, target 5 weeks (2026-03-21)

## Technical Decisions
- Backend hosted on Railway, frontend on Vercel (planned)
- Multi-tenancy: API keys hashed with SHA-256, namespaced in Redis per tenant
- Cache TTL: 7 days

## Legal
- Norwegian company — GDPR applies
- No privacy policy or ToS yet

## Current Sprint
**Sprint 1 — "First Paying Customer" | 2026-03-21 → 2026-04-04**
Sprint Definition of Done: A new user can sign up, pay, get an API key, and make a cached LLM request — without talking to anyone on the team.

### Goal 1: Production Deploy (Dag)
- [ ] Deploy backend to Railway
- [ ] Connect Supabase + Redis in prod, run migrations
- [ ] Deploy frontend to Vercel
- [ ] End-to-end smoke test in prod

### Goal 2: Self-Serve Onboarding (Arve + Ingrid)
- [ ] Sign-up / sign-in with Supabase Auth
- [ ] Auth guard on dashboard
- [ ] API key creation UI (generate, copy, revoke)
- [ ] Quick-start snippet shown after key is created (curl + Python + Node examples)

**[DECISION] Onboarding UI direction (Ingrid, 2026-03-21):**
- 3-step wizard pattern (no sidebar nav, progress indicator only): Signup → Key Creation → Quick-Start
- Build order: 1) Signup/Login, 2) Key Creation modal + list, 3) Quick-start snippet tabs
- Signup: email + password + single ToS/Privacy checkbox (GDPR), no social auth in Sprint 1
- Key creation: modal flow, show full key once with copy button (Stripe pattern), never shown again warning
- Quick-start: 3 tabs (curl/Python/Node), actual key pre-filled, JetBrains Mono code blocks, teal accent on base_url
- Proxy base_url: `https://api.cachex.dev/v1` replacing `https://api.openai.com/v1`
- Colors: #0D1117 bg, #00C9A7 primary CTA, #161B22 code block bg

### Goal 3: Revenue-Ready (Arve + Magnus)
- [ ] Stripe Checkout integration (Arve) — use tiered pricing decided by Nora
- [ ] Stripe webhook handler — activate tenant on payment (Arve)
- [ ] Enforce paywall: proxy returns 402 if tenant on free tier and over 50K req/mo (Arve)
- [ ] Privacy policy published at /privacy, GDPR-compliant, linked from signup (Magnus)
- [ ] ToS published at /terms, accepted on signup (Magnus)

### Goal 4: Design Partner Outreach (Halvard)
- [ ] Identify 10 target companies with high LLM usage
- [ ] Draft outreach email (use design partner offer: 6 months free)
- [ ] Send first wave (5 emails by end of sprint)

Previously completed:
- [x] Pick company name (Jorunn) — Cachex ✓
- [x] Brand direction, tone of voice, visual guidelines (Jorunn) ✓
- [x] Decide pricing model (Nora) ✓

---
_Last updated: 2026-03-21_
