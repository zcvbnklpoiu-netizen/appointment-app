import { prisma } from "@/lib/prisma";
import { rejectCrossOrigin, requireRole } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authResult = await requireRole(request, ["ADMIN"]);
  if (authResult.response) return authResult.response;
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
  const page = Math.max(1, Math.min(10000, Number(url.searchParams.get("page")) || 1));
  const where = query ? { OR: [{ displayName: { contains: query } }, { slug: { contains: query } }, { specialty: { name: { contains: query } } }] } : {};
  try {
    const [doctors, total] = await prisma.$transaction([
      prisma.doctor.findMany({ where, select: { id: true, slug: true, displayName: true, professionalTitle: true, university: true, biography: true, qualifications: true, training: true, subSpecialties: true, services: true, procedures: true, languages: true, procedureCount: true, practiceStartYear: true, experienceYears: true, clinicName: true, location: true, consultationModes: true, timeZone: true, imageUrl: true, isActive: true, specialtyId: true, userId: true, specialty: { select: { name: true } } }, orderBy: { displayName: "asc" }, skip: (page - 1) * 25, take: 25 }),
      prisma.doctor.count({ where }),
    ]);
    return Response.json({ doctors, total, page, pageSize: 25 }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Doctor profiles are temporarily unavailable." }, { status: 503 }); }
}

export async function PATCH(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["ADMIN"]);
  if (authResult.response) return authResult.response;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid doctor details." }, { status: 400 });
  const input = body as Record<string, unknown>;
  if (typeof input.id !== "string" || input.id.length > 40) return Response.json({ error: "A valid doctor profile is required." }, { status: 400 });
  if (typeof input.displayName !== "string" || input.displayName.trim().length < 2 || input.displayName.trim().length > 120 || typeof input.specialtyId !== "string" || typeof input.experienceYears !== "number" || !Number.isInteger(input.experienceYears) || input.experienceYears < 0 || input.experienceYears > 80) return Response.json({ error: "Provide a name, specialty, and experience value from 0 to 80." }, { status: 400 });
  const textFields = ["professionalTitle", "university", "biography", "qualifications", "training", "subSpecialties", "services", "procedures", "languages", "clinicName", "location", "imageUrl", "timeZone"];
  if (textFields.some((key) => input[key] !== undefined && (typeof input[key] !== "string" || (input[key] as string).length > 2000))) return Response.json({ error: "Profile text is invalid or too long." }, { status: 400 });
  if (typeof input.university === "string" && input.university.length > 160) return Response.json({ error: "University must be 160 characters or fewer." }, { status: 400 });
  if (typeof input.imageUrl === "string" && input.imageUrl && (!/^\/(?!\/)[a-zA-Z0-9/_\-.]+$/.test(input.imageUrl) || input.imageUrl.includes(".."))) return Response.json({ error: "Profile images must use a local public path." }, { status: 400 });
  if (typeof input.timeZone === "string") { try { new Intl.DateTimeFormat("en", { timeZone: input.timeZone }); } catch { return Response.json({ error: "Time zone must be a valid IANA time zone." }, { status: 400 }); } }
  if (input.procedureCount !== undefined && input.procedureCount !== null && (!Number.isSafeInteger(input.procedureCount) || (input.procedureCount as number) < 0 || (input.procedureCount as number) > 10_000_000)) return Response.json({ error: "Procedure count must be a whole number from 0 to 10,000,000." }, { status: 400 });
  if (input.practiceStartYear !== undefined && input.practiceStartYear !== null && (!Number.isInteger(input.practiceStartYear) || (input.practiceStartYear as number) < 1850 || (input.practiceStartYear as number) > new Date().getFullYear())) return Response.json({ error: "Practice start year is invalid." }, { status: 400 });
  try {
    const doctor = await prisma.$transaction(async (tx) => {
      const updated = await tx.doctor.update({ where: { id: input.id as string }, data: {
        displayName: (input.displayName as string).trim(), specialtyId: input.specialtyId as string, experienceYears: input.experienceYears as number,
        ...(typeof input.biography === "string" ? { biography: input.biography.trim() } : {}),
        ...(typeof input.qualifications === "string" ? { qualifications: input.qualifications.trim() } : {}),
        ...Object.fromEntries(["professionalTitle", "training", "subSpecialties", "services", "procedures", "languages"].filter((key) => typeof input[key] === "string").map((key) => [key, (input[key] as string).trim() || null])),
        ...(typeof input.university === "string" ? { university: input.university.trim().slice(0, 160) || null } : {}),
        ...(input.procedureCount === null || Number.isInteger(input.procedureCount) ? { procedureCount: input.procedureCount as number | null } : {}),
        ...(input.practiceStartYear === null || Number.isInteger(input.practiceStartYear) ? { practiceStartYear: input.practiceStartYear as number | null } : {}),
        ...(typeof input.clinicName === "string" ? { clinicName: input.clinicName.trim().slice(0, 160) } : {}),
        ...(typeof input.location === "string" ? { location: input.location.trim().slice(0, 200) } : {}),
        ...(typeof input.imageUrl === "string" ? { imageUrl: input.imageUrl.trim().slice(0, 500) } : {}),
        ...(typeof input.timeZone === "string" ? { timeZone: input.timeZone } : {}),
        ...(typeof input.isActive === "boolean" ? { isActive: input.isActive } : {}),
      }, select: { id: true, slug: true, displayName: true, isActive: true, specialty: { select: { name: true } } } });
      await tx.auditEvent.create({ data: { actorId: authResult.user!.id, action: "DOCTOR_UPDATED", targetType: "Doctor", targetId: updated.id } });
      return updated;
    });
    return Response.json({ doctor });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2003") return Response.json({ error: "Choose an existing specialty." }, { status: 400 });
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") return Response.json({ error: "Doctor profile not found." }, { status: 404 });
    return Response.json({ error: "Doctor profile could not be updated." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const authResult = await requireRole(request, ["ADMIN"]);
  if (authResult.response) return authResult.response;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid doctor details." }, { status: 400 });
  const input = body as Record<string, unknown>;
  const requiredStrings = ["slug", "displayName", "specialtyId"];
  if (requiredStrings.some((key) => typeof input[key] !== "string" || !(input[key] as string).trim()) || typeof input.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug) || typeof input.experienceYears !== "number" || !Number.isInteger(input.experienceYears) || input.experienceYears < 0 || input.experienceYears > 80) {
    return Response.json({ error: "Provide a URL-safe slug, display name, existing specialty ID, and experience years from 0 to 80." }, { status: 400 });
  }
  const optionalText = ["professionalTitle", "university", "biography", "qualifications", "training", "subSpecialties", "services", "procedures", "languages", "clinicName", "location", "consultationModes", "imageUrl", "timeZone"];
  if (optionalText.some((key) => input[key] !== undefined && (typeof input[key] !== "string" || (input[key] as string).length > 2000))) return Response.json({ error: "Doctor profile text is too long or invalid." }, { status: 400 });
  if (typeof input.university === "string" && input.university.length > 160) return Response.json({ error: "University must be 160 characters or fewer." }, { status: 400 });
  const modes = typeof input.consultationModes === "string" ? input.consultationModes.split(",").map((mode) => mode.trim()).filter(Boolean) : ["IN_PERSON"];
  if (modes.length === 0 || modes.some((mode) => !["IN_PERSON", "VIDEO"].includes(mode)) || new Set(modes).size !== modes.length) return Response.json({ error: "Consultation modes may include in-person and video." }, { status: 400 });
  if (typeof input.timeZone === "string") {
    try { new Intl.DateTimeFormat("en", { timeZone: input.timeZone }); } catch { return Response.json({ error: "Time zone must be a valid IANA time zone." }, { status: 400 }); }
  }
  if (input.procedureCount !== undefined && input.procedureCount !== null && (!Number.isSafeInteger(input.procedureCount) || (input.procedureCount as number) < 0 || (input.procedureCount as number) > 10_000_000)) return Response.json({ error: "Procedure count must be a whole number from 0 to 10,000,000." }, { status: 400 });
  if (input.practiceStartYear !== undefined && input.practiceStartYear !== null && (!Number.isInteger(input.practiceStartYear) || (input.practiceStartYear as number) < 1850 || (input.practiceStartYear as number) > new Date().getFullYear())) return Response.json({ error: "Practice start year is invalid." }, { status: 400 });
  if (typeof input.imageUrl === "string" && input.imageUrl && (!/^\/(?!\/)[a-zA-Z0-9/_\-.]+$/.test(input.imageUrl) || input.imageUrl.includes(".."))) return Response.json({ error: "Profile images must use a local public path." }, { status: 400 });
  try {
    const doctor = await prisma.$transaction(async (tx) => {
      const created = await tx.doctor.create({ data: {
        slug: input.slug as string,
        displayName: (input.displayName as string).trim().slice(0, 120),
        specialtyId: input.specialtyId as string,
        experienceYears: input.experienceYears as number,
        biography: typeof input.biography === "string" ? input.biography.trim() : "",
        qualifications: typeof input.qualifications === "string" ? input.qualifications.trim() : "",
        professionalTitle: typeof input.professionalTitle === "string" ? input.professionalTitle.trim() || null : null,
        university: typeof input.university === "string" ? input.university.trim().slice(0, 160) || null : null,
        training: typeof input.training === "string" ? input.training.trim() || null : null,
        subSpecialties: typeof input.subSpecialties === "string" ? input.subSpecialties.trim() || null : null,
        services: typeof input.services === "string" ? input.services.trim() || null : null,
        procedures: typeof input.procedures === "string" ? input.procedures.trim() || null : null,
        languages: typeof input.languages === "string" ? input.languages.trim() || null : null,
        procedureCount: input.procedureCount === null || Number.isInteger(input.procedureCount) ? input.procedureCount as number | null : null,
        practiceStartYear: input.practiceStartYear === null || Number.isInteger(input.practiceStartYear) ? input.practiceStartYear as number | null : null,
        clinicName: typeof input.clinicName === "string" ? input.clinicName.trim().slice(0, 160) : "",
        location: typeof input.location === "string" ? input.location.trim().slice(0, 200) : "",
        consultationModes: modes.join(","),
        timeZone: typeof input.timeZone === "string" ? input.timeZone : "Asia/Amman",
        imageUrl: typeof input.imageUrl === "string" ? input.imageUrl.trim().slice(0, 500) : "",
      }, select: { id: true, slug: true, displayName: true, specialty: { select: { name: true } } } });
      await tx.auditEvent.create({ data: { actorId: authResult.user!.id, action: "DOCTOR_CREATED", targetType: "Doctor", targetId: created.id } });
      return created;
    });
    return Response.json({ doctor }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return Response.json({ error: "That doctor slug is already in use." }, { status: 409 });
    if (error && typeof error === "object" && "code" in error && error.code === "P2003") return Response.json({ error: "Choose an existing specialty." }, { status: 400 });
    return Response.json({ error: "The doctor profile could not be saved." }, { status: 503 });
  }
}
