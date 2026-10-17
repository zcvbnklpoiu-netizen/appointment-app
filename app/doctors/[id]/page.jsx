import { notFound } from "next/navigation";
import DatabaseDoctorProfile from "./DatabaseDoctorProfile";
import { getDoctorById } from "@/lib/doctor-data";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DoctorPortfolioPage({ params }) {
  const { id } = await params;
  let doctor = null;

  try {
    doctor = await prisma.doctor.findFirst({
      where: { slug: id, isActive: true, specialty: { isActive: true } },
      include: {
        specialty: true,
        availabilities: {
          where: { isActive: true },
          orderBy: [{ weekday: "asc" }, { startTime: "asc" }],
        },
      },
    });
  } catch {
    // Keep the existing public profile directory usable if local database setup is unavailable.
  }

  doctor ??= getDoctorById(id);
  if (!doctor) notFound();

  return <DatabaseDoctorProfile doctor={doctor} isDemo={!doctor.displayName} />;
}
