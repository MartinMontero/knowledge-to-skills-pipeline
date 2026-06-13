import { test, expect, describe } from "bun:test";
import { invokeRequestSchema, clientIp } from "./validation";

describe("invoke request validation", () => {
  test("accepts a valid request", () => {
    const result = invokeRequestSchema.safeParse({ slug: "culture-jamming", input: "help me plan a campaign" });
    expect(result.success).toBe(true);
  });

  test("rejects an empty prompt", () => {
    const result = invokeRequestSchema.safeParse({ slug: "culture-jamming", input: "   " });
    expect(result.success).toBe(false);
  });

  test("rejects an oversize prompt", () => {
    const result = invokeRequestSchema.safeParse({ slug: "culture-jamming", input: "x".repeat(5000) });
    expect(result.success).toBe(false);
  });

  test("rejects an invalid slug", () => {
    expect(invokeRequestSchema.safeParse({ slug: "Bad Slug!", input: "hello" }).success).toBe(false);
    expect(invokeRequestSchema.safeParse({ slug: "../etc/passwd", input: "hello" }).success).toBe(false);
  });

  test("rejects a missing slug", () => {
    expect(invokeRequestSchema.safeParse({ input: "hello" }).success).toBe(false);
  });

  test("trims the input", () => {
    const result = invokeRequestSchema.safeParse({ slug: "culture-jamming", input: "  hello  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.input).toBe("hello");
  });
});

describe("clientIp", () => {
  test("uses the first x-forwarded-for hop", () => {
    const req = new Request("https://example.com", { headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } });
    expect(clientIp(req)).toBe("1.2.3.4");
  });

  test("falls back to x-real-ip", () => {
    const req = new Request("https://example.com", { headers: { "x-real-ip": "9.9.9.9" } });
    expect(clientIp(req)).toBe("9.9.9.9");
  });

  test("falls back to 'unknown' when no headers present", () => {
    expect(clientIp(new Request("https://example.com"))).toBe("unknown");
  });
});
