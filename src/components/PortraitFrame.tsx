"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Upload,
} from "lucide-react";

/**
 * Renders the founder portrait from site settings.
 * If no photo has been uploaded yet, shows a branded monogram card
 * so the layout never breaks and no substitute photo is shown.
 */
export function PortraitFrame({
  portraitUrl,
  className = "",
  aspect = "aspect-[4/5]",
  rounded = "rounded-2xl",
}: {
  portraitUrl?: string | null;
  className?: string;
  aspect?: string;
  rounded?: string;
}) {
  const hasPhoto = Boolean(portraitUrl && portraitUrl.trim().length > 0);

  return (
    <div
      className={`relative overflow-hidden ${aspect} ${rounded} ${className}`}
    >
      {hasPhoto ? (
        <img
          src={portraitUrl as string}
          alt="Ikechukwu Egbo — Founder of IYKOMO-TECH COMMUNICATION"
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="hero-mesh flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="bg-grid-dark absolute inset-0 opacity-60" />
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/25">
            <img
              src="/images/logo-mark.svg"
              alt="IYKOMO-TECH COMMUNICATION logo mark"
              className="h-full w-full object-contain p-2"
            />
          </div>
          <div className="relative space-y-1">
            <p className="text-sm font-bold text-white">Ikechukwu Egbo</p>
            <p className="font-mono text-[10px] tracking-wider text-sky-300 uppercase">
              Founder &amp; Lead Engineer
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Shared upload helper — posts a file to /api/identity and returns its URL.
 */
async function uploadIdentity(
  file: File,
  kind: "portrait" | "logo" | "logoMark"
): Promise<{ url?: string; error?: string }> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("kind", kind);
  try {
    const res = await fetch("/api/identity", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "Upload failed." };
    return { url: data.url as string };
  } catch {
    return { error: "Upload failed. Please try again." };
  }
}

/**
 * Admin control for uploading the real founder portrait / company logo.
 * Supports click-to-browse and drag-and-drop.
 */
export function IdentityUploader({
  label,
  hint,
  kind,
  currentValue,
  previewUrl,
  previewClass = "h-16 w-16",
  onUploaded,
}: {
  label: string;
  hint: string;
  kind: "portrait" | "logo" | "logoMark";
  currentValue?: string | null;
  previewUrl?: string | null;
  previewClass?: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setBusy(true);
    const result = await uploadIdentity(file, kind);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onUploaded(result.url as string);
    if (inputRef.current) inputRef.current.value = "";
  }

  const preview = previewUrl || currentValue;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-xs font-bold text-slate-900">{label}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{hint}</p>

      <div className="mt-3 flex items-center gap-3">
        <div
          className={`${previewClass} flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white`}
        >
          {preview ? (
            <img
              src={preview}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : (
            <Camera className="h-5 w-5 text-slate-300" />
          )}
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-[11px] font-semibold text-slate-800 hover:border-blue-400 hover:text-blue-700 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          {preview ? "Replace" : "Upload"}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-[11px] font-semibold text-red-600">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
    </div>
  );
}

/**
 * Large, unmissable drag-and-drop setup card shown on the Admin Overview.
 * Used to add the real founder photo to the public hero and About page.
 */
export function PhotoSetupCard({
  portraitUrl,
  onUploaded,
}: {
  portraitUrl?: string | null;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const hasPhoto = Boolean(portraitUrl && portraitUrl.trim().length > 0);

  async function handleFile(file?: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG or WEBP).");
      return;
    }
    setError("");
    setBusy(true);
    const result = await uploadIdentity(file, "portrait");
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onUploaded(result.url as string);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-50/60 ring-1 ring-sky-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 bg-white/70 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white">
            <Camera className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {hasPhoto ? "Update Your Portrait Photo" : "Add Your Portrait Photo"}
            </h2>
            <p className="text-[11px] text-slate-500">
              Appears instantly in the Home hero and About page
            </p>
          </div>
        </div>
        {hasPhoto ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Photo live
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
            <AlertCircle className="h-3.5 w-3.5" />
            Pending — placeholder showing
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 items-center gap-6 p-6 sm:grid-cols-5">
        {/* Live preview */}
        <div className="sm:col-span-1">
          <div className="mx-auto aspect-[4/5] w-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
            {hasPhoto ? (
              <img
                src={portraitUrl as string}
                alt="Current founder portrait"
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="hero-mesh flex h-full w-full flex-col items-center justify-center gap-1.5">
                <img
                  src="/images/logo-mark.svg"
                  alt="Placeholder mark"
                  className="h-8 w-8 object-contain opacity-90"
                />
                <span className="px-1 text-center font-mono text-[7px] uppercase tracking-wide text-sky-300">
                  No photo yet
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dropzone */}
        <div className="sm:col-span-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              void handleFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
              dragging
                ? "border-sky-500 bg-sky-100/70"
                : "border-sky-300 bg-white/70 hover:border-sky-500 hover:bg-sky-50/70"
            }`}
          >
            {busy ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
                <p className="mt-2 text-xs font-semibold text-slate-700">
                  Uploading your photo…
                </p>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6 text-sky-600" />
                <p className="mt-2 text-sm font-bold text-slate-900">
                  Drag &amp; drop your photo here
                </p>
                <p className="mt-1 text-[11px] text-slate-600">
                  or{" "}
                  <span className="font-semibold text-sky-700 underline">
                    browse your device
                  </span>{" "}
                  — JPG, PNG or WEBP up to 8MB
                </p>
                <p className="mt-2 font-mono text-[10px] text-slate-400">
                  Tip: a 4:5 portrait (e.g. 1080 × 1350) frames best
                </p>
              </>
            )}
          </div>

          {error && (
            <p className="mt-2 text-[11px] font-semibold text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
