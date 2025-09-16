/*
  Warnings:

  - You are about to drop the column `body_style` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `cover_image` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `engine_cylinders` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `engine_size` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `high_msrp` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `low_msrp` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `sell_price` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `stock_NO` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `tag_name` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `title_status` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `listed_price` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Vehicle" DROP COLUMN "body_style",
DROP COLUMN "cover_image",
DROP COLUMN "engine_cylinders",
DROP COLUMN "engine_size",
DROP COLUMN "high_msrp",
DROP COLUMN "low_msrp",
DROP COLUMN "sell_price",
DROP COLUMN "stock_NO",
DROP COLUMN "tag_name",
DROP COLUMN "title_status",
ADD COLUMN     "back_legroom" DOUBLE PRECISION,
ADD COLUMN     "battery_capacity" TEXT,
ADD COLUMN     "body_type" TEXT,
ADD COLUMN     "cargo_volume" DOUBLE PRECISION,
ADD COLUMN     "combined_fuel" DOUBLE PRECISION,
ADD COLUMN     "engine" TEXT,
ADD COLUMN     "expected_price" DOUBLE PRECISION,
ADD COLUMN     "exterior_color" TEXT,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "front_legroom" DOUBLE PRECISION,
ADD COLUMN     "fuel_capacity" DOUBLE PRECISION,
ADD COLUMN     "interior_color" TEXT,
ADD COLUMN     "listed_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "transmission" TEXT;

-- CreateTable
CREATE TABLE "public"."VehicleImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "VehicleImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."VehicleImage" ADD CONSTRAINT "VehicleImage_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "public"."Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
