// hooks/usePagination.ts

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface UsePaginationProps {
  defaultPage?: number;
}

const usePagination = ({ defaultPage = 1 }: UsePaginationProps = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize currentPage from URL or default
  const initialPage = searchParams.get("page")
    ? parseInt(searchParams.get("page")!, 10)
    : defaultPage;
  const [currentPage, setCurrentPage] = useState<number>(
    isNaN(initialPage) || initialPage < 1 ? 1 : initialPage
  );

  // Function to change the page and update URL
  const changePage = useCallback(
    (page: number) => {
      if (page < 1) return;
      setCurrentPage(page);

      const params = new URLSearchParams(window.location.search);
      params.set("page", String(page));

      // Update the URL while preserving other query params
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router]
  );

  // Sync currentPage when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");
    const newPage = pageParam ? parseInt(pageParam, 10) : defaultPage;
    if (!isNaN(newPage) && newPage !== currentPage) {
      setCurrentPage(newPage < 1 ? 1 : newPage);
    }
  }, [searchParams, currentPage, defaultPage]);

  return { currentPage, changePage };
};

export default usePagination;
