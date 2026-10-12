# postara backend

NestJS 11 API for the postara marketing automation platform. PostgreSQL via TypeORM (entities are the source of truth; migrations in `src/database/migrations`).

## Setup

```bash
pnpm install
cp .env.example .env   # set DATABASE_URL
pnpm run migration:run
pnpm run seed          # demo user, workspace, list, campaign
```

Or start Postgres + Redis via the root `docker-compose.yml`, which also runs this API with `start:dev`.

## Scripts

| Command | What it does |
|---|---|
| `pnpm run start:dev` | API in watch mode (`:3001`) |
| `pnpm run build` / `start:prod` | Compile to `dist/` / run compiled output |
| `pnpm run migration:generate -- <Name>` | Diff entities into a new migration |
| `pnpm run migration:run` / `migration:revert` | Apply / revert migrations |
| `pnpm run seed` | Seed demo data (idempotent) |
| `pnpm test` | Unit tests |
| `pnpm run test:e2e` | E2E tests (needs a running Postgres via `DATABASE_URL`) |

## Layout

- `src/app.module.ts` — `ConfigModule` + `TypeOrmModule.forRootAsync` (`autoLoadEntities`, `synchronize: false`)
- `src/database/data-source.ts` — TypeORM CLI data source (migrations)
- `src/database/entities/*.entity.ts` — 20 tables (users, workspaces, email, social, billing, webhooks)
- `src/database/enums.ts` — shared Postgres enums
- `src/database/seed.ts` — demo seed

Migrations are never auto-applied: `synchronize` stays `false` in every environment.
