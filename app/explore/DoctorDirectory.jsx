
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DoctorPortrait from "@/app/_component/DoctorPortrait";

export default function DoctorDirectory({ doctors, initialSpecialty = "" }) {
  const [directory, setDirectory] = useState(doctors.map((doctor) => ({ ...doctor, isDemo: true })));
  const [loadingDirectory, setLoadingDirectory] = useState(true);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))].sort();
  useEffect(() => {
    let active = true;
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? "/appointment-app"}/api/doctors`, { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : null)
      .then((result) => {
        if (!active || !result?.doctors?.length) return;
        setDirectory(result.doctors.map((doctor) => ({
          id: doctor.slug,
          name: doctor.displayName,
          specialty: doctor.specialty.name,
          image: doctor.imageUrl,
          summary: doctor.biography,
          experienceYears: doctor.experienceYears ? `${doctor.experienceYears}+` : "Not listed",
          isDemo: false,
        })));
      })
      .catch(() => {})
      .finally(() => { if (active) setLoadingDirectory(false); });
    return () => { active = false; };
  }, [doctors]);
  const directorySpecialties = [...new Set(directory.map((doctor) => doctor.specialty))].sort();
  const filtered = directory.filter((doctor) => {
    const searchMatches = !query.trim() || `${doctor.name} ${doctor.specialty} ${doctor.summary}`.toLowerCase().includes(query.trim().toLowerCase());
    return searchMatches && (!specialty || doctor.specialty === specialty);
  });

  return <>
    <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_14rem]">
      <label className="sr-only" htmlFor="doctor-search">Search doctors or specialties</label>
      <input id="doctor-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search doctor or specialty" className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-[#344B72] focus:ring-2 focus:ring-[#DCE6DA]" />
      <label className="sr-only" htmlFor="specialty-filter">Filter by specialty</label>
      <select id="specialty-filter" value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#344B72] focus:ring-2 focus:ring-[#DCE6DA]">
        <option value="">All specialties</option>
        {(directory.length && !directory[0].isDemo ? directorySpecialties : specialties).map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </div>
    <p className="mt-4 text-sm text-slate-500" aria-live="polite">{loadingDirectory && directory[0]?.isDemo ? "Checking the clinic directory… " : ""}{filtered.length} {filtered.length === 1 ? "profile" : "profiles"} shown</p>
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((doctor) => <article key={doctor.id} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative mx-auto flex h-64 w-full items-center justify-center overflow-hidden rounded-xl bg-[#EEF2EB]"><DoctorPortrait src={doctor.image} alt={`${doctor.name} portrait`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /></div>
        {doctor.isDemo && <span className="mt-4 inline-flex rounded-full bg-[#F3E8D5] px-3 py-1 text-xs font-semibold text-[#684B37]">Sample profile</span>}
        <h2 className="mt-3 text-xl font-bold text-slate-900">{doctor.name}</h2>
        <p className="mt-2 text-[#344B72]">{doctor.specialty}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{doctor.summary}</p>
        <p className="mt-2 text-xs text-slate-500">{doctor.isDemo ? "Illustrative profile information" : doctor.experienceYears !== "Not listed" ? `${doctor.experienceYears} years of experience listed` : "Experience not listed"}</p>
        <div className="mt-5 flex gap-3">
          <Link href={`/doctors/${doctor.id}`} className="flex-1 rounded-lg bg-[#263F3A] px-3 py-3 text-sm font-semibold text-white hover:bg-[#1D302D]">View profile</Link>
          <Link href={`/doctors/${doctor.id}/appointment`} className="flex-1 rounded-lg border border-[#D6C5A7] px-3 py-3 text-sm font-semibold text-[#344B72] hover:bg-[#EEF2EB]">Request time</Link>
        </div>
      </article>)}
      {filtered.length === 0 && <p className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">No profiles match those filters. Try another search or specialty.</p>}
    </div>
  </>;
}
