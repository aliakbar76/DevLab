# Baseline scope

This document separates what the DevLab baseline implements from what it intentionally leaves unfinished.

## 1. Implemented baseline functionality

- pnpm + Turborepo monorepo with shared TypeScript/ESLint/Prettier configs
- PostgreSQL via Docker Compose
- Prisma schema, initial migration, deterministic seed
- NestJS + Fastify REST API with Swagger at `/docs`
- Demo-only identity adapter (`x-demo-user-id`) with production refusal
- Membership-scoped project and task CRUD
- Shared Zod contracts as validation SSOT
- Web app: overview, projects, tasks, settings, light/dark theme, demo user switcher
- Admin app: dashboard stats, users, projects, tasks (local, non-privileged)
- Baseline smoke tests for API start, DB, project/task create, status update
- Documentation for architecture, conventions, episodes, and baseline report

## 2. Intentionally unimplemented features

- JWT access tokens, refresh tokens, token rotation
- Password hashing, OAuth, SSO, MFA, passkeys
- Cookie/session authentication
- Full RBAC / organization tenancy
- Redis, BullMQ, Kafka, RabbitMQ
- Kubernetes, API gateways, reverse proxies
- CI/CD pipelines and feature flags
- Webhooks, background workers, cron jobs
- Soft deletes, audit history, advanced indexing
- Distributed tracing and advanced observability stacks

## 3. Future educational topics

Suggested episode themes (not implemented):

- Authentication and authorization
- Refresh tokens and rotation
- API security and rate limiting
- Database indexing and query performance
- Caching with Redis
- Message queues / background jobs
- Race conditions and concurrency
- Observability (logs, metrics, tracing)
- Testing strategies beyond smoke tests
- Infrastructure and DevOps

## 4. Known limitations

- Demo identity is a local fixture, not security
- Admin dashboard has no privileged authorization model
- Membership is boolean only (no roles/permissions matrix)
- No invitation flow for adding members through the UI
- Smoke tests cover critical paths only
- No production deployment configuration

## 5. Recommended first episodes

1. **Replace demo identity with real authentication** — highest leverage teaching moment
2. **Refresh tokens and rotation** — builds directly on auth
3. **Database indexing** — generate larger datasets and measure query plans
4. **Rate limiting** — demonstrate abuse patterns against the public API surface
