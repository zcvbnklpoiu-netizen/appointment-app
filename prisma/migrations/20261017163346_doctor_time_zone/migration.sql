-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AppointmentSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doctorId" TEXT NOT NULL,
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME NOT NULL,
    "timeZone" TEXT NOT NULL DEFAULT 'Asia/Amman',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AppointmentSlot_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AppointmentSlot" ("createdAt", "doctorId", "endsAt", "id", "startsAt", "status") SELECT "createdAt", "doctorId", "endsAt", "id", "startsAt", "status" FROM "AppointmentSlot";
DROP TABLE "AppointmentSlot";
ALTER TABLE "new_AppointmentSlot" RENAME TO "AppointmentSlot";
CREATE INDEX "AppointmentSlot_doctorId_status_startsAt_idx" ON "AppointmentSlot"("doctorId", "status", "startsAt");
CREATE UNIQUE INDEX "AppointmentSlot_doctorId_startsAt_key" ON "AppointmentSlot"("doctorId", "startsAt");
CREATE TABLE "new_Doctor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "biography" TEXT NOT NULL DEFAULT '',
    "qualifications" TEXT NOT NULL DEFAULT '',
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "clinicName" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "consultationModes" TEXT NOT NULL DEFAULT 'IN_PERSON',
    "timeZone" TEXT NOT NULL DEFAULT 'Asia/Amman',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "specialtyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Doctor_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Doctor" ("biography", "clinicName", "consultationModes", "createdAt", "displayName", "experienceYears", "id", "imageUrl", "isActive", "location", "qualifications", "slug", "specialtyId", "updatedAt", "userId") SELECT "biography", "clinicName", "consultationModes", "createdAt", "displayName", "experienceYears", "id", "imageUrl", "isActive", "location", "qualifications", "slug", "specialtyId", "updatedAt", "userId" FROM "Doctor";
DROP TABLE "Doctor";
ALTER TABLE "new_Doctor" RENAME TO "Doctor";
CREATE UNIQUE INDEX "Doctor_userId_key" ON "Doctor"("userId");
CREATE UNIQUE INDEX "Doctor_slug_key" ON "Doctor"("slug");
CREATE INDEX "Doctor_specialtyId_isActive_idx" ON "Doctor"("specialtyId", "isActive");
CREATE INDEX "Doctor_isActive_displayName_idx" ON "Doctor"("isActive", "displayName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
