import { ExternalLink, Mail, MapPin, Phone, Globe } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const [{ service }, settings] = await Promise.all([
    searchParams,
    getSiteSettings(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar shortBrand={settings.shortBrand} />

      <main className="flex-1">
        <section className="section-tint relative overflow-hidden border-b border-slate-200/70 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase">
              Contact & Business Enquiries
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Connect With Ikechukwu Egbo & {settings.shortBrand}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-600">
              Available for full-stack software engineering roles, custom web application builds, product demos of iykbook & iykschool, and commercial IT support contracts.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <ContactForm defaultService={service || ""} />
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 space-y-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Direct Contact Channels
                  </h2>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-5 w-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">
                          Support & General Enquiries
                        </p>
                        <p className="text-slate-600">
                          {settings.supportEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">
                          Sales & Product Licensing
                        </p>
                        <p className="text-slate-600">{settings.salesEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-5 w-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">
                          Business Line
                        </p>
                        <p className="text-slate-600">{settings.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">Coverage</p>
                        <p className="text-slate-600">{settings.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Official Platforms & Profiles
                    </h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <a
                      href={settings.iykbookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 font-semibold text-slate-800 hover:border-blue-400 hover:text-blue-600"
                    >
                      <span>iykbook — iykbook.iykomotech.com</span>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                    <a
                      href={settings.iykschoolUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 font-semibold text-slate-800 hover:border-blue-400 hover:text-blue-600"
                    >
                      <span>iykschool — iykschool.iykomotech.com</span>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                    <a
                      href={settings.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 font-semibold text-slate-800 hover:border-blue-400 hover:text-blue-600"
                    >
                      <span>GitHub — ikechukwuegbo.github.io</span>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                    <a
                      href={settings.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 font-semibold text-slate-800 hover:border-blue-400 hover:text-blue-600"
                    >
                      <span>LinkedIn — Ikechukwu Egbo</span>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </a>
                  </div>
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
