import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Invocation log — analytics only, privacy-first.
 *
 * We deliberately store *metadata* (which skill, which mode, sizes, timing)
 * and never the raw prompt or response text, so the log is useful for usage
 * insight without retaining user content.
 */
export const skillInvocations = sqliteTable("skill_invocations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  skillSlug: text("skill_slug").notNull(),
  suiteSlug: text("suite_slug"),
  mode: text("mode").notNull(), // "live" | "demo"
  model: text("model"),
  inputChars: integer("input_chars").notNull(),
  outputChars: integer("output_chars").notNull(),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  durationMs: integer("duration_ms"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type SkillInvocation = typeof skillInvocations.$inferSelect;
export type NewSkillInvocation = typeof skillInvocations.$inferInsert;
