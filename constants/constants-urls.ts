export const BACKEND_URL_LIVE = "https://api.smartaitrainer.com";
export const DIETAPI_BASE = "diettracker";
export const ACCOUNTAPI_BASE = "accountmgmt";
export const BACKEND_URL = "https://localhost";

export const EDAMAM_BASE = "https://api.edamam.com/api/";

export const EDAMAM_MEALPLANNER_API = "meal-planner/v1";
export const EDAMAM_RECIPE_API = "recipes/v2";

export const EDAMAM_FOOD_DB_PARSER_API = "food-database/v2/parser";
export const EDAMAM_FOOD_DB_NUTRITION_API = "food-database/v2/nutrients";

export const APIM_HEADERS: CustomHeaders = {
  "Ocp-Apim-Subscription-Key": process.env.OPIM_SUBSCRIPTION_KEY as string | "",
  "Ocp-Apim-Trace": "true",
  Connection: "keep-alive",
};

export const APIM_HEADERS_PUBLIC: CustomHeaders = {
  "Ocp-Apim-Subscription-Key": process.env.NEXT_PUBLIC_OPIM_SUBSCRIPTION_KEY as
    | string
    | "",
  "Ocp-Apim-Trace": "true",
  Connection: "keep-alive",
};

type CustomHeaders = {
  [key: string]: string;
};
