import { randomBytes } from "node:crypto";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const authUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
// Use a process-local random value for development when no secret is configured.
// Production auth endpoints are disabled by server-auth unless a real secret is set.
const authSecret = process.env.SESSION_SECRET || randomBytes(32).toString("base64url");

export const auth = betterAuth({
  appName: "MediaBook",
  baseURL: authUrl,
  // Next.js strips its configured basePath before dispatching a Route Handler.
  basePath: "/api/auth",
  secret: authSecret,
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "PATIENT", input: false },
      isActive: { type: "boolean", required: false, defaultValue: true, input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({ data: { ...user, role: "PATIENT", isActive: true } }),
        after: async (user) => {
          if (user.role === "PATIENT") {
            await prisma.patient.upsert({
              where: { userId: user.id },
              create: { userId: user.id },
              update: {},
            });
          }
        },
      },
    },
  },
  advanced: {
    database: { generateId: "uuid" },
    cookiePrefix: "medibook",
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  trustedOrigins: [authUrl],
});
