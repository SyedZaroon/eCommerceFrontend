import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CollectionFilters from "../../components/collectionFilters/CollectionFilters";
import Pagination from "../../components/pagination/Pagination";
import iphoneImage from "../../assets/images/iphone.png";
import phoneImage from "../../assets/images/urphone.png";
import styles from "./collectionPage.module.css";

const products = [
  {
    id: "iphone-15-pro-max",
    title: "Apple iPhone 15 Pro Max",
    brand: "Apple",
    collection: "Phones",
    storage: "256GB",
    grade: "Excellent",
    price: 729,
    oldPrice: 899,
    image: iphoneImage,
    badge: "Best seller",
  },
  {
    id: "samsung-s24-ultra",
    title: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    collection: "Phones",
    storage: "256GB",
    grade: "Excellent",
    price: 689,
    oldPrice: 849,
    image: phoneImage,
    badge: "Great value",
  },
  {
    id: "iphone-14",
    title: "Apple iPhone 14",
    brand: "Apple",
    collection: "Phones",
    storage: "128GB",
    grade: "Good",
    price: 399,
    oldPrice: 499,
    image: iphoneImage,
  },
  {
    id: "google-pixel-8-pro",
    title: "Google Pixel 8 Pro",
    brand: "Google",
    collection: "Phones",
    storage: "128GB",
    grade: "Very Good",
    price: 479,
    oldPrice: 599,
    image: phoneImage,
    badge: "Popular",
  },
  {
    id: "iphone-13",
    title: "Apple iPhone 13",
    brand: "Apple",
    collection: "Phones",
    storage: "128GB",
    grade: "Very Good",
    price: 299,
    oldPrice: 379,
    image: iphoneImage,
  },
  {
    id: "samsung-s23",
    title: "Samsung Galaxy S23",
    brand: "Samsung",
    collection: "Phones",
    storage: "256GB",
    grade: "Good",
    price: 349,
    oldPrice: 429,
    image: phoneImage,
  },
  {
    id: "iphone-15",
    title: "Apple iPhone 15",
    brand: "Apple",
    collection: "Phones",
    storage: "128GB",
    grade: "Excellent",
    price: 559,
    oldPrice: 699,
    image: iphoneImage,
    badge: "New arrival",
  },
  {
    id: "google-pixel-8",
    title: "Google Pixel 8",
    brand: "Google",
    collection: "Phones",
    storage: "128GB",
    grade: "Very Good",
    price: 329,
    oldPrice: 419,
    image: phoneImage,
  },
  {
    id: "samsung-s22",
    title: "Samsung Galaxy S22",
    brand: "Samsung",
    collection: "Phones",
    storage: "128GB",
    grade: "Good",
    price: 249,
    oldPrice: 319,
    image: phoneImage,
    inStock: false,
  },
  {
    id: "ipad-mini",
    title: "Apple iPad mini",
    brand: "Apple",
    collection: "Tablets",
    storage: "128GB",
    grade: "Excellent",
    price: 499,
    oldPrice: 629,
    image: null,
    badge: "Compact favourite",
  },
  {
    id: "apple-watch-series-9",
    title: "Apple Watch Series 9",
    brand: "Apple",
    collection: "Wearables",
    storage: "GPS",
    grade: "Very Good",
    price: 279,
    oldPrice: 349,
    image: null,
  },
];

