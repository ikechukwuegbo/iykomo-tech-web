import { Award, ExternalLink, FileText, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TechIcon } from "@/components/TechIcon";
import {
  getSiteSettings,
  getAllSkills,
  getAllCertifications,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const [settings, skillsList, certsList] = await Promise.all([
    getSiteSettings(),
    getAllSkills(),
    getAllCertifications(),
  ]);

  const groupedSkills = skillsList.reduce<Record<string, typeof skillsList>>(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {}
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar shortBrand={settings.shortBrand} />

      <main className="flex-1">
        <section className="section-tint relative overflow-hidden border-b border-slate-200/70 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase">
              Qualifications & Competencies
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Certificates, Training & Technical Skills
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-600">
              Verified competencies spanning full-stack Next.js/PostgreSQL application engineering, enterprise networking, systems administration, hardware diagnostics, and cloud security.
            </p>
          </div>
        </section>

        {/* Certifications Grid */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5">
              <Award className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Professional Certifications & Credentials
              </h2>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              {certsList.map((cert) => (
                <div
                  key={cert.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-700">
                        Issued {cert.issueDate}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-slate-900">
                      {cert.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {cert.issuer}
                    </p>
                    {cert.credentialId && (
                      <p className="mt-2 font-mono text-xs text-slate-500">
                        Credential ID: {cert.credentialId}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {(cert.skillsCovered || []).map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {(cert.certificateFile || cert.credentialUrl) && (
                    <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
                      {cert.certificateFile && (
                        <a
                          href={cert.certificateFile}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          View Certificate
                        </a>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-blue-600"
                        >
                          Verify Credential
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categorized Skills */}
        <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Categorized Technical Proficiency Matrix
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {Object.entries(groupedSkills).map(([category, items]) => (
                <div
                  key={category}
                  className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xs"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    {category}
                  </h3>
                  <div className="mt-6 space-y-5">
                    {items.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                            <TechIcon
                              name={skill.iconName}
                              className="h-4 w-4 text-blue-600"
                            />
                            {skill.name}
                          </span>
                          <span className="font-mono text-xs font-semibold text-blue-600">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
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
