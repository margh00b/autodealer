import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function PATCH(req: Request) {
  try {
    const { leadId, status } = await req.json();

    const updatedLead = await prisma.vehicleAvailabilityForm.update({
      where: { id: leadId },
      data: { lead_status: status },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
