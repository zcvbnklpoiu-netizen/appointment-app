"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doctors as sampleDoctors } from "@/lib/doctor-data";
import DoctorPortrait from "@/app/_component/DoctorPortrait";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/appointment-app";

export default function Doctors({ limit, doctorList = sampleDoctors }) {
  const [directory, setDirectory] = useState(() => doctorList.map((doctor) => ({ ...doctor, isDemo: true })));

  useEffect(() => {
    let active = true;
    fetch(`${basePath}/api/doctors`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Doctor directory is unavailable.");
        return response.json();
      })
      .then((result) => {
        if (!active || !Array.isArray(result.doctors) || result.doctors.length === 0) return;
        setDirectory(result.doctors.map((doctor) => ({
          id: doctor.slug,
          name: doctor.displayName,
          specialty: doctor.specialty.name,
          image: doctor.imageUrl,
          summary: doctor.biography,
          experience: doctor.experienceYears > 0 ? `${doctor.experienceYears}+ years of experience listed` : "Experience not listed",
          isDemo: false,
        })));
      })
      .catch(() => {});
    return () => { active = false; };
  }, [doctorList]);

  const listedDoctors = typeof limit === "number" ? directory.slice(0, limit) : directory;

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
      {listedDoctors.map((doctor) => (
        <section key={doctor.id} className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
          <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-[#EEF2EB]">
            <DoctorPortrait src={doctor.image} alt={`${doctor.name} portrait`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
          </div>
          {doctor.isDemo && <span className="mt-4 inline-flex rounded-full bg-[#F3E8D5] px-3 py-1 text-xs font-semibold text-[#684B37]">Sample profile</span>}
          <h2 className="mt-3 text-xl font-bold text-slate-900">{doctor.name}</h2>
          <p className="mt-2 text-[#B86C4D]">{doctor.specialty}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{doctor.summary}</p>
          <p className="mt-2 text-xs text-slate-500">{doctor.isDemo ? "Illustrative profile information" : doctor.experience}</p>
          <div className="mt-5 flex gap-3">
            <Link href={`/doctors/${doctor.id}`} className="flex-1 rounded-lg bg-[#263F3A] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#1D302D]">View profile</Link>
            <Link href={`/doctors/${doctor.id}/appointment`} className="flex-1 rounded-lg border border-[#D6C5A7] px-3 py-3 text-sm font-semibold text-[#344B72] transition hover:bg-[#EEF2EB]">{doctor.isDemo ? "Booking info" : "Book appointment"}</Link>
          </div>
        </section>
      ))}
      {listedDoctors.length === 0 && <p className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">No clinician profiles are published yet.</p>}
    </div>
  );
}
