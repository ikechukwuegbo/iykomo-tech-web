import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages, mediaAssets, activityLogs } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";
import {
  getAllProjects,
  getAllServices,
  getAllPosts,
  getAllSkills,
  getAllCertifications,
  getAllAdminProfiles,
  getSiteSettings,
} from "@/lib/data";
import { AdminConsoleWorkspace } from "@/components/AdminConsoleWorkspace";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [
    projectsList,
    servicesList,
    postsList,
    skillsList,
    certsList,
    usersList,
    settings,
    messagesList,
    mediaList,
    logsList,
  ] = await Promise.all([
    getAllProjects(),
    getAllServices(),
    getAllPosts(),
    getAllSkills(),
    getAllCertifications(),
    getAllAdminProfiles(),
    getSiteSettings(),
    db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)),
    db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)),
    db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(40),
  ]);

  return (
    <AdminConsoleWorkspace
      session={session}
      initialProjects={projectsList}
      initialServices={servicesList}
      initialPosts={postsList}
      initialSkills={skillsList}
      initialCerts={certsList}
      initialMessages={messagesList}
      initialMedia={mediaList}
      initialUsers={usersList}
      initialLogs={logsList}
      initialSettings={settings}
    />
  );
}
