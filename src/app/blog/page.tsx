import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSiteSettings, getPublishedPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [settings, postsList] = await Promise.all([
    getSiteSettings(),
    getPublishedPosts(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar shortBrand={settings.shortBrand} />

      <main className="flex-1">
        <section className="section-tint relative overflow-hidden border-b border-slate-200/70 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase">
              <BookOpen className="h-4 w-4" />
              Knowledge Hub & Technical Documentation
            </div>
            <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Tutorials, Troubleshooting Guides & Architecture Notes
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-600">
              Practical lessons from building full-stack SaaS software (iykbook, iykschool) and resolving enterprise networking, server, and hardware challenges.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {postsList.map((post) => (
                <article
                  key={post.id}
                  className="card-lift flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs"
                >
                  <div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block aspect-[16/9] w-full overflow-hidden bg-slate-100"
                    >
                      <img
                        src={
                          post.coverImage ||
                          "/images/project-portfolio-infra.jpg"
                        }
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <div className="p-7">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 font-mono font-semibold text-blue-700">
                          {post.category}
                        </span>
                        <span className="font-mono text-slate-500">
                          {post.readingTime}
                        </span>
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="mt-4 text-xl font-bold text-slate-900 hover:text-blue-600">
                          {post.title}
                        </h2>
                      </Link>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {post.excerpt}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {(post.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 px-7 py-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      By {post.authorName}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Read Article
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
