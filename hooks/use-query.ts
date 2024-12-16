// hooks/useQueryUtils.ts

"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

const useQueryUtils = () => {
  const searchParams = useSearchParams();

  /**
   * Updates multiple query parameters.
   *
   * @param params - An object containing key-value pairs of query parameters to set.
   * @returns The updated query string.
   */
  const setQueryParams = useCallback(
    (params: Record<string, string>) => {
      const updatedParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        updatedParams.set(key, value);
      });
      return updatedParams.toString();
    },
    [searchParams]
  );

  /**
   * Removes multiple query parameters.
   *
   * @param keys - An array of query parameter names to remove.
   * @returns The updated query string.
   */
  const removeQueryParams = useCallback(
    (keys: string[]) => {
      const updatedParams = new URLSearchParams(searchParams.toString());
      keys.forEach((key) => updatedParams.delete(key));
      return updatedParams.toString();
    },
    [searchParams]
  );

  return { setQueryParams, removeQueryParams };
};

export default useQueryUtils;
