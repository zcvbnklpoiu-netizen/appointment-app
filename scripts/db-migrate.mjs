import "dotenv/config";
import { spawnSync } from "node:child_process";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const provider = process.env.DATABASE_PROVIDER ?? (databaseUrl.startsWith("postgres") ? "postgresql" : "sqlite");

if (provider !== "sqlite" && provider !== "postgresql") {
  throw new Error("DATABASE_PROVIDER must be either sqlite or postgresql.");
}

if (provider === "sqlite") {
  const ensure = spawnSync(process.execPath, ["scripts/ensure-sqlite-db.mjs"], { stdio: "inherit" });
  if (ensure.status !== 0) process.exit(ensure.status ?? 1);
}

const schema = provider === "postgresql" ? "prisma/schema.postgresql.prisma" : "prisma/schema.prisma";
const prismaCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const migration = spawnSync(prismaCommand, ["prisma", "migrate", "dev", "--schema", schema], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(migration.status ?? 1);
