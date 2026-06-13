# Project Status: Knowledge-to-Skills Pipeline

## Current State

**Project Status:** ✅ Production-ready reference implementation

The app converts published knowledge (`SKILL.md` files) into composable, attributed AI agent skills and executes them against a configurable LLM, with a zero-config demo fallback. It is hardened for public deployment: validated input, per-IP rate limiting, security headers, safe markdown rendering, and optional privacy-preserving analytics.

## What works today

- **Filesystem skill registry** (`src/lib/skills.ts`) — `SKILL.md` files are the source of truth; frontmatter validated with zod; bodies used as model context.
- **Live skill execution** (`src/lib/llm.ts`) via the Anthropic SDK (`claude-opus-4-8` default, configurable), grounded in the skill's markdown, with a deterministic **demo mode** when no API key is set.
- **Hardened API** — `GET /api/health`, `GET /api/skills`, `GET /api/skills/[slug]`, `POST /api/skills/invoke`; validation, rate limiting, rate-limit/Retry-After headers, sanitized errors.
- **Optional persistence** (libSQL/SQLite, `src/db/`) — logs invocation **metadata only** (no raw prompt/response text).
- **Honest UI** — landing page shows real skill counts and separates shipped features from roadmap; demo page renders markdown safely and shows live/demo state + attribution.
- **Quality gates** — 25 unit tests (`bun test`), typecheck, lint, production build, GitHub Actions CI.

## On the roadmap (not active)

Nostr distribution, Onyx vaults, and Lightning micropayments with automatic revenue splits — described as the target architecture, clearly labelled as planned.

## Key files

| File/Directory | Purpose |
|----------------|---------|
| `src/lib/env.ts` | Validated config + feature flags |
| `src/lib/skills.ts` | Filesystem skill registry |
| `src/lib/llm.ts` / `llm-helpers.ts` | Execution engine + pure helpers (tested) |
| `src/lib/rate-limit.ts`, `validation.ts` | Per-IP limiter, zod schemas |
| `src/db/` | Optional libSQL persistence + migrations |
| `src/app/api/**` | Health + skills + invoke routes |
| `src/components/markdown.tsx` | Safe markdown renderer |
| `src/skills/**` | `SKILL.md` files (4 Beautiful Trouble skills) |
| `next.config.ts` | Security headers, CSP, file tracing |

## Available skills (Beautiful Trouble suite)

- `culture-jamming` (tactic)
- `power-analysis-framework` (theory)
- `the-dilemma-action` (principle)
- `make-the-invisible-visible` (principle)

## Tech changes from the original prototype

- Removed the sandbox-locked `@kilocode/app-builder-db`; replaced with portable **libSQL** (local file or Turso).
- Added `@anthropic-ai/sdk`, `gray-matter`, `react-markdown`, `zod`, and self-hosted `geist` fonts (no build-time Google Fonts fetch).
- Skills moved from hardcoded mock data to a real filesystem registry; invocation moved from random strings to real LLM execution with a demo fallback.

## Session History

| Date | Changes |
|------|---------|
| 2026-03-03 | Initial prototype: landing page, mock API, sandbox DB |
| 2026-06-13 | Production hardening: real skill registry + LLM execution, libSQL, security headers, rate limiting, validation, safe markdown, tests, CI, docs; honest copy |
| 2026-06-13 | De-Kilo: moved project docs to `docs/` and removed the `.kilocode/` tooling (memory-bank conventions + sandbox recipe). The app was already Kilo-independent. |

## Next steps

- Author the remaining Beautiful Trouble skills toward the 24-skill target.
- Add Nostr publication and Lightning payout integration (roadmap).
- Back the rate limiter with a shared store (Redis/Upstash) for multi-instance deployments.
