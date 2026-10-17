"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/appointment-app";

function formatDate(value, timeZone) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short", timeZone }).format(new Date(value));
}

export default function DashboardClient({ role, appointments, profile }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pendingId, setPendingId] = useState("");
  const [slotLists, setSlotLists] = useState({});
  const [profileDraft, setProfileDraft] = useState(profile ?? { name: "", email: "", phone: "" });

  async function updateAppointment(id, body) {
    setPendingId(id);
    setMessage("");
    try {
      const response = await fetch(`${basePath}/api/appointments/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to update this appointment.");
      setMessage("Appointment updated.");
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update this appointment."); }
    finally { setPendingId(""); }
  }

  async function showSlots(appointment) {
    setPendingId(appointment.id);
    try {
      const response = await fetch(`${basePath}/api/doctors/${encodeURIComponent(appointment.doctor.slug)}/slots`, { credentials: "include", cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to load appointment availability.");
      setSlotLists((value) => ({ ...value, [appointment.id]: result.slots ?? [] }));
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to load availability."); }
    finally { setPendingId(""); }
  }

  async function updateProfile(event) {
    event.preventDefault();
    setMessage("");
    try {
      const response = await fetch(`${basePath}/api/me`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ name: profileDraft.name, phone: profileDraft.phone }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to update profile.");
      setMessage(result.message);
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update profile."); }
  }

  async function signOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return <div className="space-y-8">
    {message && <p role="status" aria-live="polite" className="rounded-xl border border-blue-100 bg-[#EEF2EB] p-4 text-sm text-blue-900">{message}</p>}
    <section className="space-y-4">
      <div><h2 className="text-xl font-bold text-slate-900">{role === "PATIENT" ? "Your appointments" : role === "DOCTOR" ? "Clinic schedule" : "All appointments"}</h2><p className="mt-1 text-sm text-slate-600">Appointments and availability are shown in the clinic’s local time zone.</p></div>
      {appointments.length === 0 ? <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">No appointments are recorded yet.</p> : <div className="space-y-3">{appointments.map((appointment) => <article key={appointment.id} className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><h3 className="font-semibold text-slate-900">{appointment.doctor.displayName}</h3><p className="mt-1 text-sm text-slate-600">{appointment.doctor.specialty.name} · {formatDate(appointment.slot.startsAt, appointment.slot.timeZone)}</p><p className="mt-1 text-sm text-slate-600">{appointment.type.replace("_", " ")} · <span className="font-medium">{appointment.status.toLowerCase()}</span></p>{appointment.patient && <p className="mt-1 text-sm text-slate-600">Patient: {appointment.patient.user.name} · {appointment.patient.user.email}</p>}</div>
        <div className="flex flex-wrap gap-2">
          {role === "PATIENT" && ["PENDING", "CONFIRMED"].includes(appointment.status) && <button disabled={pendingId === appointment.id} onClick={() => updateAppointment(appointment.id, { status: "CANCELLED" })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>}
          {role === "PATIENT" && ["PENDING", "CONFIRMED"].includes(appointment.status) && <button disabled={pendingId === appointment.id} onClick={() => showSlots(appointment)} className="rounded-lg border border-[#D6C5A7] px-3 py-2 text-sm font-semibold text-[#344B72] hover:bg-[#EEF2EB] disabled:opacity-50">Find another time</button>}
          {role === "DOCTOR" && appointment.status === "PENDING" && <button disabled={pendingId === appointment.id} onClick={() => updateAppointment(appointment.id, { status: "CONFIRMED" })} className="rounded-lg bg-[#263F3A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1D302D] disabled:opacity-50">Confirm</button>}
          {role === "DOCTOR" && appointment.status === "CONFIRMED" && new Date(appointment.slot.startsAt) <= new Date() && <button disabled={pendingId === appointment.id} onClick={() => updateAppointment(appointment.id, { status: "COMPLETED" })} className="rounded-lg bg-[#263F3A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1D302D] disabled:opacity-50">Mark complete</button>}
        </div></div>
        {slotLists[appointment.id] && <div className="mt-4 border-t border-slate-100 pt-4"><p className="text-sm font-semibold text-slate-800">Choose a new available time</p>{slotLists[appointment.id].length ? <div className="mt-2 flex flex-wrap gap-2">{slotLists[appointment.id].map((slot) => <button key={slot.id} onClick={() => updateAppointment(appointment.id, { slotId: slot.id })} disabled={pendingId === appointment.id} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-[#B7C9B0] hover:text-[#344B72] disabled:opacity-50">{formatDate(slot.startsAt, slot.timeZone)}</button>)}</div> : <p className="mt-2 text-sm text-slate-500">No open slots are listed for the next 31 days.</p>}</div>}
      </article>)}</div>}
    </section>
    {role === "PATIENT" && <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold text-slate-900">Profile</h2><form onSubmit={updateProfile} className="mt-4 grid gap-4 sm:grid-cols-2"><div><label htmlFor="profile-name" className="mb-1 block text-sm font-medium text-slate-700">Name</label><input id="profile-name" required maxLength={120} value={profileDraft.name} onChange={(event) => setProfileDraft({ ...profileDraft, name: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2" /></div><div><label htmlFor="profile-email" className="mb-1 block text-sm font-medium text-slate-700">Email</label><input id="profile-email" value={profileDraft.email} disabled className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500" /></div><div><label htmlFor="profile-phone" className="mb-1 block text-sm font-medium text-slate-700">Phone (optional)</label><input id="profile-phone" type="tel" maxLength={32} value={profileDraft.phone} onChange={(event) => setProfileDraft({ ...profileDraft, phone: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2" /></div><div className="flex items-end"><button className="rounded-lg bg-[#263F3A] px-4 py-2 font-semibold text-white hover:bg-[#1D302D]">Save profile</button></div></form></section>}
    <button onClick={signOut} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Sign out</button>
  </div>;
}
