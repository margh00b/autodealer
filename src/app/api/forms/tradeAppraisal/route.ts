import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function POST(req: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      make,
      model,
      year,
      trim,
      odometer,
      bodyType,
    } = await req.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !make || !model) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newForm = await prisma.tradeAppraisalForm.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        make,
        model,
        year: year ? Number(year) : null,
        trim: trim || null,
        odometer: odometer ? Number(odometer) : null,
        bodyType: bodyType || null,
      },
    });

    return NextResponse.json(newForm);
  } catch (error) {
    console.error("Trade Appraisal API Error:", error);
    return NextResponse.json(
      { error: "Failed to submit trade appraisal" },
      { status: 500 }
    );
  }
}
