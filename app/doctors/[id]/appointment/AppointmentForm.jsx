"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  addCalendarDays,
  dateKeyInTimeZone,
  getDayAvailability,
  getMonthCalendarDays,
  getSlotsForDate,
  isBookableSlot,
} from "@/lib/availability-calendar";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/appointment-app";
const fallbackTimeZone = "Asia/Amman";
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(value, timeZone) {
  return new Intl.DateTimeFormat(undefined, { timeZone, hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function formatDay(value) {
  return new Intl.DateTimeFormat(undefined, { timeZone: "UTC", dateStyle: "full" }).format(new Date(`${value}T12:00:00.000Z`));
}

function formatMonth(value) {
  return new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}-01T00:00:00.000Z`));
}

function nextMonth(value, amount) {
  const [year, month] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1 + amount, 1)).toISOString().slice(0, 7);
}

async function readAvailability(doctorSlug, from, to) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const query = params.size ? `?${params}` : "";
  const response = await fetch(`${basePath}/api/doctors/${encodeURIComponent(doctorSlug)}/slots${query}`, { cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Could not load this doctor's appointment times.");
  return result;
}

export default function AppointmentForm({ doctorSlug }) {
  const [doctor, setDoctor] = useState(null);
  const [month, setMonth] = useState("");
  const [clinicToday, setClinicToday] = useState("");
  const [calendarSlots, setCalendarSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [daySlots, setDaySlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [type, setType] = useState("IN_PERSON");
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [loadingDay, setLoadingDay] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [step, setStep] = useState("selection");

  const timeZone = doctor?.timeZone ?? fallbackTimeZone;
  const consultationModes = doctor?.consultationModes ?? "IN_PERSON";
  const supportsVideo = consultationModes.split(",").map((mode) => mode.trim()).includes("VIDEO");
  const supportsInPerson = consultationModes.split(",").map((mode) => mode.trim()).includes("IN_PERSON");
  const monthDays = useMemo(() => month ? getMonthCalendarDays(`${month}-01`) : [], [month]);
  const selectedSlot = daySlots.find((slot) => slot.id === selectedSlotId && slot.isBookable && slot.status === "OPEN");
  const selectedDaySummary = selectedDate ? getDayAvailability(calendarSlots, selectedDate, timeZone) : null;

  const loadSelectedDay = useCallback(async (date) => {
    setSelectedDate(date);
    setSelectedSlotId("");
    setAppointment(null);
    setPatientProfile(null);
    setStep("selection");
    setError("");
    setLoadingDay(true);
    try {
      const result = await readAvailability(doctorSlug, date, addCalendarDays(date, 1));
      setDaySlots(getSlotsForDate(result.slots ?? [], date, result.doctor.timeZone, Date.now()));
    } catch (loadError) {
      setDaySlots([]);
      setError(loadError instanceof Error ? loadError.message : "Could not load this day's appointment times.");
    } finally {
      setLoadingDay(false);
    }
  }, [doctorSlug]);

  useEffect(() => {
    let active = true;
    async function loadInitialAvailability() {
      setLoadingCalendar(true);
      setError("");
      try {
        const result = await readAvailability(doctorSlug);
        if (!active) return;
        const zone = result.doctor.timeZone || fallbackTimeZone;
        const today = dateKeyInTimeZone(new Date(), zone);
        const initialSlots = result.slots ?? [];
        const firstOpenSlot = initialSlots.find((slot) => isBookableSlot(slot));
        const initialDate = firstOpenSlot?.date ?? today;
        setDoctor(result.doctor);
        setClinicToday(today);
        setMonth(initialDate.slice(0, 7));
        setCalendarSlots(initialSlots);
        setSelectedDate(initialDate);
        setDaySlots(getSlotsForDate(initialSlots, initialDate, zone, Date.now()));
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load appointment availability.");
      } finally {
        if (active) setLoadingCalendar(false);
      }
    }
    loadInitialAvailability();
    return () => { active = false; };
  }, [doctorSlug]);

  async function changeMonth(amount) {
    if (!month) return;
    const targetMonth = nextMonth(month, amount);
    const firstDay = `${targetMonth}-01`;
    const [year, monthNumber] = targetMonth.split("-").map(Number);
    const nextMonthStart = new Date(Date.UTC(year, monthNumber, 1)).toISOString().slice(0, 10);
    setMonth(targetMonth);
    setError("");
    setLoadingCalendar(true);
    try {
      const result = await readAvailability(doctorSlug, firstDay, nextMonthStart);
      const resultSlots = result.slots ?? [];
      setCalendarSlots(resultSlots);
      const firstBookable = resultSlots.find((slot) => isBookableSlot(slot));
      const focusDate = firstBookable?.date ?? (firstDay < clinicToday ? clinicToday : firstDay);
      setSelectedDate(focusDate);
      setDaySlots(getSlotsForDate(resultSlots, focusDate, result.doctor.timeZone, Date.now()));
      setSelectedSlotId("");
      setAppointment(null);
      setPatientProfile(null);
      setStep("selection");
    } catch (loadError) {
      setCalendarSlots([]);
      setDaySlots([]);
      setError(loadError instanceof Error ? loadError.message : "Could not load this month's appointment times.");
    } finally {
      setLoadingCalendar(false);
    }
  }

  async function handleReview() {
    setError("");
    if (!selectedSlot || !selectedDate || !["IN_PERSON", "VIDEO"].includes(type)) {
      setError("Choose an available day, time, and appointment type.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${basePath}/api/me`, { credentials: "include", cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(response.status === 401 ? "Sign in with a patient account to continue." : result.error ?? "Could not load your patient profile.");
      if (result.profile?.role !== "PATIENT") throw new Error("Appointment requests require a patient account.");
      setPatientProfile(result.profile);
      setStep("review");
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Could not load your patient profile.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setAppointment(null);
    if (!selectedSlot || !selectedDate || !patientProfile || step !== "review" || !["IN_PERSON", "VIDEO"].includes(type)) {
      setError("Review your patient details and select an available appointment before confirming.");
      setStep("selection");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${basePath}/api/appointments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorSlug, slotId: selectedSlot.id, type }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "The appointment could not be saved.");
      setAppointment(result.appointment);
      setSelectedSlotId("");
      setStep("selection");
      setDaySlots((slots) => slots.map((slot) => slot.id === selectedSlot.id ? { ...slot, status: "BOOKED", isBookable: false } : slot));
      setCalendarSlots((slots) => slots.map((slot) => slot.id === selectedSlot.id ? { ...slot, status: "BOOKED", isBookable: false } : slot));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "The appointment could not be saved.");
      if (selectedDate) {
        try {
          const result = await readAvailability(doctorSlug, selectedDate, addCalendarDays(selectedDate, 1));
          setDaySlots(getSlotsForDate(result.slots ?? [], selectedDate, result.doctor.timeZone));
          setCalendarSlots((current) => {
            const otherDates = current.filter((slot) => slot.date !== selectedDate);
            return [...otherDates, ...(result.slots ?? [])];
          });
        } catch {
          // Keep the booking error visible; the server remains authoritative.
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return <div className="mt-8 space-y-6">
    {loadingCalendar && <p role="status" className="rounded-xl bg-[#EEF2EB] p-4 text-sm text-blue-900">Loading the clinic calendar…</p>}
    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">{error}{error.toLowerCase().includes("sign in") && <> <Link href="/login" className="font-semibold underline">Sign in</Link> or <Link href="/register" className="font-semibold underline">create an account</Link>.</>}</p>}
    {appointment && <div role="status" aria-live="polite" className="rounded-xl border border-green-200 bg-green-50 p-5 text-sm leading-6 text-green-950"><p className="font-bold">Appointment request saved</p><p>Request ID: {appointment.id}</p><p>{appointment.doctor.displayName} · {new Intl.DateTimeFormat(undefined, { timeZone: appointment.slot.timeZone ?? timeZone, dateStyle: "full", timeStyle: "short" }).format(new Date(appointment.slot.startsAt))}</p><p>Status: {appointment.status.toLowerCase()}. The clinic must confirm this request.</p><Link href="/dashboard" className="mt-2 inline-block font-semibold underline">View your appointments</Link></div>}

    {doctor && <>
      <section aria-labelledby="calendar-heading" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="calendar-heading" className="text-lg font-bold text-slate-900">Choose an available day</h2>
            <p className="mt-1 text-xs text-slate-500">Times shown in {timeZone}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Previous month" disabled={!month || nextMonth(month, -1) < clinicToday.slice(0, 7) || loadingCalendar} onClick={() => changeMonth(-1)} className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">‹</button>
            <p className="min-w-32 text-center text-sm font-semibold text-slate-800">{month ? formatMonth(month) : "Calendar"}</p>
            <button type="button" aria-label="Next month" disabled={!month || loadingCalendar} onClick={() => changeMonth(1)} className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">›</button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 sm:gap-2">
          {weekdays.map((day) => <span key={day} className="py-2">{day}</span>)}
          {monthDays.map(({ date, day, inMonth }) => {
            const summary = getDayAvailability(calendarSlots, date, timeZone);
            const disabled = !inMonth || date < clinicToday || summary.available === 0 || loadingCalendar;
            const selected = selectedDate === date;
            return <button key={date} type="button" disabled={disabled} aria-pressed={selected} aria-label={`${formatDay(date)}${summary.available ? `, ${summary.available} available times` : ", no bookable times"}`} onClick={() => loadSelectedDay(date)} className={`min-h-14 rounded-xl border p-1 text-sm transition sm:min-h-16 ${selected ? "border-blue-700 bg-[#EEF2EB] text-blue-900 ring-2 ring-blue-100" : "border-transparent text-slate-800"} ${disabled ? "cursor-not-allowed bg-slate-50 text-slate-300" : "hover:border-[#D6C5A7] hover:bg-[#EEF2EB]"}`}>
              <span className="block font-semibold">{day}</span>
              {inMonth && summary.available > 0 && <span className="mt-1 block text-[10px] leading-3 text-[#344B72]">{summary.available} open</span>}
              {inMonth && summary.available === 0 && summary.booked > 0 && <span className="mt-1 block text-[10px] leading-3 text-slate-400">Booked</span>}
              {inMonth && summary.available === 0 && summary.unavailable > 0 && <span className="mt-1 block text-[10px] leading-3 text-slate-400">Unavailable</span>}
              {inMonth && summary.available === 0 && summary.past > 0 && date >= clinicToday && <span className="mt-1 block text-[10px] leading-3 text-slate-400">Past times</span>}
            </button>;
          })}
        </div>
        {!loadingCalendar && calendarSlots.length === 0 && <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">No appointment times are published for this period. Please check another month or contact the clinic.</p>}
      </section>

      {selectedDate && <section aria-labelledby="times-heading" className="space-y-4">
        <div>
          <h2 id="times-heading" className="text-lg font-bold text-slate-900">Available times</h2>
          <p className="mt-1 text-sm text-slate-600">{formatDay(selectedDate)}</p>
        </div>
        {loadingDay && <p role="status" className="rounded-xl bg-[#EEF2EB] p-4 text-sm text-blue-900">Refreshing this day&apos;s times…</p>}
        {!loadingDay && daySlots.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">No appointment times are available for this day.</p>}
        {daySlots.length > 0 && <fieldset>
          <legend className="sr-only">Select an appointment time</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {daySlots.map((slot) => {
              const bookable = slot.isBookable === true && slot.status === "OPEN";
              const selected = selectedSlotId === slot.id;
              const status = slot.isPast ? "Past" : slot.status === "BOOKED" ? "Booked" : slot.status === "BLOCKED" ? "Unavailable" : "Available";
              return <label key={slot.id} className={`rounded-xl border px-3 py-3 text-center transition ${bookable ? "cursor-pointer" : "cursor-not-allowed bg-slate-50 text-slate-400"} ${selected ? "border-blue-700 bg-[#EEF2EB] text-[#263F3A] ring-2 ring-blue-100" : "border-slate-200 text-slate-700 hover:border-[#D6C5A7]"}`}>
                <input className="sr-only" type="radio" name="appointment-slot" value={slot.id} disabled={!bookable || loadingDay} checked={selected} onChange={() => { setSelectedSlotId(slot.id); setPatientProfile(null); setStep("selection"); }} />
                <span className="block text-sm font-semibold">{formatTime(slot.startsAt, slot.timeZone ?? timeZone)}</span>
                {!bookable && <span className="mt-1 block text-xs">{status}</span>}
              </label>;
            })}
          </div>
        </fieldset>}
        {selectedDaySummary && selectedDaySummary.available > 0 && <p className="text-xs text-slate-500" aria-live="polite">{selectedDaySummary.available} times currently open. Availability is checked again when you submit.</p>}
      </section>}

      {step === "selection" && daySlots.some((slot) => slot.isBookable === true && slot.status === "OPEN") && <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div><label htmlFor="appointment-type" className="mb-2 block text-sm font-semibold text-slate-700">Appointment type</label><select id="appointment-type" value={type} onChange={(event) => setType(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 focus:border-[#344B72] focus:outline-none">{supportsInPerson && <option value="IN_PERSON">In person</option>}{supportsVideo && <option value="VIDEO">Video consultation</option>}</select></div>
        {!selectedSlot && <p className="text-sm text-slate-500">Select an available time to continue.</p>}
        <button type="button" onClick={handleReview} disabled={submitting || loadingDay || !selectedSlot} className="w-full rounded-xl bg-[#263F3A] py-3.5 font-bold text-white transition hover:bg-[#1D302D] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Loading your details…" : "Review appointment"}</button>
        <p className="text-xs leading-5 text-slate-500">Booking requires a patient account. The clinic confirms each appointment request.</p>
      </div>}

      {step === "review" && patientProfile && selectedSlot && <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div><p className="text-xs font-bold uppercase tracking-wide text-teal-800">Final review</p><h2 className="mt-1 text-xl font-bold text-slate-950">Confirm your appointment request</h2><p className="mt-1 text-sm leading-6 text-slate-600">Review the patient and appointment details before sending the request to the clinic.</p></div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Patient</dt><dd className="mt-1 font-semibold text-slate-900">{patientProfile.name}</dd><dd className="text-sm text-slate-600">{patientProfile.email}</dd>{patientProfile.phone && <dd className="mt-1 text-sm text-slate-600">{patientProfile.phone}</dd>}</div>
          <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Doctor</dt><dd className="mt-1 font-semibold text-slate-900">{doctor.displayName}</dd></div>
          <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date and time</dt><dd className="mt-1 font-semibold text-slate-900">{new Intl.DateTimeFormat(undefined, { timeZone: selectedSlot.timeZone ?? timeZone, dateStyle: "full", timeStyle: "short" }).format(new Date(selectedSlot.startsAt))}</dd><dd className="text-sm text-slate-600">{selectedSlot.timeZone ?? timeZone}</dd></div>
          <div className="rounded-xl bg-slate-50 p-4"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Appointment type</dt><dd className="mt-1 font-semibold text-slate-900">{type === "VIDEO" ? "Video consultation" : "In person"}</dd></div>
        </dl>
        <p className="text-xs leading-5 text-slate-500">These details come from your patient account. Update your name or phone in your dashboard before booking if they need correction.</p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row"><button type="button" onClick={() => setStep("selection")} disabled={submitting} className="min-h-12 flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Change selection</button><button type="submit" disabled={submitting || loadingDay || !selectedSlot.isBookable} className="min-h-12 flex-1 rounded-xl bg-[#263F3A] px-4 py-3 font-bold text-white transition hover:bg-[#1D302D] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Saving appointment…" : "Confirm appointment"}</button></div>
      </form>}
    </>}
  </div>;
}
