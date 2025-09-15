-- CreateTable
CREATE TABLE "public"."Vehicle" (
    "id" SERIAL NOT NULL,
    "vin_number" TEXT NOT NULL,
    "stock_NO" TEXT,
    "model_year" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "trim" TEXT,
    "sell_price" DOUBLE PRECISION NOT NULL,
    "odometer" INTEGER NOT NULL,
    "cover_image" TEXT,
    "body_style" TEXT,
    "doors" INTEGER,
    "drive_type" TEXT,
    "engine_size" DOUBLE PRECISION,
    "engine_cylinders" INTEGER,
    "fuel_type" TEXT,
    "city_fuel" DOUBLE PRECISION,
    "hwy_fuel" DOUBLE PRECISION,
    "horse_power" INTEGER,
    "low_msrp" DOUBLE PRECISION,
    "high_msrp" DOUBLE PRECISION,
    "title_status" TEXT,
    "comment" TEXT,
    "tag_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vin_number_key" ON "public"."Vehicle"("vin_number");
