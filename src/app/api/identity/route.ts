import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings, mediaAssets } from "@/db/schema";
import { getSiteSettings } from "@/lib/data";
import { getAdminSession } from "@/lib/auth";
import { logAdminActivity } from "@/lib/audit";

const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

const KIND_KEY: Record<string, string> = {
  portrait: "portraitUrl",
  logo: "logoUrl",
  logoMark: "logoMarkUrl",
};

const LABEL: Record<string, string> = {
  portrait: "Founder Portrait",
  logo: "Company Logo (Full Lockup)",
  logoMark: "Company Logo Mark",
};

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const kindRaw = String(formData.get("kind") || "portrait");
    const kind = KIND_KEY[kindRaw] ? kindRaw : "portrait";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file attached." }, { status: 400 });
    }

    const mimeType = file.type || "image/png";
    if (!ALLOWED.has(mimeType)) {
      return NextResponse.json(
        { error: "Use a JPG, PNG, WEBP, or SVG image." },
        { status: 400 }
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 8MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storedName = `identity-${kind}-${Date.now()}-${safeName}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, storedName), buffer);

    const fileUrl = `/api/uploads/${storedName}`;
    const settingsKey = KIND_KEY[kind];

    // Persist into site_settings.general
    const current = await getSiteSettings();
    const merged = { ...current, [settingsKey]: fileUrl };

    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "general"));

    if (existing[0]) {
      await db
        .update(siteSettings)
        .set({ value: merged, updatedAt: new Date() })
        .where(eq(siteSettings.key, "general"));
    } else {
      await db
        .insert(siteSettings)
        .values({ key: "general", value: merged });
    }

    // Track in the media library
    await db.insert(mediaAssets).values({
      fileName: file.name,
      fileUrl,
      mimeType,
      fileSize: file.size,
      category: "general",
      altText: `${LABEL[kind]} — IYKOMO-TECH COMMUNICATION`,
      uploadedBy: session.fullName,
    });

    await logAdminActivity({
      session,
      action: "UPLOADED",
      entityType: "IdentityAsset",
      entityTitle: LABEL[kind],
      details: `Replaced ${LABEL[kind]} used across the website`,
    });

    return NextResponse.json({ ok: true, url: fileUrl, kind: settingsKey });
  } catch (err) {
    console.error("POST /api/identity error:", err);
    return NextResponse.json(
      { error: "Identity upload failed." },
      { status: 500 }
    );
  }
}
