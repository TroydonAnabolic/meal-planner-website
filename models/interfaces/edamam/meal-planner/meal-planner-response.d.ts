import { MealNumber } from "@/constants/constants-enums";

// Interface for the _links object
interface Link {
  title: string;
  href: string;
}

// Interface for a section (e.g., Breakfast, Lunch)
interface Section {
  assigned: string;
  _links: {
    self: Link;
  };
}

// Interface for each item in the selection array
interface SelectionItem {
  sections: { [key: string]: Section };
}

// Root interface for the API response
interface GeneratorResponse {
  selection: SelectionItem[];
  status: "OK" | "INCOMPLETE" | "TIME_OUT" | string;
}

export interface IMealPlannerResponse {
  status: number;
  data?: GeneratorResponse;
}
