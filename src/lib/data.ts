import { promises as fs } from "fs";
import path from "path";
import { db } from "@/db";
import {
  projects,
  projectImages,
  services,
  skills,
  certifications,
  posts,
  contactMessages,
  mediaAssets,
  siteSettings,
  activityLogs,
  profiles,
} from "@/db/schema";
import { ensureSeeded } from "./seed";
import { asc, desc, eq, count } from "drizzle-orm";

export interface GeneralSiteSettings {
  brandName: string;
  shortBrand: string;
  founderName: string;
  headline: string;
  subheadline: string;
  heroBadge: string;
  aboutSummary: string;
  mission: string;
  email: string;
  supportEmail: string;
  salesEmail: string;
  phone: string;
  location: string;
  logoUrl: string;
  logoMarkUrl: string;
  portraitUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  iykbookUrl: string;
  iykschoolUrl: string;
  seoTitle: string;
  seoDescription: string;
}

const DEFAULT_SETTINGS: GeneralSiteSettings = {
  brandName: "Ikechukwu Egbo | IYKOMO-TECH COMMUNICATION",
  shortBrand: "IYKOMO-TECH COMMUNICATION",
  founderName: "Ikechukwu Egbo (Iyke)",
  headline:
    "Building Resilient Software Products & Enterprise IT Infrastructure.",
  subheadline:
    "Personal portfolio of Ikechukwu Egbo & official technology hub of IYKOMO-TECH COMMUNICATION — delivering full-stack Next.js/PostgreSQL platforms (iykbook, iykschool), IT support, networking, cybersecurity, and turnkey systems administration.",
  heroBadge: "Available for Software Engineering Roles, Contracts & IT Projects",
  aboutSummary:
    "I am Ikechukwu Egbo (Iyke), a Full-Stack Software Developer and Enterprise IT Infrastructure Specialist leading IYKOMO-TECH COMMUNICATION.",
  mission:
    "Empowering businesses, schools, and teams with dependable software tools and zero-headache technology infrastructure.",
  email: "support@iykomotech.com",
  supportEmail: "support@iykomotech.com",
  salesEmail: "sales@iykomotech.com",
  phone: "+2348168146210",
  location: "Global Remote & On-Site IT Operations",
  logoUrl: "/images/logo-iykomo-tech.svg",
  logoMarkUrl: "/images/logo-mark.svg",
  portraitUrl: "",
  githubUrl: "https://github.com/ikechukwuegbo/ikechukwuegbo.github.io",
  linkedinUrl: "https://www.linkedin.com/in/ikechukwu-egbo",
  iykbookUrl: "https://iykbook.iykomotech.com",
  iykschoolUrl: "https://iykschool.iykomotech.com",
  seoTitle:
    "Ikechukwu Egbo | IYKOMO-TECH COMMUNICATION — Full-Stack Developer & IT Infrastructure Specialist",
  seoDescription:
    "Official portfolio and technology platform of Ikechukwu Egbo (IYKOMO-TECH COMMUNICATION) — creators of iykbook and iykschool, delivering enterprise IT support, networking, CCTV, and cloud software.",
};

/**
 * Conventional portrait lookup.
 *
 * If no photo has been uploaded through the Admin Console, the site will
 * automatically use `public/images/founder.jpg` (or .png/.webp/.jpeg) when
 * that file exists. This means you can simply commit your real photo to the
 * repository and it appears on the website with no configuration at all.
 */
export const FOUNDER_PORTRAIT_CANDIDATES = [
  "/images/founder.jpg",
  "/images/founder.jpeg",
  "/images/founder.png",
  "/images/founder.webp",
];

export async function resolveFounderPortrait(): Promise<string> {
  for (const candidate of FOUNDER_PORTRAIT_CANDIDATES) {
    try {
      const filePath = path.join(process.cwd(), "public", candidate);
      await fs.access(filePath);
      return candidate;
    } catch {
      // Candidate not present — try the next one.
    }
  }
  return "";
}

export async function getSiteSettings(): Promise<GeneralSiteSettings> {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "general"));
  const merged: GeneralSiteSettings = rows[0]
    ? { ...DEFAULT_SETTINGS, ...(rows[0].value as Partial<GeneralSiteSettings>) }
    : DEFAULT_SETTINGS;

  // Admin upload always wins; otherwise fall back to a committed founder.* file.
  if (!merged.portraitUrl || !merged.portraitUrl.trim()) {
    const conventional = await resolveFounderPortrait();
    if (conventional) {
      merged.portraitUrl = conventional;
    }
  }

  return merged;
}

export async function getPublishedProjects() {
  await ensureSeeded();
  return await db
    .select()
    .from(projects)
    .where(eq(projects.status, "published"))
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
}

export async function getAllProjects() {
  await ensureSeeded();
  return await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
}

export async function getProjectBySlug(slug: string) {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug));
  const project = rows[0];
  if (!project) return null;
  const images = await db
    .select()
    .from(projectImages)
    .where(eq(projectImages.projectId, project.id))
    .orderBy(asc(projectImages.sortOrder));
  return { ...project, images };
}

export async function getPublishedServices() {
  await ensureSeeded();
  return await db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.sortOrder), desc(services.createdAt));
}

export async function getAllServices() {
  await ensureSeeded();
  return await db
    .select()
    .from(services)
    .orderBy(asc(services.sortOrder), desc(services.createdAt));
}

export async function getAllSkills() {
  await ensureSeeded();
  return await db
    .select()
    .from(skills)
    .orderBy(asc(skills.sortOrder), desc(skills.proficiency));
}

export async function getAllCertifications() {
  await ensureSeeded();
  return await db
    .select()
    .from(certifications)
    .orderBy(asc(certifications.sortOrder), desc(certifications.createdAt));
}

export async function getPublishedPosts() {
  await ensureSeeded();
  return await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.createdAt));
}

export async function getAllPosts() {
  await ensureSeeded();
  return await db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPostBySlug(slug: string) {
  await ensureSeeded();
  const rows = await db.select().from(posts).where(eq(posts.slug, slug));
  return rows[0] || null;
}

export async function getDashboardOverviewData() {
  await ensureSeeded();
  const [
    totalProjectsRow,
    publishedPostsRow,
    unreadMessagesRow,
    totalServicesRow,
    totalMediaRow,
    recentLogs,
    recentMessages,
  ] = await Promise.all([
    db.select({ value: count() }).from(projects),
    db
      .select({ value: count() })
      .from(posts)
      .where(eq(posts.status, "published")),
    db
      .select({ value: count() })
      .from(contactMessages)
      .where(eq(contactMessages.status, "unread")),
    db.select({ value: count() }).from(services),
    db.select({ value: count() }).from(mediaAssets),
    db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(8),
    db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(5),
  ]);

  return {
    stats: {
      totalProjects: totalProjectsRow[0]?.value ?? 0,
      publishedPosts: publishedPostsRow[0]?.value ?? 0,
      unreadMessages: unreadMessagesRow[0]?.value ?? 0,
      totalServices: totalServicesRow[0]?.value ?? 0,
      totalMedia: totalMediaRow[0]?.value ?? 0,
    },
    recentLogs,
    recentMessages,
  };
}

export async function getAllAdminProfiles() {
  await ensureSeeded();
  return await db
    .select({
      id: profiles.id,
      email: profiles.email,
      fullName: profiles.fullName,
      role: profiles.role,
      title: profiles.title,
      avatarUrl: profiles.avatarUrl,
      active: profiles.active,
      lastLoginAt: profiles.lastLoginAt,
      createdAt: profiles.createdAt,
    })
    .from(profiles)
    .orderBy(asc(profiles.id));
}
