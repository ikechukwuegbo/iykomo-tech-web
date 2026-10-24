import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
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
    const serviceId = Number(id);
    const body = await request.json();

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.summary !== undefined)
      updateData.summary = String(body.summary).trim();
    if (body.description !== undefined)
      updateData.description = String(body.description).trim();
    if (body.pricingNote !== undefined)
      updateData.pricingNote = String(body.pricingNote).trim();
    if (body.iconName !== undefined)
      updateData.iconName = String(body.iconName);
    if (body.published !== undefined)
      updateData.published = Boolean(body.published);
    if (body.sortOrder !== undefined)
      updateData.sortOrder = Number(body.sortOrder);
    if (body.features !== undefined) {
      updateData.features = Array.isArray(body.features)
        ? body.features.map((f: unknown) => String(f).trim()).filter(Boolean)
        : String(body.features)
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean);
    }

    const updated = await db
      .update(services)
      .set(updateData)
      .where(eq(services.id, serviceId))
      .returning();

    if (!updated[0]) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    await logAdminActivity({
      session,
      action: "UPDATED",
      entityType: "Service",
      entityTitle: updated[0].title,
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ service: updated[0] });
  } catch (err) {
    console.error("PATCH /api/services/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update service." },
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
    .delete(services)
    .where(eq(services.id, Number(id)))
    .returning();

  if (!deleted[0]) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  await logAdminActivity({
    session,
    action: "DELETED",
    entityType: "Service",
    entityTitle: deleted[0].title,
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
