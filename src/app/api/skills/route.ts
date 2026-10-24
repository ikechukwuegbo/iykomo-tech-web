import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { getAdminSession } from "@/lib/auth";
import { logAdminActivity } from "@/lib/audit";

export async function GET() {
  await ensureSeeded();
  const list = await db
    .select()
    .from(skills)
    .orderBy(asc(skills.sortOrder), desc(skills.proficiency));
  return NextResponse.json({ skills: list });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const name = String(body.name || "").trim();
  if (!name) {
    return NextResponse.json(
      { error: "Skill name is required." },
      { status: 400 }
    );
  }

  const inserted = await db
    .insert(skills)
    .values({
      name,
      category: String(body.category || "Full-Stack Engineering"),
      proficiency: Math.min(100, Math.max(10, Number(body.proficiency || 90))),
      iconName: String(body.iconName || "Code2"),
      featured: true,
      sortOrder: Number(body.sortOrder || 20),
    })
    .returning();

  await logAdminActivity({
    session,
    action: "CREATED",
    entityType: "Skill",
    entityTitle: name,
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ skill: inserted[0] }, { status: 201 });
}
