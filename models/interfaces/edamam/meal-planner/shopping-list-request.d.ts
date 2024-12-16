export interface ShoppingListEntry {
  quantity: number;
  measure?: string;
  recipe: string;
}

export interface ShoppingListRequest {
  entries: ShoppingListEntry[];
}
