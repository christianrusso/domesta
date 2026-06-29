-- AlterTable
ALTER TABLE "DomesticProfile" ADD COLUMN     "cprCertified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nannyAgesHandled" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "nannyDescription" TEXT,
ADD COLUMN     "nannyExperience" TEXT,
ADD COLUMN     "nannyMaxChildren" INTEGER,
ADD COLUMN     "petFriendly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vaccinated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cleaningType" TEXT,
ADD COLUMN     "cleaningDetails" TEXT,
ADD COLUMN     "cookingType" TEXT,
ADD COLUMN     "cookingDetails" TEXT;

-- Update existing NULL hourlyRate values to a default value
UPDATE "DomesticProfile" SET "hourlyRate" = 1500 WHERE "hourlyRate" IS NULL;

-- Now make hourlyRate required
ALTER TABLE "DomesticProfile" ALTER COLUMN "hourlyRate" SET NOT NULL;
