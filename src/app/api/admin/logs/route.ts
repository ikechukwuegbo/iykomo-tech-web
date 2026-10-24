import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSeeded();
  const logs = await db
    .select()
    .from(activityLogs)
    .orderBy(desc(activityLogs.createdAt))
    .limit(50);
  return NextResponse.json({ logs });
}
