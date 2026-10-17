"use client";

import { useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/appointment-app";
const categories = [["GENERAL_INQUIRY", "General inquiry"], ["COMPLAINT", "Complaint"], ["TECHNICAL_ISSUE", "Technical issue"], ["SUGGESTION", "Suggestion"], ["OTHER", "Other"]];
const fieldClass = "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10";

export default function ContactForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  async function submit(event) {
    event.preventDefault(); setPending(true); setError(""); setReference("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(["name", "email", "phone", "category", "subject", "message"].map((key) => [key, form.get(key)]));
    payload.consent = form.get("consent") === "on";
    try {
      const response = await fetch(`${basePath}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Your message could not be sent.");
      setReference(result.submission.reference); formElement.reset();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Network error. Please try again."); }
    finally { setPending(false); }
  }
  return <form onSubmit={submit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
    <div><p className="text-sm font-semibold text-teal-800">Send a message</p><h2 className="mt-1 text-2xl font-bold text-slate-950">How can we support you?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Messages are stored securely for the support team. Do not include urgent medical information.</p></div>
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {reference && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">Your message was saved. Reference: <strong>{reference}</strong>. Keep this reference for follow-up.</p>}
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium text-slate-800">Full name<input name="name" required minLength={2} maxLength={120} autoComplete="name" className={fieldClass} /></label>
      <label className="text-sm font-medium text-slate-800">Email address<input name="email" required type="email" maxLength={254} autoComplete="email" className={fieldClass} /></label>
      <label className="text-sm font-medium text-slate-800">Phone number <span className="font-normal text-slate-500">(optional)</span><input name="phone" type="tel" maxLength={32} autoComplete="tel" className={fieldClass} /></label>
      <label className="text-sm font-medium text-slate-800">Category<select name="category" required className={fieldClass}>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    </div>
    <label className="block text-sm font-medium text-slate-800">Subject<input name="subject" required minLength={3} maxLength={160} className={fieldClass} /></label>
    <label className="block text-sm font-medium text-slate-800">Message<textarea name="message" required minLength={10} maxLength={5000} rows={6} className={fieldClass} /></label>
    <label className="flex items-start gap-3 text-sm leading-6 text-slate-600"><input type="checkbox" name="consent" required className="mt-1 size-4 accent-teal-800" /><span>I have read the <a href={`${basePath}/privacy`} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-900 underline">contact form privacy notice</a> and agree that MediaBook may use these details to manage this message.</span></label>
    <button disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 disabled:cursor-wait disabled:opacity-60">{pending ? "Sending…" : "Send message"}</button>
  </form>;
}
