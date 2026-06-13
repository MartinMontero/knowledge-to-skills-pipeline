/**
 * Request validation and helpers shared across API routes.
 */

import { z } from "zod";
import { env } from "./env";

export const invokeRequestSchema = z.object({
  slug: z
    .string()
    .min(1, "A skill slug is required.")
    .max(128)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid skill slug."),
  input: z
    .string()
    .trim()
    .min(1, "A prompt is required.")
    .max(env.maxInputLength, `Prompt must be ${env.maxInputLength} characters or fewer.`),
});

export type InvokeRequest = z.infer<typeof invokeRequestSchema>;

/**
 * Best-effort client IP for rate limiting. Behind a proxy/CDN the first
 * `x-forwarded-for` hop is the client; falls back to `x-real-ip`.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
