import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { prisma, prismaProvider } from "../lib/prisma";

async function main() {
const databaseUrl = process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const name = process.env.ADMIN_NAME?.trim();
const password = process.env.ADMIN_PASSWORD;

if (!databaseUrl || !email || !name || !password) {
  throw new Error("Set DATABASE_URL, ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSWORD before running this one-time command.");
}
if (process.env.DATABASE_PROVIDER && process.env.DATABASE_PROVIDER !== prismaProvider) {
  throw new Error("DATABASE_PROVIDER does not match the configured Prisma client.");
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || name.length < 2 || name.length > 120 || password.length < 12 || password.length > 128) {
  throw new Error("Use a valid email, a 2–120 character name, and a 12–128 character password.");
}

try {
  const userId = randomUUID();
  const hashedPassword = await hashPassword(password);
  await prisma.$transaction(async (tx) => {
    if (await tx.user.count({ where: { role: "ADMIN" } })) {
      throw new Error("An administrator already exists. This bootstrap command only creates the first administrator and will not modify accounts.");
    }
    if (await tx.user.findUnique({ where: { email }, select: { id: true } })) {
      throw new Error("An account with that email already exists. This command will not modify existing accounts.");
    }
    await tx.user.create({ data: { id: userId, email, name, emailVerified: false, role: "ADMIN" } });
    await tx.account.create({ data: { id: randomUUID(), accountId: userId, providerId: "credential", userId, password: hashedPassword } });
  });
  process.stdout.write("Administrator account created.\n");
} finally {
  await prisma.$disconnect();
}
}

main().catch((error: unknown) => {
  const safeMessages = new Set([
    "Set DATABASE_URL, ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSWORD in your ignored .env file before running this one-time command.",
    "Use a valid email, a 2â€“120 character name, and a 12â€“128 character password.",
    "An administrator already exists. This bootstrap command only creates the first administrator and will not modify accounts.",
    "An account with that email already exists. This command will not modify existing accounts.",
  ]);
  const details = error && typeof error === "object" ? error as { code?: unknown; message?: unknown } : {};
  const code = typeof details.code === "string" ? details.code : "";
  const errorText = typeof details.message === "string" ? details.message.toLowerCase() : "";
  const message = error instanceof Error && error.message.startsWith("Use a valid email,")
    ? "Admin configuration is invalid. Use a valid email, a 2-120 character name, and a 12-128 character password."
    : error instanceof Error && safeMessages.has(error.message)
      ? error.message
      : code === "P2021" || errorText.includes("no such table")
        ? "The database schema is not ready. Apply the checked-in migrations with npm run db:deploy, then retry."
        : code === "P2002" || code === "SQLITE_CONSTRAINT_UNIQUE" || errorText.includes("unique constraint failed")
          ? "The database rejected a duplicate record. Check whether an administrator or account with this email already exists; no existing account was modified."
          : code === "SQLITE_BUSY" || errorText.includes("database is locked")
            ? "The SQLite database is busy. Close other database tools and retry."
            : code === "SQLITE_READONLY" || errorText.includes("readonly")
              ? "The SQLite database is read-only. Check file and directory permissions."
              : code === "SQLITE_CANTOPEN" || errorText.includes("unable to open database file")
                ? "The SQLite database could not be opened. Check DATABASE_URL and ensure its parent directory exists and is writable."
                : "Administrator account creation failed for an unclassified reason. Configuration values were not printed; verify the local database and migration status.";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
