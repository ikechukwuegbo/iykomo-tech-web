import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { logAdminActivity } from "@/lib/audit";

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
    .delete(mediaAssets)
    .where(eq(mediaAssets.id, Number(id)))
    .returning();

  if (deleted[0]) {
    await logAdminActivity({
      session,
      action: "DELETED",
      entityType: "MediaAsset",
      entityTitle: deleted[0].fileName,
    });
  }

  return NextResponse.json({ ok: true });
}
