import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export interface ProjectMetrics {
  architecture?: string;
  deployment?: string;
  highlight?: string;
}

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("super_admin"), // super_admin | admin | editor
  title: text("title").default("Founder & Lead Engineer"),
  avatarUrl: text("avatar_url"),
  active: boolean("active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull().default("project"), // project | post
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("Software Product"), // Software Product | IT Infrastructure | DevOps & Cloud
  technologies: jsonb("technologies").$type<string[]>().notNull().default([]),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  coverImage: text("cover_image").notNull(),
  status: text("status").notNull().default("published"), // published | draft
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  metrics: jsonb("metrics").$type<ProjectMetrics>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectImages = pgTable("project_images", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  images: many(projectImages),
}));

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, {
    fields: [projectImages.projectId],
    references: [projects.id],
  }),
}));

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // Full-Stack Engineering | IT Infrastructure & Support | Cloud, DevOps & Security | Networking & Hardware
  proficiency: integer("proficiency").notNull().default(90),
  iconName: text("icon_name").default("Code2"),
  featured: boolean("featured").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: text("issue_date").notNull(),
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  certificateImage: text("certificate_image"),
  certificateFile: text("certificate_file"),
  skillsCovered: jsonb("skills_covered").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull().default("Server"),
  coverImage: text("cover_image"),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  pricingNote: text("pricing_note").default("Custom Quote / Retainer"),
  featured: boolean("featured").notNull().default(true),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("Engineering & Architecture"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  coverImage: text("cover_image"),
  readingTime: text("reading_time").notNull().default("6 min read"),
  status: text("status").notNull().default("published"), // published | draft
  authorName: text("author_name").notNull().default("Ikechukwu Egbo"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  serviceInterest: text("service_interest").default("General Enquiry"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"), // unread | read | replied | archived
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull().default(0),
  category: text("category").notNull().default("project"), // project | certificate | blog | general
  altText: text("alt_text"),
  uploadedBy: text("uploaded_by").default("Ikechukwu Egbo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  actorName: text("actor_name").notNull(),
  actorEmail: text("actor_email").notNull(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityTitle: text("entity_title").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});