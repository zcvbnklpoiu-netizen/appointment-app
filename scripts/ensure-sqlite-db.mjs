import "dotenv/config";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
if (process.env.DATABASE_PROVIDER === "postgresql" || url.startsWith("postgres")) {
  process.stdout.write("PostgreSQL selected; skipping local SQLite file creation.\n");
  process.exit(0);
}
if (!url.startsWith("file:")) {
  throw new Error("This local database setup expects a SQLite file: DATABASE_URL.");
}

const filePath = decodeURIComponent(url.slice("file:".length).split("?")[0]);
if (!filePath) throw new Error("DATABASE_URL must include a SQLite database file path.");
const absolutePath = path.resolve(process.cwd(), filePath);
if (!existsSync(absolutePath)) {
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  new Database(absolutePath).close();
}
