/**
 * Standalone migration runner: `bun run db:migrate`.
 *
 * Applies the SQL migrations in `src/db/migrations` to the configured database.
 * Requires `DATABASE_URL` (and `DATABASE_AUTH_TOKEN` for remote Turso). For a
 * local file URL it creates the parent directory if needed.
 */

import { mkdirSync } from "node:fs";
import path from "node:path";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL?.trim();
const authToken = process.env.DATABASE_AUTH_TOKEN?.trim();

if (!url) {
  console.error("DATABASE_URL is not set — nothing to migrate. (The app runs fine without a database.)");
  process.exit(0);
}

// Ensure the directory exists for local file URLs (e.g. file:./data/app.db).
if (url.startsWith("file:")) {
  const filePath = url.slice("file:".length);
  const dir = path.dirname(filePath);
  if (dir && dir !== ".") mkdirSync(dir, { recursive: true });
}

const client = createClient({ url, authToken });
const db = drizzle(client);

await migrate(db, { migrationsFolder: path.join("src", "db", "migrations") });
console.log("Migrations applied successfully.");
client.close();
