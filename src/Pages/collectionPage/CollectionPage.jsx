import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CollectionFilters from "../../components/collectionFilters/CollectionFilters";
import Pagination from "../../components/pagination/Pagination";
import { getAllProducts } from "../../services/product";
import { formatString } from "../../utils/formatString";
import CollectionHeader from "./components/CollectionHeader";
import CollectionStatus from "./components/CollectionStatus";
import CollectionToolbar from "./components/CollectionToolbar";
import ProductGrid from "./components/ProductGrid";
import styles from "./collectionPage.module.css";

const productsPerPage = 8;
const validSortOptions = [
  "newest",
  "oldest",
  "price_asc",
  "price_desc",
  "name_asc",
  "name_desc",
];

const CollectionPage = () => {
  const { collectionName } = useParams();
  const collectionSlug = collectionName === "all" ? "" : collectionName || "";
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const collectionTitle = collectionName === 'all' ? "All Products" : formatString(collectionName || "");
  const sortParam = searchParams.get("sort");
  const sort = validSortOptions.includes(sortParam) ? sortParam : "newest";
  const pageParam = Number(searchParams.get("page"));
  const currentPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const minimumPrice = searchParams.get("minPrice") || "";
  const maximumPrice = searchParams.get("maxPrice") || "";
  const inStockOnly = searchParams.get("inStockOnly") === "true";

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const filters = {
          ...(minimumPrice ? { minPrice: minimumPrice } : {}),
          ...(maximumPrice ? { maxPrice: maximumPrice } : {}),
          ...(inStockOnly ? { inStockOnly: "true" } : {}),
        };
        const data = await getAllProducts(
          currentPage,
          productsPerPage,
          collectionSlug || "",
          sort,
          filters,
        );

        if (!Array.isArray(data.products)) {
          throw new Error("Invalid products response from server.");
        }

        if (!active) return;

        setProducts(data.products);
        setTotalPages(data.pagination?.totalPages ?? 0);
        setTotalProducts(data.pagination?.totalProducts ?? 0);
      } catch (requestError) {
        if (!active) return;

        console.error("Failed to fetch products:", requestError);
        setProducts([]);
        setTotalPages(0);
        setTotalProducts(0);
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Unable to load products. Please try again.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [
    collectionSlug,
    currentPage,
    sort,
    minimumPrice,
    maximumPrice,
    inStockOnly,
    retryCount,
  ]);

  const updateQuery = (updates, remove = []) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      remove.forEach((key) => next.delete(key));
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    });
  };

  const handleSortChange = (event) => {
    updateQuery({ sort: event.target.value, page: 1 });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    updateQuery({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePriceChange = (key, value) => {
    const nextValue = value.trim();
    const nextMinimum = key === "minPrice" ? nextValue : minimumPrice;
    const nextMaximum = key === "maxPrice" ? nextValue : maximumPrice;

    const hasInvalidPrice = [nextMinimum, nextMaximum].some((price) => {
      if (!price) return false;
      const numericPrice = Number(price);
      return !Number.isFinite(numericPrice) || numericPrice < 0;
    });

    if (hasInvalidPrice) {
      setFilterError("Enter a valid non-negative price.");
      return;
    }

    if (
      nextMinimum &&
      nextMaximum &&
      Number(nextMinimum) > Number(nextMaximum)
    ) {
      setFilterError("Minimum price cannot exceed maximum price.");
      return;
    }

    setFilterError("");
    updateQuery({ [key]: nextValue || null, page: 1 });
  };

  const handleStockChange = (checked) => {
    setFilterError("");
    updateQuery({ inStockOnly: checked ? "true" : null, page: 1 });
  };

  const handleClearFilters = () => {
    setFilterError("");
    updateQuery({ page: 1 }, ["minPrice", "maxPrice", "inStockOnly"]);
  };

  return (
    <main className={styles.collectionPage}>
      <CollectionHeader title={collectionTitle} productCount={totalProducts} />

      <div className={styles.catalogLayout}>
        <CollectionFilters
          collections={[]}
          selectedCollections={[]}
          minimumPrice={minimumPrice}
          maximumPrice={maximumPrice}
          inStockOnly={inStockOnly}
          onMinimumPriceChange={(value) => handlePriceChange("minPrice", value)}
          onMaximumPriceChange={(value) => handlePriceChange("maxPrice", value)}
          onInStockChange={handleStockChange}
          onClear={handleClearFilters}
          errorMessage={filterError}
        />

        <section className={styles.productSection} aria-label="Products">
          {loading ? (
            <CollectionStatus message="Loading products..." status="loading" />
          ) : error ? (
            <CollectionStatus
              title="Something went wrong"
              message={error}
              actionLabel="Try again"
              onAction={() => setRetryCount((count) => count + 1)}
            />
          ) : (
            <>
              <CollectionToolbar
                currentCount={products.length}
                totalCount={totalProducts}
                sort={sort}
                onSortChange={handleSortChange}
              />

              {products.length > 0 ? (
                <ProductGrid
                  products={products}
                  collectionTitle={collectionTitle}
                />
              ) : (
                <CollectionStatus
                  title="No devices found"
                  message="There are no products matching these filters."
                />
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default CollectionPage;
