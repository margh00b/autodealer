import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { id: _id, images, ...updateData } = body;

    const updated = await prisma.vehicle.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to Update Vehicle!" },
      { status: 500 }
    );
  }
}
