"use client";

import { useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const labels = { NEW: "New", IN_PROGRESS: "In progress", RESOLVED: "Resolved", CLOSED: "Closed" };

export default function AdminContactManager() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  async function load(nextPage = page) {
    setLoading(true); setMessage("");
    try {
      const params = new URLSearchParams({ page: String(nextPage) });
      if (status) params.set("status", status);
      if (query.trim()) params.set("q", query.trim());
      const response = await fetch(`${basePath}/api/admin/contact?${params}`, { credentials: "include", cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to load contact messages.");
      setItems(data.submissions); setTotal(data.total); setPage(nextPage); setLoaded(true);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load contact messages."); }
    finally { setLoading(false); }
  }
  async function update(id, nextStatus) {
    try {
      const response = await fetch(`${basePath}/api/admin/contact`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: nextStatus }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to update message.");
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update message."); }
  }
  return <section className="mt-10 space-y-4 border-t border-slate-200 pt-8"><div><p className="text-sm font-semibold text-teal-800">PRIVATE SUPPORT INBOX</p><h2 className="mt-1 text-2xl font-bold text-slate-950">Contact messages</h2><p className="mt-1 text-sm text-slate-600">Only administrators can view message content. Status changes are recorded in the audit log.</p></div>
    <div className="flex flex-col gap-3 sm:flex-row"><form onSubmit={(event) => { event.preventDefault(); load(1); }} className="flex min-w-0 flex-1 gap-2"><label className="sr-only" htmlFor="contact-search">Search contact messages</label><input id="contact-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reference, sender, subject" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20" /><button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Search</button></form><label className="sr-only" htmlFor="contact-status-filter">Filter contact messages by status</label><select id="contact-status-filter" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"><option value="">All statuses</option>{Object.entries(labels).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></div>
    {message && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{message}</p>}{loading ? <p className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">Loading submissions…</p> : items.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">{loaded ? "No matching contact messages." : "Use search or a status filter to load messages."}</p> : <div className="space-y-3">{items.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold text-teal-800">{item.reference} · {item.category.toLowerCase().replaceAll("_", " ")}</p><h3 className="mt-1 font-semibold text-slate-950">{item.subject}</h3><p className="mt-1 text-sm text-slate-600">{item.name} · <a className="underline" href={`mailto:${encodeURIComponent(item.email)}`}>{item.email}</a>{item.phone ? ` · ${item.phone}` : ""}</p></div><select aria-label={`Status for ${item.reference}`} value={item.status} onChange={(event) => update(item.id, event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">{Object.entries(labels).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></div><p className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{item.message}</p><p className="mt-3 text-xs text-slate-500">Received {new Date(item.createdAt).toLocaleString()}</p></article>)}</div>}
    {!loading && total > 20 && <div className="flex items-center justify-between text-sm"><span className="text-slate-600">{total} submissions</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => load(page - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-50">Previous</button><button disabled={page * 20 >= total} onClick={() => load(page + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-50">Next</button></div></div>}
  </section>;
}
