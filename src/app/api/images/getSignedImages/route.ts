import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/lib/r2-client";

export async function POST(req: NextRequest) {
  try {
    const { images } = await req.json();
    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "Invalid images array" },
        { status: 400 }
      );
    }

    const signedImages = await Promise.all(
      images.map(async (img) => {
        const command = new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: img.key,
        });
        const url = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
        return { id: img.id, url };
      })
    );

    return NextResponse.json(signedImages);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not generate signed URLs" },
      { status: 500 }
    );
  }
}
