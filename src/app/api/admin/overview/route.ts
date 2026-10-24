import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDashboardOverviewData } from "@/lib/data";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const overview = await getDashboardOverviewData();
  return NextResponse.json(overview);
}
