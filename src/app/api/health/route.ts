import { NextResponse } from "next/server";
import { isLlmConfigured, isDatabaseConfigured } from "@/lib/env";
import { skillCount } from "@/lib/skills";

export const dynamic = "force-dynamic";

// GET /api/health — lightweight readiness probe for deployments.
export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      skills: skillCount(),
      llm: isLlmConfigured ? "configured" : "demo",
      database: isDatabaseConfigured ? "configured" : "none",
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
