import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaClient as PostgreSqlPrismaClient } from "@/generated/prisma-postgresql/client";

if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required in production; configure a persistent database before starting the app.");
}
const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const configuredProvider = process.env.DATABASE_PROVIDER ?? (databaseUrl.startsWith("postgres") ? "postgresql" : "sqlite");
if (configuredProvider !== "sqlite" && configuredProvider !== "postgresql") {
  throw new Error("DATABASE_PROVIDER must be either sqlite or postgresql.");
}
const databaseProvider: "sqlite" | "postgresql" = configuredProvider;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  if (databaseProvider === "postgresql") {
    if (!databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("postgresql://")) {
      throw new Error("DATABASE_URL must use PostgreSQL when DATABASE_PROVIDER=postgresql.");
    }
    const adapter = new PrismaPg({ connectionString: databaseUrl, max: 3 });
    return new PostgreSqlPrismaClient({ adapter }) as unknown as PrismaClient;
  }

  if (databaseProvider !== "sqlite") {
    throw new Error("DATABASE_PROVIDER must be either sqlite or postgresql.");
  }
  if (!databaseUrl.startsWith("file:")) {
    throw new Error("DATABASE_URL must use a file: URL when DATABASE_PROVIDER=sqlite.");
  }
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
export const prismaProvider = databaseProvider;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
