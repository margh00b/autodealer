// app/api/models/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const makeIdParam = searchParams.get("makeId");

    if (!makeIdParam) {
      return NextResponse.json(
        { error: "makeId query parameter is required" },
        { status: 400 }
      );
    }

    const makeId = parseInt(makeIdParam, 10);
    if (isNaN(makeId)) {
      return NextResponse.json(
        { error: "makeId must be a valid number" },
        { status: 400 }
      );
    }

    const models = await prisma.model.findMany({
      where: { makeId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(models, { status: 200 });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}
