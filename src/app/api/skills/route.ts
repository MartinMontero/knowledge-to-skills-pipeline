import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/db";
import { skills, skillSuites } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/skills - List all skills
export async function GET() {
  // Return demo skills if database is not configured
  if (!isDbConfigured || !db) {
    return NextResponse.json({
      skills: [
        {
          id: "demo-1",
          slug: "culture-jamming",
          name: "Culture Jamming",
          description: "Subvert dominant narratives through ironic counter-messaging",
          pricePerUse: 100,
          subscriptionPrice: 500,
          suiteId: "demo-suite",
          suite: {
            id: "demo-suite",
            slug: "beautiful-trouble",
            name: "Beautiful Trouble",
            description: "A toolbox for creative activists",
          },
        },
      ],
    });
  }

  try {
    const allSkills = await db
      .select({
        id: skills.id,
        slug: skills.slug,
        name: skills.name,
        description: skills.description,
        pricePerUse: skills.pricePerUse,
        subscriptionPrice: skills.subscriptionPrice,
        suiteId: skills.suiteId,
      })
      .from(skills);

    // Get suite info for each skill
    const skillsWithSuites = await Promise.all(
      allSkills.map(async (skill) => {
        if (skill.suiteId) {
          const [suite] = await db!
            .select()
            .from(skillSuites)
            .where(eq(skillSuites.id, skill.suiteId));
          return { ...skill, suite };
        }
        return { ...skill, suite: null };
      })
    );

    return NextResponse.json({ skills: skillsWithSuites });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}
