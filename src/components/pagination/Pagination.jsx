import React from "react";
import styles from "./pagination.module.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Go to previous page"
      >
        ← <span>Previous</span>
      </button>

      <div className={styles.pageNumbers}>
        {pages.map((page) => (
          <button
            type="button"
            key={page}
            className={`${styles.pageNumber} ${
              page === currentPage ? styles.activePage : ""
            }`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Go to next page"
      >
        <span>Next</span> →
      </button>
    </nav>
  );
};

export default Pagination;
