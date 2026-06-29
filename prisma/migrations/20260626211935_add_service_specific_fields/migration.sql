/*
  Warnings:

  - You are about to drop the column `cleaningDetails` on the `DomesticProfile` table. All the data in the column will be lost.
  - You are about to drop the column `cleaningType` on the `DomesticProfile` table. All the data in the column will be lost.
  - You are about to drop the column `cookingDetails` on the `DomesticProfile` table. All the data in the column will be lost.
  - You are about to drop the column `cookingType` on the `DomesticProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DomesticProfile" DROP COLUMN "cleaningDetails",
DROP COLUMN "cleaningType",
DROP COLUMN "cookingDetails",
DROP COLUMN "cookingType";
