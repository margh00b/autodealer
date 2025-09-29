import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(req: NextRequest) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        make: {
          select: { name: true },
        },
        model: {
          select: { name: true },
        },
        images: {
          select: { key: true, id: true },
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
