import { R2_CONFIG, r2Client } from "@/lib/r2-client";
import { Upload } from "@aws-sdk/lib-storage";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const vehicleId = Number(formData.get("vehicleId"));

    const uploaded: any[] = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = file.name.split(".").pop();
      const key = `${vehicleId}/vehicle_${nanoid(10)}.${ext}`;

      const uploader = new Upload({
        client: r2Client,
        params: {
          Bucket: R2_CONFIG.bucketName,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        },
      });

      await uploader.done();

      uploaded.push({
        vehicleId,
        key,
        url: `${R2_CONFIG.publicUrl}/${key}`,
      });
    }
    if (uploaded.length > 0) {
      await prisma.vehicleImage.createMany({ data: uploaded });
    }
    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
