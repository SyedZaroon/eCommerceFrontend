import React, { useEffect, useState } from "react";
import styles from "./collectionFilters.module.css";

const CollectionFilters = (props) => {
  const {
    collections,
    selectedCollections,
    minimumPrice,
    maximumPrice,
    priceLimit,
    inStockOnly,
    onCollectionChange,
    onMinimumPriceChange,
    onMaximumPriceChange,
    onInStockChange,
    onClear,
  } = props;
  const [minimumDraft, setMinimumDraft] = useState(String(minimumPrice));
  const [maximumDraft, setMaximumDraft] = useState(String(maximumPrice));

  useEffect(() => {
    setMinimumDraft(String(minimumPrice));
    setMaximumDraft(String(maximumPrice));
  }, [minimumPrice, maximumPrice]);

  return (
    <aside className={styles.filters} aria-label="Product filters">
      <div className={styles.filtersHeader}>
        <h2>Filters</h2>
        <button type="button" onClick={onClear} className={styles.clearButton}>
          Clear all
        </button>
      </div>

      <fieldset className={styles.filterGroup}>
        <legend>Stock</legend>
        <label className={styles.filterOption}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => onInStockChange(event.target.checked)}
          />
          <span>In stock only</span>
          <span className={styles.checkmark} aria-hidden="true" />
        </label>
      </fieldset>

      <fieldset className={styles.filterGroup}>
        <legend>Price range</legend>
        <div className={styles.priceInputs}>
          <label className={styles.priceInput}>
            <span>Min</span>
            <span className={styles.priceField}>
              <span aria-hidden="true">£</span>
              <input
                type="number"
                min="0"
                max={maximumPrice}
                step="10"
                value={minimumDraft}
                onChange={(event) => setMinimumDraft(event.target.value)}
                onBlur={() => onMinimumPriceChange(minimumDraft)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                }}
                aria-label="Minimum price"
              />
            </span>
          </label>
          <span className={styles.priceSeparator} aria-hidden="true">
            –
          </span>
          <label className={styles.priceInput}>
            <span>Max</span>
            <span className={styles.priceField}>
              <span aria-hidden="true">£</span>
              <input
                type="number"
                min={minimumPrice}
                max={priceLimit}
                step="10"
                value={maximumDraft}
                onChange={(event) => setMaximumDraft(event.target.value)}
                onBlur={() => onMaximumPriceChange(maximumDraft)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                }}
                aria-label="Maximum price"
              />
            </span>
          </label>
        </div>
        <p className={styles.priceHint}>
          Set a range from £0 to £{priceLimit.toLocaleString("en-GB")}.
        </p>
      </fieldset>

      <fieldset className={styles.filterGroup}>
        <legend>Collection</legend>
        {collections.map((collection) => (
          <label className={styles.filterOption} key={collection}>
            <input
              type="checkbox"
              checked={selectedCollections.includes(collection)}
              onChange={() => onCollectionChange(collection)}
            />
            <span>{collection}</span>
            <span className={styles.checkmark} aria-hidden="true" />
          </label>
        ))}
      </fieldset>
    </aside>
  );
};

export default CollectionFilters;
