import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";
import { use } from "react";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const Id2 = Number(id);
    const body = await req.json();
    const { id: _id, images, ...updateData } = body;

    const updated = await prisma.vehicle.update({
      where: { id: Id2 },
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
