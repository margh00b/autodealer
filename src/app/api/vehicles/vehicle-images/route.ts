import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { vehicleId, images } = await req.json();

    if (!vehicleId || !images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "Invalid payload. vehicleId and images are required." },
        { status: 400 }
      );
    }

    const createdImages = await Promise.all(
      images.map((img: { url: string; key: string }) =>
        prisma.vehicleImage.create({
          data: {
            vehicleId,
            url: img.url,
            key: img.key,
          },
        })
      )
    );

    return NextResponse.json({
      created: createdImages.length,
      images: createdImages,
    });
  } catch (error: any) {
    console.error("Failed to save vehicle images:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save images" },
      { status: 500 }
    );
  }
}
