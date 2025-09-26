/*
  Warnings:

  - You are about to drop the column `options` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `safety_features` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Vehicle" DROP COLUMN "options",
DROP COLUMN "safety_features",
ADD COLUMN     "features" TEXT[];
