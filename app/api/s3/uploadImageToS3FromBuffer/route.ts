import { NextResponse, type NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import formidable, { IncomingForm } from "formidable";
import { IncomingMessage } from "http";

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * POST handler to upload an image buffer to S3.
 */
export async function POST(request: NextRequest) {
  try {
    const form = formidable({
      keepExtensions: true, // Preserve original file extensions
      uploadDir: "/tmp", // Temporary directory to store uploads
      maxFileSize: 200 * 1024 * 1024, // Limit file size to 200MB
    });

    // Type definition for fields and files with optional undefined values
    type FormData = {
      fields: Record<string, string | string[] | undefined>;
      files: Record<string, formidable.File | formidable.File[] | undefined>;
    };
    // Convert NextRequest to IncomingMessage
    const nodeReq = request as unknown as IncomingMessage;

    // Parse the incoming request with the formidable form
    const { fields, files }: FormData = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) {
          reject(err); // Reject if there is an error during parsing
        }
        resolve({ fields, files });
      });
    });
    // Retrieve the uploaded file details
    const uploadedFile = files.image; // Assuming the form field is named 'image'
    if (!uploadedFile) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Create unique filename for S3
    const fileExtension =
      (uploadedFile as formidable.File).originalFilename?.split(".").pop() ||
      "jpg"; // Default to jpg if extension is missing
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    // Upload the file to S3
    const s3Bucket = process.env.S3_BUCKET_NAME!;
    const s3Key = `recipes/${uniqueFilename}`;
    const uploadParams = {
      Bucket: s3Bucket,
      Key: s3Key,
      Body: (uploadedFile as formidable.File).filepath, // Path to the uploaded file
      ContentType:
        (uploadedFile as formidable.File).mimetype ||
        "application/octet-stream", // Set correct mime type
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Construct the URL for the uploaded image
    const objectUrl = `https://${s3Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    return NextResponse.json({ objectUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    return NextResponse.json(
      { message: "Error uploading image to S3" },
      { status: 500 }
    );
  }
}
