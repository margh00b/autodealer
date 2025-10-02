import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Destructure all fields from request body
    const {
      salutation,
      gender,
      firstName,
      lastName,
      phone,
      email,
      maritalStatus,
      birthDate,
      sin,

      currentAddress,
      currentCity,
      currentProvince,
      currentPostalCode,
      currentDurationYear,
      currentDurationMonth,
      homeStatus,
      monthlyPayment,

      prevAddress,
      prevCity,
      prevProvince,
      prevPostalCode,
      prevDurationYear,
      prevDurationMonth,

      employmentType,
      employer,
      occupation,
      employmentAddress,
      employmentCity,
      employmentProvince,
      employmentPostalCode,
      employmentPhone,
      employmentDurationYear,
      employmentDurationMonth,
      grossIncome,

      prevEmployer,
      prevEmploymentPhone,
      prevEmploymentDurationYear,
      prevEmploymentDurationMonth,

      bankruptcy,
      repossession,
      coSignerAvailable,
      creditRating,

      vehicleId, // relation to vehicle
    } = body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !maritalStatus ||
      !birthDate ||
      !currentAddress ||
      !currentCity ||
      !currentProvince ||
      !currentPostalCode ||
      currentDurationYear === undefined ||
      currentDurationMonth === undefined ||
      !homeStatus ||
      !employmentType ||
      !employer ||
      !occupation ||
      !employmentAddress ||
      !employmentCity ||
      !employmentProvince ||
      !employmentPostalCode ||
      employmentDurationYear === undefined ||
      employmentDurationMonth === undefined ||
      grossIncome === undefined ||
      !vehicleId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the financing form entry
    const formEntry = await prisma.financingForm.create({
      data: {
        salutation,
        gender,
        firstName,
        lastName,
        phone,
        email,
        maritalStatus,
        birthDate: new Date(birthDate),
        sin,

        currentAddress,
        currentCity,
        currentProvince,
        currentPostalCode,
        currentDurationYear: Number(currentDurationYear),
        currentDurationMonth: Number(currentDurationMonth),
        homeStatus,
        monthlyPayment: monthlyPayment ? Number(monthlyPayment) : null,

        prevAddress,
        prevCity,
        prevProvince,
        prevPostalCode,
        prevDurationYear: prevDurationYear ? Number(prevDurationYear) : null,
        prevDurationMonth: prevDurationMonth ? Number(prevDurationMonth) : null,

        employmentType,
        employer,
        occupation,
        employmentAddress,
        employmentCity,
        employmentProvince,
        employmentPostalCode,
        employmentPhone,
        employmentDurationYear: Number(employmentDurationYear),
        employmentDurationMonth: Number(employmentDurationMonth),
        grossIncome: Number(grossIncome),

        prevEmployer,
        prevEmploymentPhone,
        prevEmploymentDurationYear: prevEmploymentDurationYear
          ? Number(prevEmploymentDurationYear)
          : null,
        prevEmploymentDurationMonth: prevEmploymentDurationMonth
          ? Number(prevEmploymentDurationMonth)
          : null,

        bankruptcy,
        repossession,
        coSignerAvailable,
        creditRating,

        vehicleId: Number(vehicleId),
      },
    });

    return NextResponse.json({ success: true, formEntry }, { status: 201 });
  } catch (error) {
    console.error("Error saving financing form:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
