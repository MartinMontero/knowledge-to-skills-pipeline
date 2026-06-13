/**
 * Centralised, validated runtime configuration.
 *
 * Everything the app needs from the environment is read and normalised here so
 * the rest of the codebase can depend on typed values and feature flags instead
 * of poking at `process.env` directly. Nothing in here throws at import time —
 * the app must boot (in a clearly-labelled degraded mode) even when nothing is
 * configured, so it stays deployable with zero setup.
 */

function readString(key: string): string | undefined {
  const value = process.env[key];
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readInt(key: string, fallback: number, { min, max }: { min: number; max: number }): number {
  const raw = readString(key);
  if (raw === undefined) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

const anthropicApiKey = readString("ANTHROPIC_API_KEY");
const databaseUrl = readString("DATABASE_URL");

export const env = {
  /** Human-facing app name, used in metadata and the LLM system prompt. */
  appName: readString("APP_NAME") ?? "Knowledge-to-Skills Pipeline",

  /** Public site URL, used for absolute links / Open Graph. Optional. */
  siteUrl: readString("SITE_URL"),

  llm: {
    apiKey: anthropicApiKey,
    /**
     * Model id. Defaults to the latest, most capable Claude model. Deployers
     * who care about cost can point this at a cheaper model (e.g.
     * `claude-haiku-4-5`) without touching code.
     */
    model: readString("LLM_MODEL") ?? "claude-opus-4-8",
    /** Hard ceiling on generated tokens per invocation — bounds cost and latency. */
    maxTokens: readInt("LLM_MAX_TOKENS", 2048, { min: 256, max: 8192 }),
  },

  database: {
    url: databaseUrl,
    authToken: readString("DATABASE_AUTH_TOKEN"),
  },

  rateLimit: {
    /** Requests allowed per window, per client IP, for the invoke endpoint. */
    max: readInt("RATE_LIMIT_MAX", 20, { min: 1, max: 10_000 }),
    /** Window length in seconds. */
    windowSeconds: readInt("RATE_LIMIT_WINDOW_SECONDS", 60, { min: 1, max: 86_400 }),
  },

  /** Maximum length (characters) accepted for a user prompt. */
  maxInputLength: readInt("MAX_INPUT_LENGTH", 4000, { min: 1, max: 20_000 }),
} as const;

/** True when a real LLM provider is configured; otherwise the app serves a clearly-labelled demo. */
export const isLlmConfigured = Boolean(env.llm.apiKey);

/** True when an optional libSQL/SQLite database is configured for invocation logging. */
export const isDatabaseConfigured = Boolean(env.database.url);
