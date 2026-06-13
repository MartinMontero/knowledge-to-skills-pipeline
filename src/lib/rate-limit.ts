/**
 * Minimal in-memory, per-key fixed-window rate limiter.
 *
 * Suitable for a single instance (the common self-hosted / single-region
 * serverless case). For multi-instance deployments, back this with a shared
 * store (Redis / Upstash) — the call sites would not need to change.
 */

import { env } from "./env";

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();
let lastSweep = 0;

function sweep(now: number): void {
  // Opportunistically drop expired windows so the map can't grow unbounded.
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Epoch milliseconds when the current window resets. */
  resetAt: number;
  /** Seconds to wait before retrying (only meaningful when blocked). */
  retryAfterSeconds: number;
}

export function checkRateLimit(
  key: string,
  options: { max?: number; windowSeconds?: number } = {},
): RateLimitResult {
  const max = options.max ?? env.rateLimit.max;
  const windowMs = (options.windowSeconds ?? env.rateLimit.windowSeconds) * 1000;
  const now = Date.now();
  sweep(now);

  let window = windows.get(key);
  if (!window || window.resetAt <= now) {
    window = { count: 0, resetAt: now + windowMs };
    windows.set(key, window);
  }

  window.count += 1;
  const allowed = window.count <= max;

  return {
    allowed,
    limit: max,
    remaining: Math.max(0, max - window.count),
    resetAt: window.resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((window.resetAt - now) / 1000)),
  };
}

/** Test-only: clear all limiter state. */
export function __resetRateLimiter(): void {
  windows.clear();
  lastSweep = 0;
}
