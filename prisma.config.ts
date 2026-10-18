import "dotenv/config";
import { defineConfig } from "prisma/config";
import { selectDatabaseProvider, validateConfiguredDatabaseUrl } from "./lib/database-config";

const provider = selectDatabaseProvider(process.env);
validateConfiguredDatabaseUrl(process.env);
const usePostgres = provider === "postgresql";

export default defineConfig({
  schema: usePostgres ? "prisma/schema.postgresql.prisma" : "prisma/schema.prisma",
  migrations: { path: usePostgres ? "prisma/migrations-postgresql" : "prisma/migrations" },
  datasource: {
    // Client generation and Next build must work without a live database URL.
    // db:deploy validates that a URL is configured before invoking migrate deploy.
    url: usePostgres
      ? process.env.DIRECT_URL ?? process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL
      : process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
