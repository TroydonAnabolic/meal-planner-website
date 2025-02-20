import { getIngredientsByClientId } from "@/lib/server-side/ingredients";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const clientId = Number(url.searchParams.get("clientId"));

  if (!clientId) {
    return NextResponse.json({ message: "Missing clientId" }, { status: 400 });
  }

  try {
    //TODO: Try doing the axios call here
    const ingredients = await getIngredientsByClientId(clientId);

    return NextResponse.json(ingredients);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json(
      { error: "Failed to fetch ingredients." },
      { status: 500 }
    );
  }
}
