import { R2_CONFIG, r2Client } from "@/lib/r2-client";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "../../../../../prisma/client";
import { Upload } from "@aws-sdk/lib-storage";

const VehicleSchema = z.object({
  vin_number: z.string(),
  model_year: z.coerce.number().int(),
  trim: z.string().optional().nullable(),

  listed_price: z.coerce.number(),
  expected_price: z.coerce.number().optional().nullable(),

  status: z.string().default("OPEN"),
  odometer: z.coerce.number().int().optional().nullable(),

  body_type: z.string().optional().nullable(),
  doors: z.coerce.number().int().optional().nullable(),
  drive_type: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  engine: z.string().optional().nullable(),
  horse_power: z.coerce.number().int().optional().nullable(),

  fuel_type: z.string().optional().nullable(),
  fuel_capacity: z.coerce.number().optional().nullable(),
  city_fuel: z.coerce.number().optional().nullable(),
  hwy_fuel: z.coerce.number().optional().nullable(),
  combined_fuel: z.coerce.number().optional().nullable(),
  battery_capacity: z.string().optional().nullable(),

  exterior_color: z.string().optional().nullable(),
  interior_color: z.string().optional().nullable(),

  front_legroom: z.coerce.number().optional().nullable(),
  back_legroom: z.coerce.number().optional().nullable(),
  cargo_volume: z.coerce.number().optional().nullable(),

  safety_features: z
    .string()
    .transform((val) => val.split(",").map((s) => s.trim()))
    .optional()
    .default([]),
  options: z
    .string()
    .transform((val) => val.split(",").map((s) => s.trim()))
    .optional()
    .default([]),

  comment: z.string().optional().nullable(),
  makeId: z.coerce.number().int(),
  modelId: z.coerce.number().int(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const raw = Object.fromEntries(formData.entries());
    const data = VehicleSchema.parse(raw);

    const files = formData.getAll("images") as File[];

    // 1. Create vehicle first (without images)
    const vehicle = await prisma.vehicle.create({
      data: {
        ...data,
      },
    });

    const uploadedImages: { url: string; key: string }[] = [];

    // 2. Upload each file to R2
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileId = nanoid(10);
      const ext = file.name.split(".").pop();
      const fileKey = `${vehicle.id}/vehicle_${fileId}.${ext}`;

      try {
        const parallelUpload = new Upload({
          client: r2Client,
          params: {
            Bucket: R2_CONFIG.bucketName,
            Key: fileKey,
            Body: buffer,
            ContentType: file.type,
          },
        });

        // Progress events happen here:
        parallelUpload.on("httpUploadProgress", (progress) => {
          console.log(
            `Uploading ${file.name}: ${Math.round(
              ((progress.loaded ?? 0) / (progress.total ?? 1)) * 100
            )}%`
          );
          // 👆 You can forward this info to the frontend via WebSockets, SSE, or skip and just console log
        });

        await parallelUpload.done();

        uploadedImages.push({
          url: `${R2_CONFIG.publicUrl}/${fileKey}`,
          key: fileKey,
        });
      } catch (uploadErr) {
        console.error("R2 upload failed:", uploadErr);

        // Cleanup: delete already uploaded files
        for (const img of uploadedImages) {
          await r2Client.send(
            new DeleteObjectCommand({
              Bucket: R2_CONFIG.bucketName,
              Key: img.key,
            })
          );
        }

        // Delete vehicle since upload failed
        await prisma.vehicle.delete({ where: { id: vehicle.id } });

        return NextResponse.json(
          { error: "File upload failed, vehicle creation rolled back" },
          { status: 500 }
        );
      }
    }

    // 3. Attach uploaded images to the vehicle
    if (uploadedImages.length > 0) {
      await prisma.vehicleImage.createMany({
        data: uploadedImages.map((img) => ({
          vehicleId: vehicle.id,
          url: img.url,
          key: img.key,
        })),
      });
    }

    // 4. Fetch full vehicle with images
    const fullVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
      include: { images: true },
    });

    return NextResponse.json(fullVehicle, { status: 201 });
  } catch (err: any) {
    console.error("Vehicle upload failed:", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
