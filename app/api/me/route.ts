import { prisma } from "@/lib/prisma";
import { rejectCrossOrigin, requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authResult = await requireRole(request, ["PATIENT", "DOCTOR", "ADMIN"]);
  if (authResult.response) return authResult.response;
  const user = authResult.user!;
  const patient = user.role === "PATIENT" ? await prisma.patient.findUnique({ where: { userId: user.id }, select: { phone: true } }) : null;
  return Response.json({ profile: { name: user.name, email: user.email, role: user.role, phone: patient?.phone ?? "" } }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["PATIENT"]);
  if (authResult.response) return authResult.response;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid profile details." }, { status: 400 });
  const { name, phone } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 120 || (phone !== undefined && phone !== null && (typeof phone !== "string" || phone.length > 32))) return Response.json({ error: "Enter a valid name and phone number." }, { status: 400 });
  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: authResult.user!.id }, data: { name: name.trim() } });
      await tx.patient.update({ where: { userId: authResult.user!.id }, data: { phone: typeof phone === "string" && phone.trim() ? phone.trim() : null } });
    });
    return Response.json({ message: "Profile updated." });
  } catch {
    return Response.json({ error: "The profile could not be updated." }, { status: 503 });
  }
}
