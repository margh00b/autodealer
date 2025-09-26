import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import prisma from "../../../../../prisma/client";
import { r2Client } from "@/lib/r2-client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: Number(id) },
      include: {
        images: true,
        make: true,
        model: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    // Generate signed URLs for images
    /* const signedImages = await Promise.all(
      vehicle.images.map(async (img: any) => {
        const command = new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: img.key,
        });

        const signedUrl = await getSignedUrl(r2Client, command, {
          expiresIn: 3600,
        });
        return {
          ...img,
          signedUrl,
        };
      })
    ); */

    return NextResponse.json({
      ...vehicle,
      /* images: signedImages, */
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
