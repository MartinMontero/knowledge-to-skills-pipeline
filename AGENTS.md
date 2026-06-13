# Agent Guide

This is the **Knowledge-to-Skills Pipeline** — a Next.js (App Router) + TypeScript app that converts published knowledge into composable, attributed AI agent skills and runs them against a language model.

## Commands

```bash
bun install        # install dependencies
bun dev            # dev server (http://localhost:3000)
bun run build      # production build
bun run start      # serve the production build
bun test           # unit tests (bun's runner)
bun run typecheck  # tsc --noEmit
bun run lint       # eslint
bun run db:generate  # regenerate a Drizzle migration after editing the schema
bun run db:migrate   # apply migrations (requires DATABASE_URL)
```

Always run `bun run typecheck && bun run lint && bun test` before committing.

## Architecture

- **Skills are `SKILL.md` files** under `src/skills/` (YAML frontmatter + markdown body). The body is the model's context; the frontmatter holds metadata and attribution. They are the single source of truth — loaded and validated by `src/lib/skills.ts`.
- **Execution** lives in `src/lib/llm.ts` (Anthropic SDK) with a deterministic demo fallback when `ANTHROPIC_API_KEY` is unset. Pure prompt/demo helpers are in `src/lib/llm-helpers.ts` (unit tested).
- **Config** is centralised and validated in `src/lib/env.ts`; never read `process.env` elsewhere.
- **Persistence** (`src/db/`) is optional libSQL/SQLite, used only for privacy-preserving invocation analytics (metadata only — never raw prompt/response text).
- **API routes** in `src/app/api/` are thin: validate (zod) → rate-limit → resolve skill → execute → log.

## Adding a skill

1. Create `src/skills/<suite>/<category>/<slug>.md` with valid frontmatter (`name`, `slug`, `suite` required; `slug` must be kebab-case and unique).
2. Keep content lawful, non-violent, and faithful to the cited source; include an `attribution` block.
3. It's auto-registered — verify with `bun test` and by loading `/demo`.

## Conventions

- Default to Server Components; add `"use client"` only for interactivity.
- Use the latest, most capable Claude model by default (`claude-opus-4-8`); the model is configurable via `LLM_MODEL`.
- Never expose secrets to the client or leak SDK error internals to API responses.
- Keep the landing page honest: separate shipped features from roadmap items.

## Memory bank

After significant changes, update `.kilocode/rules/memory-bank/context.md` (and other memory-bank files when architecture/tech/goals change).
