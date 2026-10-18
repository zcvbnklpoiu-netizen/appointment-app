export type DatabaseProvider = "sqlite" | "postgresql";

type DatabaseEnvironment = Record<string, string | undefined>;

const LOCAL_SQLITE_URL = "file:./dev.db";

export function selectDatabaseProvider(env: DatabaseEnvironment = process.env): DatabaseProvider {
  const configuredProvider = env.DATABASE_PROVIDER?.trim();
  if (configuredProvider !== undefined) {
    if (configuredProvider === "sqlite" || configuredProvider === "postgresql") return configuredProvider;
    throw new Error("DATABASE_PROVIDER must be either sqlite or postgresql.");
  }

  const databaseUrl = env.DATABASE_URL?.trim();
  if (databaseUrl && /^postgres(?:ql)?:\/\//i.test(databaseUrl)) return "postgresql";
  if (databaseUrl && /^file:/i.test(databaseUrl)) return "sqlite";
  if (env.VERCEL === "1" || env.NODE_ENV === "production") return "postgresql";
  return "sqlite";
}

export function validateConfiguredDatabaseUrl(env: DatabaseEnvironment = process.env) {
  const provider = selectDatabaseProvider(env);
  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl) return provider;

  if (provider === "postgresql" && !isPostgresUrl(databaseUrl)) {
    throw new Error("DATABASE_URL must be a valid postgres:// or postgresql:// URL for PostgreSQL.");
  }
  if (provider === "sqlite" && !isSqliteUrl(databaseUrl)) {
    throw new Error("DATABASE_URL must be a valid file: URL for SQLite.");
  }
  return provider;
}

function isPostgresUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "postgres:" || url.protocol === "postgresql:")
      && Boolean(url.hostname)
      && url.pathname.length > 1;
  } catch {
    return false;
  }
}

function isSqliteUrl(value: string) {
  if (!/^file:/i.test(value)) return false;
  const path = value.slice("file:".length).split("?")[0];
  return Boolean(path && path !== "/");
}

export function resolveDatabaseConfiguration(env: DatabaseEnvironment = process.env) {
  const provider = validateConfiguredDatabaseUrl(env);
  const isVercel = env.VERCEL === "1";

  if (isVercel && env.DATABASE_PROVIDER !== "postgresql") {
    throw new Error("Set DATABASE_PROVIDER=postgresql for the Vercel deployment.");
  }
  if ((isVercel || env.NODE_ENV === "production") && provider !== "postgresql" && env.MEDIBOOK_TEST_MODE !== "1") {
    throw new Error("Production requires PostgreSQL; configure DATABASE_PROVIDER=postgresql and a PostgreSQL DATABASE_URL.");
  }

  if (provider === "postgresql") {
    const databaseUrl = env.DATABASE_URL?.trim();
    if (!databaseUrl) throw new Error("DATABASE_URL is required for PostgreSQL; configure the provider connection string.");
    return { provider, databaseUrl } as const;
  }

  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    if (env.NODE_ENV === "production") throw new Error("DATABASE_URL is required in production.");
    return { provider, databaseUrl: LOCAL_SQLITE_URL } as const;
  }
  if (!isSqliteUrl(databaseUrl)) throw new Error("DATABASE_URL must be a valid file: URL for SQLite.");
  return { provider, databaseUrl } as const;
}

export function resolveMigrationDatabaseUrl(env: DatabaseEnvironment = process.env) {
  const provider = validateConfiguredDatabaseUrl(env);
  if (provider === "sqlite") return env.DATABASE_URL?.trim() || LOCAL_SQLITE_URL;

  const migrationUrl = env.DIRECT_URL?.trim() || env.DATABASE_URL_UNPOOLED?.trim() || env.DATABASE_URL?.trim();
  if (!migrationUrl) throw new Error("Set DATABASE_URL or a direct migration URL (DIRECT_URL or DATABASE_URL_UNPOOLED).");
  if (!isPostgresUrl(migrationUrl)) {
    throw new Error("The PostgreSQL migration URL must be a valid postgres:// or postgresql:// URL.");
  }
  return migrationUrl;
}
