"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Server,
  FileText,
  Award,
  Image as ImageIcon,
  Inbox,
  Shield,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Upload,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Copy,
  Loader2,
  Eye,
} from "lucide-react";
import type { GeneralSiteSettings } from "@/lib/data";
import type { AdminSessionPayload } from "@/lib/auth";
import {
  IdentityUploader,
  PhotoSetupCard,
} from "@/components/PortraitFrame";

export interface AdminProject {
  id: number;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  technologies: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  coverImage: string;
  status: string;
  featured: boolean;
  sortOrder: number;
}

export interface AdminService {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  iconName: string;
  features: string[];
  pricingNote: string | null;
  published: boolean;
  sortOrder: number;
}

export interface AdminPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string | null;
  readingTime: string;
  status: string;
  createdAt: string | Date;
}

export interface AdminSkill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
}

export interface AdminCert {
  id: number;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string | null;
  credentialUrl: string | null;
  certificateImage: string | null;
  certificateFile: string | null;
  skillsCovered: string[];
}

export interface AdminMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  serviceInterest: string | null;
  subject: string;
  message: string;
  status: string;
  adminNotes: string | null;
  createdAt: string | Date;
}

export interface AdminMedia {
  id: number;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  category: string;
  altText: string | null;
  createdAt: string | Date;
}

export interface AdminUserProfile {
  id: number;
  email: string;
  fullName: string;
  role: string;
  title: string | null;
  active: boolean;
}

export interface AdminAuditLog {
  id: number;
  actorName: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityTitle: string;
  details: string | null;
  createdAt: string | Date;
}

interface Props {
  session: AdminSessionPayload;
  initialProjects: AdminProject[];
  initialServices: AdminService[];
  initialPosts: AdminPost[];
  initialSkills: AdminSkill[];
  initialCerts: AdminCert[];
  initialMessages: AdminMessage[];
  initialMedia: AdminMedia[];
  initialUsers: AdminUserProfile[];
  initialLogs: AdminAuditLog[];
  initialSettings: GeneralSiteSettings;
}

type TabKey =
  | "overview"
  | "projects"
  | "services"
  | "blog"
  | "skills"
  | "media"
  | "messages"
  | "users"
  | "settings";

