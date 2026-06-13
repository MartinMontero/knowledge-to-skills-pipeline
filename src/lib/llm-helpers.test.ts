import { test, expect, describe } from "bun:test";
import { buildSystemPrompt, extractHeadings, demoResponse } from "./llm-helpers";
import type { Skill } from "./skills";

const fixture: Skill = {
  slug: "culture-jamming",
  name: "Culture Jamming",
  category: "tactic",
  version: "1.0.0",
  description: "Subvert messaging.",
  content: "# Title\n\n## Overview\nText.\n\n## When to Use\nMore text.\n\n### Technique\nDetail.",
  suite: { slug: "beautiful-trouble", name: "Beautiful Trouble" },
  attribution: {
    source_title: "Beautiful Trouble",
    source_authors: ["Andrew Boyd", "Dave Oswald Mitchell"],
    source_license: "CC-BY-SA-4.0",
  },
  dependsOn: [],
  relatedSkills: [],
};

describe("extractHeadings", () => {
  test("pulls h2/h3 headings, skips h1, dedupes", () => {
    expect(extractHeadings(fixture.content)).toEqual(["Overview", "When to Use", "Technique"]);
  });

  test("respects the limit", () => {
    expect(extractHeadings(fixture.content, 2)).toEqual(["Overview", "When to Use"]);
  });

  test("returns empty array when there are no headings", () => {
    expect(extractHeadings("just text, no headings")).toEqual([]);
  });
});

describe("buildSystemPrompt", () => {
  test("embeds the skill content and attribution", () => {
    const prompt = buildSystemPrompt(fixture);
    expect(prompt).toContain("Culture Jamming");
    expect(prompt).toContain("<skill>");
    expect(prompt).toContain("## Overview");
    expect(prompt).toContain("Beautiful Trouble");
    expect(prompt).toContain("CC-BY-SA-4.0");
    expect(prompt).toContain("lawful");
  });
});

describe("demoResponse", () => {
  test("is deterministic and labelled as demo", () => {
    const a = demoResponse(fixture, "my situation");
    const b = demoResponse(fixture, "my situation");
    expect(a).toBe(b);
    expect(a).toContain("Demo mode");
    expect(a).toContain("Culture Jamming");
    expect(a).toContain("my situation");
  });

  test("references the skill's own section headings", () => {
    const out = demoResponse(fixture, "x");
    expect(out).toContain("Overview");
    expect(out).toContain("When to Use");
  });
});
