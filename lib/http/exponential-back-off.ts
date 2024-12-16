// lib/exponentialBackoff.ts

export async function exponentialBackoffFetch(
  fetchFn: () => Promise<Response>,
  maxRetries: number = 5,
  initialDelay: number = 500 // in ms
): Promise<Response> {
  let retries = 0;
  let delay = initialDelay;

  while (retries <= maxRetries) {
    try {
      const response = await fetchFn();

      if (response.ok) {
        return response;
      }

      // If rate limited by Edamam (e.g., 429), throw to retry
      if (response.status === 429) {
        throw new Error("Rate limited by Edamam API.");
      }

      // For other non-OK statuses, you might not want to retry
      return response;
    } catch (error) {
      if (retries === maxRetries) {
        throw error;
      }

      // Wait for the delay before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Exponentially increase the delay
      delay *= 2;
      retries += 1;
    }
  }

  throw new Error("Max retries exceeded.");
}
