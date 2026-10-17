import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const specialties = await prisma.specialty.findMany({ where: { isActive: true }, select: { id: true, name: true, slug: true, description: true }, orderBy: { name: "asc" } });
    return Response.json({ specialties }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "The specialty directory is temporarily unavailable." }, { status: 503 });
  }
}
