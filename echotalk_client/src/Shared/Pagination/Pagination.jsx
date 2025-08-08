import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <div className="join">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`join-item btn btn-sm ${page === currentPage ? "btn-primary" : "btn-outline"}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
