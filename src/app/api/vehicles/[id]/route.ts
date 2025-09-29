import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: Number(id) },
      include: {
        images: true,
        make: true,
        model: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...vehicle,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
