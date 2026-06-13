import { NextResponse } from "next/server";
import { getSkill } from "@/lib/skills";

export const dynamic = "force-dynamic";

// GET /api/skills/[slug] — full skill detail, including the markdown body.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = getSkill(slug);

  if (!skill) {
    return NextResponse.json({ error: "Skill not found." }, { status: 404 });
  }

  return NextResponse.json({ skill }, { headers: { "Cache-Control": "no-store" } });
}
