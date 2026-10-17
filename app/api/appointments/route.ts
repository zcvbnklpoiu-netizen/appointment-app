import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { rejectCrossOrigin, requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authResult = await requireRole(request, ["PATIENT", "DOCTOR", "ADMIN"]);
  if (authResult.response) return authResult.response;
  const user = authResult.user!;

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const date = url.searchParams.get("date");
    const doctorQuery = (url.searchParams.get("doctor") ?? "").trim().slice(0, 100);
    const patientQuery = (url.searchParams.get("patient") ?? "").trim().slice(0, 100);
    const page = Math.max(1, Math.min(10000, Number(url.searchParams.get("page")) || 1));
    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"];
    if (user.role === "ADMIN" && status && !validStatuses.includes(status)) return Response.json({ error: "Invalid appointment status filter." }, { status: 400 });
    const selectedDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00.000Z`) : null;
    if (user.role === "ADMIN" && date && (!selectedDate || Number.isNaN(selectedDate.getTime()) || selectedDate.toISOString().slice(0, 10) !== date)) return Response.json({ error: "Date filter must use YYYY-MM-DD." }, { status: 400 });
    const where = user.role === "ADMIN"
      ? {
          ...(status ? { status: status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" } : {}),
          ...(selectedDate ? { slot: { startsAt: { gte: selectedDate, lt: new Date(selectedDate.getTime() + 86_400_000) } } } : {}),
          ...(doctorQuery ? { doctor: { displayName: { contains: doctorQuery } } } : {}),
          ...(patientQuery ? { patient: { user: { OR: [{ name: { contains: patientQuery } }, { email: { contains: patientQuery } }] } } } : {}),
        }
      : user.role === "DOCTOR"
        ? { doctor: { userId: user.id } }
        : { patient: { userId: user.id } };
    const select: Prisma.AppointmentSelect = {
      id: true, type: true, status: true, createdAt: true,
        slot: { select: { startsAt: true, endsAt: true, timeZone: true } },
      doctor: { select: { slug: true, displayName: true, specialty: { select: { name: true } } } },
    };
    if (user.role !== "PATIENT") select.patient = { select: { user: { select: { id: true, name: true, email: true } } } };
    if (user.role === "ADMIN") {
      const [appointments, total] = await Promise.all([
        prisma.appointment.findMany({ where, select, orderBy: { slot: { startsAt: "asc" } }, skip: (page - 1) * 25, take: 25 }),
        prisma.appointment.count({ where }),
      ]);
      return Response.json({ appointments, total, page, pageSize: 25 }, { headers: { "Cache-Control": "no-store" } });
    }
    const appointments = await prisma.appointment.findMany({ where, select, orderBy: { slot: { startsAt: "asc" } }, take: 100 });
    return Response.json({ appointments }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Appointments are temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["PATIENT"]);
  if (authResult.response) return authResult.response;
  const user = authResult.user!;

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8000) return Response.json({ error: "Request is too large." }, { status: 413 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid appointment details." }, { status: 400 });
  const input = body as Record<string, unknown>;
  if (typeof input.doctorSlug !== "string" || input.doctorSlug.length > 80 || typeof input.slotId !== "string" || input.slotId.length > 80 || !["IN_PERSON", "VIDEO"].includes(String(input.type))) {
    return Response.json({ error: "Choose a doctor, available time, and appointment type." }, { status: 400 });
  }

  try {
    const patient = await prisma.patient.findUnique({ where: { userId: user.id }, select: { id: true } });
    const doctor = await prisma.doctor.findFirst({ where: { slug: input.doctorSlug, isActive: true }, select: { id: true, consultationModes: true } });
    if (!patient) return Response.json({ error: "Patient profile is unavailable. Sign out and sign in again." }, { status: 409 });
    if (!doctor) return Response.json({ error: "This doctor is not available for booking." }, { status: 404 });
    if (!doctor.consultationModes.split(",").map((mode) => mode.trim()).includes(String(input.type))) return Response.json({ error: "This appointment type is not available with this doctor." }, { status: 400 });

    const appointment = await prisma.$transaction(async (tx) => {
      const reservation = await tx.appointmentSlot.updateMany({
        where: { id: input.slotId as string, doctorId: doctor.id, status: "OPEN", startsAt: { gt: new Date() } },
        data: { status: "BOOKED" },
      });
      if (reservation.count !== 1) return null;
      const created = await tx.appointment.create({
        data: { patientId: patient.id, doctorId: doctor.id, slotId: input.slotId as string, type: input.type as "IN_PERSON" | "VIDEO", status: "PENDING" },
        select: { id: true, status: true, type: true, slot: { select: { startsAt: true, endsAt: true, timeZone: true } }, doctor: { select: { displayName: true, slug: true } } },
      });
      await tx.auditEvent.create({ data: { actorId: user.id, action: "APPOINTMENT_REQUESTED", targetType: "Appointment", targetId: created.id } });
      return created;
    });
    if (!appointment) return Response.json({ error: "That time is no longer available. Choose another slot." }, { status: 409 });
    return Response.json({ appointment }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return Response.json({ error: "That time has already been booked. Choose another slot." }, { status: 409 });
    }
    return Response.json({ error: "The appointment could not be saved. Please try again." }, { status: 503 });
  }
}
