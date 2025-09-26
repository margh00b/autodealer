import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, vehicleId } = body;

    if (!firstName || !lastName || !email || !phone || !vehicleId) {
      return NextResponse.json(
        { error: "All fields are required, including vehicleId" },
        { status: 400 }
      );
    }

    const formEntry = await prisma.vehicleAvailabilityForm.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        vehicleId: Number(vehicleId),
      },
    });

    return NextResponse.json({ success: true, formEntry }, { status: 201 });
  } catch (error) {
    console.error("Error saving form:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
