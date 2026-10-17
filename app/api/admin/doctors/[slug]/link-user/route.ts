import { prisma } from "@/lib/prisma";
import { rejectCrossOrigin, requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["ADMIN"]);
  if (authResult.response) return authResult.response;
  const { slug } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  const userId = body && typeof body === "object" ? (body as Record<string, unknown>).userId : null;
  if (typeof userId !== "string" || userId.length > 100) return Response.json({ error: "Provide an existing user ID." }, { status: 400 });
  try {
    const doctor = await prisma.doctor.findFirst({ where: { slug, isActive: true }, select: { id: true } });
    if (!doctor) return Response.json({ error: "Doctor not found." }, { status: 404 });
    const linkedUser = await prisma.$transaction(async (tx) => {
      const account = await tx.user.findUnique({ where: { id: userId as string }, select: { id: true, role: true } });
      if (!account || account.role === "ADMIN") throw new Error("ACCOUNT_NOT_LINKABLE");
      const linked = await tx.doctor.update({ where: { id: doctor.id }, data: { userId: account.id }, select: { id: true, slug: true } });
      await tx.user.update({ where: { id: account.id }, data: { role: "DOCTOR" } });
      await tx.auditEvent.create({ data: { actorId: authResult.user!.id, action: "DOCTOR_ACCOUNT_LINKED", targetType: "Doctor", targetId: linked.id } });
      return linked;
    });
    return Response.json({ doctor: linkedUser });
  } catch (error) {
    if (error instanceof Error && error.message === "ACCOUNT_NOT_LINKABLE") return Response.json({ error: "That user cannot be linked to this doctor profile." }, { status: 400 });
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return Response.json({ error: "This user or doctor profile is already linked to another account." }, { status: 409 });
    return Response.json({ error: "The doctor account could not be linked." }, { status: 503 });
  }
}
