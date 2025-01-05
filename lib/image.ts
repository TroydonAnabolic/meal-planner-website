import { Buffer } from "buffer"; // Node.js Buffer module

const fetchImageAsBuffer = async (imageUrl: string): Promise<Buffer | null> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Error fetching image as buffer:", error);
    return null;
  }
};
