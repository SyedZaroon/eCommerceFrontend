import React from "react";
import styles from "../collectionPage.module.css";

const CollectionToolbar = ({ currentCount, totalCount, sort, onSortChange }) => (
  <div className={styles.toolbar}>
    <p className={styles.resultCount}>
      {totalCount} Products Found
    </p>

    <label className={styles.sortControl}>
      <span>Sort by</span>
      <select value={sort} onChange={onSortChange}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
        <option value="name_asc">Name: A to Z</option>
        <option value="name_desc">Name: Z to A</option>
      </select>
    </label>
  </div>
);

export default CollectionToolbar;
