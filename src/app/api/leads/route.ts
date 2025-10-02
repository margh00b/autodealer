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

    const tradeAppraisalLeads = await prisma.tradeAppraisalForm.findMany({
      orderBy: { createdAt: "desc" },
    });

    const financingLeads = await prisma.financingForm.findMany({
      include: {
        vehicle: {
          select: {
            id: true,
            model_year: true,
            make: true,
            model: true,
            listed_price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      vehicleAvailability: vehicleLeads,
      tradeAppraisals: tradeAppraisalLeads,
      financingForms: financingLeads,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
