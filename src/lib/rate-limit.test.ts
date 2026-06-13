import { test, expect, describe, beforeEach } from "bun:test";
import { checkRateLimit, __resetRateLimiter } from "./rate-limit";

describe("rate limiter", () => {
  beforeEach(() => __resetRateLimiter());

  test("allows requests up to the limit, then blocks", () => {
    const opts = { max: 3, windowSeconds: 60 };
    expect(checkRateLimit("a", opts).allowed).toBe(true);
    expect(checkRateLimit("a", opts).allowed).toBe(true);
    const third = checkRateLimit("a", opts);
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);
    const fourth = checkRateLimit("a", opts);
    expect(fourth.allowed).toBe(false);
    expect(fourth.retryAfterSeconds).toBeGreaterThan(0);
  });

  test("tracks separate keys independently", () => {
    const opts = { max: 1, windowSeconds: 60 };
    expect(checkRateLimit("x", opts).allowed).toBe(true);
    expect(checkRateLimit("x", opts).allowed).toBe(false);
    expect(checkRateLimit("y", opts).allowed).toBe(true);
  });

  test("resets after the window elapses", async () => {
    const opts = { max: 1, windowSeconds: 1 };
    expect(checkRateLimit("z", opts).allowed).toBe(true);
    expect(checkRateLimit("z", opts).allowed).toBe(false);
    await new Promise((r) => setTimeout(r, 1100));
    expect(checkRateLimit("z", opts).allowed).toBe(true);
  });

  test("reports remaining count correctly", () => {
    const opts = { max: 5, windowSeconds: 60 };
    const first = checkRateLimit("count", opts);
    expect(first.limit).toBe(5);
    expect(first.remaining).toBe(4);
  });
});
