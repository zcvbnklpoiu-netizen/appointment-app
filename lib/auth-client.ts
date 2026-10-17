import { createAuthClient } from "better-auth/client";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/appointment-app";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  basePath: `${basePath}/api/auth`,
  fetchOptions: { credentials: "include" },
});
