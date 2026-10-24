import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { getAdminSession } from "@/lib/auth";
import { logAdminActivity } from "@/lib/audit";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(request: Request) {
  try {
    await ensureSeeded();
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get("all") === "true";

    if (includeAll) {
      const session = await getAdminSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const all = await db
        .select()
        .from(projects)
        .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
      return NextResponse.json({ projects: all });
    }

    const published = await db
      .select()
      .from(projects)
      .where(eq(projects.status, "published"))
      .orderBy(asc(projects.sortOrder), desc(projects.createdAt));

    return NextResponse.json({ projects: published });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const title = String(body.title || "").trim();
    const tagline = String(body.tagline || "").trim();
    const description = String(body.description || "").trim();

    if (!title || !tagline || !description) {
      return NextResponse.json(
        { error: "Title, tagline, and description are required." },
        { status: 400 }
      );
    }

    const rawSlug = body.slug ? slugify(String(body.slug)) : slugify(title);
    const existingSlug = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, rawSlug));
    const finalSlug =
      existingSlug.length > 0 ? `${rawSlug}-${Date.now()}` : rawSlug;

    const technologies: string[] = Array.isArray(body.technologies)
      ? body.technologies.map((t: unknown) => String(t).trim()).filter(Boolean)
      : String(body.technologies || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

    const inserted = await db
      .insert(projects)
      .values({
        title,
        slug: finalSlug,
        tagline,
        description,
        category: String(body.category || "Software Project"),
        technologies,
        liveUrl: body.liveUrl ? String(body.liveUrl).trim() : null,
        githubUrl: body.githubUrl ? String(body.githubUrl).trim() : null,
        coverImage: String(
          body.coverImage || "/images/project-portfolio-infra.jpg"
        ).trim(),
        status: body.status === "draft" ? "draft" : "published",
        featured: Boolean(body.featured),
        sortOrder: Number(body.sortOrder || 10),
        metrics: body.metrics || {
          architecture: "Full-Stack TypeScript & PostgreSQL",
          deployment: "Cloud Edge + Managed DB",
          highlight: tagline,
        },
      })
      .returning();

    await logAdminActivity({
      session,
      action: "CREATED",
      entityType: "Project",
      entityTitle: title,
      details: `Created project (${body.status === "draft" ? "draft" : "published"})`,
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ project: inserted[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return NextResponse.json(
      { error: "Failed to create project." },
      { status: 500 }
    );
  }
}
