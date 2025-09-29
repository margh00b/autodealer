import { HeadBucketCommand, S3Client } from "@aws-sdk/client-s3";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_PUBLIC_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});
export const R2_CONFIG = {
  bucketName: process.env.R2_BUCKET_NAME!,
  publicUrl: process.env.R2_PUBLIC_URL,
  maxFileSize: 5 * 1024 * 1024,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  presignedUrlExpiry: 300,
};

// Test connection
export async function testR2Connection(): Promise<boolean> {
  try {
    await r2Client.send(
      new HeadBucketCommand({
        Bucket: R2_CONFIG.bucketName,
      })
    );
    return true;
  } catch (error) {
    console.error("R2 connection test failed:", error);
    return false;
  }
}

export function handleR2Error(error: {
  name: string;
  message: string;
}): string {
  if (error.name === "NoSuchBucket") return "Bucket does not exist.";
  if (error.name === "InvalidAccessKeyId") return "Invalid access key.";
  if (error.name === "SignatureDoesNotMatch") return "Authentication failed.";
  if (error.name === "AccessDenied")
    return "Access denied. Check your token permissions.";
  return `R2 operation failed: ${error.message || "Unknown error"}`;
}
