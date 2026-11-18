# DevLab Baseline Report

Educational self-assessment of the DevLab baseline foundation. These scores are engineering judgments, not an independent audit.

**Date:** 2026-11-18  
**Workspace:** monorepo root (current folder)  
**Git:** not initialized (awaiting explicit approval)

---

## 1. Final project structure

```text
apps/
  api/                 NestJS + Fastify REST API
  web/                 Next.js project management UI
  admin/               Next.js local dashboard
packages/
  contracts/           Zod schemas + shared types (SSOT)
  database/            Prisma schema, migrations, seed
  ui/                  Shared UI primitives + theme
  typescript-config/   Shared TSConfig bases
  eslint-config/       Shared ESLint configs
infrastructure/docker/ PostgreSQL Compose + test DB init
docs/
  architecture/
  development/
  episodes/
  BASELINE_SCOPE.md
  DEVLAB_BASELINE_REPORT.md
.env.example
pnpm-workspace.yaml
turbo.json
package.json
README.md
```

---

## 2. Implemented features

- Deterministic seed: 5 users, 3 projects, 9 memberships, 18 tasks
- Demo identity via `x-demo-user-id` (production boot refuses demo mode)
- Membership-scoped project/task reads and writes (including direct IDs → 404)
- Project CRUD + auto-membership on create
- Task CRUD, status updates, assignee constrained to project members
- `GET /projects/:id/members` for assignee pickers
- Admin stats/list endpoints (non-privileged local tooling)
- Web UI: overview, projects, tasks, settings, theme, demo user switcher
- Admin UI: dashboard, users, projects, tasks
- Zod contracts shared by API validation and frontend forms
- Smoke tests for health, project create, task create, status update
- Documentation for architecture, conventions, episodes, and baseline scope

---

## 3. Technology versions (verified installed)

| Technology | Version |
| --- | --- |
| Node.js | v22.23.1 |
| pnpm | 12.16.1 |
| Turbo | 2.11.11 |
| TypeScript | 5.9.3 |
| Next.js | 15.5.29 |
| React | 19.3.1 |
| NestJS | 11.2.10 |
| Prisma | 6.19.3 |
| Zod | 3.25.76 |
| PostgreSQL image | 16-alpine |
| Vitest | 3.2.7 |

---

## 4. Database models

- `User` — id, name, email (unique), timestamps
- `Project` — id, name, description?, timestamps
- `ProjectMembership` — id, userId, projectId, createdAt; unique `(userId, projectId)`
- `Task` — id, projectId, title, description?, status (`TODO` \| `IN_PROGRESS` \| `DONE`), assigneeId?, timestamps

Relations: membership join table; project → tasks cascade delete; assignee optional with `onDelete: SetNull`.

---

## 5. Available API endpoints

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/health` | DB readiness |
| GET | `/users` | Demo identity required |
| GET | `/users/:id` | |
| GET | `/projects` | Membership-scoped |
| GET | `/projects/:id` | Membership-scoped |
| GET | `/projects/:id/members` | Membership-scoped |
| POST | `/projects` | Creates membership for current user |
| PATCH | `/projects/:id` | Membership-scoped |
| DELETE | `/projects/:id` | Membership-scoped |
| GET | `/projects/:projectId/tasks` | Membership-scoped |
| POST | `/projects/:projectId/tasks` | Membership-scoped |
| GET | `/tasks/:id` | Membership via parent project |
| PATCH | `/tasks/:id` | Membership via parent project |
| DELETE | `/tasks/:id` | Membership via parent project |
| GET | `/admin/stats` | Local dashboard aggregate |
| GET | `/admin/projects` | All projects (demo-only tooling) |
| GET | `/admin/tasks` | All tasks (demo-only tooling) |

Swagger UI: `/docs`

---

## 6. Local development commands

```bash
pnpm install
cp .env.example .env
cp .env packages/database/.env
cp .env apps/api/.env
pnpm docker:up
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

Ports in this environment:

| Service | Port |
| --- | --- |
| Web | 3000 |
| Admin | 3001 |
| API | **4400** (Windows Hyper-V reserves 4000) |
| PostgreSQL | **5433→5432** (host 5433 → container 5432) |

---

## 7. Test and build results (executed)

### Finalization pass (2026-11-18)

