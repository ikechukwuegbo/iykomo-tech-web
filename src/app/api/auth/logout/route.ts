import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSession } from "@/lib/auth";
import { logAdminActivity } from "@/lib/audit";

export async function POST() {
  const session = await getAdminSession();
  if (session) {
    await logAdminActivity({
      session,
      action: "LOGOUT",
      entityType: "Security",
      entityTitle: session.email,
      details: "Administrator signed out",
    });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
