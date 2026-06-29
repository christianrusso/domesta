-- AlterTable
ALTER TABLE "DomesticProfile" ADD COLUMN     "availabilityTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "cleaningDetails" TEXT,
ADD COLUMN     "cleaningType" TEXT,
ADD COLUMN     "cookingDetails" TEXT,
ADD COLUMN     "cookingType" TEXT,
ADD COLUMN     "experience" TEXT;
