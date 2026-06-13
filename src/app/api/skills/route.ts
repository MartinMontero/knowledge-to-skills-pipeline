import { NextResponse } from "next/server";
import { listSkills } from "@/lib/skills";
import { isLlmConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

// GET /api/skills — list available skills (no markdown bodies).
export function GET() {
  return NextResponse.json(
    {
      mode: isLlmConfigured ? "live" : "demo",
      count: listSkills().length,
      skills: listSkills(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
