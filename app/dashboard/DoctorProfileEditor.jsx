"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/appointment-app";

const fields = [
  ["displayName", "Public name", "text"],
  ["professionalTitle", "Professional title", "text"],
  ["university", "University", "text"],
  ["practiceStartYear", "Year you began practicing", "number"],
  ["procedureCount", "Procedure count (optional)", "number"],
  ["languages", "Languages spoken", "textarea"],
  ["qualifications", "Qualifications and degrees", "textarea"],
  ["training", "Additional training", "textarea"],
  ["subSpecialties", "Subspecialties", "textarea"],
  ["services", "Services offered", "textarea"],
  ["procedures", "Procedures performed", "textarea"],
  ["biography", "Professional biography", "textarea"],
];

export default function DoctorProfileEditor({ profile }) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => Object.fromEntries(fields.map(([key]) => [key, profile[key] == null ? "" : String(profile[key])])));
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function save(event) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const payload = { ...draft };
    for (const key of ["practiceStartYear", "procedureCount"]) payload[key] = draft[key] === "" ? null : Number(draft[key]);
    try {
      const response = await fetch(`${basePath}/api/doctor/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to save your professional profile.");
      setMessage(result.message ?? "Professional profile saved.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save your professional profile.");
    } finally {
      setPending(false);
    }
  }

  if (!profile) return <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">Your doctor profile is not linked to this account yet. Ask an administrator to link the account to the correct clinician record.</section>;

  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div><p className="text-sm font-semibold text-teal-800">PROFESSIONAL PROFILE</p><h2 className="mt-1 text-xl font-bold text-slate-950">Edit your public profile</h2><p className="mt-2 text-sm leading-6 text-slate-600">Add only accurate information you are authorized to publish. Empty fields stay hidden from your public profile.</p></div>
    {message && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-teal-50 p-3 text-sm text-teal-950">{message}</p>}
    <form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl bg-slate-50 p-3 text-sm sm:col-span-2"><span className="font-semibold text-slate-900">{profile.displayName}</span>{profile.slug && <span className="ml-2 text-slate-500">/doctors/{profile.slug}</span>}</div>
      {fields.map(([key, label, type]) => <label key={key} className={`block text-sm font-medium text-slate-700 ${type === "textarea" ? "sm:col-span-2" : ""}`}>
        {label}
        {type === "textarea" ? <textarea rows={key === "biography" ? 5 : 3} maxLength={key === "biography" ? 4000 : key === "languages" ? 500 : 3000} value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /> : <input type={type} min={type === "number" ? 0 : undefined} max={key === "practiceStartYear" ? new Date().getFullYear() : key === "procedureCount" ? 10000000 : undefined} value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />}
      </label>)}
      <button disabled={pending} className="rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-50 sm:col-span-2">{pending ? "Saving…" : "Save professional profile"}</button>
    </form>
  </section>;
}
