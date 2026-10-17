import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppointmentForm from './AppointmentForm';
import { getDoctorById } from '@/lib/doctor-data';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function BookAppointmentPage({ params }) {
  const { id } = await params;
  let databaseDoctor = null;
  try {
    databaseDoctor = await prisma.doctor.findFirst({ where: { slug: id, isActive: true }, select: { displayName: true, specialty: { select: { name: true } } } });
  } catch {
    // The sample booking page remains available while local setup is incomplete.
  }
  const doctor = databaseDoctor ?? getDoctorById(id);
  if (!doctor) notFound();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8">

        <Link
          href={`/doctors/${id}`}
          className="text-[#B86C4D] font-semibold text-sm"
        >
          ← Back to Doctor
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Book Appointment
          </h1>

          <p className="text-slate-500 mt-2">
            Request a preferred time with {databaseDoctor?.displayName ?? doctor.name}, {databaseDoctor?.specialty.name ?? doctor.specialty}.
          </p>
        </div>

        {databaseDoctor ? <AppointmentForm doctorSlug={id} /> : <div role="status" className="mt-8 rounded-2xl border border-[#E6D6BD] bg-[#FBF5EA] p-5 text-sm leading-6 text-[#57483B]"><p className="font-bold">Online booking is not set up for this sample profile.</p><p className="mt-2">A clinic administrator must add this clinician to the database and publish appointment availability before patients can request a time.</p><Link href="/explore" className="mt-4 inline-block font-semibold underline">Browse clinician profiles</Link></div>}
      </div>
    </main>
  );
}
