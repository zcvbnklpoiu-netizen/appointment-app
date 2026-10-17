import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authResult = await requireRole(request, ["ADMIN"]);
  if (authResult.response) return authResult.response;
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return Response.json({ error: "Provide a valid registered account email." }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true, role: true, doctor: { select: { id: true } } } });
  if (!user || user.role !== "PATIENT" || user.doctor) return Response.json({ error: "No unlinked patient account was found for that email." }, { status: 404 });
  return Response.json({ user }, { headers: { "Cache-Control": "no-store" } });
}
