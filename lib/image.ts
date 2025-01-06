import axios from "axios"; // or you can use node-fetch
import { Buffer } from "buffer"; // to convert the image data into a buffer

export const fetchImageAndConvertToBuffer = async (
  imageUrl: string
): Promise<Buffer | null> => {
  try {
    // Fetch the image from the temporary URL
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer", // To get the response as a binary buffer
    });

    // Convert the response data into a buffer
    const buffer = Buffer.from(response.data);
    return buffer;
  } catch (error) {
    console.error("Error fetching or converting the image to a buffer:", error);
    return null;
  }
};
