import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // Change here to match your logic
}

const CenteredPageNumbers: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const generatePageNumbers = () => {
    const pages = [];

    // Determine a range of pages to display (for better UX)
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          type="button"
          key={i}
          onClick={() => onPageChange(i)} // Use the passed getPageLink function
          aria-current={i === currentPage ? "page" : undefined}
          className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
            i === currentPage
              ? "border-indigo-500 text-indigo-600"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          {i}
        </button>
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
        <button
          type="button"
          onClick={() => onPageChange(1)} // Go to the first page
          disabled={currentPage === 1}
          className={`inline-flex items-center border-t-2 border-transparent px-1 pt-4 text-sm font-medium ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
          aria-disabled={currentPage === 1}
        >
          <ArrowLongLeftIcon
            aria-hidden="true"
            className="mr-3 h-5 text-gray-400"
          />
          First
        </button>
      </div>
      <div className="hidden md:-mt-px md:flex">{generatePageNumbers()}</div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          type="button"
          onClick={() => onPageChange(totalPages)} // Go to the last page
          disabled={currentPage === totalPages}
          aria-disabled={currentPage === totalPages}
          className={`inline-flex items-center border-t-2 border-transparent px-2 pt-4 text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          Last
          <ArrowLongRightIcon
            aria-hidden="true"
            className="ml-3 h-5 text-gray-400"
          />
        </button>
      </div>
    </nav>
  );
};

export default CenteredPageNumbers;
