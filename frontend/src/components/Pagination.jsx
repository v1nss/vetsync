import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        <FaChevronLeft className="text-gray-500" />
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-10 w-10 rounded-xl text-sm font-medium transition ${
              currentPage === page
                ? "bg-primary text-white"
                : "text-gray-500 border border-gray-200 bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-50"
      >
        <FaChevronRight className="text-gray-500"/>
      </button>
    </div>
  );
}
