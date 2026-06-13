# Project Brief: Knowledge-to-Skills Pipeline

## Purpose

Convert published knowledge — books, guides, toolkits — into composable, attributed AI agent skills that can actually be executed. This repository is the open **reference implementation** of that pipeline.

## Target Users

- Civic technologists and organizers who want methodology-grounded AI assistance
- Authors/IP owners exploring attributed, compensated reuse of their work
- Developers building on or extending an open skill ecosystem

## Core Use Case

A user selects a skill (derived from a published work), describes their situation, and receives guidance grounded in that skill's methodology — with source attribution carried through the response.

## Key Requirements

### Must Have (shipped)

- `SKILL.md` files as the single source of truth (frontmatter + markdown body)
- Real skill execution via a configurable LLM, with a zero-config demo fallback
- IP attribution surfaced on every response
- Production hardening: input validation, rate limiting, security headers, safe rendering
- Deployable to the public internet with zero required configuration
- Passing typecheck, lint, tests, and build

### Roadmap

- Nostr-based decentralized skill distribution
- Onyx encrypted knowledge vaults
- Lightning micropayments with automatic revenue splits (70/20/10)

## Success Metrics

- Zero-error TypeScript, passing lint/tests/build
- Works end-to-end with no configuration (demo) and with an API key (live)
- Honest, non-misleading presentation of shipped vs. planned features

## Constraints

- Framework: Next.js 16 (App Router) + React 19 + Tailwind CSS 4
- Package manager / runtime: Bun
- Default model: latest, most capable Claude (`claude-opus-4-8`), configurable
- Skill content must respect each source's license (e.g. CC-BY-SA-4.0)
