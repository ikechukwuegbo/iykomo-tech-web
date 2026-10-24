import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { logAdminActivity } from "@/lib/audit";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await context.params;
    const body = await request.json();

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.excerpt !== undefined)
      updateData.excerpt = String(body.excerpt).trim();
    if (body.content !== undefined)
      updateData.content = String(body.content).trim();
    if (body.category !== undefined)
      updateData.category = String(body.category);
    if (body.coverImage !== undefined)
      updateData.coverImage = String(body.coverImage);
    if (body.status !== undefined) updateData.status = String(body.status);
    if (body.tags !== undefined) {
      updateData.tags = Array.isArray(body.tags)
        ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
        : String(body.tags)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
    }

    const updated = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, Number(id)))
      .returning();

    if (!updated[0]) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await logAdminActivity({
      session,
      action: "UPDATED",
      entityType: "BlogPost",
      entityTitle: updated[0].title,
      details: `Updated status=${updated[0].status}`,
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ post: updated[0] });
  } catch (err) {
    console.error("PATCH /api/posts/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update post." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const deleted = await db
    .delete(posts)
    .where(eq(posts.id, Number(id)))
    .returning();

  if (!deleted[0]) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await logAdminActivity({
    session,
    action: "DELETED",
    entityType: "BlogPost",
    entityTitle: deleted[0].title,
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
