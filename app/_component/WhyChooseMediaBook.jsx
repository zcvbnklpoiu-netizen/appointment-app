import React from "react";

const reasons = [
  {
    title: "Better Patient Care",
    description:
      "We are here to provide better and more personalized care for every patient.",
  },
  {
    title: "Trusted Doctors",
    description:
      "Connect with trusted doctors across different medical specialties and find the care that fits your needs.",
  },
  {
    title: "Easy Appointments",
    description:
      "Find the right doctor and book your appointment through a simple and convenient experience.",
  },
  {
    title: "Comfortable Experience",
    description:
      "From the moment you arrive, we aim to make your healthcare experience comfortable and welcoming.",
  },
  {
    title: "Modern Healthcare",
    description:
      "Modern facilities and technology come together to support better and more efficient healthcare.",
  },
  {
    title: "Patient Support",
    description:
      "Our team is here to guide you and make your healthcare journey easier every step of the way.",
  },
];

function WhyMediaBook() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Why MediaBook
          </span>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            We Are Here to Care for You
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Everything we do is focused on making healthcare simpler,
            more comfortable, and more accessible for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg sm:p-7"
            >
              <span className="text-sm font-semibold text-blue-600">
                0{index + 1}
              </span>

              <h2 className="mt-3 text-xl font-bold text-slate-900">
                {reason.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyMediaBook;