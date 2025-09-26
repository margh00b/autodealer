// app/api/makes/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET() {
  try {
    const makes = await prisma.make.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(makes);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch makes" },
      { status: 500 }
    );
  }
}
