# DevLab

DevLab is a **baseline educational software engineering laboratory** — a realistic but intentionally incomplete project management application used to teach real-world engineering topics through independent YouTube episodes.

This is **not** a complete SaaS product. Authentication, caching, queues, observability, and many other production concerns are deliberately left for future episodes.

## Technology stack

- **Monorepo:** pnpm workspaces + Turborepo + TypeScript
- **Web / Admin:** Next.js App Router, React, Tailwind CSS, TanStack Query
- **API:** NestJS + Fastify, Zod contracts via `nestjs-zod`, OpenAPI/Swagger
- **Database:** PostgreSQL + Prisma

## Requirements

- Node.js 20+
- pnpm 9+ (tested with pnpm 12)
- Docker (for local PostgreSQL)

## Quick start

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env
cp .env packages/database/.env
cp .env apps/api/.env
cp .env apps/web/.env.local
cp .env apps/admin/.env.local

# 3. Start PostgreSQL (host 5433 → container 5432)
pnpm docker:up

# 4. Generate Prisma client, migrate, and seed
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 5. Start all apps (web :3000, admin :3001, api :4400)
pnpm dev
```

## Environment

See [`.env.example`](.env.example).

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Primary PostgreSQL connection |
| `TEST_DATABASE_URL` | Smoke-test database |
| `API_PORT` | API listen port (default `4400`) |
| `IDENTITY_MODE` | Must be `demo` locally; refused in production |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL |

## Applications

| App | Port | Package |
| --- | --- | --- |
| Web | 3000 | `@devlab/web` |
| Admin | 3001 | `@devlab/admin` |
| API | 4400 | `@devlab/api` |
| PostgreSQL | 5433→5432 | Docker Compose (host 5433 → container 5432) |

API docs: [http://localhost:4400/docs](http://localhost:4400/docs)

> Note: Prefer `4400` when Windows Hyper-V excludes the classic `4000` port range. Override with `API_PORT` / `NEXT_PUBLIC_API_URL` if needed.

## Common commands

```bash
pnpm install          # Install workspace dependencies
pnpm docker:up        # Start PostgreSQL
pnpm docker:down      # Stop PostgreSQL
pnpm db:generate      # Prisma generate
pnpm db:migrate       # Create/apply migrations (dev)
pnpm db:seed          # Seed deterministic demo data
pnpm dev              # Start all apps
pnpm build            # Build all packages/apps
pnpm lint             # Lint
pnpm typecheck        # TypeScript checks
pnpm test             # Baseline smoke tests
```

## Repository structure

```text
apps/
  web/                 End-user project management UI
  admin/               Local development dashboard
  api/                 NestJS REST API
packages/
  database/            Prisma schema, migrations, seed
  contracts/           Shared Zod schemas and types
  ui/                  Shared UI primitives and theme
  typescript-config/   Shared TSConfig bases
  eslint-config/       Shared ESLint configs
infrastructure/docker/ Local PostgreSQL Compose stack
docs/                  Architecture, conventions, episodes, baseline scope
```

## Demo identity (local only)

DevLab does **not** ship real authentication in the baseline.

- Seeded demo users can be selected in the web UI.
- The selected user id is sent as `x-demo-user-id`.
- The API resolves identity through an isolated demo adapter.
- Production boot **refuses** `IDENTITY_MODE=demo`.

## Documentation

- [Architecture overview](docs/architecture/OVERVIEW.md)
- [Development conventions](docs/development/CONVENTIONS.md)
- [Episode branching workflow](docs/episodes/README.md)
- [Baseline scope](docs/BASELINE_SCOPE.md)
- [Baseline report](docs/DEVLAB_BASELINE_REPORT.md)

## License

Educational project — use and adapt for teaching.
