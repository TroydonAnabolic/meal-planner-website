import { handleUserPrompt } from "@/lib/gemini/gemini";
import { convertTextToSpeech } from "@/lib/google/speech-to-text";
import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userPrompt, clientId }: { userPrompt: string; clientId: number } =
      await request.json();

    // Get user prompt API response
    const {
      response,
      generatedMealPlan,
      fetchedRecipes,
    }: {
      response: string;
      generatedMealPlan: IMealPlan | null;
      fetchedRecipes: IRecipeInterface[];
    } = await handleUserPrompt(userPrompt, clientId);

    // Convert the API response to speech
    const speech: Uint8Array | null = await convertTextToSpeech(response);

    // Encode the speech data as Base64 for transmission
    const audioBase64 = speech ? Buffer.from(speech).toString("base64") : null;

    return NextResponse.json({
      responseText: response,
      audio: audioBase64,
      generatedMealPlan,
      fetchedRecipes,
    });
  } catch (error: any) {
    console.error("Error getting API speech:", error);
    return NextResponse.json(
      {
        message: "Could not get processed speech response",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
