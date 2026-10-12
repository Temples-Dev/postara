# postara

Modular monolith marketing automation: email newsletters, social media scheduling, and AI content generation — with payment providers pluggable behind adapters.

**Status:** Early — architecture and domain docs approved, no implementation yet.
**Stack:** Next.js 15 + React 19 + TypeScript + Tailwind CSS 4 + shadcn-ui, Better Auth; Django backend (ORM: Prisma, PostgreSQL); Django ORM is the source of truth. Durable database-backed jobs first; no message broker until a concrete need emerges.

## Why

Every small business eventually rebuilds the same marketing stack: email campaigns, social media schedulers, and AI content creation. Done badly, retries double-charge subscribers, plan edits rewrite mailing lists, and AI prompts leak into content calculations.

postara separates the three concerns that must not be the same operation: measurement (usage/newsletter engagement), access (subscriptions and permissions), and money (billing and invoicing). Pricing, plans, and invoices are versioned so historical records stay explainable after the catalog changes.

## What it covers

- **Newsletters**: subscriber management, segmentation, drag-and-drop editor, campaign scheduling, A/B testing, analytics, double opt-in
- **Social Media Scheduler**: multi-platform support (Twitter, Facebook, Instagram, LinkedIn), bulk scheduling, media upload, calendar view, post recycling, engagement analytics
- **AI Content Generation**: email subject lines and body, social media posts, blog post outlines, content repurposing, multi-language support, customizable tone and style
- **Platform**: Next.js App Router, OpenAPI contract, audit records, durable background jobs with retries, administrative web interface

Out of scope for v1: general ledger, payroll/tax filing, card data storage, custom pricing DSL, globally linearizable quotas, exactly-once delivery guarantees, microservices per module.

## Docs

- `docs/architecture/architecture-overview.md` — purpose, stack, modules, core flows, acceptance criteria
- `docs/architecture/domain-model.md` — entities, relationships, lifecycle states, invariants
- `docs/architecture/usage-metering-and-aggregation.md` — metrics, ingestion, deduplication, aggregation
- `docs/architecture/subscriptions-and-entitlements.md` — subscription lifecycle, plans, entitlement resolution
- `docs/architecture/quotas-and-enforcement.md` — quota models, concurrency, enforcement policies
- `docs/architecture/billing-and-invoicing.md` — rating, billing periods, invoices, adjustments
- `docs/architecture/api-specification.md` — REST contract, errors, idempotency, versioning
- `docs/architecture/database-design.md` — schema, constraints, transaction boundaries
- `docs/architecture/security-and-tenant-isolation.md` — auth, RBAC, secrets, callback validation
- `docs/architecture/observability-and-operations.md` — logs, metrics, alerts, recovery
- `docs/architecture/deployment-and-environments.md` — environments, config, release process
- `docs/architecture/testing-strategy.md` — unit through financial-integrity testing
- `docs/architecture/implementation-roadmap.md` — phased delivery plan

## License

MIT — see LICENSE.