import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";
import { isAuthConfigured } from "@/lib/server-auth";

export const runtime = "nodejs";

function configuredHandler(method: "GET" | "POST") {
  return async (request: Request) => {
    if (process.env.NODE_ENV === "production" && !isAuthConfigured()) {
      return Response.json({ error: "Authentication is not configured on this server." }, { status: 503 });
    }
    const handlers = toNextJsHandler(getAuth());
    return handlers[method](request);
  };
}

export const GET = configuredHandler("GET");
export const POST = configuredHandler("POST");
