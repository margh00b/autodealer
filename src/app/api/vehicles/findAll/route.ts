import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(req: NextRequest) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      select: {
        id: true,
        model_year: true,
        trim: true,
        listed_price: true,
        discounted_price: true,
        odometer: true,
        body_type: true,
        transmission: true,
        engine: true,
        doors: true,
        drive_type: true,
        features: true,
        make: {
          select: { name: true },
        },
        model: {
          select: { name: true },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(vehicles, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
