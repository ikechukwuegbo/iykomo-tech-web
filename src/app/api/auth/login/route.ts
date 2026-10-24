import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { ADMIN_COOKIE_NAME, signAdminToken } from "@/lib/auth";
import { logAdminActivity } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const found = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, email));
    const user = found[0];

    if (!user || !user.active) {
      return NextResponse.json(
        { error: "Invalid administrator credentials." },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid administrator credentials." },
        { status: 401 }
      );
    }

    await db
      .update(profiles)
      .set({ lastLoginAt: new Date() })
      .where(eq(profiles.id, user.id));

    const sessionPayload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    const token = await signAdminToken(sessionPayload);

    await logAdminActivity({
      session: sessionPayload,
      action: "LOGIN",
      entityType: "Security",
      entityTitle: user.email,
      details: `Administrator signed in (${user.role})`,
    });

    const response = NextResponse.json({
      ok: true,
      user: sessionPayload,
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Authentication service error." },
      { status: 500 }
    );
  }
}
