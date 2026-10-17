
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CiSearch } from "react-icons/ci";
import DoctorPortrait from "@/app/_component/DoctorPortrait";
import { doctors as doctorProfiles } from "@/lib/doctor-data";

const doctors = doctorProfiles.map((doctor) => ({
  name: doctor.name,
  specialty: doctor.specialty,
  image: doctor.image,
  profile: `/doctors/${doctor.id}`,
  appointment: `/doctors/${doctor.id}/appointment`,
}));

function CategorySearch() {
  const [search, setSearch] = useState("");
  const [doctor, setDoctor] = useState(null);

  function handleclickDoctors() {
    const searchValue = search.trim().toLowerCase();

    const foundDoctor = doctors.find((doctor) =>
      doctor.name.toLowerCase().includes(searchValue)
    );

    setDoctor(foundDoctor || null);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">

      <h2 className="mb-6 text-center text-2xl font-bold text-slate-900 sm:mb-8 sm:text-3xl">
        Find the Right Doctor for You
      </h2>

      {/* Search */}
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl bg-white p-4 shadow-lg sm:flex-row sm:gap-4 sm:p-6">

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter your Doctor"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#344B72] focus:ring-2 focus:ring-[#DCE6DA] sm:text-base"
        />

        <Button
          type="button"
          onClick={handleclickDoctors}
          className="w-full rounded-lg bg-[#344B72] px-6 py-3 font-semibold text-white transition hover:bg-[#263F3A] sm:w-auto"
        >
          <CiSearch className="text-xl" />
        </Button>

      </div>

      {/* Doctor */}
      {doctor && (
        <div className="mx-auto mt-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">

          {/* Doctor Image */}
          <div className="relative h-72 w-full bg-[#EEF2EB]">

            <DoctorPortrait
              src={doctor.image}
              alt={`${doctor.name} portrait`}
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-contain"
            />

          </div>

          {/* Doctor Information */}
          <div className="p-5 text-center">

            <h3 className="text-xl font-bold text-slate-900">
              {doctor.name}
            </h3>

            <p className="mt-2 text-[#B86C4D]">
              {doctor.specialty}
            </p>

            {/* Buttons */}
            <div className="mt-5 flex gap-3">

              <Link
                href={doctor.profile}
                className="flex-1 rounded-lg bg-[#344B72] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#263F3A]"
              >
                View Profile
              </Link>

              <Link
                href={doctor.appointment}
                className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-[#B86C4D] transition hover:bg-[#EEF2EB]"
              >
                Book Appointment
              </Link>

            </div>

          </div>
        </div>
      )}

      {/* No Doctor */}
      {search && !doctor && (
        <p className="mt-8 text-center text-slate-500">
          No doctor found.
        </p>
      )}

    </section>
  );
}

export default CategorySearch;
