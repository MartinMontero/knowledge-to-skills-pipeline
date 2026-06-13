/**
 * Optional database client (libSQL / SQLite).
 *
 * The app is fully functional with no database — persistence is an opt-in
 * enhancement for invocation analytics. When `DATABASE_URL` is unset, `db` is
 * `null` and all logging becomes a no-op.
 *
 * Supported URLs:
 *   - `file:./data/app.db`            local SQLite file (zero-config self-host)
 *   - `libsql://<db>.turso.io`        Turso (set DATABASE_AUTH_TOKEN)
 *   - `http://127.0.0.1:8080`         local libSQL server / sqld
 */

import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { env, isDatabaseConfigured } from "@/lib/env";
import * as schema from "./schema";

let dbInstance: LibSQLDatabase<typeof schema> | null = null;

if (isDatabaseConfigured && env.database.url) {
  try {
    const client = createClient({
      url: env.database.url,
      authToken: env.database.authToken,
    });
    dbInstance = drizzle(client, { schema });
  } catch (error) {
    console.error("Failed to initialise database client; continuing without persistence.", error);
    dbInstance = null;
  }
}

export const db = dbInstance;
