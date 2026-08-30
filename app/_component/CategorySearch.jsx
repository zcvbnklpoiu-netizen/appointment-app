"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CiSearch } from "react-icons/ci";

const doctors = [
  {
    name: "Dr. James Anderson",
    specialty: "Orthopedic Surgeon",
    image: "/doctor1.png",
    profile: "/doctors/james-anderson",
    appointment: "/doctors/james-anderson/appointment",
  },
  {
    name: "Dr. Michael Carter",
    specialty: "Cardiologist",
    image: "/doctor2.png",
    profile: "/doctors/michael-carter",
    appointment: "/doctors/michael-carter/appointment",
  },
  {
    name: "Dr. Daniel Wilson",
    specialty: "Neurologist",
    image: "/doctor3.png",
    profile: "/doctors/daniel-wilson",
    appointment: "/doctors/daniel-wilson/appointment",
  },
  {
    name: "Dr. Ethan Brown",
    specialty: "Pediatrician",
    image: "/doctor4.png",
    profile: "/doctors/ethan-brown",
    appointment: "/doctors/ethan-brown/appointment",
  },
  {
    name: "Dr. William Taylor",
    specialty: "Dermatologist",
    image: "/doctor5.png",
    profile: "/doctors/william-taylor",
    appointment: "/doctors/william-taylor/appointment",
  },
  {
    name: "Dr. Alexander Moore",
    specialty: "Ophthalmologist",
    image: "/doctor6.png",
    profile: "/doctors/alexander-moore",
    appointment: "/doctors/alexander-moore/appointment",
  },
  {
    name: "Dr. Oliver Smith",
    specialty: "Internal Medicine",
    image: "/doctor7.png",
    profile: "/doctors/oliver-smith",
    appointment: "/doctors/oliver-smith/appointment",
  },
  {
    name: "Dr. Emily Johnson",
    specialty: "Gynecologist",
    image: "/doctor8.png",
    profile: "/doctors/emily-johnson",
    appointment: "/doctors/emily-johnson/appointment",
  },
  {
    name: "Dr. Sophia Williams",
    specialty: "Dentist",
    image: "/doctor9.png",
    profile: "/doctors/sophia-williams",
    appointment: "/doctors/sophia-williams/appointment",
  },
  {
    name: "Dr. Olivia Davis",
    specialty: "ENT Specialist",
    image: "/doctor10.png",
    profile: "/doctors/olivia-davis",
    appointment: "/doctors/olivia-davis/appointment",
  },
  {
    name: "Dr. Emma Thompson",
    specialty: "General Surgeon",
    image: "/doctor11.png",
    profile: "/doctors/emma-thompson",
    appointment: "/doctors/emma-thompson/appointment",
  },
  {
    name: "Dr. Charlotte Miller",
    specialty: "Psychiatrist",
    image: "/doctor12.png",
    profile: "/doctors/charlotte-miller",
    appointment: "/doctors/charlotte-miller/appointment",
  },
];

function CategorySearch() {
  const [search, setSearch] = useState("");
  const [doctor, setDoctor] = useState(null);

  function handleclickDoctors() {
    const foundDoctor = doctors.find((doctor) =>
      doctor.name.toLowerCase().includes(search.trim().toLowerCase())
    );

    setDoctor(foundDoctor);
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
          onChange={(x) => setSearch(x.target.value)}
          placeholder="Enter your Doctor"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base"
        />

        <Button
          type="button"
          onClick={handleclickDoctors}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
        >
          <CiSearch className="text-xl" />
        </Button>

      </div>

      {/* Doctor */}
      {doctor && (
        <div className="mx-auto mt-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">

          {/* Image */}
          <div className="relative h-72 w-full bg-blue-50">
            <Image
              src={doctor.image}
              alt={doctor.name}
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

            <p className="mt-2 text-blue-600">
              {doctor.specialty}
            </p>

            {/* Buttons */}
            <div className="mt-5 flex gap-3">

              <a
                href={doctor.profile}
                className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View Profile
              </a>

              <a
                href={doctor.appointment}
                className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Book Appointment
              </a>

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