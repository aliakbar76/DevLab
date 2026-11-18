# Educational episode workflow

DevLab episodes are isolated Git branches. The baseline remains a stable starting point for teaching.

## Branch model

```text
main                 # optional integration / release pointer
baseline             # immutable educational foundation after stabilization
episodes/<topic>     # one concept per branch
```

Examples:

```text
baseline
episodes/refresh-token
episodes/rate-limiting
episodes/database-indexing
episodes/caching
```

## Rules

1. After the baseline is stabilized, treat `baseline` as **immutable**.
2. Start each episode from `baseline`, unless the episode explicitly depends on another episode.
3. If an episode needs a prerequisite, document that prerequisite branch in the episode README.
4. Do **not** merge experimental episode work back into `baseline` by default.
5. Do not pre-create empty episode branches.

## Create a new episode

```bash
git fetch origin
git checkout baseline
git pull origin baseline
git checkout -b episodes/your-topic-name
```

Implement only the concept for that video. Keep unrelated refactors out of the episode branch.

## Return to baseline

```bash
git checkout baseline
pnpm install
pnpm docker:up
pnpm db:migrate:deploy
pnpm db:seed
pnpm dev
```

If the episode changed migrations incompatibly, reset the local database volume before migrating:

```bash
pnpm docker:down
docker volume rm docker_devlab_postgres_data
pnpm docker:up
pnpm db:migrate:deploy
pnpm db:seed
```

## Run an episode's code

```bash
git checkout episodes/your-topic-name
pnpm install
# follow any episode-specific setup in docs/episodes/<topic>/README.md
pnpm docker:up
pnpm db:migrate:deploy
pnpm db:seed
pnpm dev
```

## Episode documentation

Each episode should eventually add:

```text
docs/episodes/<topic>/README.md
```

Include: learning goal, problem statement, what changed, how to verify, and restoration notes.
