// lib/rateLimiterConfig.ts

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerMonth: number;
}

export const rateLimitConfigs: { [key: string]: RateLimitConfig } = {
  recipe: {
    requestsPerMinute: 10,
    requestsPerMonth: 10000,
  },
  mealPlanner: {
    requestsPerMinute: 10,
    requestsPerMonth: 10000,
  },
  food: {
    requestsPerMinute: 50,
    requestsPerMonth: 100000,
  },
  nutrients: {
    requestsPerMinute: 50,
    requestsPerMonth: 100000,
  },
};
