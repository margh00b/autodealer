import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      vin_number,
      model_year,
      trim,
      listed_price,
      expected_price,
      status,
      odometer,
      body_type,
      doors,
      drive_type,
      transmission,
      engine,
      horse_power,
      fuel_type,
      fuel_capacity,
      city_fuel,
      hwy_fuel,
      combined_fuel,
      battery_capacity,
      exterior_color,
      interior_color,
      front_legroom,
      back_legroom,
      cargo_volume,
      safety_features = [],
      options = [],
      comment,
      makeId,
      modelId,
    } = body;

    if (
      !vin_number ||
      !model_year ||
      !listed_price ||
      !odometer ||
      !makeId ||
      !modelId
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: vin_number, model_year, listed_price, odometer, makeId, modelId",
        },
        { status: 400 }
      );
    }

    // Create vehicle in DB
    const vehicle = await prisma.vehicle.create({
      data: {
        vin_number,
        model_year,
        trim,
        listed_price,
        expected_price,
        status,
        odometer,
        body_type,
        doors,
        drive_type,
        transmission,
        engine,
        horse_power,
        fuel_type,
        fuel_capacity,
        city_fuel,
        hwy_fuel,
        combined_fuel,
        battery_capacity,
        exterior_color,
        interior_color,
        front_legroom,
        back_legroom,
        cargo_volume,
        safety_features,
        options,
        comment,
        makeId,
        modelId,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error: any) {
    console.error("Failed to create vehicle:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
