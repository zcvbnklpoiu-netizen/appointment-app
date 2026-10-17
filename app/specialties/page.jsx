import Link from "next/link";
import { doctors as sampleDoctors } from "@/lib/doctor-data";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = { title: "Browse specialties | MediaBook" };

export default async function SpecialtiesPage() {
  let specialties = [];
  try {
    specialties = await prisma.specialty.findMany({
      where: { isActive: true },
      select: { name: true, slug: true, _count: { select: { doctors: { where: { isActive: true } } } } },
      orderBy: { name: "asc" },
    });
  } catch {
    // Keep the sample directory browseable if the local database is unavailable.
  }

  const isSample = specialties.length === 0;
  const items = isSample
    ? [...new Set(sampleDoctors.map((doctor) => doctor.specialty))].sort().map((name) => ({ name, slug: name, count: sampleDoctors.filter((doctor) => doctor.specialty === name).length }))
    : specialties.map((specialty) => ({ name: specialty.name, slug: specialty.name, count: specialty._count.doctors }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-[#344B72]">Areas of care</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">Browse by specialty</h1>
      <p className="mt-3 max-w-2xl text-slate-600">Browse areas of care and explore clinician profiles, services, and appointment options.</p>
      {isSample && <p className="mt-4 rounded-xl bg-[#F3E8D5] p-3 text-sm text-[#684B37]">These specialty categories describe sample profiles. Clinic specialties appear here when configured by an administrator.</p>}
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((specialty) => (
          <li key={specialty.name}>
            <Link href={`/explore?specialty=${encodeURIComponent(specialty.slug)}`} className="flex h-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#B7C9B0] hover:shadow-sm">
              <span className="font-semibold text-slate-800">{specialty.name}</span>
              <span className="text-sm text-slate-500">{specialty.count} {specialty.count === 1 ? "profile" : "profiles"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
