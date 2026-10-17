import { prisma } from "@/lib/prisma";
import { rejectCrossOrigin, requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["ADMIN", "DOCTOR"]);
  if (authResult.response) return authResult.response;
  const { slug } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  const slots = body && typeof body === "object" ? (body as Record<string, unknown>).slots : null;
  if (!Array.isArray(slots) || slots.length < 1 || slots.length > 100) return Response.json({ error: "Provide between 1 and 100 appointment slots." }, { status: 400 });

  const doctor = await prisma.doctor.findFirst({ where: { slug, isActive: true }, select: { id: true, userId: true } });
  if (!doctor) return Response.json({ error: "Doctor not found." }, { status: 404 });
  if (authResult.user!.role === "DOCTOR" && doctor.userId !== authResult.user!.id) return Response.json({ error: "You can only manage your own schedule." }, { status: 403 });

  const now = Date.now();
  const parsed = slots.map((slot) => {
    if (!slot || typeof slot !== "object") return null;
    const startsAt = new Date((slot as Record<string, unknown>).startsAt as string);
    const endsAt = new Date((slot as Record<string, unknown>).endsAt as string);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || startsAt.getTime() <= now || endsAt <= startsAt || endsAt.getTime() - startsAt.getTime() > 4 * 60 * 60 * 1000) return null;
    const slotTimeZone = (slot as Record<string, unknown>).timeZone;
    if (slotTimeZone !== undefined) {
      if (typeof slotTimeZone !== "string" || slotTimeZone.length > 80) return null;
      try { new Intl.DateTimeFormat("en", { timeZone: slotTimeZone }); } catch { return null; }
    }
    return { doctorId: doctor.id, startsAt, endsAt, timeZone: (slotTimeZone as string | undefined) ?? "Asia/Amman", status: "OPEN" as const };
  });
  if (parsed.some((slot) => slot === null)) return Response.json({ error: "Every slot must have valid future start/end times and last no more than four hours." }, { status: 400 });
  const sorted = [...parsed].sort((a, b) => a!.startsAt.getTime() - b!.startsAt.getTime());
  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index]!.startsAt < sorted[index - 1]!.endsAt) return Response.json({ error: "Submitted appointment slots cannot overlap." }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const minStart = new Date(Math.min(...parsed.map((slot) => slot!.startsAt.getTime())));
      const maxEnd = new Date(Math.max(...parsed.map((slot) => slot!.endsAt.getTime())));
      const existing = await tx.appointmentSlot.findMany({ where: { doctorId: doctor.id, startsAt: { lt: maxEnd }, endsAt: { gt: minStart } }, select: { startsAt: true, endsAt: true } });
      if (parsed.some((candidate) => existing.some((slot) => candidate!.startsAt < slot.endsAt && candidate!.endsAt > slot.startsAt))) throw new Error("SLOT_OVERLAP");
      const created = await tx.appointmentSlot.createMany({ data: parsed as NonNullable<(typeof parsed)[number]>[] });
      await tx.auditEvent.create({ data: { actorId: authResult.user!.id, action: "SCHEDULE_SLOTS_CREATED", targetType: "Doctor", targetId: doctor.id } });
      return created.count;
    });
    return Response.json({ created: result }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_OVERLAP") return Response.json({ error: "One or more appointment times overlap an existing slot." }, { status: 409 });
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return Response.json({ error: "One or more slots already exist for this doctor." }, { status: 409 });
    return Response.json({ error: "The schedule could not be saved." }, { status: 503 });
  }
}
