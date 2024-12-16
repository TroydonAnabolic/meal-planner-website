export type FieldType = "string" | "number" | "date" | "";

export type Tab = {
  name: string;
  href: string;
  current: boolean;
  visible?: boolean;
};

export type FormActionType = "Add" | "Edit" | "View";

export type LabelSection =
  | "mealTypeKey"
  | "dietLabels"
  | "healthLabels"
  | "cuisineType"
  | "dishType"
  | "cautions";
