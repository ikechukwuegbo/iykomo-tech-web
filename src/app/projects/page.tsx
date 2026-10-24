import { db } from "@/db";
import { projects } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";

// Force dynamic rendering so it always fetches the latest data from the SQLite database
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  // Fetch all projects from your database using Drizzle
  const allProjects = await db.select().from(projects);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
          Featured Projects
        </h1>
        <p className="text-lg text-slate-600">
          Explore software products, IT infrastructure, and cloud solutions built by IYKOMO-TECH COMMUNICATION.
        </p>
      </div>

      {allProjects.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-lg">No projects found in the database yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Project Cover Image */}
              <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
                    No Cover Image
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-600 shadow-sm">
                  {project.category}
                </div>
              </div>

              {/* Project Details */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                  {project.tagline}
                </p>

                {/* Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 mt-auto">
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      Live Demo &rarr;
                    </Link>
                  )}
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                    >
                      GitHub &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}