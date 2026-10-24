import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TechIcon } from "@/components/TechIcon";
import { getSiteSettings, getPublishedServices } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [settings, servicesList] = await Promise.all([
    getSiteSettings(),
    getPublishedServices(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar shortBrand={settings.shortBrand} />

      <main className="flex-1">
        <section className="section-tint relative overflow-hidden border-b border-slate-200/70 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase">
              IYKOMO-TECH Commercial Offerings
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              IT Infrastructure & Custom Software Services
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-600">
              Comprehensive technical solutions designed for businesses, schools, clinics, retail organizations, and growing teams—from custom cloud applications to on-site networking, CCTV surveillance, and helpdesk SLAs.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {servicesList.map((service) => (
                <div
                  key={service.id}
                  className="card-lift flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <TechIcon name={service.iconName} className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-3.5 py-1 font-mono text-xs font-semibold text-slate-700">
                        {service.pricingNote}
                      </span>
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-slate-900">
                      {service.title}
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-slate-600">
                      {service.description}
                    </p>

                    <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-5">
                      {(service.features || []).map((feat) => (
                        <div
                          key={feat}
                          className="flex items-start gap-2.5 text-sm text-slate-700"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      Enquire About This Service
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
