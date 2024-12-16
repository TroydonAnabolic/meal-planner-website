// app/api/s3/delete/route.ts

import { NextResponse } from "next/server";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import s3Client from "@/lib/s3-client";

/**
 * Request Body Interface
 */
interface DeleteImageRequestBody {
  imageUrl: string;
}

/**
 * POST handler to delete an image from S3.
 */
export async function POST(request: Request) {
  try {
    const { imageUrl }: DeleteImageRequestBody = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { message: "Missing imageUrl in request body." },
        { status: 400 }
      );
    }

    // Extract S3 Key from the image URL
    const url = new URL(imageUrl);
    const s3Key = decodeURIComponent(url.pathname.substring(1)); // Remove leading '/'

    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);

    await s3Client.send(deleteCommand);

    return NextResponse.json(
      { message: "Image deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    return NextResponse.json(
      { message: "Failed to delete image from S3." },
      { status: 500 }
    );
  }
}
