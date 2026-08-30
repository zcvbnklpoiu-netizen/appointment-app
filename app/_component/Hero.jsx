
import React from "react";
import Image from "next/image";

function Hero() {
  return (
    <section className="bg-blue-50">
      <div className="mx-auto flex min-h-[600px] max-w-7xl flex-col items-center justify-between gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:gap-12 lg:px-8">

        {/* Content */}
        <div className="max-w-2xl flex-1 text-center lg:text-left">
          <span className="mb-5 inline-block rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-600 sm:text-sm">
            Trusted Healthcare Platform
          </span>

          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Your Health
            <span className="block text-blue-600">
              Our Priority
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
            Book appointments with trusted doctors and get the care you need
            whenever you need it.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4 lg:justify-start">
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Explore New
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex w-full flex-1 justify-center lg:justify-end">
          <div className="relative h-[300px] w-full max-w-[400px] sm:h-[350px] sm:max-w-[450px] lg:h-[400px] lg:max-w-[500px]">
            <Image
              src="/appointment-app/Hero.png"
              alt="Doctor"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
              className="object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;
