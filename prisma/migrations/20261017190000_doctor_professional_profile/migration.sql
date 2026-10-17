-- Optional professional profile fields; existing doctor records are preserved.
ALTER TABLE "Doctor" ADD COLUMN "professionalTitle" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "training" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "subSpecialties" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "services" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "procedures" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "languages" TEXT;
ALTER TABLE "Doctor" ADD COLUMN "procedureCount" INTEGER;
ALTER TABLE "Doctor" ADD COLUMN "practiceStartYear" INTEGER;
