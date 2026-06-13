/**
 * Pure helpers for skill execution: prompt construction and the deterministic
 * demo response. Kept free of side effects and SDK imports so they can be unit
 * tested in isolation.
 */

import type { Skill } from "./skills";

export function buildSystemPrompt(skill: Skill): string {
  const source = skill.attribution?.source_title ?? skill.suite.name;
  const authors = skill.attribution?.source_authors?.join(", ");
  const license = skill.attribution?.source_license;

  const attributionLine = [
    source && `Source work: "${source}"`,
    authors && `by ${authors}`,
    license && `(licensed ${license})`,
  ]
    .filter(Boolean)
    .join(" ");

  return [
    `You are an expert practitioner applying a specific, named methodology — "${skill.name}" — to help the user with their request.`,
    attributionLine && `This methodology is derived from published knowledge. ${attributionLine}.`,
    "",
    "Reference material (the methodology you must apply):",
    "<skill>",
    skill.content,
    "</skill>",
    "",
    "Instructions:",
    "- Ground your guidance in the methodology above. Be concrete, practical, and specific to the user's situation.",
    "- Cite the source work when you draw on its ideas, and respect its license.",
    "- Keep all guidance lawful, non-violent, safe, and ethical. This material concerns creative civic engagement and organizing.",
    "- Refuse, and suggest a constructive alternative, if a request seeks to cause physical harm, property destruction, harassment, or other illegal acts.",
    "- Respond in clear, well-structured markdown. Lead with the most useful, actionable point.",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Pull the first few section headings out of a markdown body, for the demo response. */
export function extractHeadings(markdown: string, limit = 4): string[] {
  const headings: string[] = [];
  for (const line of markdown.split("\n")) {
    const match = /^#{2,3}\s+(.+?)\s*$/.exec(line);
    if (match) {
      const heading = match[1].replace(/[#*`]/g, "").trim();
      if (heading && !headings.includes(heading)) headings.push(heading);
    }
    if (headings.length >= limit) break;
  }
  return headings;
}

export function demoResponse(skill: Skill, input: string): string {
  const headings = extractHeadings(skill.content);
  const angle =
    headings.length > 0
      ? headings.map((h) => `- **${h}** — consider how this applies to your situation.`).join("\n")
      : "- Break the goal into concrete, achievable steps.\n- Identify who holds power and where leverage exists.";

  const source = skill.attribution?.source_title;
  const authors = skill.attribution?.source_authors?.join(" & ");

  return [
    `### Applying **${skill.name}** to your request`,
    "",
    `> ${input.trim()}`,
    "",
    `Using the **${skill.name}** methodology${skill.suite?.name ? ` from the *${skill.suite.name}* suite` : ""}, here are the angles worth exploring:`,
    "",
    angle,
    "",
    source ? `_Methodology derived from *${source}*${authors ? ` by ${authors}` : ""}._` : "",
    "",
    "---",
    "⚙️ **Demo mode.** This response is generated locally from the skill's own structure — no language model was called. Set an `ANTHROPIC_API_KEY` to get a fully reasoned, situation-specific answer grounded in the complete skill content.",
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}
