import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
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
    const projectId = Number(id);
    if (!projectId) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.tagline !== undefined)
      updateData.tagline = String(body.tagline).trim();
    if (body.description !== undefined)
      updateData.description = String(body.description).trim();
    if (body.category !== undefined)
      updateData.category = String(body.category).trim();
    if (body.liveUrl !== undefined)
      updateData.liveUrl = body.liveUrl ? String(body.liveUrl).trim() : null;
    if (body.githubUrl !== undefined)
      updateData.githubUrl = body.githubUrl
        ? String(body.githubUrl).trim()
        : null;
    if (body.coverImage !== undefined)
      updateData.coverImage = String(body.coverImage).trim();
    if (body.status !== undefined) updateData.status = String(body.status);
    if (body.featured !== undefined)
      updateData.featured = Boolean(body.featured);
    if (body.sortOrder !== undefined)
      updateData.sortOrder = Number(body.sortOrder);
    if (body.metrics !== undefined) updateData.metrics = body.metrics;

    if (body.technologies !== undefined) {
      updateData.technologies = Array.isArray(body.technologies)
        ? body.technologies.map((t: unknown) => String(t).trim()).filter(Boolean)
        : String(body.technologies)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
    }

    const updated = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, projectId))
      .returning();

    if (!updated[0]) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await logAdminActivity({
      session,
      action: "UPDATED",
      entityType: "Project",
      entityTitle: updated[0].title,
      details: `Updated project status=${updated[0].status}, order=${updated[0].sortOrder}`,
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ project: updated[0] });
  } catch (err) {
    console.error("PATCH /api/projects/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update project." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const projectId = Number(id);
    if (!projectId) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const deleted = await db
      .delete(projects)
      .where(eq(projects.id, projectId))
      .returning();

    if (!deleted[0]) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await logAdminActivity({
      session,
      action: "DELETED",
      entityType: "Project",
      entityTitle: deleted[0].title,
      details: "Removed project from database",
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, deletedId: projectId });
  } catch (err) {
    console.error("DELETE /api/projects/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete project." },
      { status: 500 }
    );
  }
}
