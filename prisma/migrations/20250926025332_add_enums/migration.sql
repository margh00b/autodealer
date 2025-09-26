/*
  Warnings:

  - The `drive_type` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fuel_type` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `body_type` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `transmission` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."vehicleStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'PENDING', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "public"."bodyType" AS ENUM ('CONVERTIBLE', 'COUPE', 'HATCHBACK', 'MINIVAN', 'SEDAN', 'SUV', 'TRUCK', 'WAGON');

-- CreateEnum
CREATE TYPE "public"."driveType" AS ENUM ('FWD', 'RWD', 'AWD', 'FOURWD');

-- CreateEnum
CREATE TYPE "public"."transmissions" AS ENUM ('AUTOMATIC', 'MANUAL');

-- CreateEnum
CREATE TYPE "public"."fuelType" AS ENUM ('PETROL', 'DIESEL', 'ELECTRIC');

-- AlterTable
ALTER TABLE "public"."Vehicle" DROP COLUMN "drive_type",
ADD COLUMN     "drive_type" "public"."driveType",
DROP COLUMN "fuel_type",
ADD COLUMN     "fuel_type" "public"."fuelType",
DROP COLUMN "body_type",
ADD COLUMN     "body_type" "public"."bodyType",
DROP COLUMN "status",
ADD COLUMN     "status" "public"."vehicleStatus",
DROP COLUMN "transmission",
ADD COLUMN     "transmission" "public"."transmissions";
