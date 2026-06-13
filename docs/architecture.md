# Architecture

How the Knowledge-to-Skills Pipeline is put together.

## Overview

```
                 ┌──────────────────────────────────────────────┐
   Browser ────► │  Next.js (App Router)                        │
                 │                                              │
                 │  app/page.tsx        landing (server)        │
                 │  app/demo/page.tsx   interactive runner      │
                 │  app/api/**          health · skills · invoke│
                 └───────────────┬──────────────────────────────┘
                                 │
        ┌────────────────────────┼─────────────────────────────┐
        ▼                        ▼                              ▼
  lib/skills.ts            lib/llm.ts                      db/ (optional)
  filesystem registry      execution engine                libSQL invocation
  (SKILL.md = truth)       Anthropic SDK | demo             log (metadata only)
        ▲                        ▲
        │                        │
  src/skills/**/*.md       lib/llm-helpers.ts (pure, tested)
```

## Request flow: `POST /api/skills/invoke`

1. **Rate limit** by client IP (`lib/rate-limit.ts`).
2. **Size guard** — reject oversized bodies (413) before parsing.
3. **Validate** the body with a zod schema (`lib/validation.ts`): kebab-case slug, prompt length ≤ `MAX_INPUT_LENGTH`.
4. **Resolve** the skill from the registry (`lib/skills.ts`); 404 if unknown.
5. **Execute** (`lib/llm.ts`): if an API key is configured, call Claude with the skill's markdown as the system prompt and the user input as the user turn; otherwise return a deterministic demo response. SDK errors are mapped to safe, user-facing messages.
6. **Log** metadata (no raw text) if a database is configured — fire-and-forget, never fatal.
7. **Respond** with `{ success, mode, output, skill, attribution, usage }` plus rate-limit headers.

## Key modules

| Module | Responsibility |
| --- | --- |
| `lib/env.ts` | Read & validate all configuration once; expose typed values + feature flags (`isLlmConfigured`, `isDatabaseConfigured`). Nothing else reads `process.env`. |
| `lib/skills.ts` | Walk `src/skills/`, parse `SKILL.md` frontmatter (gray-matter + zod), cache the registry. Source of truth for skills. |
| `lib/llm.ts` | Skill execution: Anthropic SDK call or demo fallback. Server-only. |
| `lib/llm-helpers.ts` | Pure helpers (system-prompt builder, demo response, heading extraction). No side effects → unit tested. |
| `lib/rate-limit.ts` | In-memory per-key fixed-window limiter. |
| `lib/validation.ts` | zod request schema + client-IP extraction. |
| `db/` | Optional libSQL client, schema, migrations, and non-blocking logging. |
| `components/markdown.tsx` | `react-markdown` renderer (no raw HTML) used for model/skill output. |

## Design principles

- **SKILL.md is the source of truth.** Skills are data, not code; adding a markdown file adds a skill. The body grounds the model; the frontmatter carries metadata and attribution.
- **Works with zero configuration.** No API key → demo mode. No database → no persistence. The app is always runnable and deployable.
- **Configuration is centralized** in `lib/env.ts` and validated; feature flags gate optional behavior.
- **Security at the boundary.** Validate and rate-limit in the route; render output safely; keep secrets server-side; never leak SDK internals.
- **Honest surface.** Shipped features and roadmap items (Nostr, Lightning, Onyx) are clearly distinguished in the UI.

## Rendering & runtime

- `app/page.tsx` is a Server Component and reads the registry at render (prerendered; skill counts are build-stable).
- `app/demo/page.tsx` is a Client Component that talks to the API at runtime and shows the authoritative live/demo state.
- API routes run on the Node.js runtime (`dynamic = "force-dynamic"`, `Cache-Control: no-store`).
- `next.config.ts` sets security headers/CSP and `outputFileTracingIncludes` so the skill markdown ships with serverless bundles.

## Extending

- **Add a skill:** drop a `SKILL.md` under `src/skills/<suite>/<category>/`. See `docs/tech.md` and the repo `README.md`.
- **Swap the model:** set `LLM_MODEL`. The provider boundary is `lib/llm.ts`.
- **Add persistence:** set `DATABASE_URL`; extend `db/schema.ts` and run `bun run db:generate`.
- **Scale rate limiting:** replace the in-memory store in `lib/rate-limit.ts` with Redis/Upstash; call sites are unchanged.
