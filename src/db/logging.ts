/**
 * Fire-and-forget invocation logging.
 *
 * Logging must never affect the user-facing request: every failure is swallowed
 * and the call is a no-op when no database is configured.
 */

import { db } from "./index";
import { skillInvocations, type NewSkillInvocation } from "./schema";

export async function logInvocation(entry: NewSkillInvocation): Promise<void> {
  if (!db) return;
  try {
    await db.insert(skillInvocations).values(entry);
  } catch (error) {
    console.error("Failed to log invocation (non-fatal):", error);
  }
}
