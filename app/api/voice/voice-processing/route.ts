import { handleUserPrompt } from "@/lib/gemini/gemini";
import { convertTextToSpeech } from "@/lib/aws/polly";
import { transcribeAudio } from "@/lib/aws/transcribe";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { NextResponse } from "next/server";
import { Buffer } from "buffer";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Get audio file and clientId from the form data
    const audioFile = formData.get("audio") as File | null;
    const clientId = formData.get("clientId") as string;

    if (!audioFile || !clientId) {
      return NextResponse.json(
        { message: "Missing audio file or clientId" },
        { status: 400 }
      );
    }

    // Save the audio file locally if needed
    const audioBuffer = await audioFile.arrayBuffer();

    console.log("Temporary directory path creating:");

    // Get the system's default temporary directory
    const tmpDirectory = path.join(os.tmpdir(), "meal-planner"); // You can create a subdirectory if needed
    console.log("Temporary directory path:", tmpDirectory);

    // Ensure that the tmp directory exists
    await fs.mkdir(tmpDirectory, { recursive: true });
    console.log("Temporary directory created:", tmpDirectory);

    const audioPath = path.join(tmpDirectory, "audio.mp3");
    console.log("Temporary directory joined:", audioPath);

    // Write the audio file to the temporary directory
    await fs.writeFile(audioPath, Buffer.from(audioBuffer));
    console.log("writing file");

    // Step 1: Transcribe the audio
    const transcribedText = await transcribeAudio(audioPath);

    if (transcribedText) {
      // Step 2: Process the text with clientId
      const {
        response,
        generatedMealPlan,
        fetchedRecipes,
      }: {
        response: string;
        generatedMealPlan: IMealPlan | null;
        fetchedRecipes: IRecipeInterface[];
      } = await handleUserPrompt(transcribedText, Number(clientId));

      // Step 3: Convert the response to speech
      const speech: Uint8Array | null = await convertTextToSpeech(response);

      // Step 4: Encode the speech data as Base64
      const audioBase64 = speech
        ? Buffer.from(speech).toString("base64")
        : null;

      return NextResponse.json({
        responseText: response,
        audio: audioBase64,
        generatedMealPlan,
        fetchedRecipes,
      });
    } else {
      return NextResponse.json(
        { message: "Failed to transcribe audio" },
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
