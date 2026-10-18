"use client";

import { useEffect, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DoctorScheduleManager({ doctor }) {
  const [availability, setAvailability] = useState({ weekday: "1", startTime: "09:00", endTime: "17:00", slotMinutes: "30", timeZone: doctor.timeZone || "Asia/Amman" });
  const [schedule, setSchedule] = useState([]);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function readSchedule() {
    const response = await fetch(`${basePath}/api/admin/doctors/${encodeURIComponent(doctor.slug)}/availability`, { credentials: "include", cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "Unable to load your schedule.");
    setSchedule(result.availabilities ?? []);
  }

  useEffect(() => {
    let active = true;
    fetch(`${basePath}/api/admin/doctors/${encodeURIComponent(doctor.slug)}/availability`, { credentials: "include", cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Unable to load your schedule.");
        if (active) setSchedule(result.availabilities ?? []);
      })
      .catch((error) => { if (active) setMessage(error instanceof Error ? error.message : "Unable to load your schedule."); });
    return () => { active = false; };
  }, [doctor.slug]);

  async function submit(event, path, body, success) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const response = await fetch(`${basePath}${path}`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "The request could not be completed.");
      setMessage(success(result));
      await readSchedule();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The request could not be completed.");
    } finally {
      setPending(false);
    }
  }

  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div><p className="text-sm font-semibold text-teal-800">SCHEDULE & AVAILABILITY</p><h2 className="mt-1 text-xl font-bold text-slate-950">Manage your appointment hours</h2><p className="mt-2 text-sm leading-6 text-slate-600">Set weekly working windows, then publish real appointment slots for a date range. Dates and times use your clinic time zone: {doctor.timeZone || "Asia/Amman"}.</p></div>
    {message && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-teal-50 p-3 text-sm text-teal-950">{message}</p>}
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <form onSubmit={(event) => submit(event, `/api/admin/doctors/${encodeURIComponent(doctor.slug)}/availability`, { ...availability, weekday: Number(availability.weekday), slotMinutes: Number(availability.slotMinutes) }, () => "Weekly hours saved.")} className="space-y-3 rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-900">Add weekly working hours</h3>
        <label className="block text-sm text-slate-700">Day<select value={availability.weekday} onChange={(event) => setAvailability({ ...availability, weekday: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">{weekdays.map((day, index) => <option key={day} value={index}>{day}</option>)}</select></label>
        <div className="grid grid-cols-2 gap-3"><label className="block text-sm text-slate-700">Start<input required type="time" value={availability.startTime} onChange={(event) => setAvailability({ ...availability, startTime: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><label className="block text-sm text-slate-700">End<input required type="time" value={availability.endTime} onChange={(event) => setAvailability({ ...availability, endTime: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label></div>
        <label className="block text-sm text-slate-700">Appointment length<select value={availability.slotMinutes} onChange={(event) => setAvailability({ ...availability, slotMinutes: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2">{[15, 20, 30, 45, 60, 90, 120].map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes</option>)}</select></label>
        <button disabled={pending} className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Save weekly hours</button>
      </form>
      <form onSubmit={(event) => submit(event, `/api/admin/doctors/${encodeURIComponent(doctor.slug)}/generate-slots`, dateRange, (result) => `${result.created ?? 0} bookable appointment slots published.`)} className="space-y-3 rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-900">Publish appointment slots</h3>
        <p className="text-sm leading-6 text-slate-600">Generates future appointment times from your active weekly hours. Each range can cover up to 32 calendar days.</p>
        <label className="block text-sm text-slate-700">From clinic date<input required type="date" value={dateRange.from} onChange={(event) => setDateRange({ ...dateRange, from: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="block text-sm text-slate-700">Through clinic date<input required type="date" value={dateRange.to} onChange={(event) => setDateRange({ ...dateRange, to: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <button disabled={pending || schedule.filter((entry) => entry.isActive).length === 0} className="rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Generate available times</button>
      </form>
    </div>
    <div className="mt-6"><h3 className="font-semibold text-slate-900">Current weekly hours</h3>{schedule.length ? <ul className="mt-3 grid gap-3 sm:grid-cols-2">{schedule.map((item) => <li key={item.id} className={`rounded-xl border p-4 text-sm ${item.isActive ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-slate-100 text-slate-500"}`}><p className="font-semibold">{weekdays[item.weekday]} · {item.startTime}–{item.endTime}</p><p className="mt-1">{item.slotMinutes}-minute appointments · {item.timeZone}</p><p className="mt-1 text-xs">{item.isActive ? "Active weekly hours" : "Inactive"}</p></li>)}</ul> : <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No weekly hours have been published yet.</p>}</div>
    <p className="mt-5 text-xs leading-5 text-slate-500">Break periods and date-specific leave are not configured in this release. Add those before relying on this schedule for a clinic with breaks or planned closures.</p>
  </section>;
}
