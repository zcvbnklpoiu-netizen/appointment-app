import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = (params.get("q") ?? "").trim().slice(0, 100);
  const specialty = (params.get("specialty") ?? "").trim().slice(0, 100);
  const take = Math.min(Math.max(Number(params.get("limit") ?? 50) || 50, 1), 100);

  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        isActive: true,
        specialty: { isActive: true, ...(specialty ? { slug: specialty } : {}) },
        ...(query ? { OR: [{ displayName: { contains: query } }, { biography: { contains: query } }, { specialty: { name: { contains: query } } }] } : {}),
      },
      select: {
        id: true, slug: true, displayName: true, biography: true, qualifications: true,
        experienceYears: true, clinicName: true, location: true, consultationModes: true,
        imageUrl: true, specialty: { select: { name: true, slug: true } },
      },
      orderBy: { displayName: "asc" },
      take,
    });
    return Response.json({ doctors, source: "database" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "The doctor directory is temporarily unavailable." }, { status: 503 });
  }
}
