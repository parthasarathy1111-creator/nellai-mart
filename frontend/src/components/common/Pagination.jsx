import React from "react";

function Pagination({ currentPage = 1, totalPages = 5, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6 rounded-lg shadow-xs">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
            <button
              onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2.5 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              <span className="sr-only">Previous</span>
              ‹
            </button>
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => onPageChange && onPageChange(p)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold cursor-pointer ${
                  p === currentPage
                    ? "z-10 bg-green-600 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2.5 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              <span className="sr-only">Next</span>
              ›
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
