import { IRecipeInterface } from "../recipe/recipe";

export interface Link {
  title: string;
  href: string;
}

// Interface for a section (e.g., Breakfast, Lunch)
export interface Section {
  assigned: string;
  _links: {
    self: Link;
  };
}

// Interface for each item in the selection array
export interface SelectionItem {
  sections: { [key: string]: Section };
}

// Root interface for the API response
export interface IMealPlan {
  id: number;
  clientId: number;
  startDate: string;
  endDate: string;
  recipes?: IRecipeInterface[];
  meals?: IMealInterface[];
  selection: SelectionItem[];
}
