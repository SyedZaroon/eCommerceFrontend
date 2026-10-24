import React, { useEffect } from "react";
import ProductSearch from "./ProductSearch";
import styles from "./searchDrawer.module.css";

const SearchDrawer = ({ isOpen = false, onClose }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
      >
        <header className={styles.header}>
          <div className={styles.heading}>
            <h2 id="search-title">Search</h2>
            <p>Find your next device</p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close search"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className={styles.searchContent}>
          <ProductSearch
            mode="drawer"
            enabled={isOpen}
            onResultClick={onClose}
          />
        </div>
      </aside>
    </div>
  );
};

export default SearchDrawer;
