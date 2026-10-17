import { prisma } from "@/lib/prisma";
import { rejectCrossOrigin, requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const statuses = ["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

export async function GET(request: Request) {
  const authResult = await requireRole(request, ["ADMIN"]);
  if (authResult.response) return authResult.response;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
  const page = Math.max(1, Math.min(1000, Number(url.searchParams.get("page")) || 1));
  const where = {
    ...(statuses.includes(status as (typeof statuses)[number]) ? { status: status as (typeof statuses)[number] } : {}),
    ...(query ? { OR: [{ reference: { contains: query } }, { name: { contains: query } }, { email: { contains: query } }, { subject: { contains: query } }] } : {}),
  };
  try {
    const [submissions, total] = await prisma.$transaction([
      prisma.contactSubmission.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * 20, take: 20 }),
      prisma.contactSubmission.count({ where }),
    ]);
    return Response.json({ submissions, total, page, pageSize: 20 }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Contact submissions are temporarily unavailable." }, { status: 503 }); }
}

export async function PATCH(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["ADMIN"]);
  if (authResult.response) return authResult.response;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid contact update." }, { status: 400 });
  const { id, status } = body as Record<string, unknown>;
  if (typeof id !== "string" || id.length > 40 || !statuses.includes(status as (typeof statuses)[number])) return Response.json({ error: "Choose a valid submission and status." }, { status: 400 });
  try {
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.contactSubmission.update({ where: { id }, data: { status: status as (typeof statuses)[number] } });
      await tx.auditEvent.create({ data: { actorId: authResult.user!.id, action: `CONTACT_${status}`, targetType: "ContactSubmission", targetId: id } });
      return updated;
    });
    return Response.json({ submission: result });
  } catch { return Response.json({ error: "Contact submission not found or could not be updated." }, { status: 404 }); }
}
