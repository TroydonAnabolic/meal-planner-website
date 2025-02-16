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
import { IMealInterface } from "@/models/interfaces/meal/Meal";

export const maxDuration = 60; // This function can run for a maximum of 2 minutes

export async function POST(request: Request) {
  try {
    const { audio, clientId } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { message: "Missing clientId" },
        { status: 400 }
      );
    } else if (!audio) {
      return NextResponse.json(
        { message: "Missing audio file" },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audio, "base64");

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
    if (!transcribedText) {
      return NextResponse.json(
        { message: `Failed to transcribe audio for audioPath - ${audioPath}` },
        { status: 500 }
      );
    }

    // Step 2: Process the text with clientId
    const {
      response,
      generatedMealPlan,
      fetchedRecipes,
      meal,
    }: {
      response: string;
      generatedMealPlan: IMealPlan | null;
      fetchedRecipes: IRecipeInterface[];
      meal: IMealInterface | null;
    } = await handleUserPrompt(transcribedText, Number(clientId));
    if (!response) {
      return NextResponse.json(
        { message: `Failed to transcription to speech - ${response}` },
        { status: 500 }
      );
    }

    // Step 3: Convert the response to speech
    const speech: Uint8Array | null = await convertTextToSpeech(response);
    if (!speech) {
      return NextResponse.json(
        { message: `Failed to transcription to speech - ${response}` },
        { status: 500 }
      );
    }

    // Step 4: Encode the speech data as Base64
    const audioBase64 = speech ? Buffer.from(speech).toString("base64") : null;

    return NextResponse.json({
      responseText: response,
      audio: audioBase64,
      generatedMealPlan,
      fetchedRecipes,
      meal,
    });
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
