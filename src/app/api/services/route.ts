import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { getAdminSession } from "@/lib/auth";
import { logAdminActivity } from "@/lib/audit";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  if (searchParams.get("all") === "true") {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const all = await db
      .select()
      .from(services)
      .orderBy(asc(services.sortOrder), desc(services.createdAt));
    return NextResponse.json({ services: all });
  }

  const published = await db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.sortOrder), desc(services.createdAt));
  return NextResponse.json({ services: published });
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const title = String(body.title || "").trim();
    const summary = String(body.summary || "").trim();
    const description = String(body.description || summary).trim();

    if (!title || !summary) {
      return NextResponse.json(
        { error: "Service title and summary are required." },
        { status: 400 }
      );
    }

    const features: string[] = Array.isArray(body.features)
      ? body.features.map((f: unknown) => String(f).trim()).filter(Boolean)
      : String(body.features || "")
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean);

    const slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;

    const inserted = await db
      .insert(services)
      .values({
        title,
        slug,
        summary,
        description,
        iconName: String(body.iconName || "Server"),
        coverImage: String(
          body.coverImage || "/images/service-infrastructure.jpg"
        ),
        features,
        pricingNote: String(body.pricingNote || "Custom Quote / Retainer"),
        featured: Boolean(body.featured ?? true),
        published: Boolean(body.published ?? true),
        sortOrder: Number(body.sortOrder || 10),
      })
      .returning();

    await logAdminActivity({
      session,
      action: "CREATED",
      entityType: "Service",
      entityTitle: title,
      details: "Added IT/Software service offering",
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ service: inserted[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/services error:", err);
    return NextResponse.json(
      { error: "Failed to create service." },
      { status: 500 }
    );
  }
}
