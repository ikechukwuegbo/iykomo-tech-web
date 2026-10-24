import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { certifications } from "@/db/schema";
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

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = String(body.title).trim();
    if (body.issuer !== undefined) updateData.issuer = String(body.issuer).trim();
    if (body.issueDate !== undefined)
      updateData.issueDate = String(body.issueDate).trim();
    if (body.credentialId !== undefined)
      updateData.credentialId = body.credentialId
        ? String(body.credentialId).trim()
        : null;
    if (body.credentialUrl !== undefined)
      updateData.credentialUrl = body.credentialUrl
        ? String(body.credentialUrl).trim()
        : null;
    if (body.certificateFile !== undefined)
      updateData.certificateFile = body.certificateFile
        ? String(body.certificateFile).trim()
        : null;
    if (body.sortOrder !== undefined)
      updateData.sortOrder = Number(body.sortOrder);
    if (body.skillsCovered !== undefined) {
      updateData.skillsCovered = Array.isArray(body.skillsCovered)
        ? body.skillsCovered.map((s: unknown) => String(s).trim()).filter(Boolean)
        : String(body.skillsCovered)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    const updated = await db
      .update(certifications)
      .set(updateData)
      .where(eq(certifications.id, Number(id)))
      .returning();

    if (!updated[0]) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await logAdminActivity({
      session,
      action: "UPDATED",
      entityType: "Certification",
      entityTitle: updated[0].title,
    });

    return NextResponse.json({ certification: updated[0] });
  } catch (err) {
    console.error("PATCH /api/certifications/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update certification." },
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
    .delete(certifications)
    .where(eq(certifications.id, Number(id)))
    .returning();

  if (deleted[0]) {
    await logAdminActivity({
      session,
      action: "DELETED",
      entityType: "Certification",
      entityTitle: deleted[0].title,
    });
  }

  return NextResponse.json({ ok: true });
}
