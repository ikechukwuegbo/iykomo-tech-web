import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSeeded();
  const list = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));
  return NextResponse.json({ messages: list });
}
