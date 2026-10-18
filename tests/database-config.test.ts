import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveDatabaseConfiguration,
  resolveMigrationDatabaseUrl,
  selectDatabaseProvider,
} from "../lib/database-config";

test("local configuration defaults to SQLite without needing a database URL", () => {
  assert.equal(selectDatabaseProvider({ NODE_ENV: "development" }), "sqlite");
  assert.deepEqual(resolveDatabaseConfiguration({ NODE_ENV: "development" }), {
    provider: "sqlite",
    databaseUrl: "file:./dev.db",
  });
});

test("PostgreSQL production configuration selects the matching runtime and migration URLs", () => {
  const env = {
    NODE_ENV: "production",
    DATABASE_PROVIDER: "postgresql",
    DATABASE_URL: "postgresql://app:private@db.example/medibook?sslmode=require",
    DATABASE_URL_UNPOOLED: "postgresql://app:private@direct.example/medibook?sslmode=require",
  };
  assert.deepEqual(resolveDatabaseConfiguration(env), {
    provider: "postgresql",
    databaseUrl: env.DATABASE_URL,
  });
  assert.equal(resolveMigrationDatabaseUrl(env), env.DATABASE_URL_UNPOOLED);
});

test("Vercel never initializes SQLite and requires an explicit PostgreSQL provider", () => {
  assert.equal(selectDatabaseProvider({ VERCEL: "1" }), "postgresql");
  assert.throws(
    () => resolveDatabaseConfiguration({ VERCEL: "1", DATABASE_URL: "file:./dev.db" }),
    /DATABASE_PROVIDER=postgresql/,
  );
  assert.throws(
    () => resolveDatabaseConfiguration({ VERCEL: "1", DATABASE_PROVIDER: "postgresql" }),
    /DATABASE_URL is required for PostgreSQL/,
  );
});

test("production rejects SQLite, with an explicit exception only for isolated integration tests", () => {
  assert.throws(
    () => resolveDatabaseConfiguration({ NODE_ENV: "production", DATABASE_PROVIDER: "sqlite", DATABASE_URL: "file:./dev.db" }),
    /Production requires PostgreSQL/,
  );
  assert.equal(
    resolveDatabaseConfiguration({ NODE_ENV: "production", MEDIBOOK_TEST_MODE: "1", DATABASE_PROVIDER: "sqlite", DATABASE_URL: "file:./isolated.db" }).provider,
    "sqlite",
  );
});

test("provider typos and provider/URL mismatches fail with actionable messages", () => {
  assert.throws(() => selectDatabaseProvider({ DATABASE_PROVIDER: "mysql" }), /DATABASE_PROVIDER must be/);
  assert.throws(
    () => resolveDatabaseConfiguration({ DATABASE_PROVIDER: "postgresql", DATABASE_URL: "file:./dev.db" }),
    /DATABASE_URL must be a valid postgres/,
  );
  assert.throws(
    () => resolveDatabaseConfiguration({ DATABASE_PROVIDER: "sqlite", DATABASE_URL: "postgresql://host/db" }),
    /DATABASE_URL must be a valid file:/,
  );
});

test("migration URL selection prefers explicit direct URL and rejects incompatible URLs", () => {
  const base = { DATABASE_PROVIDER: "postgresql", DATABASE_URL: "postgresql://app:private@pool.example/db" };
  assert.equal(resolveMigrationDatabaseUrl({ ...base, DIRECT_URL: "postgresql://app:private@direct.example/db" }), "postgresql://app:private@direct.example/db");
  assert.equal(resolveMigrationDatabaseUrl({ ...base, DATABASE_URL_UNPOOLED: "postgresql://app:private@unpooled.example/db" }), "postgresql://app:private@unpooled.example/db");
  assert.equal(resolveMigrationDatabaseUrl(base), base.DATABASE_URL);
  assert.throws(
    () => resolveMigrationDatabaseUrl({ ...base, DIRECT_URL: "file:./wrong.db" }),
    /migration URL must be a valid postgres/,
  );
});
