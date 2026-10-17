import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { isAuthConfigured } from "@/lib/server-auth";

export const runtime = "nodejs";
const handlers = toNextJsHandler(auth);

function configuredHandler(handler: (request: Request) => Promise<Response>) {
  return async (request: Request) => {
    if (process.env.NODE_ENV === "production" && !isAuthConfigured()) {
      return Response.json({ error: "Authentication is not configured on this server." }, { status: 503 });
    }
    return handler(request);
  };
}

export const GET = configuredHandler(handlers.GET);
export const POST = configuredHandler(handlers.POST);
