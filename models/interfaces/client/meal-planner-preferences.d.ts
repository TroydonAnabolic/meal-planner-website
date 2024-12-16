export interface Range {
  min?: number;
  max?: number;
}

export interface NutrientConstraints {
  [key: string]: Range;
}

export interface AllMealFilter {
  /**
   * Select entries matching all of a given list of filters.
   */
  all?: AllMealFilter[]; // Ensure this is always an array when used
  /**
   * Select entries matching at least one out of a given list of filters.
   */
  any?: AllMealFilter[];
  /**
   * Select entries that do *not* match a given filters.
   */
  not?: AllMealFilter;
  /**
   * Select entries that satisfy a given target requirement, subject to a pre-condition.
   * Entries that do *not* satisfy the precondition will match this rule vacuously.
   */
  when?: {
    condition: AllMealFilter;
    require: AllMealFilter;
  };
  health?: string[];
  diet?: string[];
  caution?: string[];
  cuisine?: string[];
  meal?: string[];
  dish?: string[];
  "only-dish"?: string[];
  source?: string[];
  "source-name"?: string[];
}

export interface MealFilter {
  /**
   * Select entries matching all of a given list of filters.
   */
  all?: MealFilter[]; // Ensure this is always an array when used
  /**
   * Select entries matching at least one out of a given list of filters.
   */
  any?: MealFilter[];
  /**
   * Select entries that do *not* match a given filters.
   */
  not?: MealFilter;
  /**
   * Select entries that satisfy a given target requirement, subject to a pre-condition.
   * Entries that do *not* satisfy the precondition will match this rule vacuously.
   */
  when?: {
    condition: MealFilter;
    require: MealFilter;
  };
  health?: string[];
  diet?: string[];
  caution?: string[];
  cuisine?: string[];
  meal?: string[];
  dish?: string[];
  "only-dish"?: string[];
  source?: string[];
  "source-name"?: string[];
}

export interface MealSection {
  accept?: MealFilter;
  fit?: NutrientConstraints;
  exclude?: string[];
}

export interface AllMealSection {
  accept?: AllMealFilter;
  fit?: NutrientConstraints;
  exclude?: string[];
  sections?: { [key: string]: MealSection };
}

export interface IMealPlanPreferences {
  id?: number; // Primary Key
  clientSettingsId?: number; // Foreign Key to Client
  size: number;
  plan: AllMealSection;
}
