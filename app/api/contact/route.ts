import { createHmac, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { validateContactSubmission } from "@/lib/contact-validation";
import { getRequestUser, rejectCrossOrigin } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_BODY_BYTES = 12_000;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export async function POST(request: Request) {
  const originError = rejectCrossOrigin(request);
  if (originError) return originError;
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return Response.json({ error: "The message is too large." }, { status: 413 });
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ error: "Request body is required." }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > MAX_BODY_BYTES) {
        await reader.cancel();
        return Response.json({ error: "The message is too large." }, { status: 413 });
      }
      chunks.push(value);
    }
  } catch { return Response.json({ error: "Unable to read this request." }, { status: 400 }); }
  const bodyBytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) { bodyBytes.set(chunk, offset); offset += chunk.byteLength; }
  const raw = new TextDecoder().decode(bodyBytes);
  let input: unknown;
  try { input = JSON.parse(raw); } catch { return Response.json({ error: "Request must contain valid JSON." }, { status: 400 }); }
  const validated = validateContactSubmission(input);
  if (validated.error) return Response.json({ error: validated.error }, { status: 400 });

  // Configure the reverse proxy to overwrite X-Forwarded-For before relying on this per-client limit.
  const clientAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limiterKey = createHmac("sha256", process.env.SESSION_SECRET ?? "contact-rate-limit-local-only").update(clientAddress).digest("hex");
  const now = new Date();
  const windowStart = new Date(Math.floor(now.getTime() / WINDOW_MS) * WINDOW_MS);
  try {
    await prisma.$executeRaw`INSERT INTO "ContactRateLimit" ("key", "windowStart", "count", "updatedAt") VALUES (${limiterKey}, ${windowStart}, 1, ${now}) ON CONFLICT("key") DO UPDATE SET "count" = CASE WHEN "ContactRateLimit"."windowStart" = excluded."windowStart" THEN "ContactRateLimit"."count" + 1 ELSE 1 END, "windowStart" = excluded."windowStart", "updatedAt" = excluded."updatedAt"`;
    const limit = await prisma.contactRateLimit.findUnique({ where: { key: limiterKey }, select: { count: true } });
    if ((limit?.count ?? 0) > MAX_PER_WINDOW) return Response.json({ error: "Too many messages were sent from this connection. Please try again later." }, { status: 429, headers: { "Retry-After": "3600" } });
    const user = await getRequestUser(request);
    const reference = `MB-${randomBytes(5).toString("hex").toUpperCase()}`;
    const submission = await prisma.contactSubmission.create({
      data: { ...validated.data!, reference, userId: user?.role === "PATIENT" ? user.id : null },
      select: { reference: true, createdAt: true },
    });
    return Response.json({ submission }, { status: 201 });
  } catch {
    return Response.json({ error: "Your message could not be saved. Please try again later." }, { status: 503 });
  }
}
