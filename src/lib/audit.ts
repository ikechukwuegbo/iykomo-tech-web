import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import type { AdminSessionPayload } from "./auth";

export async function logAdminActivity(params: {
  session: AdminSessionPayload;
  action: string;
  entityType: string;
  entityTitle: string;
  details?: string;
}) {
  try {
    await db.insert(activityLogs).values({
      actorName: params.session.fullName,
      actorEmail: params.session.email,
      action: params.action,
      entityType: params.entityType,
      entityTitle: params.entityTitle,
      details: params.details || null,
    });
  } catch (err) {
    console.error("Failed to record admin activity log:", err);
  }
}
