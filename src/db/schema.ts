import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table - accounts for the platform
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  nostrPubkey: text("nostr_pubkey"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Skill suites - collections of related skills (e.g., Beautiful Trouble)
export const skillSuites = sqliteTable("skill_suites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  sourceId: integer("source_id").references(() => knowledgeSources.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Individual skills - specific capabilities within a suite
export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  suiteId: integer("suite_id").references(() => skillSuites.id),
  name: text("name").notNull(),
  description: text("description"),
  content: text("content"), // The full SKILL.md content
  ipOwnerId: integer("ip_owner_id").references(() => users.id),
  authorId: integer("author_id").references(() => users.id),
  pricePerUse: integer("price_per_use"), // in sats
  subscriptionPrice: integer("subscription_price"), // in sats/month
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Knowledge sources - books, guides, toolkits being converted
export const knowledgeSources = sqliteTable("knowledge_sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  author: text("author"),
  publisher: text("publisher"),
  url: text("url"),
  ipOwnerId: integer("ip_owner_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Payment records - Lightning/Zap transactions
export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fromUserId: integer("from_user_id").references(() => users.id),
  toUserId: integer("to_user_id").references(() => users.id),
  skillId: integer("skill_id").references(() => skills.id),
  amount: integer("amount").notNull(), // in sats
  type: text("type").notNull(), // "zap" | "subscription"
  zapRequestId: text("zap_request_id"), // NIP-57 zap request ID
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Skill invocations - logs of skill executions
export const skillInvocations = sqliteTable("skill_invocations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  skillId: integer("skill_id").references(() => skills.id),
  userId: integer("user_id").references(() => users.id),
  input: text("input"),
  output: text("output"),
  tokensUsed: integer("tokens_used"),
  duration: integer("duration"), // in milliseconds
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
