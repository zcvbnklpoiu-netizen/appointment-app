import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { validateDoctorProfileInput } from "@/lib/doctor-profile-validation.js";
import { rejectCrossOrigin, requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const profileSelect = {
  id: true,
  slug: true,
  displayName: true,
  professionalTitle: true,
  university: true,
  biography: true,
  qualifications: true,
  training: true,
  subSpecialties: true,
  services: true,
  procedures: true,
  languages: true,
  procedureCount: true,
  practiceStartYear: true,
};

export async function GET(request: Request) {
  const authResult = await requireRole(request, ["DOCTOR"]);
  if (authResult.response) return authResult.response;

  try {
    const doctor = await prisma.doctor.findUnique({ where: { userId: authResult.user!.id }, select: profileSelect });
    if (!doctor) return Response.json({ error: "Your doctor profile has not been linked yet." }, { status: 404 });
    return Response.json({ doctor }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Doctor profile is temporarily unavailable." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["DOCTOR"]);
  if (authResult.response) return authResult.response;

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_000) return Response.json({ error: "Request is too large." }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  const validation = validateDoctorProfileInput(body);
  if (!validation.ok) return Response.json({ error: validation.error }, { status: 400 });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.doctor.findUnique({ where: { userId: authResult.user!.id }, select: { id: true } });
      if (!existing) return null;
      const doctor = await tx.doctor.update({ where: { id: existing.id }, data: validation.data as Prisma.DoctorUpdateInput, select: profileSelect });
      await tx.auditEvent.create({ data: { actorId: authResult.user!.id, action: "DOCTOR_PROFILE_UPDATED", targetType: "Doctor", targetId: doctor.id } });
      return doctor;
    });
    if (!result) return Response.json({ error: "Your doctor profile has not been linked yet." }, { status: 404 });
    return Response.json({ doctor: result, message: "Professional profile saved." }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Doctor profile could not be saved." }, { status: 503 });
  }
}
