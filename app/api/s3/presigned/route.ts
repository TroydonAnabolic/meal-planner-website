import { v4 as uuidv4 } from "uuid";
import { NextResponse, type NextRequest } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION, // e.g., 'ap-southeast-2'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * GET handler to generate a pre-signed URL for uploading a file to S3.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("fileName");
  const suffix = searchParams.get("suffix") || "";
  const contentType = searchParams.get("contentType");

  if (!fileName || !contentType) {
    return NextResponse.json(
      { message: "Missing fileName or contentType query parameter" },
      { status: 400 }
    );
  }

  const uniqueFileName = `${uuidv4()}-${fileName}`;
  const s3Bucket = process.env.S3_BUCKET_NAME!;
  const s3Key = `${process.env.S3_BUCKET_KEYPATH}${suffix}${uniqueFileName}`;
  const awsRegion = process.env.AWS_REGION!;

  const command = new PutObjectCommand({
    Bucket: s3Bucket,
    Key: s3Key,
    ContentType: contentType,
    // ACL: "public-read",
    // ServerSideEncryption: "AES256",
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    const objectUrl = `https://${s3Bucket}.s3.${awsRegion}.amazonaws.com/${s3Key}`;

    return NextResponse.json({ signedUrl, objectUrl }, { status: 200 });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json(
      { message: "Error generating pre-signed URL" },
      { status: 500 }
    );
  }
}
