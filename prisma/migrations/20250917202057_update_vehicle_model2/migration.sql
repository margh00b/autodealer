/*
  Warnings:

  - You are about to drop the column `expected_price` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Vehicle" DROP COLUMN "expected_price",
ADD COLUMN     "discounted_price" DOUBLE PRECISION;
