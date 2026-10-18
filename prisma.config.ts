import "dotenv/config";
import { defineConfig } from "prisma/config";

const configuredUrl = process.env.DATABASE_URL;
const usePostgres = process.env.DATABASE_PROVIDER === "postgresql" || Boolean(configuredUrl?.startsWith("postgres"));

export default defineConfig({
  schema: usePostgres ? "prisma/schema.postgresql.prisma" : "prisma/schema.prisma",
  migrations: { path: usePostgres ? "prisma/migrations-postgresql" : "prisma/migrations" },
  datasource: {
    url: usePostgres
      ? process.env.DIRECT_URL ?? process.env.DATABASE_URL
      : process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