const productsPerPage = 4;
const maximumPrice = 1000;
const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const formatCollectionName = (name = "All devices") =>
  name.toLowerCase() === "all"
    ? "All Devices"
    : name
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const CollectionPage = () => {
  const { collectionName = "all" } = useParams();
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [maximumSelectedPrice, setMaximumSelectedPrice] =
    useState(maximumPrice);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("a-z");
  const [currentPage, setCurrentPage] = useState(1);
  const collectionTitle = formatCollectionName(collectionName);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (
        selectedCollections.length > 0 &&
        !selectedCollections.includes(product.collection)
      ) {
        return false;
      }

      if (inStockOnly && product.inStock === false) return false;
      if (
        product.price < minimumPrice ||
        product.price > maximumSelectedPrice
      ) {
        return false;
      }

      return true;
    });

    if (sortBy === "a-z") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === "z-a") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }
    if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);

    return filtered;
  }, [
    inStockOnly,
    maximumSelectedPrice,
    minimumPrice,
    selectedCollections,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );
  const firstResult =
    filteredProducts.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1;
  const lastResult = Math.min(
    currentPage * productsPerPage,
    filteredProducts.length,
  );

  const updateFilters = (update) => {
    update();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCollections([]);
    setMinimumPrice(0);
    setMaximumSelectedPrice(maximumPrice);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const updateMinimumPrice = (value) => {
    const nextValue = Math.max(
      0,
      Math.min(Number(value) || 0, maximumSelectedPrice),
    );
    updateFilters(() => setMinimumPrice(nextValue));
  };

  const updateMaximumPrice = (value) => {
    const nextValue = Math.max(
      minimumPrice,
      Math.min(Number(value) || 0, maximumPrice),
    );
    updateFilters(() => setMaximumSelectedPrice(nextValue));
  };

  return (
    <main className={styles.collectionPage}>
      <div className={styles.breadcrumbs} aria-label="Breadcrumb">
        <span>Home</span>
        <span className={styles.breadcrumbSeparator} aria-hidden="true">
          /
        </span>
        <span aria-current="page">{collectionTitle}</span>
      </div>

      <section className={styles.collectionHero}>
        <div>
          <p className={styles.eyebrow}>PRE-LOVED. PRICE-FIRST.</p>
          <h1>{collectionTitle}</h1>
          <p className={styles.heroDescription}>
            Find your next favourite device for less. Every phone is carefully
            checked and ready for a new home.
          </p>
        </div>
        <div className={styles.heroStat}>
          <span>{products.length}</span>
          <span>devices to explore</span>
        </div>
      </section>

      <div className={styles.catalogLayout}>
        <CollectionFilters
          collections={["Phones", "Tablets", "Wearables"]}
          selectedCollections={selectedCollections}
          minimumPrice={minimumPrice}
          maximumPrice={maximumSelectedPrice}
          priceLimit={maximumPrice}
          inStockOnly={inStockOnly}
          onCollectionChange={(collection) =>
            updateFilters(() =>
              setSelectedCollections((current) =>
                current.includes(collection)
                  ? current.filter((item) => item !== collection)
                  : [...current, collection],
              ),
            )
          }
          onMinimumPriceChange={updateMinimumPrice}
          onMaximumPriceChange={updateMaximumPrice}
          onInStockChange={(checked) =>
            updateFilters(() => setInStockOnly(checked))
          }
          onClear={clearFilters}
        />

        <section className={styles.productSection} aria-label="Products">
          <div className={styles.toolbar}>
            <p className={styles.resultCount}>
              Showing <strong>{firstResult}–{lastResult}</strong> of{" "}
              <strong>{filteredProducts.length}</strong> devices
            </p>
            <label className={styles.sortControl}>
              <span>Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="a-z">A–Z</option>
                <option value="z-a">Z–A</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>

          {visibleProducts.length > 0 ? (
            <div className={styles.productGrid}>
              {visibleProducts.map((product) => (
                <article className={styles.productCard} key={product.id}>
                  <div className={styles.productImageWrap}>
                    {product.badge && (
                      <span className={styles.productBadge}>
                        {product.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      className={styles.favoriteButton}
                      aria-label={`Save ${product.title} to favourites`}
                    >
                      ♡
                    </button>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className={styles.productImage}
                      />
                    ) : (
                      <span className={styles.imagePlaceholder}>
                        {product.collection}
                      </span>
                    )}
                  </div>

                  <div className={styles.productInfo}>
                    <p className={styles.productBrand}>
                      {product.collection} <span>·</span> {product.storage}
                    </p>
                    <h2>{product.title}</h2>
                    <p className={styles.condition}>
                      <span
                        className={
                          product.inStock === false ? styles.outOfStockDot : ""
                        }
                        aria-hidden="true"
                      />
                      {product.inStock === false
                        ? "Out of stock"
                        : `${product.grade} condition`}
                    </p>
                    <div className={styles.productPriceRow}>
                      <strong>{currencyFormatter.format(product.price)}</strong>
                      <del>{currencyFormatter.format(product.oldPrice)}</del>
                    </div>
                    <p className={styles.savings}>
                      Save {currencyFormatter.format(product.oldPrice - product.price)}
                    </p>
                    <button type="button" className={styles.viewButton}>
                      View device
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2>No devices match these filters</h2>
              <p>Try changing your filters to see more devices.</p>
              <button
                type="button"
                className={styles.resetButton}
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default CollectionPage;
