import Link from "next/link";
import { ArrowUpRight, GitBranch, Layers } from "lucide-react";
import type { ProjectMetrics } from "@/db/schema";

export interface ProjectItem {
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
  metrics?: ProjectMetrics | null;
}

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
      <Link
        href={`/projects/${project.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 block"
      >
        <img
          src={project.coverImage || "/images/project-portfolio-infra.jpg"}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 font-mono text-xs font-semibold text-slate-900 shadow-xs backdrop-blur-xs">
            <Layers className="h-3 w-3 text-blue-600" />
            {project.category}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-7 sm:p-8">
        <div>
          <Link href={`/projects/${project.slug}`}>
            <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
              {project.title}
            </h3>
          </Link>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
            {project.tagline}
          </p>

          {project.metrics?.deployment && (
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-2.5">
              <p className="font-mono text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Endpoint:</span>{" "}
                {project.metrics.deployment}
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {(project.technologies || []).slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-blue-600"
          >
            Case Study Details →
          </Link>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} GitHub repository`}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <GitBranch className="h-3.5 w-3.5" />
                Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                Live App
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
