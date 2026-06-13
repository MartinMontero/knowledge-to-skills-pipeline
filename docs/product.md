# Product Context: Knowledge-to-Skills Pipeline

## Why This Exists

Valuable methodologies are locked inside books and guides. This pipeline turns that knowledge into AI agent skills that can be invoked on demand — while keeping a clear, auditable link back to the source so authors are credited (and, in the target architecture, compensated).

## Problems It Solves

1. **Access:** methodology-grounded help instead of generic AI answers.
2. **Attribution:** every response cites the source work and its license.
3. **Composability:** skills declare dependencies/relationships and can be combined.
4. **Sustainability (planned):** revenue splits route value back to IP owners.

## How It Works (User Flow)

1. User opens the demo and picks a skill (e.g. *Power Analysis Framework*).
2. User describes their situation.
3. The app runs the skill: the skill's markdown grounds the model (or a labelled demo response is produced if no model key is configured).
4. The response is returned with source attribution.

## Key Experience Goals

- **Useful by default:** works with zero configuration (demo mode).
- **Honest:** shipped features and roadmap are clearly distinguished.
- **Trustworthy:** attribution on every answer; safe, lawful, non-violent guidance.
- **Fast to extend:** add a `SKILL.md` file and it's live.

## What It Provides

1. A filesystem skill registry (`SKILL.md` = source of truth).
2. Real LLM execution with a deterministic demo fallback.
3. A hardened public API (validation, rate limiting, security headers).
4. Optional privacy-preserving invocation analytics.

## Integration Points

- **LLM:** Anthropic by default (`@anthropic-ai/sdk`), configurable via env.
- **Database:** optional libSQL/SQLite (local file or Turso).
- **Distribution/payments:** Nostr + Lightning (roadmap).
