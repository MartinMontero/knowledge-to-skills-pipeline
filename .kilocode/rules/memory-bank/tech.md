# Technical Context: Knowledge-to-Skills Pipeline

## Technology Stack

| Technology | Purpose |
| --- | --- |
| Next.js 16 (App Router) | React framework, API routes |
| React 19 | UI |
| TypeScript 5.9 (strict) | Type safety |
| Tailwind CSS 4 | Styling |
| Bun | Package manager, runtime, test runner |
| @anthropic-ai/sdk | LLM execution (default `claude-opus-4-8`) |
| Drizzle ORM + @libsql/client | Optional libSQL/SQLite persistence |
| gray-matter | `SKILL.md` frontmatter parsing |
| react-markdown | Safe markdown rendering (no raw HTML) |
| zod | Request/config validation |
| geist | Self-hosted fonts (no build-time Google Fonts fetch) |

## Commands

```bash
bun install
bun dev              # http://localhost:3000
bun run build
bun run start
bun test             # unit tests
bun run typecheck    # tsc --noEmit
bun run lint         # eslint
bun run db:generate  # regenerate a migration after editing src/db/schema.ts
bun run db:migrate   # apply migrations (needs DATABASE_URL)
```

## Environment Variables

All optional; the app runs with zero config (demo mode, no DB). See `.env.example`.

- `ANTHROPIC_API_KEY` — enables live execution
- `LLM_MODEL` (default `claude-opus-4-8`), `LLM_MAX_TOKENS` (default 2048)
- `DATABASE_URL`, `DATABASE_AUTH_TOKEN` — optional libSQL/Turso
- `RATE_LIMIT_MAX` (20), `RATE_LIMIT_WINDOW_SECONDS` (60), `MAX_INPUT_LENGTH` (4000)
- `APP_NAME`, `SITE_URL`

Config is read and validated once in `src/lib/env.ts`; do not read `process.env` elsewhere.

## Key Configuration

- `next.config.ts` — security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy), `poweredByHeader: false`, `serverExternalPackages` for native/CJS server deps, and `outputFileTracingIncludes` so skill markdown ships with serverless bundles.
- `tsconfig.json` — strict; excludes `**/*.test.ts` from the app typecheck (Bun runs tests separately).
- `drizzle.config.ts` — sqlite dialect; migrations in `src/db/migrations`.

## File Structure

```
src/
├── app/
│   ├── api/{health,skills,skills/[slug],skills/invoke}/route.ts
│   ├── page.tsx              # landing (server-rendered)
│   └── demo/page.tsx         # interactive runner (client)
├── components/markdown.tsx
├── db/{index,schema,logging,migrate}.ts + migrations/
├── lib/{env,skills,llm,llm-helpers,rate-limit,validation}.ts
└── skills/**/<slug>.md       # SKILL.md source of truth
.github/workflows/ci.yml       # typecheck + lint + test + build
```

## Deployment

- **Vercel:** import, set env vars, deploy. File tracing bundles the skill markdown.
- **Node/container:** `bun run build && bun run start`.
- For analytics, point `DATABASE_URL` at Turso and run `bun run db:migrate` at release.

## Constraints

- Modern browsers (ES2020+).
- In-memory rate limiter suits single-instance; use a shared store for multi-instance.
