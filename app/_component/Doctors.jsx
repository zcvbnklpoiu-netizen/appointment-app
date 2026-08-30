import React from "react";
import Image from "next/image";
import Link from "next/link";

function Doctors() {
  const doctors = [
    {
      id: "james-anderson",
      name: "Dr. James Anderson",
      specialty: "Orthopedic Surgeon",
      image: "/appointment-app/doctor1.png",
    },
    {
      id: "michael-carter",
      name: "Dr. Michael Carter",
      specialty: "Cardiologist",
      image: "/appointment-app/doctor2.png",
    },
    {
      id: "daniel-wilson",
      name: "Dr. Daniel Wilson",
      specialty: "Neurologist",
      image: "/appointment-app/doctor3.png",
    },
    {
      id: "ethan-brown",
      name: "Dr. Ethan Brown",
      specialty: "Pediatrician",
      image: "/appointment-app/doctor4.png",
    },
    {
      id: "william-taylor",
      name: "Dr. William Taylor",
      specialty: "Dermatologist",
      image: "/appointment-app/doctor5.png",
    },
    {
      id: "alexander-moore",
      name: "Dr. Alexander Moore",
      specialty: "Ophthalmologist",
      image: "/appointment-app/doctor6.png",
    },
    {
      id: "oliver-smith",
      name: "Dr. Oliver Smith",
      specialty: "Internal Medicine",
      image: "/appointment-app/doctor7.png",
    },
    {
      id: "emily-johnson",
      name: "Dr. Emily Johnson",
      specialty: "Gynecologist",
      image: "/appointment-app/doctor8.png",
    },
    {
      id: "sophia-williams",
      name: "Dr. Sophia Williams",
      specialty: "Dentist",
      image: "/appointment-app/doctor9.png",
    },
    {
      id: "olivia-davis",
      name: "Dr. Olivia Davis",
      specialty: "ENT Specialist",
      image: "/appointment-app/doctor10.png",
    },
    {
      id: "emma-thompson",
      name: "Dr. Emma Thompson",
      specialty: "General Surgeon",
      image: "/appointment-app/doctor11.png",
    },
    {
      id: "charlotte-miller",
      name: "Dr. Charlotte Miller",
      specialty: "Psychiatrist",
      image: "/appointment-app/doctor12.png",
    },
  ];

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doctor) => (
        <section
          key={doctor.id}
          className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            {doctor.name}
          </h2>

          <p className="mt-2 text-blue-600">{doctor.specialty}</p>

          <div className="mt-5 flex gap-3">
            <Link
              href={`/doctors/${doctor.id}`}
              className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View Profile
            </Link>

            <Link
              href={`/doctors/${doctor.id}/appointment`}
              className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Book Appointment
            </Link>
          </div>
        </section>
      ))}
    </div>
  );
}

export default Doctors;