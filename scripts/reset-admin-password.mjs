import Database from "better-sqlite3";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import path from "node:path";

function requireLocalConfiguration() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("This password reset command is local-development only.");
  }

  const databaseUrl = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!databaseUrl || !email || !password) {
    throw new Error("Set DATABASE_URL, ADMIN_EMAIL, and ADMIN_PASSWORD in the ignored .env file.");
  }
  if (!/^file:/i.test(databaseUrl)) {
    throw new Error("Refusing to reset credentials for a non-SQLite database.");
  }
  if (password.length < 12 || password.length > 128) {
    throw new Error("ADMIN_PASSWORD must be between 12 and 128 characters.");
  }

  const databasePath = path.resolve(process.cwd(), databaseUrl.slice(5).split("?")[0]);
  const expectedDatabasePath = path.resolve(process.cwd(), "dev.db");
  if (databasePath !== expectedDatabasePath) {
    throw new Error("This command only operates on the project-root dev.db database.");
  }

  return { databasePath, email, password };
}

async function main() {
  const { databasePath, email, password } = requireLocalConfiguration();
  const database = new Database(databasePath, { fileMustExist: true });

  try {
    const user = database.prepare("SELECT id, role FROM User WHERE lower(email) = ? LIMIT 1").get(email);
    if (!user) throw new Error("No account matches ADMIN_EMAIL in the local database.");
    if (user.role !== "ADMIN") throw new Error("The matching account is not an administrator; no credentials were changed.");

    const accounts = database.prepare(
      "SELECT id, accountId, userId, password FROM Account WHERE userId = ? AND providerId = ?",
    ).all(user.id, "credential");
    if (accounts.length !== 1 || accounts[0].accountId !== user.id || accounts[0].userId !== user.id || !accounts[0].password) {
      throw new Error("The administrator does not have exactly one usable credential account; no credentials were changed.");
    }

    const account = accounts[0];
    if (await verifyPassword({ hash: account.password, password }).catch(() => false)) {
      process.stdout.write("The configured password already matches this account; no changes were made.\n");
      return;
    }

    const nextHash = await hashPassword(password);
    const update = database.transaction(() => {
      const currentUser = database.prepare("SELECT role FROM User WHERE id = ? AND lower(email) = ?").get(user.id, email);
      const currentAccount = database.prepare(
        "SELECT id, password FROM Account WHERE id = ? AND userId = ? AND accountId = ? AND providerId = ?",
      ).get(account.id, user.id, user.id, "credential");
      if (currentUser?.role !== "ADMIN" || currentAccount?.password !== account.password) {
        throw new Error("The account changed during verification; no credentials were changed. Retry after reviewing the account.");
      }

      const result = database.prepare(
        "UPDATE Account SET password = ?, updatedAt = ? WHERE id = ? AND userId = ? AND accountId = ? AND providerId = ? AND password = ?",
      ).run(nextHash, new Date().toISOString(), account.id, user.id, user.id, "credential", account.password);
      if (result.changes !== 1) throw new Error("Credential update did not affect exactly one account.");
    });
    update();
    process.stdout.write("The local administrator credential was updated. Sign in using ADMIN_EMAIL and ADMIN_PASSWORD.\n");
  } finally {
    database.close();
  }
}

main().catch((error) => {
  const safeMessages = new Set([
    "This password reset command is local-development only.",
    "Set DATABASE_URL, ADMIN_EMAIL, and ADMIN_PASSWORD in the ignored .env file.",
    "Refusing to reset credentials for a non-SQLite database.",
    "ADMIN_PASSWORD must be between 12 and 128 characters.",
    "This command only operates on the project-root dev.db database.",
    "No account matches ADMIN_EMAIL in the local database.",
    "The matching account is not an administrator; no credentials were changed.",
    "The administrator does not have exactly one usable credential account; no credentials were changed.",
    "The account changed during verification; no credentials were changed. Retry after reviewing the account.",
    "Credential update did not affect exactly one account.",
  ]);
  const message = error instanceof Error && safeMessages.has(error.message)
    ? error.message
    : "Credential reset failed. No secret values were printed.";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
