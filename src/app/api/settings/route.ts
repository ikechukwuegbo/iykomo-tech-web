import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { getSiteSettings } from "@/lib/data";
import { getAdminSession } from "@/lib/auth";
import { logAdminActivity } from "@/lib/audit";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const current = await getSiteSettings();
    const merged = { ...current, ...body };

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
      await db.insert(siteSettings).values({
        key: "general",
        value: merged,
      });
    }

    await logAdminActivity({
      session,
      action: "UPDATED",
      entityType: "SiteSettings",
      entityTitle: merged.brandName || "Global Website Configuration",
      details: "Updated public branding, content & SEO settings",
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ settings: merged });
  } catch (err) {
    console.error("PATCH /api/settings error:", err);
    return NextResponse.json(
      { error: "Failed to save site settings." },
      { status: 500 }
    );
  }
}
