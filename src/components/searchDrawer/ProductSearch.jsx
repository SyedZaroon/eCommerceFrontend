import React, { useEffect, useId, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import SearchIcon from "../../assets/icons/SearchIcon";
import { searchProduct } from "../../services/product";
import styles from "./productSearch.module.css";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const getProductPath = (product) => {
  const brand =
    product.brandSlug ||
    product.brand?.slug ||
    (typeof product.brand === "string" ? product.brand : "") ||
    product.brandName ||
    "product";
  const slug = product.slug || product._id;

  return `/${[brand, slug]
    .map((segment) => encodeURIComponent(String(segment)))
    .join("/")}`;
};

const getProductPrice = (product) => {
  const price = Number(product.discountPrice ?? product.basePrice);
  return Number.isFinite(price) ? currencyFormatter.format(price) : null;
};

const ProductSearch = ({
  mode = "drawer",
  enabled = true,
  onResultClick,
}) => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("idle");
  const inputId = useId();
  const inputRef = useRef(null);
  const normalizedQuery = query.trim();

  useEffect(() => {
    if (mode === "drawer") inputRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    if (!enabled || !normalizedQuery) {
      setProducts([]);
      setStatus("idle");
      return undefined;
    }

    let active = true;
    setStatus("loading");
    const timer = setTimeout(async () => {
      try {
        const data = await searchProduct(normalizedQuery);
        const results = Array.isArray(data) ? data : data?.products;

        if (!Array.isArray(results)) {
          throw new Error("Product search returned an invalid response.");
        }

        if (active) {
          setProducts(results);
          setStatus("success");
        }
      } catch (error) {
        if (active) {
          console.error("Product search failed:", error);
          setProducts([]);
          setStatus("error");
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [enabled, normalizedQuery]);

  return (
    <div className={styles[mode === "inline" ? "inlineSearch" : "drawerSearch"]}>
      <label className={styles.searchLabel} htmlFor={inputId}>
        Search devices
      </label>
      <div className={styles.searchField}>
        <SearchIcon />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by device name..."
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

      {normalizedQuery && (
        <div className={styles.resultsPanel}>
          <div className={styles.resultsHeader}>
            <h3>Products</h3>
            {status === "success" && (
              <span>
                {products.length} {products.length === 1 ? "result" : "results"}
              </span>
            )}
          </div>

          {status === "loading" && (
            <p className={styles.message} role="status">
              Searching products...
            </p>
          )}

          {status === "error" && (
            <p className={styles.message} role="alert">
              Search is unavailable right now. Please try again.
            </p>
          )}

          {status === "success" && products.length === 0 && (
            <p className={styles.message} role="status">
              No products found for “{normalizedQuery}”.
            </p>
          )}

          {status === "success" && products.length > 0 && (
            <div className={styles.results} aria-label="Product results">
              {products.map((product) => (
                <NavLink
                  to={getProductPath(product)}
                  key={product._id || product.slug}
                  className={styles.productResult}
                  onClick={onResultClick}
                >
                  <span className={styles.productImage}>
                    {product.productImg || product.image ? (
                      <img
                        src={product.productImg || product.image}
                        alt=""
                      />
                    ) : (
                      <span aria-hidden="true">Device</span>
                    )}
                  </span>
                  <span className={styles.productInfo}>
                    <span className={styles.productTitle}>
                      {product.title || product.name || "Product"}
                    </span>
                    <span className={styles.productPrice}>
                      {getProductPrice(product) || "Price unavailable"}
                    </span>
                  </span>
                  <span className={styles.resultArrow} aria-hidden="true">
                    →
                  </span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
