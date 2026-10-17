CREATE TABLE "ContactSubmission" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "reference" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "category" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "userId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "ContactSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ContactSubmission_reference_key" ON "ContactSubmission"("reference");
CREATE INDEX "ContactSubmission_status_createdAt_idx" ON "ContactSubmission"("status", "createdAt");
CREATE INDEX "ContactSubmission_category_createdAt_idx" ON "ContactSubmission"("category", "createdAt");
CREATE TABLE "ContactRateLimit" (
  "key" TEXT NOT NULL PRIMARY KEY,
  "windowStart" DATETIME NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "ContactRateLimit_windowStart_idx" ON "ContactRateLimit"("windowStart");
