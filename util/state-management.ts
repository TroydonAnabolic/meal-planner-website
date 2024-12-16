export const crudReducer = <T extends { id: number }>(
  state: T[] | undefined,
  action: { type: "upsert" | "delete"; item: T }
): T[] => {
  if (!state) {
    return action.type === "upsert" ? [action.item] : [];
  }

  switch (action.type) {
    case "upsert":
      const index = state.findIndex((r) => r.id === action.item.id);
      if (index === -1) {
        // Add phase: Add the new recipe to the existing state
        return [...state, action.item];
      } else {
        // Update phase: Update the existing recipe in the state
        return state.map((r) => (r.id === action.item.id ? action.item : r));
      }
    case "delete":
      return state.filter((r) => r.id !== action.item.id);
    default:
      return state;
  }
};
