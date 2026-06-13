/**
 * Filesystem-backed skill registry.
 *
 * Skills are authored as `SKILL.md` files (YAML frontmatter + markdown body)
 * under `src/skills/`. Those files are the single source of truth: the markdown
 * body is the actual context handed to the language model at invocation time,
 * and the frontmatter carries metadata and IP attribution. This module loads
 * and validates them once, then caches the result for the process lifetime.
 *
 * Server-only by nature: it touches the filesystem and parses YAML (via the
 * `node:fs` import below), so it must only be used from server code.
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const SKILLS_DIR = path.join(process.cwd(), "src", "skills");

const attributionSchema = z
  .object({
    source_title: z.string().optional(),
    source_authors: z.array(z.string()).optional(),
    source_publisher: z.string().optional(),
    source_url: z.string().optional(),
    source_license: z.string().optional(),
    ip_owner_npub: z.string().optional(),
    ip_owner_lightning: z.string().optional(),
    derivative_license: z.string().optional(),
    skill_author: z.string().optional(),
    skill_author_npub: z.string().optional(),
    conversion_date: z.string().optional(),
  })
  .passthrough();

const revenueSplitSchema = z.object({
  ip_owner: z.number(),
  skill_author: z.number(),
  platform: z.number(),
});

const frontmatterSchema = z
  .object({
    name: z.string().min(1),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
    suite: z.string().min(1),
    category: z.string().optional(),
    version: z.union([z.string(), z.number()]).optional(),
    description: z.string().optional(),
    trigger: z.string().optional(),
    attribution: attributionSchema.optional(),
    revenue_split: revenueSplitSchema.optional(),
    depends_on: z.array(z.string()).optional(),
    related_skills: z.array(z.string()).optional(),
    price_per_use: z.number().int().nonnegative().optional(),
    subscription_price: z.number().int().nonnegative().optional(),
  })
  .passthrough();

export type SkillAttribution = z.infer<typeof attributionSchema>;
export type RevenueSplit = z.infer<typeof revenueSplitSchema>;

export interface SuiteSummary {
  slug: string;
  name: string;
  description?: string;
}

export interface Skill {
  slug: string;
  name: string;
  category?: string;
  version: string;
  /** Short, human-readable summary for cards/listings. */
  description: string;
  /** Guidance on when this skill should be invoked. */
  trigger?: string;
  /** Full markdown body — the context used to ground the model. */
  content: string;
  suite: SuiteSummary;
  attribution?: SkillAttribution;
  revenueSplit?: RevenueSplit;
  dependsOn: string[];
  relatedSkills: string[];
  /** Indicative price metadata (sats). Display-only; no live payments occur. */
  pricePerUse?: number;
  subscriptionPrice?: number;
}

/** The shape returned to clients — omits the (large) markdown body for listings. */
export type SkillListItem = Omit<Skill, "content">;

interface SuiteIndexEntry {
  slug: string;
  name: string;
  source?: string;
  authors?: string[];
  license?: string;
  status?: string;
}

interface SuiteIndex {
  suites?: SuiteIndexEntry[];
  attribution?: {
    default_split?: RevenueSplit;
    license_compatibility?: Record<string, unknown>;
  };
}

function loadSuiteIndex(): Map<string, SuiteIndexEntry> {
  const indexPath = path.join(SKILLS_DIR, "index.json");
  const map = new Map<string, SuiteIndexEntry>();
  if (!existsSync(indexPath)) return map;
  try {
    const parsed = JSON.parse(readFileSync(indexPath, "utf8")) as SuiteIndex;
    for (const suite of parsed.suites ?? []) {
      if (suite.slug) map.set(suite.slug, suite);
    }
  } catch {
    // A malformed index shouldn't take down skill loading; suites degrade to
    // their frontmatter-derived names.
  }
  return map;
}

function walkMarkdown(dir: string): string[] {
  const out: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walkMarkdown(full));
      continue;
    }
    // Skill files end in `.md`; `_`-prefixed files (e.g. `_suite.md`) are
    // suite-level documents, not invokable skills.
    if (entry.endsWith(".md") && !entry.startsWith("_")) {
      out.push(full);
    }
  }
  return out;
}

function buildRegistry(): Map<string, Skill> {
  const suiteIndex = loadSuiteIndex();
  const registry = new Map<string, Skill>();

  for (const file of walkMarkdown(SKILLS_DIR)) {
    let parsed: matter.GrayMatterFile<string>;
    try {
      parsed = matter(readFileSync(file, "utf8"));
    } catch {
      continue;
    }

    const result = frontmatterSchema.safeParse(parsed.data);
    if (!result.success) {
      // Skip malformed skills loudly in dev, silently in prod — never crash.
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Skipping invalid skill ${path.relative(SKILLS_DIR, file)}: ${result.error.message}`);
      }
      continue;
    }

    const fm = result.data;
    if (registry.has(fm.slug)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Duplicate skill slug "${fm.slug}" — keeping the first occurrence.`);
      }
      continue;
    }

    const suiteEntry = suiteIndex.get(fm.suite);
    const description = (fm.description ?? fm.trigger ?? "").trim() || `${fm.name} skill.`;

    registry.set(fm.slug, {
      slug: fm.slug,
      name: fm.name,
      category: fm.category,
      version: String(fm.version ?? "1.0.0"),
      description,
      trigger: fm.trigger?.trim() || undefined,
      content: parsed.content.trim(),
      suite: {
        slug: fm.suite,
        name: suiteEntry?.name ?? fm.suite,
        description: suiteEntry?.source,
      },
      attribution: fm.attribution,
      revenueSplit: fm.revenue_split,
      dependsOn: fm.depends_on ?? [],
      relatedSkills: fm.related_skills ?? [],
      pricePerUse: fm.price_per_use,
      subscriptionPrice: fm.subscription_price,
    });
  }

  return registry;
}

let cache: Map<string, Skill> | null = null;

function registry(): Map<string, Skill> {
  // Cache in production; always rebuild in development so editing a skill file
  // is reflected without a server restart.
  if (cache && process.env.NODE_ENV === "production") return cache;
  if (!cache || process.env.NODE_ENV !== "production") {
    cache = buildRegistry();
  }
  return cache;
}

function toListItem(skill: Skill): SkillListItem {
  // Strip the large markdown body for listing payloads.
  const { content: _content, ...rest } = skill;
  void _content;
  return rest;
}

/** All skills, sorted by suite then name, without their markdown bodies. */
export function listSkills(): SkillListItem[] {
  return [...registry().values()]
    .map(toListItem)
    .sort((a, b) => a.suite.name.localeCompare(b.suite.name) || a.name.localeCompare(b.name));
}

/** Full skill (including markdown body) by slug, or null if unknown. */
export function getSkill(slug: string): Skill | null {
  return registry().get(slug) ?? null;
}

/** Number of loaded skills. */
export function skillCount(): number {
  return registry().size;
}
