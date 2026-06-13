# Knowledge-to-Skills Pipeline

Convert published knowledge — books, guides, toolkits — into **composable, attributed AI agent skills you can actually run**. This is the open reference implementation: it loads real `SKILL.md` files, executes them against a language model, and carries source attribution through every response.

> **What works today:** a filesystem-backed skill registry, live skill execution via a configurable LLM provider (with a zero-config demo fallback), input validation, rate limiting, security headers, and optional invocation analytics.
>
> **On the roadmap:** decentralized distribution (Nostr), encrypted vaults (Onyx), and Lightning micropayments with automatic revenue splits. These are described on the landing page as the target architecture and are **not** active.

---

## Quick start

```bash
bun install
cp .env.example .env.local   # optional — the app runs with zero config
bun dev                      # http://localhost:3000
```

With no configuration the app runs in **demo mode**: skill responses are generated locally from each skill's structure (clearly labelled, no model called). Add an `ANTHROPIC_API_KEY` to `.env.local` for live, fully-reasoned responses.

Production:

```bash
bun run build
bun run start
```

## Configuration

Every variable is optional. See [`.env.example`](./.env.example).

| Variable | Default | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | — | Enables live skill execution. Omit for demo mode. |
| `LLM_MODEL` | `claude-opus-4-8` | Model id. Use e.g. `claude-haiku-4-5` to reduce cost. |
| `LLM_MAX_TOKENS` | `2048` | Max generated tokens per invocation (bounds cost/latency). |
| `DATABASE_URL` | — | Optional libSQL/SQLite for invocation analytics (`file:./data/app.db` or `libsql://…`). |
| `DATABASE_AUTH_TOKEN` | — | Auth token for remote Turso databases. |
| `RATE_LIMIT_MAX` | `20` | Requests per window, per client IP, on `/api/skills/invoke`. |
| `RATE_LIMIT_WINDOW_SECONDS` | `60` | Rate-limit window length. |
| `MAX_INPUT_LENGTH` | `4000` | Maximum prompt length (characters). |
| `APP_NAME` | `Knowledge-to-Skills Pipeline` | Branding/metadata. |
| `SITE_URL` | — | Public URL for absolute links / Open Graph. |

## How skills work

A skill is a single `SKILL.md` file under [`src/skills/`](./src/skills) — YAML frontmatter plus a markdown body. **The markdown body is the source of truth**: it's the context handed to the model at invocation time. The frontmatter carries metadata and IP attribution.

```markdown
---
name: Power Analysis Framework
slug: power-analysis-framework      # kebab-case, unique; the public identifier
suite: beautiful-trouble
category: theory
version: 1.0.0
description: Map who holds power over an issue and where your leverage is.
attribution:
  source_title: "Beautiful Trouble: A Toolbox for Revolution"
  source_authors: ["Andrew Boyd", "Dave Oswald Mitchell"]
  source_license: "CC-BY-SA-4.0"
revenue_split: { ip_owner: 70, skill_author: 20, platform: 10 }
---

# Power Analysis Framework

…the methodology the model applies…
```

To add a skill: drop a new `*.md` file in the appropriate suite directory. It's picked up automatically (files prefixed with `_`, like `_suite.md`, are treated as suite docs, not skills). Invalid frontmatter is skipped, never fatal.

## API

| Method & path | Description |
| --- | --- |
| `GET /api/health` | Readiness probe (skill count, LLM/DB status). |
| `GET /api/skills` | List available skills (no markdown bodies). |
| `GET /api/skills/[slug]` | Full skill detail, including the markdown body. |
| `POST /api/skills/invoke` | Execute a skill. Body: `{ "slug": "...", "input": "..." }`. |

`invoke` is validated (zod), rate limited per IP, and returns `{ success, mode, output, skill, attribution, usage }`. Rate-limit state is exposed via `X-RateLimit-*` headers and a `Retry-After` header on `429`.

## Database (optional)

The app is fully functional without a database. When `DATABASE_URL` is set, each invocation logs **metadata only** — which skill, mode, sizes, timing — and never the raw prompt or response text.

```bash
# Local SQLite file
DATABASE_URL="file:./data/app.db" bun run db:migrate

# Turso
DATABASE_URL="libsql://your-db.turso.io" DATABASE_AUTH_TOKEN="..." bun run db:migrate
```

Schema changes: edit `src/db/schema.ts`, then `bun run db:generate` to produce a new migration.

## Security

- **Input validation** on every request (slug shape, prompt length).
- **Per-IP rate limiting** on the invoke endpoint (in-memory; back it with Redis/Upstash for multi-instance — the call sites don't change).
- **Security headers** (CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy) set in [`next.config.ts`](./next.config.ts).
- **Safe rendering**: model/skill markdown is rendered with `react-markdown` (no raw HTML), so output can't inject markup.
- **No secret leakage**: the API key is server-only; SDK errors are mapped to generic, user-safe messages.
- **Untrusted input** goes in the model's *user* role; the skill content is the *system* prompt — the safe arrangement.

To harden the CSP further, switch to a nonce-based policy via middleware.

## Deployment

Deploys anywhere Next.js runs.

- **Vercel:** import the repo, set env vars, deploy. Skill markdown is included in serverless bundles via `outputFileTracingIncludes`.
- **Node / container:** `bun run build && bun run start` (or `next start`). Set env vars in your platform.

For analytics in production, point `DATABASE_URL` at Turso (serverless-friendly) and run `bun run db:migrate` once during release.

## Testing & checks

```bash
bun test          # unit tests (skills loader, validation, rate limiter, prompt/demo helpers)
bun run typecheck # tsc --noEmit
bun run lint      # eslint
bun run build     # production build
```

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── health/route.ts
│   │   └── skills/route.ts, [slug]/route.ts, invoke/route.ts
│   ├── page.tsx            # landing (server-rendered, real skill counts)
│   └── demo/page.tsx       # interactive skill runner
├── components/markdown.tsx # safe markdown renderer
├── db/                     # optional libSQL persistence + migrations
├── lib/
│   ├── env.ts              # validated config + feature flags
│   ├── skills.ts           # filesystem skill registry
│   ├── llm.ts              # execution engine (Anthropic + demo fallback)
│   ├── llm-helpers.ts      # pure prompt/demo helpers (unit tested)
│   ├── rate-limit.ts       # per-IP limiter
│   └── validation.ts       # zod schemas + client IP
└── skills/                 # SKILL.md files (the source of truth)
```

## Licensing

- **Code:** MIT — see [`LICENSE`](./LICENSE).
- **Skill content:** licensed per each skill's `attribution` block. The Beautiful Trouble reference skills are derived from *Beautiful Trouble: A Toolbox for Revolution* under **CC-BY-SA-4.0**; derivatives share that license. Respect each source's license before adding or redistributing skills.

---

A project of **homebase civic lab** — a civic renaissance lab for downtown Nanaimo, BC.
