import { prisma } from "@/lib/prisma";
import { rejectCrossOrigin, requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";

function localTimeToUtc(day: string, time: string, timeZone: string) {
  const [year, month, date] = day.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const target = Date.UTC(year, month - 1, date, hour, minute);
  let timestamp = target;
  const formatter = new Intl.DateTimeFormat("en-GB", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  for (let iteration = 0; iteration < 4; iteration += 1) {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(timestamp)).map((part) => [part.type, part.value]));
    const represented = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute));
    const difference = target - represented;
    if (difference === 0) break;
    timestamp += difference;
  }
  const check = Object.fromEntries(formatter.formatToParts(new Date(timestamp)).map((part) => [part.type, part.value]));
  if (Number(check.year) !== year || Number(check.month) !== month || Number(check.day) !== date || Number(check.hour) !== hour || Number(check.minute) !== minute) return null;
  return new Date(timestamp);
}

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["ADMIN", "DOCTOR"]);
  if (authResult.response) return authResult.response;
  const { slug } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const validDay = (value: unknown) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  if (!validDay(input.from) || !validDay(input.to)) return Response.json({ error: "Provide valid from and to dates." }, { status: 400 });
  const fromMs = Date.parse(`${input.from}T00:00:00Z`);
  const toMs = Date.parse(`${input.to}T00:00:00Z`);
  const days = (toMs - fromMs) / 86400000;
  if (days < 0 || days > 31) return Response.json({ error: "Generate slots for a date range of 32 days or less." }, { status: 400 });

  try {
    const doctor = await prisma.doctor.findFirst({ where: { slug, isActive: true }, select: { id: true, userId: true, timeZone: true } });
    if (!doctor) return Response.json({ error: "Doctor not found." }, { status: 404 });
    if (authResult.user!.role === "DOCTOR" && doctor.userId !== authResult.user!.id) return Response.json({ error: "You can only manage your own schedule." }, { status: 403 });
    const availabilities = await prisma.doctorAvailability.findMany({ where: { doctorId: doctor.id, isActive: true } });
    const weekdayByDate = new Map<string, number>();
    for (let offset = 0; offset <= days; offset += 1) {
      const day = new Date(fromMs + offset * 86400000).toISOString().slice(0, 10);
      weekdayByDate.set(day, new Date(`${day}T12:00:00Z`).getUTCDay());
    }
    const candidates: { doctorId: string; startsAt: Date; endsAt: Date; timeZone: string; status: "OPEN" }[] = [];
    for (const [day, weekday] of weekdayByDate) {
      for (const availability of availabilities.filter((item) => item.weekday === weekday)) {
        const [startHour, startMinute] = availability.startTime.split(":").map(Number);
        const [endHour, endMinute] = availability.endTime.split(":").map(Number);
        const endMinutes = endHour * 60 + endMinute;
        for (let minute = startHour * 60 + startMinute; minute + availability.slotMinutes <= endMinutes; minute += availability.slotMinutes) {
          const startText = `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
          const endText = `${String(Math.floor((minute + availability.slotMinutes) / 60)).padStart(2, "0")}:${String((minute + availability.slotMinutes) % 60).padStart(2, "0")}`;
          const startsAt = localTimeToUtc(day, startText, availability.timeZone);
          const endsAt = localTimeToUtc(day, endText, availability.timeZone);
          if (startsAt && endsAt && startsAt.getTime() > Date.now()) candidates.push({ doctorId: doctor.id, startsAt, endsAt, timeZone: availability.timeZone, status: "OPEN" });
        }
      }
    }
    if (candidates.length > 500) return Response.json({ error: "This schedule produces more than 500 slots. Use a shorter date range." }, { status: 400 });
    if (!candidates.length) return Response.json({ created: 0, message: "No future slots were generated from the published weekly availability." });

    const created = await prisma.$transaction(async (tx) => {
      const low = new Date(Math.min(...candidates.map((slot) => slot.startsAt.getTime())));
      const high = new Date(Math.max(...candidates.map((slot) => slot.endsAt.getTime())));
      const existing = await tx.appointmentSlot.findMany({ where: { doctorId: doctor.id, startsAt: { lt: high }, endsAt: { gt: low } }, select: { startsAt: true, endsAt: true } });
      const fresh = candidates.filter((candidate) => !existing.some((slot) => slot.startsAt.getTime() === candidate.startsAt.getTime() && slot.endsAt.getTime() === candidate.endsAt.getTime()));
      if (fresh.some((candidate) => existing.some((slot) => candidate.startsAt < slot.endsAt && candidate.endsAt > slot.startsAt))) throw new Error("SLOT_OVERLAP");
      const result = await tx.appointmentSlot.createMany({ data: fresh });
      if (result.count) await tx.auditEvent.create({ data: { actorId: authResult.user!.id, action: "SCHEDULE_SLOTS_GENERATED", targetType: "Doctor", targetId: doctor.id } });
      return result.count;
    });
    return Response.json({ created }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_OVERLAP") return Response.json({ error: "Generated times overlap slots already in the schedule. Review the weekly hours and existing slots." }, { status: 409 });
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return Response.json({ error: "Some generated slots already exist. Refresh the schedule and retry." }, { status: 409 });
    return Response.json({ error: "Appointment slots could not be generated." }, { status: 503 });
  }
}
