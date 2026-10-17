import { prisma } from "@/lib/prisma";
import { rejectCrossOrigin, requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["PATIENT", "DOCTOR", "ADMIN"]);
  if (authResult.response) return authResult.response;
  const user = authResult.user!;
  const { id } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid appointment update." }, { status: 400 });
  const input = body as Record<string, unknown>;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: { select: { userId: true } }, patient: { select: { userId: true } }, slot: true },
    });
    if (!appointment) return Response.json({ error: "Appointment not found." }, { status: 404 });
    const isPatientOwner = user.role === "PATIENT" && appointment.patient.userId === user.id;
    const isDoctorOwner = user.role === "DOCTOR" && appointment.doctor.userId === user.id;
    const isAdmin = user.role === "ADMIN";
    if (!isPatientOwner && !isDoctorOwner && !isAdmin) return Response.json({ error: "You do not have access to this appointment." }, { status: 403 });

    if (typeof input.slotId === "string") {
      if (!isPatientOwner) return Response.json({ error: "Only the patient can request a new time." }, { status: 403 });
      const cutoff = appointment.slot.startsAt.getTime() - Date.now();
      if (cutoff < 24 * 60 * 60 * 1000 || !["PENDING", "CONFIRMED"].includes(appointment.status)) {
        return Response.json({ error: "Rescheduling is available until 24 hours before a pending or confirmed appointment." }, { status: 409 });
      }
      if (input.slotId === appointment.slotId) return Response.json({ error: "Choose a different time." }, { status: 400 });
      const updated = await prisma.$transaction(async (tx) => {
        const reservation = await tx.appointmentSlot.updateMany({ where: { id: input.slotId as string, doctorId: appointment.doctorId, status: "OPEN", startsAt: { gt: new Date() } }, data: { status: "BOOKED" } });
        if (reservation.count !== 1) return null;
        const changed = await tx.appointment.updateMany({ where: { id, slotId: appointment.slotId, status: { in: ["PENDING", "CONFIRMED"] } }, data: { slotId: input.slotId as string, status: "PENDING" } });
        if (changed.count !== 1) throw new Error("APPOINTMENT_CONFLICT");
        await tx.appointmentSlot.update({ where: { id: appointment.slotId }, data: { status: "OPEN" } });
        await tx.auditEvent.create({ data: { actorId: user.id, action: "APPOINTMENT_RESCHEDULED", targetType: "Appointment", targetId: id } });
        return tx.appointment.findUnique({ where: { id }, select: { id: true, status: true, type: true, slot: { select: { startsAt: true, endsAt: true, timeZone: true } } } });
      });
      if (!updated) return Response.json({ error: "That time is no longer available. Choose another slot." }, { status: 409 });
      return Response.json({ appointment: updated });
    }

    const nextStatus = input.status;
    const mayCancel = nextStatus === "CANCELLED" && ["PENDING", "CONFIRMED"].includes(appointment.status);
    const mayConfirm = nextStatus === "CONFIRMED" && isDoctorOwner && appointment.status === "PENDING";
    const mayFinish = ["COMPLETED", "NO_SHOW"].includes(String(nextStatus)) && (isDoctorOwner || isAdmin) && appointment.status === "CONFIRMED" && appointment.slot.startsAt <= new Date();
    const mayAdminSet = isAdmin && (
      (appointment.status === "PENDING" && ["CONFIRMED", "CANCELLED"].includes(String(nextStatus))) ||
      (appointment.status === "CONFIRMED" && ["COMPLETED", "NO_SHOW", "CANCELLED"].includes(String(nextStatus)))
    );
    if (!mayCancel && !mayConfirm && !mayFinish && !mayAdminSet) return Response.json({ error: "That status change is not allowed." }, { status: 409 });
    if (isPatientOwner && mayCancel && appointment.slot.startsAt.getTime() - Date.now() < 24 * 60 * 60 * 1000) {
      return Response.json({ error: "Cancellations must be made at least 24 hours in advance." }, { status: 409 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const changed = await tx.appointment.updateMany({ where: { id, status: appointment.status, slotId: appointment.slotId }, data: { status: nextStatus as "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW", ...(nextStatus === "CANCELLED" ? { cancelledAt: new Date() } : {}) } });
      if (changed.count !== 1) throw new Error("APPOINTMENT_CONFLICT");
      if (nextStatus === "CANCELLED") await tx.appointmentSlot.update({ where: { id: appointment.slotId }, data: { status: "OPEN" } });
      await tx.auditEvent.create({ data: { actorId: user.id, action: `APPOINTMENT_${nextStatus}`, targetType: "Appointment", targetId: id } });
      return tx.appointment.findUnique({ where: { id }, select: { id: true, status: true, cancelledAt: true } });
    });
    return Response.json({ appointment: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "APPOINTMENT_CONFLICT") return Response.json({ error: "This appointment changed while you were working. Refresh and try again." }, { status: 409 });
    return Response.json({ error: "The appointment could not be updated." }, { status: 503 });
  }
}