| Check | Result | Evidence |
| --- | --- | --- |
| Postgres host port `5433:5432` | PASS | Container healthy; Prisma connects via `localhost:5433` |
| API on `:4400` + `NEXT_PUBLIC_API_URL` | PASS | Health OK; frontends configured to `http://localhost:4400` |
| Browser Web overview | PASS | Ava Chen projects loaded from API |
| Browser demo user switch | PASS | Elena Brooks → 1 membership-scoped project |
| Browser project create | PASS | Created `Browser Smoke Project` |
| Browser project update | PASS | After CORS fix; description updated |
| Browser task create | PASS | Created `Browser Smoke Task` |
| Browser task status update | PASS | After CORS fix; status → `DONE` |
| Browser Admin dashboard | PASS | Users 5 / Projects 4 / Tasks 18 + status breakdown |
| Browser Admin users list | PASS | Five seeded users visible |
| `pnpm --filter @devlab/api test` | PASS | 2/2 smoke tests |
| Lint (api/web/admin) | PASS | |
| Typecheck (api/web/admin/contracts/database) | PASS | |
| Builds (api/web/admin) | PASS | |
| Future-feature scan | PASS | No Redis/JWT/OAuth/queues/K8s/etc. in app source |
| Defects fixed during finalization | PASS | (1) CORS methods included PATCH/DELETE (2) DELETE omitted empty JSON Content-Type |

### Earlier baseline verification

| Check | Result |
| --- | --- |
| `pnpm install` | PASS |
| migrate + seed | PASS |
| API CRUD via curl | PASS |

---

## 8. Known limitations / remaining issues

- Demo identity is a local fixture, not authentication or authorization security.
- Admin endpoints are not privileged; they only require a valid demo user header.
- Membership is boolean (member / not member). No roles.
- No UI flow to invite/add project members beyond seed + creator membership.
- API uses **4400** because Windows Hyper-V excludes TCP **3984–4083** (includes 4000).
- Postgres uses host **5433** to avoid colliding with other local Postgres bindings on 5432.
- Native `window.confirm` dialogs can interrupt automated browser delete clicks; DELETE API path verified after client Content-Type fix.
- `nestjs-zod` Swagger patching omitted (incompatible private swagger import); Zod remains validation SSOT.
- pnpm 12 requires explicit `allowBuilds` for Prisma/esbuild/SWC.
- No Playwright E2E suite yet (intentional for future episodes).

---

## 9. Intentionally excluded future features

Refresh tokens, JWT auth, OAuth/SSO/MFA, Redis/caching, queues/workers, rate limiting, CI/CD, Kubernetes, microservices, advanced observability, soft deletes, audit logs, organizations/billing, feature flags, webhooks.

See [BASELINE_SCOPE.md](./BASELINE_SCOPE.md).

---

## 10. Recommended first educational episode

**Replace demo identity with real authentication** (then follow with refresh-token rotation).

This episode has the highest leverage: the identity seam is already isolated, membership checks already exist, and the demo adapter can be swapped without rewriting business services.

---

## Architecture quality assessment

| Dimension | Score | Justification |
| --- | --- | --- |
| Code cleanliness | 88 | Focused modules, thin controllers, minimal speculative abstractions |
| Readability | 90 | Straightforward naming and small files; Nest/Next conventions followed |
| Modularity | 87 | Clear app/package boundaries; identity and membership isolated |
| Maintainability | 86 | Shared contracts/UI/database packages reduce drift; docs present |
| Extensibility | 89 | Identity resolver seam + membership helper leave room for episodes without stubs |
| Database design | 85 | Small normalized schema with required constraints only; no premature indexes |
| Type safety | 88 | Strict TS + Zod SSOT for API/forms; Nest DI metadata handled carefully |
| Developer experience | 82 | Solid scripts/docs; Windows port reservation and pnpm build approvals add friction |
| Educational suitability | 93 | Intentionally incomplete, polished enough for video, episode workflow documented |

**Overall (mean):** **87 / 100**

---

## Refinements honored

1. Membership enforced on all project/task read/write paths, including direct resource access.
2. Zod contracts are the validation SSOT (no parallel class-validator DTOs).
3. Episode workflow documents immutable `baseline` and branch isolation; no episode branches created.
