import React from "react";
import styles from "../collectionPage.module.css";
import { NavLink } from "react-router-dom";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const ProductGrid = ({ products, collectionTitle }) => (
  <div className={styles.productGrid}>
    {products.map((product) => (
      <article className={styles.productCard} key={product._id}>
        <div className={styles.productImageWrap}>

          {product.productImg ? (
            <img
              src={product.productImg}
              alt={product.title}
              className={styles.productImage}
            />
          ) : (
            <span className={styles.imagePlaceholder}>{collectionTitle}</span>
          )}
        </div>

        <div className={styles.productInfo}>
          <p className={styles.productBrand}>{collectionTitle}</p>
          <h2>{product.title}</h2>
          <p className={styles.condition}>
            <span
              className={product.stock <= 0 ? styles.outOfStockDot : ""}
              aria-hidden="true"
            />
            {product.stock <= 0 ? "Out of stock" : "In stock"}
          </p>

          <div className={styles.productPriceRow}>
            <strong>{currencyFormatter.format(product.discountPrice)}</strong>
            <del>{currencyFormatter.format(product.basePrice)}</del>
          </div>

          <p className={styles.savings}>
            Save{" "}
            {currencyFormatter.format(
              product.basePrice - product.discountPrice,
            )}
          </p>

          <NavLink to={`/product/${product.slug}`} type="button" className={styles.viewButton}>
            View device
            <span aria-hidden="true">→</span>
          </NavLink>
        </div>
      </article>
    ))}
  </div>
);

export default ProductGrid;
