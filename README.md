# postara

Modular monolith marketing automation: email newsletters, social media scheduling, and AI content generation — with payment providers pluggable behind adapters.

**Status:** Early — frontend ported to Vite, NestJS + TypeORM scaffold with entities in place, no feature modules yet.
**Stack:** Vite 6 + React 19 + TypeScript + Tailwind CSS 4 + shadcn-ui + react-router-dom, Better Auth client; NestJS 11 backend (ORM: TypeORM, PostgreSQL). TypeORM entities are the source of truth. Durable database-backed jobs first; no message broker until a concrete need emerges.

## Why

Every small business eventually rebuilds the same marketing stack: email campaigns, social media schedulers, and AI content creation. Done badly, retries double-charge subscribers, plan edits rewrite mailing lists, and AI prompts leak into content calculations.

postara separates the three concerns that must not be the same operation: measurement (usage/newsletter engagement), access (subscriptions and permissions), and money (billing and invoicing). Pricing, plans, and invoices are versioned so historical records stay explainable after the catalog changes.

## What it covers

- **Newsletters**: subscriber management, segmentation, drag-and-drop editor, campaign scheduling, A/B testing, analytics, double opt-in
- **Social Media Scheduler**: multi-platform support (Twitter, Facebook, Instagram, LinkedIn), bulk scheduling, media upload, calendar view, post recycling, engagement analytics
- **AI Content Generation**: email subject lines and body, social media posts, blog post outlines, content repurposing, multi-language support, customizable tone and style
- **Platform**: Vite SPA, REST contract, audit records, durable background jobs with retries, administrative web interface

Out of scope for v1: general ledger, payroll/tax filing, card data storage, custom pricing DSL, globally linearizable quotas, exactly-once delivery guarantees, microservices per module.

## Layout

- `src/` — Vite + React frontend (`pnpm run dev` on `:5173`)
- `backend/` — NestJS 11 + TypeORM API (`pnpm run start:dev` on `:3001`, needs `DATABASE_URL`)
- `docs/` — domain and setup notes (see below)
- `docker-compose.yml` — Postgres, Redis, backend; frontend and tools behind profiles

## Run it

```bash
# infra
docker compose up postgres redis
# backend (needs DATABASE_URL, then migrate + seed)
cd backend && pnpm install && pnpm run migration:run && pnpm run seed && pnpm run start:dev
# frontend
pnpm install && pnpm run dev
```

## Docs

Feature specs: `docs/F0-OVERVIEW.md`, `docs/F1-AUTH.md`, `docs/F2-AI-CONTENT.md`, `docs/F3-SOCIAL-SCHEDULER.md`, `docs/F4-EMAIL-NEWSLETTER.md`, `docs/F6-BRAND-VOICE.md`.

Setup/operations notes: `docs/AUTH_IMPLEMENTATION.md`, `docs/BACKEND_ROADMAP.md`, `docs/BETTER_AUTH_SETUP.md`, `docs/CORE_FEATURE.md`, `docs/DOCKER_SETUP.md`, `docs/GETTING_STARTED.md`, `docs/MIGRATION_GUIDE.md`, `docs/SCALING_STRATEGY.md`, `docs/SUPABASE_REMOVAL.md`.

Note: the older setup notes predate the current stack and may still mention Next.js, Prisma, Django, or Supabase. The source of truth is this README plus `backend/README.md`.

## License

MIT.
