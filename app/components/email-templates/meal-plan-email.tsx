import { IMealPlan } from "@/models/interfaces/diet/meal-plan";
import { IRecipeInterface } from "@/models/interfaces/recipe/recipe";

interface MealPlanToHTMLProps {
  mealPlanData: any; // Replace `any` with the proper type if available
  recipesData: any; // Replace `any` with the proper type if available
  clientId: string;
}

// app/components/email-templates/MealPlanEmail.tsx
export async function generateMealPlanEmail(props: {
  mealPlanData: IMealPlan[];
  recipesData: IRecipeInterface[];
  clientId: number;
  givenName: string;
}) {
  const { mealPlanData, recipesData, givenName } = props;

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Meal Plan</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
            }
          </style>
        </head>
        <body>
          <div style="background-color: #f8f9fa; padding: 20px; margin-bottom: 30px; border-radius: 5px;">
            <h1>Your Meal Plan</h1>
            <p>Hi ${givenName},</p>
            <p>Here's your customized meal plan:</p>
          </div>
          
          <div>
            ${generateMealPlanContent(mealPlanData, recipesData)}
          </div>
  
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p>Thank you for using our meal planning service!</p>
          </div>
        </body>
      </html>
    `;
}

function generateMealPlanContent(
  mealPlanData: IMealPlan[],
  recipesData: IRecipeInterface[]
) {
  // Generate HTML string for meal plan content
  // You'll need to implement this based on your data structure
  let content = '<div class="meal-plan">';

  // Example of how you might structure the content
  if (mealPlanData && mealPlanData.length > 0) {
    const currentPlan = mealPlanData[0];
    content += `
          <div class="meal-plan-dates">
            <h2>Meal Plan: ${new Date(
              currentPlan.startDate
            ).toLocaleDateString()} - 
                ${new Date(currentPlan.endDate).toLocaleDateString()}</h2>
          </div>
        `;

    // Add recipes section
    if (recipesData && recipesData.length > 0) {
      content += '<div class="recipes-section">';
      content += "<h3>Planned Meals</h3>";
      content += "<table>";
      content += "<tr><th>Day</th><th>Meal</th><th>Recipe</th></tr>";

      recipesData.forEach((recipe: any) => {
        content += `
              <tr>
                <td>${recipe.day || ""}</td>
                <td>${recipe.mealType || ""}</td>
                <td>${recipe.name || ""}</td>
              </tr>
            `;
      });

      content += "</table>";
      content += "</div>";
    }
  }

  content += "</div>";
  return content;
}
