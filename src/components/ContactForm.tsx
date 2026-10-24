"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

export function ContactForm({ defaultService = "" }: { defaultService?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [serviceInterest, setServiceInterest] = useState(
    defaultService || "Custom Full-Stack Software & Web Applications"
  );
  const [subject, setSubject] = useState(
    defaultService ? `Enquiry: ${defaultService}` : ""
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          serviceInterest,
          subject,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Please check all required fields.");
      } else {
        setSubmitted(true);
        setName("");
        setEmail("");
        setPhone("");
        setCompany("");
        setSubject("");
        setMessage("");
      }
    } catch {
      setError("Network error while submitting enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-8 sm:p-10 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          Message Received — Thank You!
        </h3>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600">
          Your enquiry has been securely recorded in the IYKOMO-TECH Admin Console inbox. Ikechukwu Egbo will review and respond promptly.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-2xs space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Send a Direct Message or Project Enquiry
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Recruiters, clients, schools, and businesses—fill out the form below for a prompt response.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Full Name *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@organization.com"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-phone"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Phone / WhatsApp (Optional)
          </label>
          <input
            id="contact-phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 / +44 / +234 ..."
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
          />
        </div>

        <div>
          <label
            htmlFor="contact-company"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Organization / School / Company
          </label>
          <input
            id="contact-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company or Institution Name"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-service"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Area of Interest
          </label>
          <select
            id="contact-service"
            value={serviceInterest}
            onChange={(e) => setServiceInterest(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
          >
            <option value="Full-Stack Engineering / Hiring Opportunity">
              Full-Stack Engineering / Hiring Opportunity
            </option>
            <option value="Custom Full-Stack Software & Web Applications">
              Custom Full-Stack Software & Web Applications
            </option>
            <option value="iykbook / iykschool Product Demo">
              iykbook / iykschool Product Demo
            </option>
            <option value="IT Support, Helpdesk & Endpoint Troubleshooting">
              IT Support, Helpdesk & Endpoint Troubleshooting
            </option>
            <option value="Network Installation, Structured Cabling & Wi-Fi">
              Network Installation, Structured Cabling & Wi-Fi
            </option>
            <option value="IP CCTV Surveillance & Physical Security Systems">
              IP CCTV Surveillance & Physical Security Systems
            </option>
            <option value="Server Administration & Printer Support">
              Server Administration & Printer Support
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Subject *
          </label>
          <input
            id="contact-subject"
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="How can we work together?"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
        >
          Project Details or Message *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me about your role, software requirements, or IT infrastructure project..."
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-hidden"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting Enquiry...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Message
          </>
        )}
      </button>
    </form>
  );
}
