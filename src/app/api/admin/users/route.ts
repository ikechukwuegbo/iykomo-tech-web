import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import { getAllAdminProfiles } from "@/lib/data";
import { logAdminActivity } from "@/lib/audit";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = await getAllAdminProfiles();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "super_admin" && session.role !== "admin") {
      return NextResponse.json(
        { error: "Insufficient role permissions." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const fullName = String(body.fullName || "").trim();
    const password = String(body.password || "").trim();
    const role = String(body.role || "editor");

    if (!email || !fullName || password.length < 6) {
      return NextResponse.json(
        {
          error:
            "Full name, valid email, and password (min 6 chars) are required.",
        },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, email));
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An administrator with this email already exists." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const inserted = await db
      .insert(profiles)
      .values({
        email,
        passwordHash,
        fullName,
        role,
        title: String(body.title || "Content & Operations Administrator"),
        avatarUrl: "/images/logo-mark.svg",
        active: true,
      })
      .returning();

    await logAdminActivity({
      session,
      action: "CREATED",
      entityType: "AdminUser",
      entityTitle: email,
      details: `Provisioned administrator with role: ${role}`,
    });

    return NextResponse.json(
      {
        user: {
          id: inserted[0].id,
          email: inserted[0].email,
          fullName: inserted[0].fullName,
          role: inserted[0].role,
          title: inserted[0].title,
          active: inserted[0].active,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/admin/users error:", err);
    return NextResponse.json(
      { error: "Failed to create administrator." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const userId = Number(body.id);
  if (!userId) {
    return NextResponse.json({ error: "User ID required." }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.role !== undefined) updateData.role = String(body.role);
  if (body.active !== undefined) updateData.active = Boolean(body.active);
  if (body.title !== undefined) updateData.title = String(body.title);

  const updated = await db
    .update(profiles)
    .set(updateData)
    .where(eq(profiles.id, userId))
    .returning();

  if (updated[0]) {
    await logAdminActivity({
      session,
      action: "UPDATED",
      entityType: "AdminUser",
      entityTitle: updated[0].email,
      details: `Updated role=${updated[0].role}, active=${updated[0].active}`,
    });
  }

  return NextResponse.json({ ok: true });
}
