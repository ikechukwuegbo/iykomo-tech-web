import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { getAdminSession } from "@/lib/auth";
import { logAdminActivity } from "@/lib/audit";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSeeded();
  const assets = await db
    .select()
    .from(mediaAssets)
    .orderBy(desc(mediaAssets.createdAt));
  return NextResponse.json({ assets });
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const category = String(formData.get("category") || "project");
    const altText = String(formData.get("altText") || "");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Please attach a valid file." },
        { status: 400 }
      );
    }

    const mimeType = file.type || "image/png";
    if (!ALLOWED_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: "Unsupported file format. Upload JPG, PNG, WEBP, SVG, or PDF." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File exceeds maximum 10MB upload size." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeOriginal = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storedName = `${Date.now()}-${safeOriginal}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, storedName), buffer);

    const fileUrl = `/api/uploads/${storedName}`;

    const inserted = await db
      .insert(mediaAssets)
      .values({
        fileName: file.name,
        fileUrl,
        mimeType,
        fileSize: file.size,
        category,
        altText: altText || file.name,
        uploadedBy: session.fullName,
      })
      .returning();

    await logAdminActivity({
      session,
      action: "UPLOADED",
      entityType: "MediaAsset",
      entityTitle: file.name,
      details: `Saved to media library (${Math.round(file.size / 1024)} KB)`,
    });

    return NextResponse.json(
      { asset: inserted[0], url: fileUrl },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/upload error:", err);
    return NextResponse.json(
      { error: "File upload failed." },
      { status: 500 }
    );
  }
}
