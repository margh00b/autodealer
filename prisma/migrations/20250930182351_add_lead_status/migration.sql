/*
  Warnings:

  - Made the column `discounted_price` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."leadStatus" AS ENUM ('NEW', 'CONTACTED', 'LOST', 'CONVERTED');

-- AlterTable
ALTER TABLE "public"."Vehicle" ALTER COLUMN "discounted_price" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."vehicleAvailabilityForm" ADD COLUMN     "lead_status" "public"."leadStatus" NOT NULL DEFAULT 'NEW';
