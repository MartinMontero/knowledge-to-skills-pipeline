# Active Context: Knowledge-to-Skills Pipeline

## Current State

**Project Status**: ✅ Backend Implemented

The Knowledge-to-Skills Pipeline now has database schema, API routes, and a working demo interface. The system converts published knowledge (books, guides, toolkits) into composable AI agent skills, delivered through Onyx + Maple AI with IP attribution via Nostr Lightning payments.

## Recently Completed

- [x] Analyze the Knowledge-to-Skills Pipeline specification document
- [x] Create landing page presenting the pipeline architecture
- [x] Build skill suite showcase section with Beautiful Trouble as reference
- [x] Add business model explanation (SkillStream & SkillZap)
- [x] Implement skill manifest structure and SKILL.md template
- [x] Create sample SKILL.md (culture-jamming from Beautiful Trouble)
- [x] Create skill index registry (src/skills/index.json)
- [x] Create suite manifest (_suite.md)
- [x] Pass typecheck and lint validation
- [x] Add lucide-react dependency for icons
- [x] Add database with Drizzle ORM (users, skills, payments, invocations)
- [x] Create API routes for skills (GET /api/skills, POST /api/skills/invoke)
- [x] Build demo page at /demo with skill invocation interface

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Landing page with pipeline overview | ✅ Built |
| `src/skills/index.json` | Skill registry with suite metadata | ✅ Built |
| `src/skills/beautiful-trouble/_suite.md` | Suite manifest with composability | ✅ Built |
| `src/skills/beautiful-trouble/tactics/culture-jamming.md` | Sample SKILL.md template | ✅ Built |

## Current Focus

This is a complex multi-phase project. Initial implementation includes:
1. Landing page showcasing the pipeline
2. Sample skill structure (Beautiful Trouble reference implementation)
3. Skill registry and manifest system

## Key Concepts Implemented

### Technology Stack
- **Onyx**: Nostr-native encrypted knowledge vault
- **Maple AI**: Privacy-first inference engine
- **Nostr**: Decentralized relay network
- **Lightning**: Native micropayments (Zaps)

### Business Models
- **SkillStream**: Subscription + Revenue Share ($12/month)
- **SkillZap**: Pay-per-invocation (25-500 sats)

### Attribution System
- Revenue split: 70% IP owner, 20% skill author, 10% platform
- NIP-57 Zap receipts for transparent payments

## Session History

| Date | Changes |
|------|---------|
| 2026-03-03 | Initial implementation: landing page, skill structure, sample SKILL.md |
| 2026-03-03 | Add database schema, API routes, and demo page |
| 2026-03-03 | Fix database configuration for build without environment variables |
| 2026-03-03 | Add placeholder migration script for build without DB |

## Next Steps (Future Phases)

From the specification document, the full roadmap includes:
- Phase 1: Foundation (Onyx fork, Maple integration)
- Phase 2: Payment integration (NIP-57 Zaps, revenue splits)
- Phase 3: Scale pipeline (10+ sources)
- Phase 4: Ecosystem (community submissions)

## Dependencies Added

- `lucide-react` for icon components
