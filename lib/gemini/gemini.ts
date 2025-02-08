import { IMealInterface } from "@/models/interfaces/meal/Meal";
import {
  Content,
  GenerateContentRequest,
  GenerativeModel,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import dayjs from "dayjs";
import { getMealsByClientId } from "../meal";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { Nutrients } from "@/constants/constants-enums";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
});

interface ApiCall {
  key: string;
  query: string;
}

const apiCalls: ApiCall[] = [
  {
    key: "Remaining Calories",
    query: "How many calories is remaining for me to consume today",
  },
];

// Helper to call Gemini to generate content
async function generateContent(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

// Handles the Gemini semantic matching and query execution
export async function handleUserPrompt(userPrompt: string) {
  try {
    const promptForMatching = `Given the following user input: "${userPrompt}", match it to one of these queries: ${apiCalls
      .map((call) => `"${call.key}"`)
      .join(", ")} or return "No match found."`;

    const matchResult = await generateContent(promptForMatching);
    let response: string;

    // Handle API query based on the match
    switch (matchResult.trim()) {
      case "Remaining Calories":
        // Call database or external API for the actual query
        const { remainingCalories } = await queryDatabaseForCalorieDetails(); // Mock this function
        response = await generateContent(
          `The user has ${remainingCalories} calories remaining for today. Respond in a friendly tone.`
        );
        break;

      default:
        response = "I'm sorry, I couldn't understand your request.";
        break;
    }

    return response;
  } catch (error) {
    console.error("Error handling user prompt:", error);
    return "Sorry, there was an error processing your request.";
  }
}

// Usage example
// const prompt = "Explain how AI works";
// generateContent(prompt)
//   .then((response) => console.log(response))
//   .catch((error) => console.error(error));

// export class ChatService {
//   private genAI: GoogleGenerativeAI;
//   private model: GenerativeModel;
//   private conversationHistory: Content[] = [];

//   constructor(apiKey: string) {
//     this.genAI = new GoogleGenerativeAI(apiKey);
//     this.model = this.genAI.getGenerativeModel({
//       model: "gemini-2.0-flash-001",
//     });
//   }

//   async chatWithGemini(content: string): Promise<string | undefined> {
//     // Prepare user content as required by the Content structure
//     this.conversationHistory.push({
//       role: "user",
//       parts: [{ text: content }],
//     });

//     const request: GenerateContentRequest = {
//       contents: this.conversationHistory,
//     };

//     try {
//       const result = await this.model.generateContent(request);
//       const replyPart = result?.response?.text();

//       if (replyPart) {
//         // Store assistant reply in conversation history
//         this.conversationHistory.push({
//           role: "assistant",
//           parts: [{ text: replyPart }],
//         });
//       }

//       return replyPart;
//     } catch (error) {
//       console.error("Error during chat with Gemini:", error);
//       return undefined;
//     }
//   }
// }

async function queryDatabaseForCalorieDetails(): Promise<{
  totalCalories: number;
  remainingCalories: number;
  consumedCalories: number;
}> {
  const session = (await auth()) as Session;
  const clientId = session.user.clientId;

  const meals: IMealInterface[] = (await getMealsByClientId(
    Number(clientId)
  )) as IMealInterface[];

  const startOfToday = dayjs().startOf("day");
  const endOfToday = dayjs().endOf("day");

  // Filter meals for today
  const mealsToday = meals.filter((meal) => {
    const mealDate = dayjs(meal.timeScheduled);
    return mealDate.isAfter(startOfToday) && mealDate.isBefore(endOfToday);
  });

  // Total Calories (sum of all planned meals)
  const totalCalories = mealsToday.reduce((total, meal) => {
    const mealEnergy = meal.nutrients?.["ENERC_KCAL"]?.quantity || 0;
    return total + mealEnergy;
  }, 0);

  // Consumed Calories (sum of only consumed meals)
  const consumedCalories = mealsToday.reduce((total, meal) => {
    if (meal.timeConsumed) {
      const mealEnergy = meal.nutrients?.["ENERC_KCAL"]?.quantity || 0;
      return total + mealEnergy;
    }
    return total;
  }, 0);

  // Remaining Calories
  const remainingCalories = totalCalories - consumedCalories;

  return {
    totalCalories,
    remainingCalories,
    consumedCalories,
  };
}
