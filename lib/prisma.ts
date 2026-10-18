import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaClient as PostgreSqlPrismaClient } from "@/generated/prisma-postgresql/client";
import { resolveDatabaseConfiguration, selectDatabaseProvider } from "@/lib/database-config";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const { provider, databaseUrl } = resolveDatabaseConfiguration();
  if (provider === "postgresql") {
    const pool = new Pool({ connectionString: databaseUrl, max: 3, idleTimeoutMillis: 5_000 });
    if (process.env.VERCEL === "1") attachDatabasePool(pool);
    const adapter = new PrismaPg(pool, { disposeExternalPool: false });
    return new PostgreSqlPrismaClient({ adapter }) as unknown as PrismaClient;
  }

  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  return new PrismaClient({ adapter });
}

function getPrismaClient() {
  globalForPrisma.prisma ??= createPrismaClient();
  return globalForPrisma.prisma;
}

export function getPrismaProvider() {
  return selectDatabaseProvider();
}

// Defer URL validation and client creation until a server operation actually needs Prisma.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
