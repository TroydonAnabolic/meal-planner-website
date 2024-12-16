// utils/getRoute.ts
// utils/getRoute.ts

import { ROUTES } from "@/constants/routes";

export const getRoute = (path: string[]): string => {
  let current: any = ROUTES;

  for (const segment of path) {
    if (current[segment]) {
      current = current[segment];
    } else {
      throw new Error(`Route segment "${segment}" does not exist.`);
    }
  }

  if (typeof current === "string") {
    return current;
  }

  throw new Error(`Invalid route path: ${path.join("/")}`);
};

// Usage in a component
// import { getRoute } from "@/utils/getRoute";

const dashboardRoute = getRoute(["MEAL_PLANNER", "DASHBOARD"]);
