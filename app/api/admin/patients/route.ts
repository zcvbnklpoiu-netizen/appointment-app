import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authResult = await requireRole(request, ["ADMIN"]);
  if (authResult.response) return authResult.response;
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
  const page = Math.max(1, Math.min(10000, Number(url.searchParams.get("page")) || 1));
  try {
    const where = { role: "PATIENT", ...(query ? { OR: [{ name: { contains: query } }, { email: { contains: query } }] } : {}) };
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({ where, select: { id: true, name: true, email: true, isActive: true, createdAt: true, patient: { select: { phone: true, _count: { select: { appointments: true } } } } }, orderBy: { createdAt: "desc" }, skip: (page - 1) * 25, take: 25 }),
      prisma.user.count({ where }),
    ]);
    return Response.json({ patients: users, total, page, pageSize: 25 }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Patient records are temporarily unavailable." }, { status: 503 }); }
}
