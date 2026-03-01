import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (totalPages <= 1) return null;

  const effectiveSiblingCount = isMobile ? 0 : siblingCount;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const totalPageNumbers = effectiveSiblingCount * 2 + 5;

    if (totalPages <= totalPageNumbers) {
      return [...Array(totalPages)].map((_, i) => i + 1);
    }

    const leftSibling = Math.max(currentPage - effectiveSiblingCount, 1);
    const rightSibling = Math.min(currentPage + effectiveSiblingCount, totalPages);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = [...Array(3 + effectiveSiblingCount * 2)].map((_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = [...Array(3 + effectiveSiblingCount * 2)].map(
        (_, i) => totalPages - (2 + effectiveSiblingCount * 2) + i
      );
      return [1, "...", ...rightRange];
    }

    const middleRange = [...Array(rightSibling - leftSibling + 1)].map((_, i) => leftSibling + i);
    return [1, "...", ...middleRange, "...", totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="p-2 sm:p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        <FaChevronLeft className="text-gray-500 text-xs sm:text-sm" />
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="h-8 w-6 sm:h-10 sm:w-10 flex items-center justify-center text-gray-400 text-sm"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-8 w-8 sm:h-10 sm:w-10 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-primary text-white"
                : "text-gray-500 border border-gray-200 bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-2 sm:p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        <FaChevronRight className="text-gray-500 text-xs sm:text-sm" />
      </button>
    </div>
  );
}