import { prisma } from "@/lib/prisma";
import { rejectCrossOrigin, requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authResult = await requireRole(request, ["ADMIN"]);
  if (authResult.response) return authResult.response;
  const specialties = await prisma.specialty.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true, description: true, isActive: true, _count: { select: { doctors: true } } } });
  return Response.json({ specialties }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["ADMIN"]);
  if (authResult.response) return authResult.response;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid specialty details." }, { status: 400 });
  const { name, slug, description } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100 || typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100 || (description !== undefined && (typeof description !== "string" || description.length > 500))) {
    return Response.json({ error: "Provide a specialty name, URL-safe slug, and optional description (up to 500 characters)." }, { status: 400 });
  }
  try {
    const specialty = await prisma.$transaction(async (tx) => {
      const created = await tx.specialty.create({ data: { name: name.trim(), slug, description: typeof description === "string" ? description.trim() : null } });
      await tx.auditEvent.create({ data: { actorId: authResult.user!.id, action: "SPECIALTY_CREATED", targetType: "Specialty", targetId: created.id } });
      return created;
    });
    return Response.json({ specialty }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return Response.json({ error: "That specialty name or slug already exists." }, { status: 409 });
    return Response.json({ error: "The specialty could not be saved." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["ADMIN"]);
  if (authResult.response) return authResult.response;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid specialty details." }, { status: 400 });
  const { id, name, slug, description, isActive } = body as Record<string, unknown>;
  if (typeof id !== "string" || id.length > 40 || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100 || typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100 || (description !== undefined && (description !== null && (typeof description !== "string" || description.length > 500))) || (isActive !== undefined && typeof isActive !== "boolean")) return Response.json({ error: "Provide a valid specialty name, URL-safe slug, and optional description." }, { status: 400 });
  try {
    const specialty = await prisma.$transaction(async (tx) => {
      const updated = await tx.specialty.update({ where: { id }, data: { name: name.trim(), slug, description: typeof description === "string" ? description.trim() || null : null, ...(typeof isActive === "boolean" ? { isActive } : {}) } });
      await tx.auditEvent.create({ data: { actorId: authResult.user!.id, action: "SPECIALTY_UPDATED", targetType: "Specialty", targetId: id } });
      return updated;
    });
    return Response.json({ specialty });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return Response.json({ error: "That specialty name or slug already exists." }, { status: 409 });
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") return Response.json({ error: "Specialty not found." }, { status: 404 });
    return Response.json({ error: "The specialty could not be updated." }, { status: 503 });
  }
}
