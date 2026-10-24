import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
        <Layers className="h-7 w-7" />
      </div>
      <p className="mt-5 font-mono text-xs font-semibold text-blue-600 uppercase tracking-widest">
        404 • Page Not Found
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
        Requested Resource Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-slate-600">
        The page or case study you requested may have been moved, unpublished, or removed from the IYKOMO-TECH database.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/projects"
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-semibold text-slate-800 hover:bg-slate-50"
        >
          Explore Projects
        </Link>
      </div>
    </div>
  );
}
