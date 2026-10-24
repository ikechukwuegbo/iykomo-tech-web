import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Code2,
  Server,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PortraitFrame } from "@/components/PortraitFrame";
import {
  getSiteSettings,
  getAllSkills,
  getAllCertifications,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [settings, skillsList, certsList] = await Promise.all([
    getSiteSettings(),
    getAllSkills(),
    getAllCertifications(),
  ]);

  const timeline = [
    {
      year: "Present",
      role: "Founder & Lead Full-Stack / IT Infrastructure Engineer",
      org: "IYKOMO-TECH",
      summary:
        "Architecting cloud SaaS products including iykbook (accounting & business ledger) and iykschool (unified academic management), while delivering enterprise IT support, networking, CCTV security, and systems administration.",
    },
    {
      year: "2024 – 2025",
      role: "Full-Stack Web Platform Engineering",
      org: "Production Cloud Systems (Next.js + PostgreSQL / Supabase)",
      summary:
        "Engineered multi-tenant role-protected web applications, REST APIs, database schemas with Row-Level Security, custom domain DNS routing, and automated GitHub deployment workflows.",
    },
    {
      year: "2022 – 2024",
      role: "IT Infrastructure, Networking & Technical Support Specialist",
      org: "Commercial & Educational Facilities",
      summary:
        "Led workstation diagnostics, Windows Server Active Directory rollouts, VLAN switch configuration, multifunction network printer fleets, structured Cat6 cabling, and PoE IP surveillance installations.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar shortBrand={settings.shortBrand} />

      <main className="flex-1">
        <section className="hero-mesh relative isolate overflow-hidden py-16 sm:py-24">
          <div className="bg-grid-dark absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="blob h-64 w-64 bg-sky-500/50 -top-16 left-10 animate-floaty-slow" aria-hidden="true" />
          <div className="blob h-72 w-72 bg-blue-600/45 bottom-0 right-0 animate-floaty" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#f7f9fc]" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-6">
                <p className="font-mono text-xs font-semibold tracking-[0.2em] text-sky-300 uppercase">
                  About Me • Personal Brand &amp; Company Story
                </p>
            <div className="inline-flex max-w-full items-center overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-xs">
              <img
                src={settings.logoUrl}
                alt="IYKOMO-TECH COMMUNICATION official company logo"
                className="h-14 w-auto"
              />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Ikechukwu Egbo & The Vision Behind{" "}
              <span className="text-blue-600">{settings.shortBrand}</span>
            </h1>
                <p className="text-lg leading-relaxed text-slate-600">
                  {settings.aboutSummary}
                </p>
                <p className="text-base leading-relaxed text-slate-600">
                  Organizations rarely fail from a lack of hardware or software ideas—they struggle when software developers don&apos;t understand real-world office operations, or when IT support lacks modern software engineering automation. By uniting full-stack Next.js/PostgreSQL engineering with hands-on systems & network administration, I build technology ecosystems that genuinely work every day.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Explore My Software Products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    View IT Support & Infra Portfolio
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="glass-dark rounded-3xl p-4 ring-1 ring-white/12">
                  <PortraitFrame
                    portraitUrl={settings.portraitUrl}
                    aspect="aspect-[4/5]"
                    rounded="rounded-2xl"
                  />
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-white/8 p-3 ring-1 ring-white/10">
                      <p className="font-mono text-xl font-bold text-white">
                        {skillsList.length}+
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">
                        Core Tech Skills
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/8 p-3 ring-1 ring-white/10">
                      <p className="font-mono text-xl font-bold text-sky-300">
                        2+
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">
                        Live SaaS Apps
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/8 p-3 ring-1 ring-white/10">
                      <p className="font-mono text-xl font-bold text-emerald-300">
                        {certsList.length}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">
                        Credentials
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Core Engineering & Operational Pillars
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-8">
                <Code2 className="h-8 w-8 text-blue-600" />
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Full-Stack SaaS Engineering
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Designing clean, type-safe web platforms with Next.js, React, TypeScript, Tailwind CSS, and PostgreSQL—exemplified by iykbook and iykschool.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-8">
                <Server className="h-8 w-8 text-blue-600" />
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Enterprise IT & Infrastructure
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Commissioning reliable office LAN/Wi-Fi networks, Active Directory servers, multifunction printers, IP surveillance, and structured cabling.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-8">
                <ShieldCheck className="h-8 w-8 text-emerald-600" />
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Security & Long-Term Maintainability
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Implementing server-side authorization, database access policies, VLAN isolation, encrypted backups, and documented operational handovers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="border-t border-slate-200 bg-slate-50 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <h2 className="text-3xl font-bold text-slate-900">
                Professional Journey & Experience
              </h2>
            </div>

            <div className="mt-10 space-y-6">
              {timeline.map((item) => (
                <div
                  key={item.role}
                  className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-blue-50 px-3.5 py-1 font-mono text-xs font-semibold text-blue-700">
                      {item.year}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {item.org}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-900">
                    {item.role}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-8">
              <div className="flex items-center gap-3">
                <Award className="h-7 w-7 text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900">
                    Explore Verified Certificates & Technical Skills
                  </h3>
                  <p className="text-sm text-slate-600">
                    View full breakdown of competencies across software, networking, and systems.
                  </p>
                </div>
              </div>
              <Link
                href="/certificates"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                View Certificates
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
