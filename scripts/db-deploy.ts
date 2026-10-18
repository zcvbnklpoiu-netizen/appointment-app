import "dotenv/config";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { resolveDatabaseConfiguration, resolveMigrationDatabaseUrl } from "../lib/database-config";

const { provider } = resolveDatabaseConfiguration(process.env);
resolveMigrationDatabaseUrl(process.env);

const schema = provider === "postgresql"
  ? "prisma/schema.postgresql.prisma"
  : "prisma/schema.prisma";

if (process.argv.includes("--validate-only")) {
  console.log(`Database deployment configuration is valid (${provider}; ${schema}).`);
  process.exit(0);
}

const prismaCli = resolve("node_modules", "prisma", "build", "index.js");
const migration = spawnSync(process.execPath, [prismaCli, "migrate", "deploy", "--schema", schema], {
  encoding: "utf8",
  env: process.env,
});

if (migration.error) {
  console.error("Could not start Prisma migrate deploy. Check that dependencies are installed.");
  process.exit(1);
}
const output = `${migration.stdout ?? ""}${migration.stderr ?? ""}`
  .replace(/postgres(?:ql)?:\/\/[^\s"'<>]+/gi, "postgresql://[redacted]")
  .replace(/Datasource "[^"]+": PostgreSQL database "[^"]+", schema "[^"]+" at "[^"]+"/gi,
    'Datasource "db": PostgreSQL database [redacted], schema [redacted], host [redacted]');
process.stdout.write(output);
process.exit(migration.status ?? 1);
