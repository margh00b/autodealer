import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";
import { use } from "react";
type Context = Promise<{ id: string }>;

export async function PATCH(req: NextRequest, { params }: { params: Context }) {
  try {
    const { id }: { id: string } = use(params);
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
