// lib/exponentialBackoffAxios.ts
import axios from "@/axiosConfig";

import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Utility function to perform Axios requests with exponential backoff retry strategy.
 *
 * @param axiosConfig - The Axios request configuration.
 * @param maxRetries - Maximum number of retries (default is 5).
 * @param initialDelay - Initial delay in milliseconds (default is 500ms).
 * @returns A promise resolving to the Axios response.
 * @throws An error if all retry attempts fail.
 */
export async function exponentialBackoffAxios<T = any>(
  axiosConfig: AxiosRequestConfig,
  maxRetries: number = 5,
  initialDelay: number = 500 // in ms
): Promise<AxiosResponse<T>> {
  let retries = 0;
  let delay = initialDelay;

  while (retries <= maxRetries) {
    try {
      const response = await axios(axiosConfig);

      // If response is successful, return it.
      return response;
    } catch (error: any) {
      if (retries === maxRetries) {
        throw error;
      }

      // Determine if the error is retryable.
      // Retry on network errors or 5xx status codes.
      if (
        error.code === "ECONNABORTED" || // Timeout
        error.response?.status >= 500 || // Server errors
        error.response?.status === 429 // Too Many Requests
      ) {
        // Wait for the delay before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Increase the delay exponentially
        delay *= 2;
        retries += 1;
      } else {
        // For non-retryable errors, throw immediately
        throw error;
      }
    }
  }

  throw new Error("Max retries exceeded.");
}
