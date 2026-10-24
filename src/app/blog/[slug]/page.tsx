import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSiteSettings, getPostBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [settings, post] = await Promise.all([
    getSiteSettings(),
    getPostBySlug(slug),
  ]);

  if (!post) {
    notFound();
  }

  const blocks = post.content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar shortBrand={settings.shortBrand} />

      <main className="flex-1 py-14 sm:py-20">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Knowledge Hub
          </Link>

          <div className="mt-8 space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-blue-50 px-3.5 py-1 font-mono font-semibold text-blue-700">
                {post.category}
              </span>
              <span className="font-mono text-slate-500">
                {post.readingTime}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500 pt-1">
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                <User className="h-3.5 w-3.5 text-blue-600" />
                {post.authorName}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {post.coverImage && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={post.coverImage}
                alt={post.title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          )}

          <div className="mt-10 space-y-5 text-base leading-relaxed text-slate-700">
            {blocks.map((block, idx) => {
              if (block.startsWith("### ")) {
                return (
                  <h2
                    key={idx}
                    className="pt-4 text-xl font-bold text-slate-900"
                  >
                    {block.replace(/^###\s+/, "")}
                  </h2>
                );
              }
              return (
                <p key={idx} className="whitespace-pre-line">
                  {block}
                </p>
              );
            })}
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8 flex flex-wrap gap-2">
            {(post.tags || []).map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs text-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
