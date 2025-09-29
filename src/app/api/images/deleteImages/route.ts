import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { R2_CONFIG, r2Client } from "@/lib/r2-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
  try {
    const { imageIds } = await req.json();

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { error: "imageIds must be a non-empty array" },
        { status: 400 }
      );
    }

    const results: { id: number; success: boolean; error?: string }[] = [];

    for (const id of imageIds) {
      try {
        const image = await prisma.vehicleImage.findUnique({
          where: { id: Number(id) },
        });

        if (!image) {
          results.push({ id, success: false, error: "Image not found" });
          continue;
        }

        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: R2_CONFIG.bucketName,
            Key: image.key,
          })
        );

        await prisma.vehicleImage.delete({ where: { id: image.id } });
        results.push({ id, success: true });
      } catch (err) {
        console.error(`Failed to delete image ${id}:`, err);
        results.push({ id, success: false, error: (err as Error)?.message });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Delete images failed:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
