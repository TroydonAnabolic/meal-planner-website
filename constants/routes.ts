// constants/routes.ts
export const ROUTES = {
  HOME: "/",
  PRIVACY: "/privacy",
  HOW_IT_WORKS: "/how-it-works",
  PREMIUM_PLAN: "/premium-plan",
  MEAL_PLANNER_DEMO: "/demo",
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    REGISTRATION_CONFIRMATION: "/registration-confirmation",
    USER_AUTHENTICATED: "/user-authenticated",
    VERIFY_CODE: "/verify-code",
  },
  MEAL_PLANNER: {
    BASE: "/meal-planner",
    DASHBOARD: "/meal-planner/dashboard",
    SETTINGS: {
      PROFILE: "/meal-planner/settings/profile",
      PHYSICAL_ATTRIBUTES: "/meal-planner/settings/physical-attributes",
      SUBSCRIPTIONS: "/meal-planner/settings/subscriptions",
      // Add more settings-related routes here
    },
    PLAN: "/meal-planner/plan-meal",
    MEAL_PREFERENCES: "/meal-planner/meal-preferences",
    MEAL_PLAN: "/meal-planner/meal-plan",
    RECIPES: {
      MANAGE_RECIPES: "/meal-planner/recipes",
      VIEW_RECIPE_DETAILS: "/meal-planner/recipes/view",
    },
    MEALS: "/meal-planner/meals",
    // Add more meal planner routes here
  },

  // Add more top-level routes as needed
};

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

// To handle nested paths more effectively, you can use utility types or helper functions if needed.
