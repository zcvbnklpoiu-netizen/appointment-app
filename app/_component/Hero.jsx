
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { publicImage } from "@/lib/public-image";

function Hero() {
  return (
    <section className="bg-[#EEF2EB]">
      <div className="mx-auto flex min-h-[600px] max-w-7xl flex-col items-center justify-between gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:gap-12 lg:px-8">

        {/* Content */}
        <div className="max-w-2xl flex-1 text-center lg:text-left">
          <span className="mb-5 inline-block rounded-full bg-[#E3EADF] px-4 py-2 text-xs font-semibold text-[#344B72] sm:text-sm">
            Find care options with clarity
          </span>

          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Your Health
            <span className="block text-[#B86C4D]">
              Our Priority
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 lg:mx-0">
            Explore care options, compare specialties, and connect with a clinician that fits your needs.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link href="/explore" className="rounded-lg bg-[#263F3A] px-6 py-3 font-semibold text-white transition hover:bg-[#1D302D]">Explore doctors</Link>
            <Link href="/specialties" className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Browse specialties</Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex w-full flex-1 justify-center lg:justify-end">
          <div className="relative h-[300px] w-full max-w-[400px] sm:h-[350px] sm:max-w-[450px] lg:h-[400px] lg:max-w-[500px]">
            <Image
              src={publicImage("/Hero.png")}
              alt="Healthcare professional ready to help patients"
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
