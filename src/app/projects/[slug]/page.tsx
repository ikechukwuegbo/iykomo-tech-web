import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  GitBranch,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSiteSettings, getProjectBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [settings, project] = await Promise.all([
    getSiteSettings(),
    getProjectBySlug(slug),
  ]);

  if (!project) {
    notFound();
  }

  const paragraphs = project.description.split(/\n\n+/).filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar shortBrand={settings.shortBrand} />

      <main className="flex-1 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Projects
          </Link>

          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 font-mono text-xs font-semibold text-blue-700">
                <Layers className="h-3.5 w-3.5" />
                {project.category}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-mono text-xs font-semibold text-emerald-800">
                Status: {project.status.toUpperCase()}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-5xl">
              {project.title}
            </h1>
            <p className="text-xl leading-relaxed text-slate-600">
              {project.tagline}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700"
                >
                  Launch Live Application
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <GitBranch className="h-4 w-4" />
                  View Source / Repository
                </a>
              )}
            </div>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
            <img
              src={project.coverImage || "/images/project-portfolio-infra.jpg"}
              alt={project.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Architecture & Implementation Overview
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-slate-700">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {project.images && project.images.length > 0 && (
                <div className="pt-6 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    Project Screenshots & Views
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {project.images.map((img) => (
                      <div
                        key={img.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.caption || project.title}
                          className="aspect-[16/10] w-full object-cover"
                        />
                        {img.caption && (
                          <p className="p-3.5 text-xs font-medium text-slate-600">
                            {img.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-5">
                <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
                  Technical Specifications
                </h3>
                {project.metrics?.architecture && (
                  <div>
                    <p className="font-mono text-xs text-slate-500">
                      Architecture
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {project.metrics.architecture}
                    </p>
                  </div>
                )}
                {project.metrics?.deployment && (
                  <div>
                    <p className="font-mono text-xs text-slate-500">
                      Production Endpoint
                    </p>
                    <p className="mt-1 font-mono text-xs font-semibold text-blue-600 break-all">
                      {project.metrics.deployment}
                    </p>
                  </div>
                )}

                <div>
                  <p className="font-mono text-xs text-slate-500 mb-2.5">
                    Technologies Used
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(project.technologies || []).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs font-medium text-slate-800"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900 p-6 text-white">
                <h3 className="text-base font-bold">
                  Want a Similar Platform Built for Your Organization?
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  IYKOMO-TECH builds tailored cloud applications, internal admin suites, and IT infrastructure.
                </p>
                <Link
                  href={`/contact?service=${encodeURIComponent(project.title)}`}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  Request Project Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
