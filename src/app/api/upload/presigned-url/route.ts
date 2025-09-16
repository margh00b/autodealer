import { R2_CONFIG, r2Client } from "@/lib/r2-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    /*
        TODO (auth)
        const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); 
    }*/

    // Parse request body
    const { fileName, fileType, fileSize, documentType } = await request.json();

    // Validate file type
    if (!R2_CONFIG.allowedMimeTypes.includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    // Validate file size
    if (fileSize > R2_CONFIG.maxFileSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }
    // Generate unique file key
    const timestamp = new Date().toISOString().split("T")[0];
    const fileId = nanoid(10);
    const fileExtension = fileName.split(".").pop();
    /* TODO (auth) const fileKey = `${userId}/${timestamp}/${documentType}_${fileId}.${fileExtension}`; */
    const fileKey = `${timestamp}/${documentType}_${fileId}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: fileKey,
      ContentType: fileType,
      ContentLength: fileSize,
      Metadata: {
        originalFileName: fileName,
        documentType,
        uploadedAt: new Date().toISOString(),
      },
    });
    const presignedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: R2_CONFIG.presignedUrlExpiry,
    });

    return NextResponse.json({
      presignedUrl,
      fileKey,
      filePath: fileKey,
      expiresAt: Date.now() + R2_CONFIG.presignedUrlExpiry * 1000,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
