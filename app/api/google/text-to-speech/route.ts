import { handleUserPrompt } from "@/lib/gemini/gemini";
import { convertTextToSpeech } from "@/lib/google/speech-to-text";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userPrompt, clientId }: { userPrompt: string; clientId: number } =
      await request.json();

    // get user prompt api response
    const { response, generatedMealPlan, fetchedRecipes } =
      await handleUserPrompt(userPrompt, clientId);
    // convert the api response to speech and return it along with the text answer
    const speech = await convertTextToSpeech(response);

    if (
      generatedMealPlan &&
      generatedMealPlan.id > 0 &&
      fetchedRecipes?.length
    ) {
      return NextResponse.json({ speech, generatedMealPlan, fetchedRecipes });
    } else {
      return NextResponse.json({ speech });
    }
  } catch (error: any) {
    console.error("Error getting api speech:", error);
    return NextResponse.json(
      {
        message: "Could not get proceesed speech response",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
