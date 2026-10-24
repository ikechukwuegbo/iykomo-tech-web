import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  ShieldCheck,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { TechIcon } from "@/components/TechIcon";
import { PortraitFrame } from "@/components/PortraitFrame";
import {
  getSiteSettings,
  getPublishedProjects,
  getPublishedServices,
  getAllSkills,
  getPublishedPosts,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, projectsList, servicesList, skillsList, postsList] =
    await Promise.all([
      getSiteSettings(),
      getPublishedProjects(),
      getPublishedServices(),
      getAllSkills(),
      getPublishedPosts(),
    ]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar shortBrand={settings.shortBrand} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-mesh relative isolate overflow-hidden py-20 sm:py-28">
          <div className="bg-grid-dark absolute inset-0 opacity-70" />
          <div
            className="blob h-72 w-72 bg-sky-500/60 -top-16 -left-10 animate-floaty-slow"
            aria-hidden="true"
          />
          <div
            className="blob h-80 w-80 bg-blue-600/50 top-24 -right-16 animate-floaty"
            aria-hidden="true"
          />
          <div
            className="blob h-56 w-56 bg-amber-400/25 bottom-0 left-1/3"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#f7f9fc]"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-8 animate-fade-up">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-ring" />
                  {settings.heroBadge}
                </div>

                <div className="space-y-5">
                  <p className="font-mono text-xs font-semibold tracking-[0.2em] text-sky-300 uppercase">
                    Ikechukwu Egbo • Founder of {settings.shortBrand}
                  </p>
                  <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
                    <span className="text-gradient">{settings.headline}</span>
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
                    {settings.subheadline}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:brightness-110"
                  >
                    Explore Software & IT Projects
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
                  >
                    View IT & Dev Services
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-sky-300 hover:text-white"
                  >
                    Hire or Enquire →
                  </Link>
                </div>

                {/* Live Product Quick Links */}
                <div className="glass-dark rounded-2xl p-5">
                  <p className="font-mono text-[11px] font-semibold tracking-wider text-sky-200 uppercase">
                    Live Production Ecosystem — Direct Access
                  </p>
                  <div className="mt-3.5 flex flex-wrap gap-3">
                    <a
                      href={settings.iykbookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 shadow-2xs transition hover:border-blue-400"
                    >
                      <img
                        src="/images/logo-iykbook.png"
                        alt="iykbook logo"
                        className="h-6 w-6 rounded-md object-cover"
                      />
                      <span className="flex flex-col leading-none">
                        <span>iykbook</span>
                        <span className="mt-0.5 font-mono text-[10px] font-normal text-slate-500">
                          Accounting • Inventory • Business
                        </span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </a>
                    <a
                      href={settings.iykschoolUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-slate-900 transition hover:border-sky-400 hover:bg-white"
                    >
                      <img
                        src="/images/logo-iykschool.png"
                        alt="iykschool logo"
                        className="h-6 w-6 rounded-md object-contain"
                      />
                      <span className="flex flex-col leading-none">
                        <span>iykschool</span>
                        <span className="mt-0.5 font-mono text-[10px] font-normal text-slate-500">
                          Learn • Grow • Succeed
                        </span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </a>
                    <a
                      href={settings.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-2xs transition hover:border-slate-400"
                    >
                      <GitBranch className="h-3.5 w-3.5 text-slate-700" />
                      ikechukwuegbo.github.io
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Executive Visual Card */}
              <div className="lg:col-span-5">
                <div className="relative animate-fade-up">
                  <div
                    className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-sky-400/30 via-blue-500/20 to-transparent blur-2xl"
                    aria-hidden="true"
                  />
                  <div className="glass-dark relative rounded-3xl p-4 ring-1 ring-white/12">
                    <PortraitFrame
                      portraitUrl={settings.portraitUrl}
                      aspect="aspect-[4/5]"
                      rounded="rounded-2xl"
                    />
                    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-950/70 px-5 py-4 text-white ring-1 ring-white/10">
                      <div className="min-w-0">
                        <p className="text-sm font-bold">Ikechukwu Egbo (Iyke)</p>
                        <p className="mt-0.5 text-xs text-slate-300">
                          Full-Stack Software &amp; IT Infrastructure Architect
                        </p>
                      </div>
                      <span className="shrink-0 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 px-3 py-1.5 text-center font-mono text-[10px] font-semibold leading-tight">
                        IYKOMO-TECH
                        <br />
                        COMMUNICATION
                      </span>
                    </div>
                  </div>

                  {/* Floating credential chip */}
                  <div className="glass-dark animate-floaty-slow absolute -bottom-5 -left-4 hidden rounded-xl px-4 py-3 sm:block">
                    <p className="font-mono text-[10px] tracking-wider text-sky-200 uppercase">
                      Uptime
                    </p>
                    <p className="text-lg font-extrabold text-white">99.95%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Stat Band */}
        <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass ring-glow grid grid-cols-2 gap-6 rounded-2xl px-6 py-6 sm:px-8 lg:grid-cols-4">
            {[
              { k: "2+", v: "Live Software Projects" },
              { k: "6", v: "Enterprise IT Service Lines" },
              { k: "10", v: "Core Technical Competencies" },
              { k: "99.95%", v: "Infrastructure Uptime" },
            ].map((s) => (
              <div key={s.v} className="text-center">
                <p className="text-2xl font-extrabold text-gradient-brand sm:text-3xl">
                  {s.k}
                </p>
                <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-600 uppercase">
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Software Products & IT Projects */}
        <section className="section-tint py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase">
                  Software Projects & Case Studies
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                  Software Projects & IT Infrastructure Work
                </h2>
                <p className="mt-3 text-base text-slate-600">
                  Our software projects — <span className="font-semibold text-slate-900">iykbook</span> and <span className="font-semibold text-slate-900">iykschool</span> — are engineered from database schema to cloud edge, alongside turnkey enterprise IT rollouts. Managed dynamically via our PostgreSQL CMS.
                </p>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 shrink-0"
              >
                All {projectsList.length} Projects
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {projectsList.slice(0, 4).map((project) => (
                <div key={project.id} className="animate-fade-up">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Services Section */}
        <section className="border-y border-slate-200/80 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase">
                  IYKOMO-TECH Solutions
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                  End-to-End Software & IT Infrastructure Services
                </h2>
                <p className="mt-3 text-base text-slate-600">
                  Whether your organization needs custom cloud software, reliable helpdesk support, structured office networking, or IP security cameras, we deliver engineered reliability.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 shrink-0"
              >
                Explore Full Service Catalogue
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {servicesList.slice(0, 6).map((service) => (
                <div
                  key={service.id}
                  className="card-lift flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <TechIcon name={service.iconName} className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-lg font-bold text-slate-900">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      {service.summary}
                    </p>
                    <ul className="mt-5 space-y-2">
                      {(service.features || []).slice(0, 3).map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2 text-xs text-slate-700"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-7 border-t border-slate-100 pt-4 flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-500">
                      {service.pricingNote}
                    </span>
                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Request Quote →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Matrix Preview */}
        <section className="section-tint py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
              <div className="lg:col-span-5 space-y-5">
                <p className="font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase">
                  Technical Stack & Competencies
                </p>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  Bridging Modern Full-Stack Code & Enterprise Systems
                </h2>
                <p className="text-base leading-relaxed text-slate-600">
                  {settings.aboutSummary}
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/about"
                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Read Full Biography
                  </Link>
                  <Link
                    href="/certificates"
                    className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Certificates & Credentials
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {skillsList.slice(0, 8).map((skill) => (
                  <div
                    key={skill.id}
                    className="card-lift rounded-2xl border border-slate-200 bg-white/80 p-5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {skill.name}
                      </span>
                      <span className="font-mono text-xs font-semibold text-blue-600">
                        {skill.proficiency}%
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">
                      {skill.category}
                    </p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Knowledge Hub / Technical Blog Section */}
        <section className="border-t border-slate-200/80 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase">
                  Knowledge Hub & Engineering Notes
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                  Tutorials, Architecture & IT Field Guides
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Read All Articles
                <BookOpen className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {postsList.slice(0, 3).map((post) => (
                <article
                  key={post.id}
                  className="card-lift flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="rounded-md bg-blue-50 px-2.5 py-1 font-mono font-semibold text-blue-700">
                        {post.category}
                      </span>
                      <span className="font-mono">{post.readingTime}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="mt-4 text-lg font-bold text-slate-900 hover:text-blue-600">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-blue-600"
                    >
                      Read Full Guide →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Executive CTA */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-slate-900 px-8 py-14 text-white sm:px-14 sm:py-16">
              <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-emerald-400 uppercase">
                    <Sparkles className="h-4 w-4" />
                    Ready to Collaborate
                  </div>
                  <h2 className="text-3xl font-bold sm:text-4xl">
                    Need a Full-Stack Developer, Custom Business App, or Reliable IT Partner?
                  </h2>
                  <p className="text-slate-300 text-base">
                    Connect directly with Ikechukwu Egbo & IYKOMO-TECH to discuss software engineering roles, custom web applications, or enterprise IT support.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 shrink-0">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    Start a Conversation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Open Admin Console
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
