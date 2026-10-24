import Link from "next/link";
import {
  CheckCircle2,
  Network,
  Printer,
  Server,
  ShieldCheck,
  Wrench,
  ArrowRight,
  HardDrive,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { getSiteSettings, getPublishedProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ITPortfolioPage() {
  const [settings, allProjects] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects(),
  ]);

  const infraDomains = [
    {
      title: "IT Support & Helpdesk Operations",
      icon: Wrench,
      metrics: "L1–L3 Diagnostics • Windows, macOS & Linux",
      points: [
        "Rapid troubleshooting of OS boot failures, driver conflicts, BSOD crashes, and performance bottlenecks",
        "Microsoft 365 & Google Workspace tenant setup, user lifecycle provisioning, and email DNS security",
        "Hardware upgrades (NVMe SSDs, ECC/DDR4/DDR5 RAM), thermal servicing, and asset tagging",
      ],
    },
    {
      title: "Enterprise Networking & Structured Cabling",
      icon: Network,
      metrics: "VLAN Segmentation • Ubiquiti / Cisco / MikroTik",
      points: [
        "End-to-end Cat6/Cat6a structured cabling, rack mounting, patch panel termination, and cable certification",
        "Multi-VLAN network isolation separating corporate staff, finance servers, printers, CCTV, and guest Wi-Fi",
        "Dual-WAN ISP failover routing, site-to-site VPN tunnels, and seamless multi-floor wireless roaming",
      ],
    },
    {
      title: "Server Administration & Backup Governance",
      icon: Server,
      metrics: "Active Directory • Linux • PostgreSQL • NAS",
      points: [
        "Windows Server Domain Controllers, Active Directory users/OUs, DNS/DHCP scopes, and Group Policy enforcement",
        "Ubuntu/Debian Linux server hardening, SSH key authentication, Docker services, and automated cron monitoring",
        "3-2-1 disaster recovery architecture combining RAID NAS appliances with encrypted offsite cloud backups",
      ],
    },
    {
      title: "Cybersecurity, CCTV Surveillance & Printer Fleets",
      icon: ShieldCheck,
      metrics: "Zero-Trust Access • 4K PoE NVR • MFP Fleets",
      points: [
        "High-definition PoE IP CCTV surveillance design, dedicated security VLANs, UPS backup, and encrypted mobile viewing",
        "Enterprise multifunction printer (MFP) static IP queues, Scan-to-SMB folders, and authenticated Scan-to-Email",
        "Endpoint protection policies, MFA rollout across critical accounts, and least-privilege access reviews",
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar shortBrand={settings.shortBrand} />

      <main className="flex-1">
        <section className="border-b border-slate-200 bg-slate-50/80 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-5">
                <p className="font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase">
                  IT Support & Infrastructure Portfolio
                </p>
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                  Systems Administration, Networking, Security & Field Engineering
                </h1>
                <p className="text-lg leading-relaxed text-slate-600">
                  Alongside full-stack software development, Ikechukwu Egbo & IYKOMO-TECH design, deploy, troubleshoot, and secure physical and cloud IT environments for offices, schools, and growing enterprises.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/contact?service=IT%20Infrastructure%20%26%20Support"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Book an IT Consultation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    View Managed IT Services
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3.5 shadow-md">
                  <img
                    src="/images/service-infrastructure.jpg"
                    alt="Enterprise IT Server & Network Rack"
                    className="aspect-[16/11] w-full rounded-2xl object-cover"
                  />
                  <div className="mt-3.5 flex items-center justify-between px-2 py-1">
                    <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-slate-800">
                      <HardDrive className="h-4 w-4 text-blue-600" />
                      Structured Rack, Switching & NVR Architecture
                    </span>
                    <span className="font-mono text-xs text-emerald-700 font-semibold">
                      99.95% Uptime
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure Domains Matrix */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-slate-900">
                Core Infrastructure & Technical Support Competencies
              </h2>
              <p className="mt-2.5 text-base text-slate-600">
                Practical, documented IT execution focused on stability, security isolation, and clean maintainability.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {infraDomains.map((domain) => {
                const Icon = domain.icon;
                return (
                  <div
                    key={domain.title}
                    className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-700">
                        {domain.metrics}
                      </span>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-slate-900">
                      {domain.title}
                    </h3>
                    <ul className="mt-5 space-y-3">
                      {domain.points.map((pt) => (
                        <li
                          key={pt}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Live Portfolio Case Studies */}
        <section className="border-t border-slate-200 bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  Featured Infrastructure, DevOps & Software Deployments
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Real systems built and maintained under IYKOMO-TECH.
                </p>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600"
              >
                Open Full Project Directory →
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              {allProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <Printer className="h-8 w-8 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Need On-Site Network Setup, Printer Fleet Support, or CCTV Installation?
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Reach out for site surveys, troubleshooting SLAs, or turnkey hardware & software deployments.
                  </p>
                </div>
              </div>
              <Link
                href="/contact"
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shrink-0 hover:bg-blue-700"
              >
                Request IT Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
