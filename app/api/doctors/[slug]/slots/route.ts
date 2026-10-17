import { prisma } from "@/lib/prisma";
import { addCalendarDays, dateKeyInTimeZone, isDateKey } from "@/lib/availability-calendar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const url = new URL(request.url);
  const fromValue = url.searchParams.get("from");
  const toValue = url.searchParams.get("to");

  try {
    const doctor = await prisma.doctor.findFirst({
      where: { slug, isActive: true },
      select: { id: true, displayName: true, consultationModes: true, timeZone: true },
    });
    if (!doctor) return Response.json({ error: "This doctor is not available for online booking." }, { status: 404 });

    const today = dateKeyInTimeZone(new Date(), doctor.timeZone);
    const from = fromValue ?? today;
    if (!isDateKey(from)) return Response.json({ error: "Choose a valid date range of 32 days or less." }, { status: 400 });
    const to = toValue ?? addCalendarDays(from, 32);
    if (!isDateKey(to) || to <= from || addCalendarDays(from, 32) < to) {
      return Response.json({ error: "Choose a valid date range of 32 days or less." }, { status: 400 });
    }

    // Search a broad UTC window so local dates remain correct in every IANA time zone.
    const fromUtc = new Date(Date.parse(`${from}T00:00:00.000Z`) - 86400000);
    const toUtc = new Date(Date.parse(`${to}T00:00:00.000Z`) + 86400000);
    const records = await prisma.appointmentSlot.findMany({
      where: { doctorId: doctor.id, startsAt: { gte: fromUtc, lt: toUtc } },
      select: { id: true, startsAt: true, endsAt: true, timeZone: true, status: true },
      orderBy: { startsAt: "asc" },
      take: 500,
    });
    const now = Date.now();
    const slots = records
      .map((slot) => {
        const isPast = slot.startsAt.getTime() <= now;
        return {
          ...slot,
          date: dateKeyInTimeZone(slot.startsAt, slot.timeZone || doctor.timeZone),
          isPast,
          isBookable: slot.status === "OPEN" && !isPast,
        };
      })
      .filter((slot) => slot.date >= from && slot.date < to);

    return Response.json({
      doctor: { displayName: doctor.displayName, consultationModes: doctor.consultationModes, timeZone: doctor.timeZone },
      range: { from, to },
      slots,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Appointment availability is temporarily unavailable." }, { status: 503 });
  }
}
