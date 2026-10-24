import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { logAdminActivity } from "@/lib/audit";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.status !== undefined) updateData.status = String(body.status);
  if (body.adminNotes !== undefined)
    updateData.adminNotes = String(body.adminNotes);

  const updated = await db
    .update(contactMessages)
    .set(updateData)
    .where(eq(contactMessages.id, Number(id)))
    .returning();

  if (!updated[0]) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  await logAdminActivity({
    session,
    action: "UPDATED",
    entityType: "Enquiry",
    entityTitle: updated[0].subject,
    details: `Marked enquiry from ${updated[0].name} as ${updated[0].status}`,
  });

  revalidatePath("/admin", "layout");
  return NextResponse.json({ messageRecord: updated[0] });
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
    .delete(contactMessages)
    .where(eq(contactMessages.id, Number(id)))
    .returning();

  if (!deleted[0]) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  await logAdminActivity({
    session,
    action: "DELETED",
    entityType: "Enquiry",
    entityTitle: deleted[0].subject,
  });

  revalidatePath("/admin", "layout");
  return NextResponse.json({ ok: true });
}
