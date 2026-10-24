import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
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
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  if (searchParams.get("all") === "true") {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const all = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return NextResponse.json({ posts: all });
  }

  const published = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.createdAt));
  return NextResponse.json({ posts: published });
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const title = String(body.title || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const content = String(body.content || "").trim();

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, excerpt, and article content are required." },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    const existing = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, baseSlug));
    const slug = existing.length > 0 ? `${baseSlug}-${Date.now()}` : baseSlug;

    const tags = Array.isArray(body.tags)
      ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
      : String(body.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

    const inserted = await db
      .insert(posts)
      .values({
        title,
        slug,
        excerpt,
        content,
        category: String(body.category || "Engineering & Architecture"),
        tags,
        coverImage: String(
          body.coverImage || "/images/project-portfolio-infra.jpg"
        ),
        readingTime: String(body.readingTime || "5 min read"),
        status: body.status === "draft" ? "draft" : "published",
        authorName: session.fullName || "Ikechukwu Egbo",
      })
      .returning();

    await logAdminActivity({
      session,
      action: "PUBLISHED",
      entityType: "BlogPost",
      entityTitle: title,
      details: `Status: ${inserted[0].status}`,
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ post: inserted[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json(
      { error: "Failed to publish blog post." },
      { status: 500 }
    );
  }
}
