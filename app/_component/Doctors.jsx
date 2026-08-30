import React from "react";
import Image from "next/image";
import Link from "next/link";

function Doctors() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">

      {/* Doctor 1 */}
      <section className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
          <Image
            src="/doctor1.png"
            alt="Dr. James Anderson"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Dr. James Anderson
        </h2>

        <p className="mt-2 text-blue-600">Orthopedic Surgeon</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/doctors/james-anderson"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Profile
          </Link>

          <Link
            href="/doctors/james-anderson/appointment"
            className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Doctor 2 */}
      <section className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
          <Image
            src="/doctor2.png"
            alt="Dr. Michael Carter"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Dr. Michael Carter
        </h2>

        <p className="mt-2 text-blue-600">Cardiologist</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/doctors/michael-carter"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Profile
          </Link>

          <Link
            href="/doctors/michael-carter/appointment"
            className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Doctor 3 */}
      <section className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
          <Image
            src="/doctor3.png"
            alt="Dr. Daniel Wilson"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Dr. Daniel Wilson
        </h2>

        <p className="mt-2 text-blue-600">Neurologist</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/doctors/daniel-wilson"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Profile
          </Link>

          <Link
            href="/doctors/daniel-wilson/appointment"
            className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Doctor 4 */}
      <section className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
          <Image
            src="/doctor4.png"
            alt="Dr. Ethan Brown"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Dr. Ethan Brown
        </h2>

        <p className="mt-2 text-blue-600">Pediatrician</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/doctors/ethan-brown"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Profile
          </Link>

          <Link
            href="/doctors/ethan-brown/appointment"
            className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Doctor 5 */}
      <section className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
          <Image
            src="/doctor5.png"
            alt="Dr. William Taylor"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Dr. William Taylor
        </h2>

        <p className="mt-2 text-blue-600">Dermatologist</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/doctors/william-taylor"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Profile
          </Link>

          <Link
            href="/doctors/william-taylor/appointment"
            className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Doctor 6 */}
      <section className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
          <Image
            src="/doctor6.png"
            alt="Dr. Alexander Moore"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Dr. Alexander Moore
        </h2>

        <p className="mt-2 text-blue-600">Ophthalmologist</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/doctors/alexander-moore"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Profile
          </Link>

          <Link
            href="/doctors/alexander-moore/appointment"
            className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Doctor 7 */}
      <section className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
          <Image
            src="/doctor7.png"
            alt="Dr. Oliver Smith"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Dr. Oliver Smith
        </h2>

        <p className="mt-2 text-blue-600">Internal Medicine</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/doctors/oliver-smith"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Profile
          </Link>

          <Link
            href="/doctors/oliver-smith/appointment"
            className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Doctor 8 */}
      <section className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
          <Image
            src="/doctor8.png"
            alt="Dr. Emily Johnson"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Dr. Emily Johnson
        </h2>

        <p className="mt-2 text-blue-600">Gynecologist</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/doctors/emily-johnson"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Profile
          </Link>

          <Link
            href="/doctors/emily-johnson/appointment"
            className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Doctor 9 */}
      <section className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
          <Image
            src="/doctor9.png"
            alt="Dr. Sophia Williams"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Dr. Sophia Williams
        </h2>

        <p className="mt-2 text-blue-600">Dentist</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/doctors/sophia-williams"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Profile
          </Link>

          <Link
            href="/doctors/sophia-williams/appointment"
            className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Doctor 10 */}
      <section className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
          <Image
            src="/doctor10.png"
            alt="Dr. Olivia Davis"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Dr. Olivia Davis
        </h2>

        <p className="mt-2 text-blue-600">ENT Specialist</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/doctors/olivia-davis"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Profile
          </Link>

          <Link
            href="/doctors/olivia-davis/appointment"
            className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Doctor 11 */}
      <section className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
          <Image
            src="/doctor11.png"
            alt="Dr. Emma Thompson"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Dr. Emma Thompson
        </h2>

        <p className="mt-2 text-blue-600">General Surgeon</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/doctors/emma-thompson"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Profile
          </Link>

          <Link
            href="/doctors/emma-thompson/appointment"
            className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Doctor 12 */}
      <section className="rounded-2xl bg-white p-5 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl bg-blue-50">
          <Image
            src="/doctor12.png"
            alt="Dr. Charlotte Miller"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Dr. Charlotte Miller
        </h2>

        <p className="mt-2 text-blue-600">Psychiatrist</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/doctors/charlotte-miller"
            className="flex-1 rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Profile
          </Link>

          <Link
            href="/doctors/charlotte-miller/appointment"
            className="flex-1 rounded-lg border border-blue-600 px-3 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Doctors;