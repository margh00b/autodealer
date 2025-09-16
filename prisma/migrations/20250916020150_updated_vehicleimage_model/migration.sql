/*
  Warnings:

  - You are about to drop the column `public_id` on the `VehicleImage` table. All the data in the column will be lost.
  - Added the required column `key` to the `VehicleImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."VehicleImage" DROP COLUMN "public_id",
ADD COLUMN     "key" TEXT NOT NULL;
