# Architecture overview

## Purpose

DevLab is a monorepo laboratory for teaching software engineering. The baseline prioritizes clear boundaries and replaceable seams over completeness.

## High-level system

```text
┌────────────┐   ┌─────────────┐
│  web:3000  │   │ admin:3001  │
└─────┬──────┘   └──────┬──────┘
      │  REST + x-demo-user-id
      └──────────┬───────┘
                 ▼
          ┌────────────┐
          │  api:4400  │
          └─────┬──────┘
                ▼
       ┌─────────────────┐
       │ PostgreSQL host:5433 → container:5432 │
       └─────────────────┘
```

## Application boundaries

| App | Responsibility | Not responsible for |
| --- | --- | --- |
| `web` | Membership-scoped project/task UX, demo user switching | Auth, admin aggregates |
| `admin` | Local read-mostly ops dashboard | Privileged authorization |
| `api` | REST resources, membership checks, demo identity | Background jobs, caching |

Apps never import each other.

## Shared packages

| Package | Role |
| --- | --- |
| `@devlab/contracts` | Single source of truth for Zod schemas and inferred types |
| `@devlab/database` | Prisma schema, migrations, seed, client export |
| `@devlab/ui` | Shared primitives, theme tokens, light/dark styles |
| `@devlab/typescript-config` | Shared compiler bases |
| `@devlab/eslint-config` | Shared lint configs |

## Database relationships

```text
User 1──* ProjectMembership *──1 Project 1──* Task
User 1──* Task (optional assignee)
```

- Unique membership per `(userId, projectId)`
- Deleting a project cascades memberships and tasks
- Assignee is optional; clearing a user sets assignee to null

## Identity seam

```text
Request headers
    → DemoIdentityGuard
    → IdentityResolver (DemoIdentityAdapter)
    → CurrentUser on request
    → Controllers/services
```

Future authentication episodes should replace `DemoIdentityAdapter` while keeping controllers free of header parsing.

## Membership boundaries

Every project and task read/write path asserts membership for the current demo user, including direct resource access (`GET /projects/:id`, `GET /tasks/:id`). Unauthorized access returns **404** to avoid leaking resource existence. This is intentionally not RBAC.

## API communication

Frontends use a small typed `apiRequest` helper plus TanStack Query hooks. Contracts are shared Zod schemas from `@devlab/contracts`. The API validates requests with `ZodValidationPipe` / `createZodDto` so frontend and backend share one validation source.

## Extensibility without premature features

The baseline leaves hooks for future episodes (auth, indexing, caching, queues, observability) but does not stub those systems. Prefer deleting or replacing the demo identity adapter over accumulating unused abstractions.