export function AdminConsoleWorkspace({
  session,
  initialProjects,
  initialServices,
  initialPosts,
  initialSkills,
  initialCerts,
  initialMessages,
  initialMedia,
  initialUsers,
  initialLogs,
  initialSettings,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [projectsList, setProjectsList] =
    useState<AdminProject[]>(initialProjects);
  const [servicesList, setServicesList] =
    useState<AdminService[]>(initialServices);
  const [postsList, setPostsList] = useState<AdminPost[]>(initialPosts);
  const [skillsList, setSkillsList] = useState<AdminSkill[]>(initialSkills);
  const [certsList, setCertsList] = useState<AdminCert[]>(initialCerts);
  const [messagesList, setMessagesList] =
    useState<AdminMessage[]>(initialMessages);
  const [mediaList, setMediaList] = useState<AdminMedia[]>(initialMedia);
  const [usersList, setUsersList] = useState<AdminUserProfile[]>(initialUsers);
  const [logsList, setLogsList] = useState<AdminAuditLog[]>(initialLogs);
  const [settingsForm, setSettingsForm] =
    useState<GeneralSiteSettings>(initialSettings);

  // Project Editor State
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [projTitle, setProjTitle] = useState("");
  const [projTagline, setProjTagline] = useState("");
  const [projCategory, setProjCategory] = useState("Software Project");
  const [projDesc, setProjDesc] = useState("");
  const [projTech, setProjTech] = useState("Next.js, TypeScript, PostgreSQL");
  const [projLiveUrl, setProjLiveUrl] = useState("");
  const [projGithubUrl, setProjGithubUrl] = useState("");
  const [projCover, setProjCover] = useState("/images/project-iykbook.jpg");
  const [projStatus, setProjStatus] = useState("published");
  const [projFeatured, setProjFeatured] = useState(true);
  const [projSaving, setProjSaving] = useState(false);

  // Service Editor State
  const [srvTitle, setSrvTitle] = useState("");
  const [srvSummary, setSrvSummary] = useState("");
  const [srvDesc, setSrvDesc] = useState("");
  const [srvFeatures, setSrvFeatures] = useState("");
  const [srvPricing, setSrvPricing] = useState("Custom Quote / Retainer");
  const [srvIcon, setSrvIcon] = useState("Server");

  // Blog Post Editor State
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState(
    "Engineering & Architecture"
  );
  const [postTags, setPostTags] = useState("Next.js, PostgreSQL, IT Support");
  const [postCover, setPostCover] = useState(
    "/images/project-portfolio-infra.jpg"
  );
  const [postStatus, setPostStatus] = useState("published");

  // Skill & Certification State
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("Full-Stack Engineering");
  const [skillProficiency, setSkillProficiency] = useState(92);

  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("2026");
  const [certCredId, setCertCredId] = useState("");
  const [certSkills, setCertSkills] = useState("Networking, Cloud Security");
  const [certFile, setCertFile] = useState("");
  const [certUploading, setCertUploading] = useState(false);

  // Media Upload State
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaCategory, setMediaCategory] = useState("project");
  const [mediaAlt, setMediaAlt] = useState("");

  // New Admin User State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("editor");

  // Settings Save State
  const [savingSettings, setSavingSettings] = useState(false);

  function showToast(type: "success" | "error", text: string) {
    setNotice({ type, text });
    setTimeout(() => {
      setNotice((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  }

  async function refreshLogs() {
    try {
      const res = await fetch("/api/admin/logs");
      if (res.ok) {
        const data = await res.json();
        setLogsList(data.logs || []);
      }
    } catch {
      // ignore
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  // Upload File Helper
  async function uploadFileHelper(
    file: File,
    category: string,
    alt = ""
  ): Promise<string | null> {
    setUploadingMedia(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", category);
      fd.append("altText", alt || file.name);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Upload failed.");
        return null;
      }
      setMediaList((prev) => [data.asset, ...prev]);
      await refreshLogs();
      showToast("success", `Uploaded ${file.name} to Media Library.`);
      return data.url as string;
    } catch {
      showToast("error", "Error uploading file.");
      return null;
    } finally {
      setUploadingMedia(false);
    }
  }

  // Save Project
  async function handleSaveProject(e: FormEvent) {
    e.preventDefault();
    setProjSaving(true);
    try {
      const payload = {
        title: projTitle,
        tagline: projTagline,
        category: projCategory,
        description: projDesc,
        technologies: projTech,
        liveUrl: projLiveUrl,
        githubUrl: projGithubUrl,
        coverImage: projCover,
        status: projStatus,
        featured: projFeatured,
      };

      if (editingProjectId) {
        const res = await fetch(`/api/projects/${editingProjectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          showToast("error", data.error || "Failed to update project.");
          return;
        }
        setProjectsList((prev) =>
          prev.map((p) => (p.id === editingProjectId ? data.project : p))
        );
        showToast("success", `Updated project "${data.project.title}".`);
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          showToast("error", data.error || "Failed to create project.");
          return;
        }
        setProjectsList((prev) => [data.project, ...prev]);
        showToast(
          "success",
          `Published "${data.project.title}" — live on public Projects page!`
        );
      }

      setEditingProjectId(null);
      setProjTitle("");
      setProjTagline("");
      setProjDesc("");
      setProjLiveUrl("");
      setProjGithubUrl("");
      await refreshLogs();
      router.refresh();
    } finally {
      setProjSaving(false);
    }
  }

  function startEditProject(p: AdminProject) {
    setEditingProjectId(p.id);
    setProjTitle(p.title);
    setProjTagline(p.tagline);
    setProjCategory(p.category);
    setProjDesc(p.description);
    setProjTech((p.technologies || []).join(", "));
    setProjLiveUrl(p.liveUrl || "");
    setProjGithubUrl(p.githubUrl || "");
    setProjCover(p.coverImage);
    setProjStatus(p.status);
    setProjFeatured(p.featured);
  }

  async function toggleProjectStatus(p: AdminProject) {
    const nextStatus = p.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/projects/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      const data = await res.json();
      setProjectsList((prev) =>
        prev.map((item) => (item.id === p.id ? data.project : item))
      );
      await refreshLogs();
      router.refresh();
      showToast("success", `Project set to ${nextStatus}.`);
    }
  }

  async function reorderProject(index: number, direction: -1 | 1) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= projectsList.length) return;
    const copy = [...projectsList];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    const reindexed = copy.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    setProjectsList(reindexed);

    await Promise.all([
      fetch(`/api/projects/${reindexed[index].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: reindexed[index].sortOrder }),
      }),
      fetch(`/api/projects/${reindexed[targetIdx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: reindexed[targetIdx].sortOrder }),
      }),
    ]);
    router.refresh();
  }

  async function handleDeleteProject(id: number, title: string) {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjectsList((prev) => prev.filter((p) => p.id !== id));
      await refreshLogs();
      router.refresh();
      showToast("success", `Deleted "${title}".`);
    }
  }

  // Save Service
  async function handleCreateService(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: srvTitle,
        summary: srvSummary,
        description: srvDesc || srvSummary,
        features: srvFeatures,
        pricingNote: srvPricing,
        iconName: srvIcon,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast("error", data.error || "Failed to add service.");
      return;
    }
    setServicesList((prev) => [...prev, data.service]);
    setSrvTitle("");
    setSrvSummary("");
    setSrvDesc("");
    setSrvFeatures("");
    await refreshLogs();
    router.refresh();
    showToast("success", `Added service "${data.service.title}".`);
  }

  async function handleDeleteService(id: number) {
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      setServicesList((prev) => prev.filter((s) => s.id !== id));
      await refreshLogs();
      router.refresh();
      showToast("success", "Removed service.");
    }
  }

  // Save Blog Post
  async function handleSavePost(e: FormEvent) {
    e.preventDefault();
    const payload = {
      title: postTitle,
      excerpt: postExcerpt,
      content: postContent,
      category: postCategory,
      tags: postTags,
      coverImage: postCover,
      status: postStatus,
    };

    if (editingPostId) {
      const res = await fetch(`/api/posts/${editingPostId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Failed to update article.");
        return;
      }
      setPostsList((prev) =>
        prev.map((item) => (item.id === editingPostId ? data.post : item))
      );
      showToast("success", `Updated article "${data.post.title}".`);
    } else {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Failed to publish article.");
        return;
      }
      setPostsList((prev) => [data.post, ...prev]);
      showToast("success", `Saved "${data.post.title}" to Knowledge Hub.`);
    }

    setEditingPostId(null);
    setPostTitle("");
    setPostExcerpt("");
    setPostContent("");
    await refreshLogs();
    router.refresh();
  }

  async function handleDeletePost(id: number) {
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPostsList((prev) => prev.filter((p) => p.id !== id));
      await refreshLogs();
      router.refresh();
      showToast("success", "Deleted article.");
    }
  }

  // Add Skill & Cert
  async function handleAddSkill(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: skillName,
        category: skillCategory,
        proficiency: skillProficiency,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setSkillsList((prev) => [...prev, data.skill]);
      setSkillName("");
      await refreshLogs();
      router.refresh();
      showToast("success", `Added skill "${data.skill.name}".`);
    }
  }

  async function handleDeleteSkill(id: number) {
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSkillsList((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    }
  }

  async function handleAddCert(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: certTitle,
        issuer: certIssuer,
        issueDate: certDate,
        credentialId: certCredId,
        skillsCovered: certSkills,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setCertsList((prev) => [data.certification, ...prev]);
      setCertTitle("");
      setCertIssuer("");
      setCertCredId("");
      setCertFile("");
      await refreshLogs();
      router.refresh();
      showToast("success", `Added certificate "${data.certification.title}".`);
    }
  }

  async function handleDeleteCert(id: number) {
    const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCertsList((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    }
  }

  // Media Library Input Handler
  async function handleMediaInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFileHelper(file, mediaCategory, mediaAlt);
    setMediaAlt("");
    e.target.value = "";
  }

  async function handleDeleteMedia(id: number) {
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      showToast("success", "Removed asset from Media Library.");
    }
  }

  // Update Message Status
  async function handleMessageStatus(id: number, status: string) {
    const res = await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setMessagesList((prev) =>
        prev.map((m) => (m.id === id ? data.messageRecord : m))
      );
      await refreshLogs();
      showToast("success", `Marked enquiry as ${status}.`);
    }
  }

  async function handleDeleteMessage(id: number) {
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessagesList((prev) => prev.filter((m) => m.id !== id));
      showToast("success", "Deleted enquiry.");
    }
  }

  // Create Admin User
  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast("error", data.error || "Could not create user.");
      return;
    }
    setUsersList((prev) => [...prev, data.user]);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    await refreshLogs();
    showToast("success", `Created administrator ${data.user.email}.`);
  }

  // Save Site Settings
  async function handleSaveSettings(e: FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        await refreshLogs();
        router.refresh();
        showToast(
          "success",
          "Saved global branding, content & SEO settings to PostgreSQL!"
        );
      } else {
        showToast("error", "Failed to save site settings.");
      }
    } finally {
      setSavingSettings(false);
    }
  }

  const unreadCount = messagesList.filter((m) => m.status === "unread").length;

  const navItems: {
    key: TabKey;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: number;
  }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    {
      key: "projects",
      label: "Projects & Portfolio",
      icon: FolderKanban,
      badge: projectsList.length,
    },
    { key: "services", label: "Services", icon: Server },
    { key: "blog", label: "Blog / Knowledge Hub", icon: FileText },
    { key: "skills", label: "Certificates & Skills", icon: Award },
    { key: "media", label: "Media Library", icon: ImageIcon },
    {
      key: "messages",
      label: "Enquiry Inbox",
      icon: Inbox,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { key: "users", label: "Users & Security", icon: Shield },
    { key: "settings", label: "Site Settings & CMS", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-68 shrink-0 flex-col justify-between bg-slate-900 text-slate-200 p-5">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 pt-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-slate-700">
              <img
                src="/images/logo-mark.svg"
                alt="IYKOMO-TECH COMMUNICATION logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold leading-tight text-white">
                IYKOMO-TECH
              </p>
              <p className="font-mono text-[11px] font-semibold leading-tight text-emerald-400">
                COMMUNICATION
              </p>
              <p className="mt-1 font-mono text-[10px] text-slate-400">
                Admin CMS Console
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                    active
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-800 text-emerald-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 border-t border-slate-800 pt-4">
          <div className="px-2">
            <p className="text-xs font-semibold text-white truncate">
              {session.fullName}
            </p>
            <p className="font-mono text-[11px] text-slate-400 truncate">
              {session.email}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-red-600 hover:border-red-600 hover:text-white transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 py-4 sm:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {navItems.find((i) => i.key === activeTab)?.label}
            </h1>
            <p className="text-xs text-slate-500">
              PostgreSQL Real-Time Content & Infrastructure Control Centre
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              <Eye className="h-3.5 w-3.5 text-blue-600" />
              Public Site
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>

          {/* Mobile Tab Selector */}
          <div className="w-full lg:hidden flex overflow-x-auto gap-1.5 pb-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  activeTab === item.key
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        {/* Feedback Toast */}
        {notice && (
          <div className="mx-4 mt-4 sm:mx-8">
            <div
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold ${
                notice.type === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {notice.text}
              </span>
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="underline ml-4"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8 space-y-8">
          {/* 1. OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <PhotoSetupCard
                portraitUrl={settingsForm.portraitUrl}
                onUploaded={(url) =>
                  setSettingsForm((prev) => ({ ...prev, portraitUrl: url }))
                }
              />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <p className="font-mono text-xs text-slate-500 uppercase">
                    Portfolio Projects
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {projectsList.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("projects")}
                    className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Manage Projects →
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <p className="font-mono text-xs text-slate-500 uppercase">
                    Knowledge Articles
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {postsList.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("blog")}
                    className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Write / Edit Posts →
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <p className="font-mono text-xs text-slate-500 uppercase">
                    Unread Enquiries
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-blue-600">
                    {unreadCount}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("messages")}
                    className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Open Inbox ({messagesList.length}) →
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <p className="font-mono text-xs text-slate-500 uppercase">
                    Active Services
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {servicesList.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("services")}
                    className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Edit Offerings →
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <p className="font-mono text-xs text-slate-500 uppercase">
                    Media Assets
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                    {mediaList.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("media")}
                    className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Upload Files →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Manage Portfolio Projects
                  </h2>
                  <p className="text-xs text-slate-500">
                    Create, publish, reorder, or edit case studies and product showcases.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {editingProjectId ? "Edit Project" : "Add New Project"}
                </h3>
                <form onSubmit={handleSaveProject} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Project Title
                      </label>
                      <input
                        type="text"
                        required
                        value={projTitle}
                        onChange={(e) => setProjTitle(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                        placeholder="e.g. iykbook Business Suite"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Tagline
                      </label>
                      <input
                        type="text"
                        required
                        value={projTagline}
                        onChange={(e) => setProjTagline(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                        placeholder="e.g. Accounting, Inventory & Management"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Category
                      </label>
                      <input
                        type="text"
                        value={projCategory}
                        onChange={(e) => setProjCategory(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Technologies (comma separated)
                      </label>
                      <input
                        type="text"
                        value={projTech}
                        onChange={(e) => setProjTech(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    {editingProjectId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProjectId(null);
                          setProjTitle("");
                          setProjTagline("");
                          setProjDesc("");
                        }}
                        className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-semibold text-slate-700"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={projSaving}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                    >
                      {projSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : editingProjectId ? (
                        "Update Project"
                      ) : (
                        "Publish Project"
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Existing Projects ({projectsList.length})
                  </h3>
                </div>
                <div className="divide-y divide-slate-200">
                  {projectsList.map((p, idx) => (
                    <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 p-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${p.status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{p.tagline}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => reorderProject(idx, -1)}
                          className="rounded-lg border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => reorderProject(idx, 1)}
                          className="rounded-lg border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditProject(p)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleProjectStatus(p)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Toggle Status
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(p.id, p.title)}
                          className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. SERVICES */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-5">
                <h2 className="text-lg font-bold text-slate-900">Manage IT & Software Services</h2>
                <p className="text-xs text-slate-500">Configure professional services and technical offerings.</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Add Service Offering</h3>
                <form onSubmit={handleCreateService} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Title</label>
                      <input
                        type="text"
                        required
                        value={srvTitle}
                        onChange={(e) => setSrvTitle(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Pricing Note</label>
                      <input
                        type="text"
                        value={srvPricing}
                        onChange={(e) => setSrvPricing(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Summary</label>
                    <input
                      type="text"
                      required
                      value={srvSummary}
                      onChange={(e) => setSrvSummary(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" /> Add Service
                  </button>
                </form>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Active Services ({servicesList.length})</h3>
                </div>
                <div className="divide-y divide-slate-200">
                  {servicesList.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-6">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{s.summary}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(s.id)}
                        className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. BLOG */}
          {activeTab === "blog" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-5">
                <h2 className="text-lg font-bold text-slate-900">Knowledge Hub & Articles</h2>
                <p className="text-xs text-slate-500">Publish architectural guides and technical insights.</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{editingPostId ? "Edit Article" : "New Article"}</h3>
                <form onSubmit={handleSavePost} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      required
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Excerpt</label>
                    <textarea
                      rows={2}
                      required
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Content</label>
                    <textarea
                      rows={4}
                      required
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    {editingPostId ? "Update Article" : "Publish Article"}
                  </button>
                </form>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Published Articles ({postsList.length})</h3>
                </div>
                <div className="divide-y divide-slate-200">
                  {postsList.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-6">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{post.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{post.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPostId(post.id);
                            setPostTitle(post.title);
                            setPostExcerpt(post.excerpt);
                            setPostContent(post.content);
                          }}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-5">
                <h2 className="text-lg font-bold text-slate-900">Certificates & Technical Skills</h2>
                <p className="text-xs text-slate-500">Manage professional stack and credentials.</p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Add Skill</h3>
                  <form onSubmit={handleAddSkill} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Skill Name</label>
                      <input
                        type="text"
                        required
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      Add Skill
                    </button>
                  </form>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Add Certification</h3>
                  <form onSubmit={handleAddCert} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Certificate Title</label>
                      <input
                        type="text"
                        required
                        value={certTitle}
                        onChange={(e) => setCertTitle(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Issuer</label>
                      <input
                        type="text"
                        required
                        value={certIssuer}
                        onChange={(e) => setCertIssuer(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      Add Certificate
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* 6. MEDIA */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-5">
                <h2 className="text-lg font-bold text-slate-900">Media Library</h2>
                <p className="text-xs text-slate-500">Upload and manage site images and assets.</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Upload New File</label>
                <input
                  type="file"
                  onChange={handleMediaInput}
                  disabled={uploadingMedia}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Uploaded Assets ({mediaList.length})</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
                  {mediaList.map((m) => (
                    <div key={m.id} className="relative group rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 space-y-2">
                      <img src={m.fileUrl} alt={m.altText || m.fileName} className="h-28 w-full object-cover rounded-lg" />
                      <p className="text-[11px] font-medium text-slate-700 truncate">{m.fileName}</p>
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(m.id)}
                        className="absolute top-3 right-3 rounded-lg bg-red-600 text-white p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. MESSAGES */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-5">
                <h2 className="text-lg font-bold text-slate-900">Enquiry Inbox</h2>
                <p className="text-xs text-slate-500">Messages sent via public contact forms.</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs divide-y divide-slate-200">
                {messagesList.length === 0 ? (
                  <p className="p-6 text-xs text-slate-500">No enquiries found.</p>
                ) : (
                  messagesList.map((msg) => (
                    <div key={msg.id} className="p-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">{msg.name} ({msg.email})</h4>
                        <span className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs font-semibold text-blue-600">{msg.subject}</p>
                      <p className="text-sm text-slate-700">{msg.message}</p>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleMessageStatus(msg.id, "read")}
                          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          Mark Read
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="rounded-lg border border-red-200 bg-red-50 p-1 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 8. USERS */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-5">
                <h2 className="text-lg font-bold text-slate-900">Users & Security Centre</h2>
                <p className="text-xs text-slate-500">Manage administrators and audit logs.</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Create Admin Account</h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                    />
                    <input
                      type="password"
                      required
                      placeholder="Secure Password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white"
                  >
                    Create Administrator
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 9. SETTINGS & CMS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Site Settings &amp; CMS Branding
                  </h2>
                  <p className="text-xs text-slate-500">
                    Customize global business identity, branding names, phone lines, and SEO across the portfolio template.
                  </p>
                </div>
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                  Public Site
                </Link>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Brand & Identity Settings */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Business &amp; Brand Identity (Template Settings)
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Full Brand / Business Name
                      </label>
                      <input
                        type="text"
                        value={settingsForm.brandName || ""}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, brandName: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                        placeholder="e.g. IYKOMO-TECH COMMUNICATION"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Short Brand Code
                      </label>
                      <input
                        type="text"
                        value={settingsForm.shortBrand || ""}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, shortBrand: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                        placeholder="e.g. IYKOMO-TECH"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Business Phone / WhatsApp Line
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phone || ""}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, phone: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                        placeholder="+2348168146210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={settingsForm.supportEmail || ""}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, supportEmail: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Sales Email
                      </label>
                      <input
                        type="email"
                        value={settingsForm.salesEmail || ""}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, salesEmail: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Location / Coverage
                    </label>
                    <input
                      type="text"
                      value={settingsForm.location || ""}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, location: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {savingSettings ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving Settings...
                      </>
                    ) : (
                      "Save Website Settings & Template Data"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}