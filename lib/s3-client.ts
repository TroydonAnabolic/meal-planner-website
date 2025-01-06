// lib/s3-client.ts

import { dataURLtoBlob } from "@/util/generic-utils";
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION, // e.g., 'us-east-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export default s3Client;

/**
 * Uploads an image to S3 and returns the S3 URL.
 *
 * @param imageData - Base64 encoded image data.
 * @returns The S3 URL of the uploaded image or undefined if upload fails.
 */
export const saveImageToS3 = async (
  imageData: string,
  suffix: string
): Promise<string | undefined> => {
  const fileName = imageData.split("/").pop()?.split("?")[0] || "unknown.jpg";
  const contentType = imageData.substring(
    imageData.indexOf(":") + 1,
    imageData.indexOf(";")
  ); // e.g., "image/jpeg"

  // Request pre-signed URL
  const presignedURLResponse = await fetch(
    `/api/s3/presigned?fileName=${encodeURIComponent(
      fileName
    )}&contentType=${encodeURIComponent(contentType)}&suffix=${suffix || ""}`,
    {
      method: "GET",
    }
  );

  if (!presignedURLResponse.ok) {
    throw new Error("Failed to get pre-signed URL");
  }

  const { signedUrl, objectUrl } = await presignedURLResponse.json();

  // Convert data:image to Blob
  const imageBlob = dataURLtoBlob(imageData);

  if (!imageBlob) {
    throw new Error("Failed to convert image to Blob");
  }

  // Upload the binary data to S3 using the pre-signed URL
  const uploadResponse = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      // "Content-Type": contentType,
      // "x-amz-acl": "public-read",
      // "x-amz-server-side-encryption": "AES256",
    },
    body: imageBlob,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to S3");
  }

  console.log("File uploaded successfully:", objectUrl);
  return objectUrl;
};

export const uploadImageToS3FromBuffer = async (
  buffer: Buffer,
  path: string,
  filename: string,
  contentType: string
): Promise<string | null> => {
  try {
    // Create a FormData object to send the buffer as raw binary data
    const formData = new FormData();
    formData.append("path", path);
    formData.append("filename", filename);
    formData.append("contentType", contentType);
    formData.append("file", new Blob([buffer], { type: contentType }));

    // Call the new API endpoint to upload the buffer
    const response = await fetch("/api/s3/uploadImageToS3FromBuffer", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image to S3");
    }

    const data = await response.json();
    return data.objectUrl; // Return the object URL from S3
  } catch (error) {
    console.error("Error uploading image to S3 from buffer:", error);
    return null;
  }
};

/**
 * Deletes an image from S3 by calling the server-side API route.
 *
 * @param imageUrl - The full S3 URL of the image to delete.
 * @returns A boolean indicating whether the deletion was successful.
 */
export const deleteImageFromS3 = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/s3/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error deleting image:", errorData.message);
      return false;
    }

    console.log("Image deleted successfully from S3.");
    return true;
  } catch (error) {
    console.error("Error deleting image from S3:", error);
    return false;
  }
};
