import { auth } from "@/lib/auth";

export type AppRole = "PATIENT" | "DOCTOR" | "ADMIN";

export function isAuthConfigured() {
  const secret = process.env.SESSION_SECRET;
  if (typeof secret !== "string" || secret.length < 32 || secret.startsWith("replace-with-")) return false;

  try {
    const authUrl = new URL(process.env.BETTER_AUTH_URL ?? "http://localhost:3000");
    const siteUrl = new URL(globalThis.process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
    const localHttp = (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1")
      && ["localhost", "127.0.0.1", "[::1]"].includes(authUrl.hostname)
      && authUrl.protocol === "http:";
    return authUrl.origin === siteUrl.origin
      && (authUrl.protocol === "https:" || localHttp)
      && authUrl.pathname === "/"
      && siteUrl.pathname === "/";
  } catch {
    return false;
  }
}

export async function getRequestUser(request: Request) {
  if (process.env.NODE_ENV === "production" && !isAuthConfigured()) return null;
  const result = await auth.api.getSession({ headers: request.headers });
  if (!result?.user || result.user.isActive === false) return null;
  return result.user;
}

export async function requireRole(request: Request, roles: AppRole[]) {
  const user = await getRequestUser(request);
  if (!user) return { user: null, response: Response.json({ error: "Authentication required." }, { status: 401 }) };
  if (!roles.includes(user.role as AppRole)) return { user: null, response: Response.json({ error: "You do not have permission to perform this action." }, { status: 403 }) };
  return { user, response: null };
}

export function rejectCrossOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const expected = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  try {
    if (new URL(origin).origin !== new URL(expected).origin) {
      return Response.json({ error: "Cross-origin request rejected." }, { status: 403 });
    }
  } catch {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }
  return null;
}
