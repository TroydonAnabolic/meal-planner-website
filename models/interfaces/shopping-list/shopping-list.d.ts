import { ShoppingListItem } from "../edamam/meal-planner/shopping-list-request";

export interface ShoppingList {
  id: string;
  mealPlanId: string;
  items: ShoppingListItem[];
}
