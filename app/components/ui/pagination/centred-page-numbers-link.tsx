import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";

interface PaginationPropsLink {
  currentPage: number;
  totalPages: number;
  getPageLink: (page: number) => string; // Change here to match your logic
}

const CenteredPageNumbersLink: React.FC<PaginationPropsLink> = ({
  currentPage,
  totalPages,
  getPageLink,
}) => {
  const generatePageNumbers = () => {
    const pages = [];

    // Determine a range of pages to display (for better UX)
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={getPageLink(i)} // Use the passed getPageLink function
          aria-current={i === currentPage ? "page" : undefined}
          className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
            i === currentPage
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          {i}
        </Link>
      );
    }
    return pages;
  };

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6"
      aria-label="Pagination"
    >
      <div className="-mt-px flex w-0 flex-1">
        <Link
          href={getPageLink(currentPage - 1)} // Previous button link
          aria-disabled={currentPage === 1}
          className={`inline-flex items-center border-t-2 border-transparent px-1 pt-4 text-sm font-medium ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          <ArrowLongLeftIcon
            aria-hidden="true"
            className="mr-3 h-5 text-gray-400"
          />
          Previous
        </Link>
      </div>
      <div className="hidden md:-mt-px md:flex">{generatePageNumbers()}</div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <Link
          href={getPageLink(currentPage + 1)} // Next button link
          aria-disabled={currentPage === totalPages}
          className={`inline-flex items-center border-t-2 border-transparent px-2 pt-4 text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          Next
          <ArrowLongRightIcon
            aria-hidden="true"
            className="ml-3 h-5 text-gray-400"
          />
        </Link>
      </div>
    </nav>
  );
};

export default CenteredPageNumbersLink;
