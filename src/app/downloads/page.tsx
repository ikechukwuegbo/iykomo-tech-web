import Link from "next/link";
import {
  ArrowRight,
  Database,
  Download,
  FolderGit2,
  KeyRound,
  Rocket,
  Terminal,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

const ZIP_URL = "/downloads/iykomo-tech-communication-source.zip";

const STEPS = [
  {
    icon: FolderGit2,
    title: "1. Unzip & install",
    code: "unzip iykomo-tech-communication-source.zip\ncd iykomo-tech-communication-source\nnpm install",
  },
  {
    icon: Database,
    title: "2. Configure your database",
    code: "cp .env.example .env\n# edit .env → set DATABASE_URL\nnpx drizzle-kit push",
  },
  {
    icon: Terminal,
    title: "3. Run it",
    code: "npm run dev        # development\nnpm run build && npm run start   # production",
  },
  {
    icon: Rocket,
    title: "4. Push to GitHub & deploy",
    code: "git init && git add . && git commit -m \"IYKOMO-TECH\"\ngit branch -M main\ngit remote add origin https://github.com/<you>/<repo>.git\ngit push -u origin main",
  },
];

export default async function DownloadsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar shortBrand={settings.shortBrand} />

      <main className="flex-1">
        <section className="section-tint relative overflow-hidden border-b border-slate-200/70 bg-white py-16 sm:py-20">
          <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-blue-600 uppercase">
              Source Code &amp; Deployment
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Download the Complete Project
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-600">
              The full Next.js + TypeScript + PostgreSQL codebase — frontend,
              backend APIs, database schema, and the protected Admin Console.
              Save it locally, push it to GitHub, and host it online.
            </p>

            <div className="mt-8 inline-flex flex-wrap items-center gap-4">
              <a
                href={ZIP_URL}
                download
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-700 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-900/25 transition hover:brightness-110"
              >
                <Download className="h-5 w-5" />
                Download ZIP (2.1 MB)
              </a>
              <span className="font-mono text-xs text-slate-500">
                128 files · includes .gitignore &amp; .env.example
              </span>
            </div>
          </div>
        </section>

        {/* Setup steps */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Setup &amp; Deployment Steps
            </h2>
            <div className="mt-8 space-y-5">
              {STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-7"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {step.title}
                      </h3>
                    </div>
                    <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-[11px] leading-relaxed text-slate-100 sm:text-xs">
                      {step.code}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Admin credentials */}
        <section className="section-tint border-y border-slate-200/70 py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-50/60 p-7 sm:p-9">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white">
                  <KeyRound className="h-4.5 w-4.5" />
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  Admin Console Login
                </h2>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Visit <span className="font-mono font-semibold">/admin/login</span>{" "}
                after starting the app.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                    Primary — Super Admin
                  </p>
                  <p className="mt-1.5 font-mono text-xs font-bold text-slate-900">
                    admin@iykomotech.com
                  </p>
                  <p className="font-mono text-xs font-bold text-blue-600">
                    IykomoAdmin2026!
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">
                    Secondary — Operations
                  </p>
                  <p className="mt-1.5 font-mono text-xs font-bold text-slate-900">
                    ops@iykomotech.com
                  </p>
                  <p className="font-mono text-xs font-bold text-blue-600">
                    IykomoOps2026!
                  </p>
                </div>
              </div>

              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                <strong>Change these passwords before going live</strong> — Admin
                → Users &amp; Security.
              </p>
            </div>
          </div>
        </section>

        {/* Adding pictures */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Adding Your Photos After Hosting
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-7">
                <h3 className="text-base font-bold text-slate-900">
                  Option A — Commit the file (best for Vercel)
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Drop your photo into{" "}
                  <span className="font-mono text-xs">public/images/</span> named{" "}
                  <span className="font-mono text-xs font-bold">founder.jpg</span>{" "}
                  and push. It appears automatically.
                </p>
                <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-3.5 font-mono text-[11px] text-slate-100">
                  {`# from your project folder
cp ~/Pictures/your-photo.jpg public/images/founder.jpg
git add public/images/founder.jpg
git commit -m "Add founder photo"
git push`}
                </pre>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-7">
                <h3 className="text-base font-bold text-slate-900">
                  Option B — Upload in Admin Console
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Go to the Admin dashboard and use the{" "}
                  <strong>&ldquo;Add Your Portrait Photo&rdquo;</strong>{" "}
                  drag-and-drop card. Best when self-hosting on your own server.
                </p>
                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                  Note: Vercel&apos;s filesystem is read-only at runtime, so use
                  Option A there. Both work on your own VPS.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Open Admin Console
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={ZIP_URL}
                download
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Download ZIP Again
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
