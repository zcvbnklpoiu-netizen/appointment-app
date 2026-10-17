import { prisma } from "@/lib/prisma";
import { rejectCrossOrigin, requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const authResult = await requireRole(request, ["ADMIN", "DOCTOR"]);
  if (authResult.response) return authResult.response;
  const { slug } = await context.params;
  try {
    const doctor = await prisma.doctor.findFirst({ where: { slug, isActive: true }, select: { id: true, userId: true } });
    if (!doctor) return Response.json({ error: "Doctor not found." }, { status: 404 });
    if (authResult.user!.role === "DOCTOR" && doctor.userId !== authResult.user!.id) return Response.json({ error: "You can only view your own schedule." }, { status: 403 });
    const availabilities = await prisma.doctorAvailability.findMany({ where: { doctorId: doctor.id }, orderBy: [{ weekday: "asc" }, { startTime: "asc" }] });
    return Response.json({ availabilities }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Doctor availability is temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["ADMIN", "DOCTOR"]);
  if (authResult.response) return authResult.response;
  const { slug } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid availability details." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const validTime = (time: unknown) => typeof time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
  if (!Number.isInteger(input.weekday) || Number(input.weekday) < 0 || Number(input.weekday) > 6 || !validTime(input.startTime) || !validTime(input.endTime) || typeof input.slotMinutes !== "number" || ![15, 20, 30, 45, 60, 90, 120].includes(input.slotMinutes) || typeof input.timeZone !== "string" || input.timeZone.length > 80) {
    return Response.json({ error: "Provide a weekday (0–6), valid local start/end times, a supported slot length, and an IANA time zone." }, { status: 400 });
  }
  if ((input.startTime as string) >= (input.endTime as string)) return Response.json({ error: "Availability end time must be after start time on the same day." }, { status: 400 });
  try { new Intl.DateTimeFormat("en", { timeZone: input.timeZone }); } catch { return Response.json({ error: "Time zone must be a valid IANA time zone." }, { status: 400 }); }
  const doctor = await prisma.doctor.findFirst({ where: { slug, isActive: true }, select: { id: true, userId: true } });
  if (!doctor) return Response.json({ error: "Doctor not found." }, { status: 404 });
  if (authResult.user!.role === "DOCTOR" && doctor.userId !== authResult.user!.id) return Response.json({ error: "You can only manage your own schedule." }, { status: 403 });
  try {
    const availability = await prisma.$transaction(async (tx) => {
      const existing = await tx.doctorAvailability.findMany({ where: { doctorId: doctor.id, weekday: input.weekday as number, isActive: true }, select: { startTime: true, endTime: true } });
      if (existing.some((item) => (input.startTime as string) < item.endTime && (input.endTime as string) > item.startTime)) throw new Error("AVAILABILITY_OVERLAP");
      const record = await tx.doctorAvailability.create({ data: { doctorId: doctor.id, weekday: input.weekday as number, startTime: input.startTime as string, endTime: input.endTime as string, slotMinutes: input.slotMinutes as number, timeZone: input.timeZone as string } });
      await tx.auditEvent.create({ data: { actorId: authResult.user!.id, action: "DOCTOR_AVAILABILITY_CREATED", targetType: "DoctorAvailability", targetId: record.id } });
      return record;
    });
    return Response.json({ availability }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "AVAILABILITY_OVERLAP") return Response.json({ error: "This weekly schedule overlaps an existing availability window." }, { status: 409 });
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return Response.json({ error: "This weekly availability entry already exists." }, { status: 409 });
    return Response.json({ error: "Availability could not be saved." }, { status: 503 });
  }
}
