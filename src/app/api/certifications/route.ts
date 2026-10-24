import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { certifications } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { getAdminSession } from "@/lib/auth";
import { logAdminActivity } from "@/lib/audit";

export async function GET() {
  await ensureSeeded();
  const list = await db
    .select()
    .from(certifications)
    .orderBy(asc(certifications.sortOrder), desc(certifications.createdAt));
  return NextResponse.json({ certifications: list });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const title = String(body.title || "").trim();
  const issuer = String(body.issuer || "").trim();
  if (!title || !issuer) {
    return NextResponse.json(
      { error: "Title and issuing organization are required." },
      { status: 400 }
    );
  }

  const skillsCovered = Array.isArray(body.skillsCovered)
    ? body.skillsCovered.map((s: unknown) => String(s).trim()).filter(Boolean)
    : String(body.skillsCovered || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const inserted = await db
    .insert(certifications)
    .values({
      title,
      issuer,
      issueDate: String(body.issueDate || "2025"),
      credentialId: body.credentialId ? String(body.credentialId).trim() : null,
      credentialUrl: body.credentialUrl
        ? String(body.credentialUrl).trim()
        : null,
      certificateFile: body.certificateFile
        ? String(body.certificateFile).trim()
        : null,
      skillsCovered,
      sortOrder: Number(body.sortOrder || 10),
    })
    .returning();

  await logAdminActivity({
    session,
    action: "CREATED",
    entityType: "Certification",
    entityTitle: title,
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ certification: inserted[0] }, { status: 201 });
}
