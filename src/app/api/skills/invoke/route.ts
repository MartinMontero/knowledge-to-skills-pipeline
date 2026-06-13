import { NextResponse } from "next/server";
import { getSkill } from "@/lib/skills";
import { runSkill, LlmError } from "@/lib/llm";
import { checkRateLimit } from "@/lib/rate-limit";
import { invokeRequestSchema, clientIp } from "@/lib/validation";
import { logInvocation } from "@/db/logging";

export const dynamic = "force-dynamic";

// Reject oversized bodies before parsing. The prompt itself is capped to a few
// thousand characters, so anything beyond this is abusive — fail fast.
const MAX_BODY_BYTES = 32 * 1024;

function rateLimitHeaders(result: ReturnType<typeof checkRateLimit>): Record<string, string> {
  return {
    "Cache-Control": "no-store",
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}

// POST /api/skills/invoke — execute a skill against a user prompt.
export async function POST(request: Request) {
  // 1. Rate limit per client IP.
  const rate = checkRateLimit(`invoke:${clientIp(request)}`);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please slow down and try again." },
      { status: 429, headers: { ...rateLimitHeaders(rate), "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  // 2. Reject oversized payloads early (DoS guard).
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large." }, { status: 413, headers: rateLimitHeaders(rate) });
  }

  // 3. Parse and validate the body.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400, headers: rateLimitHeaders(rate) });
  }

  const parsed = invokeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400, headers: rateLimitHeaders(rate) },
    );
  }
  const { slug, input } = parsed.data;

  // 4. Resolve the skill.
  const skill = getSkill(slug);
  if (!skill) {
    return NextResponse.json({ error: "Skill not found." }, { status: 404, headers: rateLimitHeaders(rate) });
  }

  // 5. Execute (live model or demo fallback).
  try {
    const result = await runSkill(skill, input);

    await logInvocation({
      skillSlug: skill.slug,
      suiteSlug: skill.suite.slug,
      mode: result.mode,
      model: result.model,
      inputChars: input.length,
      outputChars: result.output.length,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      durationMs: result.durationMs,
    });

    return NextResponse.json(
      {
        success: true,
        mode: result.mode,
        output: result.output,
        skill: { slug: skill.slug, name: skill.name },
        attribution: skill.attribution ?? null,
        revenueSplit: skill.revenueSplit ?? null,
        usage: {
          model: result.model ?? null,
          inputTokens: result.inputTokens ?? null,
          outputTokens: result.outputTokens ?? null,
          durationMs: result.durationMs,
        },
      },
      { headers: rateLimitHeaders(rate) },
    );
  } catch (error) {
    if (error instanceof LlmError) {
      return NextResponse.json({ error: error.message }, { status: error.status, headers: rateLimitHeaders(rate) });
    }
    console.error("Unhandled error during skill invocation:", error);
    return NextResponse.json({ error: "Skill execution failed." }, { status: 500, headers: rateLimitHeaders(rate) });
  }
}
