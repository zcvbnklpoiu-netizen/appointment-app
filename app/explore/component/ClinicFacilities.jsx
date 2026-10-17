
import React from "react";
import Image from "next/image";
import { publicImage } from "@/lib/public-image";

const facilities = [
  {
    image: "/ClinicFacilities1.png",
    tag: "Modern Consultation Rooms",
    title: "Comfortable Spaces for Every Consultation",
    description:
      "Example of a consultation room that practices may describe in their profiles.",
  },
  {
    image: "/ClinicFacilities2.png",
    tag: "Advanced Equipment",
    title: "Modern Technology for Better Care",
    description:
      "Practices can list the equipment and services available at their location.",
  },
  {
    image: "/ClinicFacilities3.png",
    tag: "Patient Care",
    title: "A Space Designed Around You",
    description:
      "Review the visit information published by each practice before booking.",
  },
  {
    image: "/ClinicFacilities4.png",
    tag: "Professional Environment",
    title: "Built for Quality Healthcare",
    description:
      "Explore clinician profiles and practice information in one place.",
  },
  {
    image: "/ClinicFacilities5.png",
    tag: "Clean & Organized",
    title: "A Safe and Welcoming Environment",
    description:
      "Contact the practice directly with questions about its location or facilities.",
  },
  {
    image: "/ClinicFacilities6.png",
    tag: "Complete Care",
    title: "Everything You Need in One Place",
    description:
      "MediaBook helps patients discover practices and request appointments online.",
  },
];

function ClinicFacilities() {
  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#B86C4D]">
            Practice information
          </span>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Information to plan your visit
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            These illustrations accompany practical prompts about information
            patients may want to check with a practice before their visit.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={publicImage(facility.image)}
                  alt={facility.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="p-6">
                <span className="text-sm font-semibold text-[#B86C4D]">
                  {facility.tag}
                </span>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {facility.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {facility.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClinicFacilities;
