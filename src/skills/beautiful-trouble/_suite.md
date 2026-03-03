# Beautiful Trouble Skill Suite

## Suite Metadata

| Property | Value |
|----------|-------|
| **Name** | Beautiful Trouble |
| **Source** | Beautiful Trouble: A Toolbox for Revolution |
| **Authors** | Andrew Boyd & Dave Oswald Mitchell |
| **License** | CC-BY-SA-4.0 |
| **Suite Version** | 1.0.0 |
| **Total Skills** | 24 |
| **Conversion Date** | 2026-02-23 |

## Skill Categories

### Tactics (12 skills)
- `culture-jamming` - Subverting corporate messaging through artistic intervention
- `banner-drop` - Creating visible banner actions
- `guerrilla-theater` - Performative direct action
- `meme-warfare` - Digital counter-narrative creation
- `symbolic-action` - Visual representations of demands
- `direct-action` - Physical intervention tactics
- `occupation` - Taking and holding space
- `blockade` - Preventing access
- `sabotage` - Interrupting systems
- `dumpster-dive` - Consumer culture critique
- `flash-mob` - Surprise coordinated action
- `media-stunt` - Attention-grabbing publicity events

### Principles (6 skills)
- `dilemma-action` - Forcing opponent to choose between bad options
- `prefigurative-politics` - Living the world you want now
- `disrupting-the-narrative` - Shifting public perception
- `outside-inside-strategy` - Combining radical and establishment pressure
- `rank-and-file-filip` - Pressuring leadership through base
- `strategic-nonviolence` - Principles of nonviolent struggle

### Theories (6 skills)
- `power-analysis-framework` - Understanding power structures
- `movement-building-theory` - Building durable movements
- `nonviolence-philosophy` - Philosophical foundations
- `community-organizing` - Base-building approaches
- `strategic-framing` - Message construction
- `coalition-building` - Alliance formation

## Composability Map

```
tactics/
├── culture-jamming ──→ depends on: power-analysis, prefigurative
├── banner-drop ──────→ depends on: disrupting-narrative
├── guerrilla-theater ─→ depends on: strategic-framing
├── meme-warfare ─────→ depends on: disrupting-narrative
├── direct-action ────→ depends on: strategic-nonviolence
├── occupation ────────→ depends on: power-analysis
└── ...

principles/
├── dilemma-action ────→ informs: tactics
├── prefigurative ─────→ informs: all tactics
├── disrupting-narrative → informs: media tactics
└── ...

theories/
├── power-analysis ────→ informs: all
├── movement-building ──→ informs: strategy
└── ...
```

## Shared Resources

- `shared/consent-and-safety.md` - Safety protocols for all tactics
- `shared/power-analysis-framework.md` - Core analytical tool
- `shared/de-escalation-protocol.md` - Conflict management

## Revenue Distribution

Each skill invocation (25-500 sats) is split:
- **70%** → beautifultrouble.org (IP Owner)
- **20%** → homebase-civic-lab (Skill Author)
- **10%** → Platform (Onyx/Maple Operations)

## Nostr Integration

- **Suite Publisher npub**: npub1_beautifultrouble_suite_example
- **Relay**: wss://relay.beautifultrouble.skills
- **Kind**: 30078 (Parameterized Replaceable Event)
- **Discovery tag**: #beautiful-trouble

## Cross-Suite Integration

This suite integrates with:
- `rules-for-radicals` - Strategic principles
- `facilitators-guide` - Process tactics
- Shared: consent-and-safety, power-analysis
