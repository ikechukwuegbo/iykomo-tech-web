import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Run a lightweight raw query using sql template tag
    await db.run(sql`SELECT 1`);

    return NextResponse.json({ ok: true, status: "healthy" });
  } catch {
    // Fallback if db.run is not supported by driver
    try {
      await db.select().from(sql`(SELECT 1)`);
      return NextResponse.json({ ok: true, status: "healthy" });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Database healthcheck failed";
      return NextResponse.json(
        { ok: false, status: "error", error: errorMsg },
        { status: 500 }
      );
    }
  }
}