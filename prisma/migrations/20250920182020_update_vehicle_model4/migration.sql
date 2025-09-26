/*
  Warnings:

  - Added the required column `updatedAt` to the `vehicleAvailabilityForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleId` to the `vehicleAvailabilityForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."vehicleAvailabilityForm" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vehicleId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."vehicleAvailabilityForm" ADD CONSTRAINT "vehicleAvailabilityForm_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
