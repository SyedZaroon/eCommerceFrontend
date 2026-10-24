import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { formatString } from "../../utils/formatString";
import SearchIcon from "../../assets/icons/SearchIcon";
import styles from "./searchDrawer.module.css";

const SearchDrawer = ({ menu = [], isOpen = false, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? menu.filter((collection) =>
        formatString(collection.slug).toLowerCase().includes(normalizedQuery)
      )
    : menu;

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
            <p>Find a collection to explore</p>
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
          <label className={styles.searchLabel} htmlFor="collection-search">
            Search collections
          </label>
          <div className={styles.searchField}>
            <SearchIcon />
            <input
              ref={inputRef}
              id="collection-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try iPhone, Samsung..."
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <div className={styles.resultsHeader}>
            <h3>
              {normalizedQuery ? "Matching collections" : "Browse collections"}
            </h3>
            <span aria-live="polite">
              {results.length} {results.length === 1 ? "result" : "results"}
            </span>
          </div>

          {results.length > 0 ? (
            <nav className={styles.results} aria-label="Search results">
              {results.map((collection) => (
                <NavLink
                  to={`/collection/${collection.slug}`}
                  key={collection._id}
                  className={styles.resultLink}
                  onClick={onClose}
                >
                  <span>{formatString(collection.slug)}</span>
                  <span className={styles.resultArrow} aria-hidden="true">
                    →
                  </span>
                </NavLink>
              ))}
            </nav>
          ) : (
            <div className={styles.emptyState} role="status">
              <p>No collections found for “{query.trim()}”.</p>
              <span>Try another brand or collection name.</span>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default SearchDrawer;
