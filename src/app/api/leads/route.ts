import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET() {
  try {
    const vehicleLeads = await prisma.vehicleAvailabilityForm.findMany({
      include: {
        vehicle: {
          select: {
            model_year: true,
            make: true,
            model: true,
          },
        },
      },

      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      vehicleAvailability: vehicleLeads,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
