import Link from "next/link";
import { ExternalLink, Mail, MapPin } from "lucide-react";
import type { GeneralSiteSettings } from "@/lib/data";

export function Footer({ settings }: { settings: GeneralSiteSettings }) {
  return (
    <footer className="band-navy relative isolate overflow-hidden text-slate-300">
      <div className="bg-grid-dark absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent"
        aria-hidden="true"
      />
      <div
        className="blob h-72 w-72 bg-blue-600/40 -top-24 left-1/4 animate-floaty-slow"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-white/20">
                <img
                  src="/images/logo-mark.svg"
                  alt="IYKOMO-TECH COMMUNICATION logo"
                  className="h-full w-full object-contain p-1"
                />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight text-white">
                  Ikechukwu Egbo
                </p>
                <p className="font-mono text-[11px] font-semibold leading-tight text-sky-300 uppercase">
                  {settings.shortBrand}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {settings.mission}
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Systems &amp; SaaS Operational
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              Software Projects
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={settings.iykbookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-slate-300 transition hover:text-sky-300"
                >
                  iykbook — Business Management
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a
                  href={settings.iykschoolUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-slate-300 transition hover:text-sky-300"
                >
                  iykschool — Education Platform
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-slate-300 transition hover:text-sky-300"
                >
                  GitHub Engineering Repo
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="font-medium text-slate-300 transition hover:text-sky-300"
                >
                  View All Case Studies →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              Platform Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="transition hover:text-sky-300">
                  About Ikechukwu Egbo
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="transition hover:text-sky-300">
                  IT Infrastructure Portfolio
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition hover:text-sky-300">
                  IT &amp; Software Services
                </Link>
              </li>
              <li>
                <Link
                  href="/certificates"
                  className="transition hover:text-sky-300"
                >
                  Certificates &amp; Skills
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition hover:text-sky-300">
                  Knowledge Hub
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              Direct Contact
            </h3>
            <p className="flex items-center gap-2 text-sm text-slate-300">
              <Mail className="h-4 w-4 shrink-0 text-sky-400" />
              <span>Support: {settings.supportEmail}</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-300">
              <Mail className="h-4 w-4 shrink-0 text-sky-400" />
              <span>Sales: {settings.salesEmail}</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-300">
              <MapPin className="h-4 w-4 shrink-0 text-sky-400" />
              <span>{settings.location}</span>
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} {settings.brandName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}