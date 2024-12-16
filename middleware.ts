// middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "./lib/http/rate-limiter";
import { auth } from "./auth";
import { Session } from "next-auth";

/**
 * Middleware to handle rate limiting based on clientId.
 */
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Define protected routes
  const protectedRoutes = [
    "/api/edamam/meal-planner/fetch-recipe",
    "/api/edamam/meal-planner/select",
    "/api/edamam/recipe/fetch-recipe",
    "/api/edamam/recipe/fetch-recipe-by-filter",
    "/api/edamam/food/fetch-food",
    "/api/edamam/nutrients/fetch-nutrients",
  ];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // TODO: Potentially wont work in production
    const { user } = (await auth()) as Session;
    const clientId = parseInt(user.clientId!, 10);

    if (isNaN(clientId)) {
      return NextResponse.json(
        { message: "Invalid client ID format." },
        { status: 400 }
      );
    }

    // Determine the API name based on the route
    const apiName = extractApiNameFromPath(pathname);
    if (!apiName) {
      return NextResponse.json(
        {
          name: "InvalidAPI",
          message: "API not recognized for rate limiting.",
        },
        { status: 400 }
      );
    }

    // Check rate limits
    const { allowed, retryAfter } = rateLimiter.checkRateLimit(
      apiName,
      clientId
    );

    if (!allowed) {
      if (retryAfter) {
        return NextResponse.json(
          {
            name: "RateLimitExceeded",
            message: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
          },
          {
            status: 429,
            statusText: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
          }
        );
      } else {
        return NextResponse.json(
          {
            name: "MonthlyRateLimitExceeded",
            message: "Monthly rate limit exceeded.",
          },
          {
            status: 429,
            statusText: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
          }
        );
      }
    }
  }

  return NextResponse.next();
}

/**
 * Extracts the API name from the request path.
 * @param path - The request pathname.
 * @returns The API name or null if not found.
 */
function extractApiNameFromPath(path: string): string | null {
  if (path.includes("/edamam/meal-planner")) return "mealPlanner";
  if (
    path.includes("/edamam/recipe/fetch-recipe-by-filter") ||
    path.includes("/edamam/recipe/fetch-recipe")
  )
    return "recipe";
  if (path.includes("/edamam/food")) return "food";
  if (path.includes("/edamam/nutrition")) return "nutrition";
  return null;
}

export const config = {
  matcher: "/api/edamam/:path*",
};
