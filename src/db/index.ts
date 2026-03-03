import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

// Database will be null if DB_URL and DB_TOKEN are not provided
let dbInstance: ReturnType<typeof createDatabase> | null = null;

try {
  // This will throw if DB_URL and DB_TOKEN are not set
  dbInstance = createDatabase(schema);
} catch (error) {
  console.warn(
    "Database not configured. Set DB_URL and DB_TOKEN environment variables. Using mock database mode."
  );
}

export const db = dbInstance;
export const isDbConfigured = dbInstance !== null;
