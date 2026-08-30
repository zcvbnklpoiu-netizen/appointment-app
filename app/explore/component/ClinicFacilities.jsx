
import React from "react";
import Image from "next/image";

const facilities = [
  {
    image: "/appointment-app/ClinicFacilities1.png",
    tag: "Modern Consultation Rooms",
    title: "Comfortable Spaces for Every Consultation",
    description:
      "Our consultation rooms are designed to provide a calm, private, and comfortable environment for every patient.",
  },
  {
    image: "/appointment-app/ClinicFacilities2.png",
    tag: "Advanced Equipment",
    title: "Modern Technology for Better Care",
    description:
      "Modern medical equipment supports our specialists in delivering accurate and efficient care.",
  },
  {
    image: "/appointment-app/ClinicFacilities3.png",
    tag: "Patient Care",
    title: "A Space Designed Around You",
    description:
      "Every detail of our facilities is designed to make your healthcare experience easier and more comfortable.",
  },
  {
    image: "/appointment-app/ClinicFacilities4.png",
    tag: "Professional Environment",
    title: "Built for Quality Healthcare",
    description:
      "A professional medical environment where doctors and healthcare teams can focus on what matters most: patient care.",
  },
  {
    image: "/appointment-app/ClinicFacilities5.png",
    tag: "Clean & Organized",
    title: "A Safe and Welcoming Environment",
    description:
      "We maintain clean, organized spaces to create a reassuring experience for every patient.",
  },
  {
    image: "/appointment-app/ClinicFacilities6.png",
    tag: "Complete Care",
    title: "Everything You Need in One Place",
    description:
      "From consultation to treatment, MediaBook brings together a complete healthcare experience under one roof.",
  },
];

function ClinicFacilities() {
  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Our Facilities
          </span>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Modern Facilities, Better Care
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Explore the spaces and facilities at MediaBook, designed to create
            a comfortable, organized, and modern healthcare experience.
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
                  src={facility.image}
                  alt={facility.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="p-6">
                <span className="text-sm font-semibold text-blue-600">
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
