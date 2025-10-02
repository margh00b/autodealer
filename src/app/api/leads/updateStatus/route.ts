import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function PATCH(req: Request) {
  try {
    const { leadId, status, type } = await req.json();

    if (!leadId || !status || !type) {
      return NextResponse.json(
        { error: "Missing required fields (leadId, status, type)" },
        { status: 400 }
      );
    }

    let updatedLead;

    if (type === "vehicle") {
      updatedLead = await prisma.vehicleAvailabilityForm.update({
        where: { id: leadId },
        data: { lead_status: status },
      });
    } else if (type === "trade") {
      updatedLead = await prisma.tradeAppraisalForm.update({
        where: { id: leadId },
        data: { lead_status: status },
      });
    } else if (type === "financing") {
      updatedLead = await prisma.financingForm.update({
        where: { id: leadId },
        data: { lead_status: status },
      });
    } else {
      return NextResponse.json(
        {
          error:
            "Invalid lead type. Must be 'vehicle', 'trade', or 'financing'",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("Update Lead Status Error:", error);
    return NextResponse.json(
      { error: "Failed to update lead status" },
      { status: 500 }
    );
  }
}
