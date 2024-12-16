// lib/rateLimiter.ts

import dayjs from "dayjs";
import { RateLimitConfig, rateLimitConfigs } from "./rate-limiter-config";

interface RateLimitRecord {
  countPerMinute: number;
  timestamp: number;
  countPerMonth: number;
  month: number;
}

// TODO: Migrate to redis for distributed rate limiting, when I am ready to learn redis
class RateLimiter {
  private records: Map<string, RateLimitRecord> = new Map();

  constructor() {}

  /**
   * Generates a unique key based on API name and client ID.
   * @param api - The name of the API (e.g., 'recipe').
   * @param clientId - The unique identifier for the client.
   * @returns A string key.
   */
  private generateKey(api: string, clientId: number): string {
    return `${api}:${clientId}`;
  }

  /**
   * Checks and updates the rate limits.
   * @param api - The name of the API.
   * @param clientId - The unique identifier for the client.
   * @returns An object indicating if the request is allowed and retry-after seconds if not.
   */
  public checkRateLimit(
    api: string,
    clientId: number
  ): { allowed: boolean; retryAfter?: number } {
    const config: RateLimitConfig = rateLimitConfigs[api];
    if (!config) {
      throw new Error(`Rate limit configuration for API '${api}' not found.`);
    }

    const key = this.generateKey(api, clientId);
    const currentTimestamp = Date.now();
    const currentMinute = dayjs().minute();
    const currentMonth = dayjs().month(); // 0-indexed

    let record = this.records.get(key);

    if (!record) {
      record = {
        countPerMinute: 0,
        timestamp: currentTimestamp,
        countPerMonth: 0,
        month: currentMonth,
      };
      this.records.set(key, record);
    }

    // Reset counts if a minute has passed
    if (dayjs(record.timestamp).minute() !== currentMinute) {
      record.countPerMinute = 0;
      record.timestamp = currentTimestamp;
    }

    // Reset monthly count if a new month has started
    if (record.month !== currentMonth) {
      record.countPerMonth = 0;
      record.month = currentMonth;
    }

    // Check per-minute limit
    if (record.countPerMinute >= config.requestsPerMinute) {
      const retryAfter = 60 - dayjs(currentTimestamp).second(); // Seconds until next minute
      return { allowed: false, retryAfter };
    }

    // Check per-month limit
    if (record.countPerMonth >= config.requestsPerMonth) {
      return { allowed: false };
    }

    // Increment counts
    record.countPerMinute += 1;
    record.countPerMonth += 1;

    return { allowed: true };
  }
}

export const rateLimiter = new RateLimiter();
