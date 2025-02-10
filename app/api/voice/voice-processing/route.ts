import { handleUserPrompt } from "@/lib/gemini/gemini";
import { convertTextToSpeech } from "@/lib/aws/polly";
import { transcribeAudio } from "@/lib/aws/transcribe"; // Import the new transcribe function
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable"; // To handle file uploads

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle multipart form data
  },
};

export async function POST(request: NextRequest) {
  try {
    // Handle file upload (audio) using formidable
    const form = new IncomingForm();
    const formData = await new Promise<any>((resolve, reject) => {
      form.parse(request as any, async (err, fields, files) => {
        if (err) {
          reject(err);
        }
        resolve({ fields, files });
      });
    });

    // Get the audio file from the form data
    const audioFile = formData.files.audio[0];

    // Step 1: Transcribe the audio
    const transcribedText = await transcribeAudio(audioFile.path); // The path to the audio file

    if (transcribedText) {
      // Step 2: Handle the transcribed text as a user prompt
      const { clientId } = formData.fields; // Get clientId from the fields
      const {
        response,
        generatedMealPlan,
        fetchedRecipes,
      }: {
        response: string;
        generatedMealPlan: IMealPlan | null;
        fetchedRecipes: IRecipeInterface[];
      } = await handleUserPrompt(transcribedText, clientId);

      // Step 3: Convert the response to speech
      const speech: Uint8Array | null = await convertTextToSpeech(response);

      // Step 4: Encode the speech data as Base64 for transmission
      const audioBase64 = speech
        ? Buffer.from(speech).toString("base64")
        : null;

      // Step 5: Return the data
      return NextResponse.json({
        responseText: response,
        audio: audioBase64,
        generatedMealPlan,
        fetchedRecipes,
      });
    } else {
      console.error("Error transcribing audio");
      return NextResponse.json(
        {
          message: "Could not transcribing processed speech response",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      {
        message: "Could not get processed speech response",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
