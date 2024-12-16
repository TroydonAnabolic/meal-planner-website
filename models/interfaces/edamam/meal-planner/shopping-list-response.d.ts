export interface IShoppingListResult {
  entries: ShoppingListEntry[];
}

export interface ShoppingListEntry {
  foodItem: string;
  foodId: string;
  food: string;
  quantities: Quantity[];
}

export interface Quantity {
  quantity: number;
  measure: string;
  qualifiers?: string[];
  weight: number;
}

export interface IShoppingListResponse {
  data: IShoppingListResult;
  status: number;
}
