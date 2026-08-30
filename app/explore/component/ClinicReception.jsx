import React from "react";
import Image from "next/image";

function ClinicReception() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row-reverse lg:justify-between">

        <div className="w-full max-w-2xl text-center lg:text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-600 sm:text-base">
            Patient Support
          </h2>

          <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Here to Make Your Visit Easier
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg lg:leading-8">
            Our reception and booking team is ready to help you schedule your
            appointment, find the right doctor, and make your visit simple
            and organized from the moment you arrive.
          </p>
        </div>

        <div className="relative h-[280px] w-full max-w-[550px] overflow-hidden rounded-2xl shadow-xl sm:h-[350px] lg:h-[420px]">
          <Image
            src="/appointment-app/ClinicReception.png"
            alt="MediaBook reception and booking team"
            fill
            sizes="(max-width: 1024px) 100vw, 550px"
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
}

export default ClinicReception;