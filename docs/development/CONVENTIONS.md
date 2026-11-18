# Development conventions

## Naming

- Packages: `@devlab/<name>`
- Files: kebab-case for modules (`demo-identity.guard.ts`)
- React components: PascalCase filenames matching the export
- Database models: Prisma PascalCase (`ProjectMembership`)
- Env vars: `SCREAMING_SNAKE_CASE`

## Folder organization

- Feature modules in NestJS: `users/`, `projects/`, `tasks/`, `identity/`
- Next.js App Router pages under `src/app`
- Shared UI in `packages/ui`
- Shared contracts in `packages/contracts`
- Keep page files thin; put data hooks in `src/hooks`

## Component conventions

- Prefer composition over prop-heavy mega-components
- Extract only when reuse or clarity justifies it
- No hardcoded project/task domain data in UI
- Loading and empty states are first-class

## Backend conventions

- Controllers stay thin
- Business rules live in services
- Membership checks go through `MembershipService`
- Identity resolution stays in the identity module
- Prefer Nest conventions over custom frameworks

## Validation

- Zod schemas in `@devlab/contracts` are the single source of truth
- API DTOs are created with `createZodDto` from those schemas
- Do not introduce parallel `class-validator` DTO classes

## Database conventions

- Use Prisma migrations for schema changes
- Keep seed data deterministic and idempotent
- Avoid speculative indexes and soft-delete columns in baseline

## TypeScript practices

- `strict` mode enabled
- Prefer `type` imports
- Avoid `any`
- Share domain types via contracts, not duplicated interfaces

## Git / episode hygiene

- Do not commit secrets (`.env` is gitignored)
- Do not merge unfinished episode experiments into `baseline`
- Document prerequisite branches when an episode depends on another
