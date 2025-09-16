/*
  Warnings:

  - You are about to drop the column `features` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Vehicle" DROP COLUMN "features",
ADD COLUMN     "options" TEXT[],
ADD COLUMN     "safety_features" TEXT[];
