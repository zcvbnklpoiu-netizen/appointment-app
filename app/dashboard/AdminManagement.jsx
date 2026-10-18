"use client";

import { useEffect, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

async function send(path, body) {
  const response = await fetch(`${basePath}${path}`, { method: body ? "POST" : "GET", credentials: "include", headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "The request could not be completed.");
  return result;
}

export default function AdminManagement() {
  const [specialties, setSpecialties] = useState([]);
  const [message, setMessage] = useState("");
  const [doctorSlug, setDoctorSlug] = useState("");
  const [specialty, setSpecialty] = useState({ name: "", slug: "", description: "" });
  const [doctor, setDoctor] = useState({ displayName: "", slug: "", specialtyId: "", experienceYears: "", university: "", qualifications: "", biography: "", clinicName: "", location: "", consultationModes: "IN_PERSON,VIDEO", timeZone: "Asia/Amman", imageUrl: "" });
  const [availability, setAvailability] = useState({ weekday: "1", startTime: "09:00", endTime: "17:00", slotMinutes: "30", timeZone: "Asia/Amman" });
  const [slotDates, setSlotDates] = useState({ from: "", to: "" });
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`${basePath}/api/specialties`, { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Unable to load specialties.");
        return result;
      })
      .then((result) => { if (active) setSpecialties(result.specialties); })
      .catch((error) => { if (active) setMessage(error instanceof Error ? error.message : "Unable to load specialties."); });
    return () => { active = false; };
  }, []);

  async function run(label, operation) {
    setPending(true); setMessage("");
    try { const result = await operation(); setMessage(`${label}${result.created !== undefined ? ` (${result.created} slots)` : ""} completed.`); }
    catch (error) { setMessage(error instanceof Error ? error.message : "The request could not be completed."); }
    finally { setPending(false); }
  }

  function bind(field, state, setState, type = "text") {
    return <input aria-label={field} type={type} value={state[field]} onChange={(event) => setState({ ...state, [field]: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />;
  }

  return <section className="space-y-5 border-t border-slate-200 pt-8"><div><p className="text-sm font-semibold text-[#344B72]">Clinic admin</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Manage the directory and schedules</h2><p className="mt-2 text-sm text-slate-600">Changes are saved directly to the clinic database. New profiles and availability are not added to the sample directory until saved here.</p></div>
    {message && <p role="status" aria-live="polite" className="rounded-xl border border-blue-100 bg-[#EEF2EB] p-4 text-sm text-blue-900">{message}</p>}
    <div className="grid gap-5 lg:grid-cols-2">
      <form onSubmit={(event) => { event.preventDefault(); run("Specialty saved", async () => { const result = await send("/api/admin/specialties", specialty); setSpecialties((items) => [...items, result.specialty]); setSpecialty({ name: "", slug: "", description: "" }); return result; }); }} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold text-slate-900">Add specialty</h3>{bind("name", specialty, setSpecialty)}{bind("slug", specialty, setSpecialty)}{bind("description", specialty, setSpecialty)}<button disabled={pending} className="rounded-lg bg-[#263F3A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Save specialty</button></form>
      <form onSubmit={(event) => { event.preventDefault(); run("Doctor profile saved", async () => { const result = await send("/api/admin/doctors", { ...doctor, experienceYears: Number(doctor.experienceYears || 0) }); setDoctorSlug(result.doctor.slug); setDoctor({ ...doctor, displayName: "", slug: "", experienceYears: "", university: "", biography: "", qualifications: "", location: "", clinicName: "", imageUrl: "" }); return result; }); }} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold text-slate-900">Add doctor</h3>{bind("displayName", doctor, setDoctor)}{bind("slug", doctor, setDoctor)}<label className="block text-xs font-medium text-slate-600">Specialty<select required value={doctor.specialtyId} onChange={(event) => setDoctor({ ...doctor, specialtyId: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="">Select specialty</option>{specialties.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>{bind("experienceYears", doctor, setDoctor, "number")}{bind("university", doctor, setDoctor)}{bind("qualifications", doctor, setDoctor)}{bind("biography", doctor, setDoctor)}{bind("clinicName", doctor, setDoctor)}{bind("location", doctor, setDoctor)}<label className="block text-xs font-medium text-slate-600">Consultation modes<select value={doctor.consultationModes} onChange={(event) => setDoctor({ ...doctor, consultationModes: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="IN_PERSON">In person</option><option value="VIDEO">Video</option><option value="IN_PERSON,VIDEO">In person and video</option></select></label>{bind("timeZone", doctor, setDoctor)}{bind("imageUrl", doctor, setDoctor)}<button disabled={pending || !specialties.length} className="rounded-lg bg-[#263F3A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Save doctor</button></form>
      <form onSubmit={(event) => { event.preventDefault(); run("Weekly availability saved", () => send(`/api/admin/doctors/${encodeURIComponent(doctorSlug)}/availability`, { ...availability, weekday: Number(availability.weekday), slotMinutes: Number(availability.slotMinutes) })); }} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold text-slate-900">Publish weekly hours</h3><label className="block text-xs font-medium text-slate-600">Doctor slug<input required value={doctorSlug} onChange={(event) => setDoctorSlug(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label><label className="block text-xs font-medium text-slate-600">Weekday<select value={availability.weekday} onChange={(event) => setAvailability({ ...availability, weekday: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">{weekdays.map((day, index) => <option key={day} value={index}>{day}</option>)}</select></label>{bind("startTime", availability, setAvailability, "time")}{bind("endTime", availability, setAvailability, "time")}<label className="block text-xs font-medium text-slate-600">Minutes per appointment<select value={availability.slotMinutes} onChange={(event) => setAvailability({ ...availability, slotMinutes: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">{[15, 20, 30, 45, 60, 90, 120].map((minutes) => <option key={minutes}>{minutes}</option>)}</select></label>{bind("timeZone", availability, setAvailability)}<button disabled={pending || !doctorSlug} className="rounded-lg bg-[#263F3A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Save weekly hours</button></form>
      <form onSubmit={(event) => { event.preventDefault(); run("Available slots generated", () => send(`/api/admin/doctors/${encodeURIComponent(doctorSlug)}/generate-slots`, slotDates)); }} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold text-slate-900">Generate bookable times</h3><p className="text-sm text-slate-600">Turns the doctor’s published weekly hours into actual appointment slots.</p><label className="block text-xs font-medium text-slate-600">From<input type="date" required value={slotDates.from} onChange={(event) => setSlotDates({ ...slotDates, from: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label><label className="block text-xs font-medium text-slate-600">Through<input type="date" required value={slotDates.to} onChange={(event) => setSlotDates({ ...slotDates, to: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" /></label><button disabled={pending || !doctorSlug} className="rounded-lg bg-[#263F3A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Generate slots</button></form>
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold text-slate-900">Link a doctor account</h3><p className="text-sm text-slate-600">The clinician first registers a patient account. Search the exact email, then link it to the doctor profile.</p><form onSubmit={(event) => { event.preventDefault(); run("Account found", async () => { const result = await send(`/api/admin/doctor-candidates?email=${encodeURIComponent(candidateEmail)}`); setCandidate(result.user); return result; }); }} className="flex gap-2"><input required type="email" value={candidateEmail} onChange={(event) => setCandidateEmail(event.target.value)} placeholder="doctor@example.com" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm" /><button disabled={pending} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">Find</button></form>{candidate && <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"><p className="text-sm text-slate-700">{candidate.name} · {candidate.email}</p><button disabled={pending || !doctorSlug} onClick={() => run("Doctor account linked", () => send(`/api/admin/doctors/${encodeURIComponent(doctorSlug)}/link-user`, { userId: candidate.id }))} className="rounded-lg bg-[#263F3A] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Link to {doctorSlug || "doctor slug"}</button></div>}</div>
    </div>
  </section>;
}
