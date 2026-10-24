import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../button/Button.jsx";
import styles from "./variantPicker.module.css";
import { useCart } from "../../hook/useCart.jsx";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const formatPrice = (price) => {
  const amount = Number(price);
  return Number.isFinite(amount) ? currencyFormatter.format(amount) : null;
};

const VariantPicker = ({ product }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState("1");
  const [showQuantityError, setShowQuantityError] = useState(false);
    const { addToCart } = useCart();
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    setQuantity("1");
    setShowQuantityError(false);
  }, [product]);

  if (!product) {
    return <p className={styles.loading}>Loading product...</p>;
  }

  const { productImg, image, sku, title, discountPrice, basePrice, stock } =
    product;
  const imageSrc = productImg || image;
  const quantityValue = Number(quantity);
  const stockValue = Number(stock);
  const hasValidStock =
    stock !== null &&
    stock !== undefined &&
    stock !== "" &&
    Number.isInteger(stockValue) &&
    stockValue >= 0;
  const isInStock = hasValidStock && stockValue > 0;
  const isQuantityValid = Number.isInteger(quantityValue) && quantityValue >= 1;
  const exceedsStock =
    isQuantityValid && hasValidStock && quantityValue > stockValue;
  const unitPrice = Number(discountPrice);
  const subtotal =
    isQuantityValid && !exceedsStock && Number.isFinite(unitPrice)
      ? formatPrice(unitPrice * quantityValue)
      : null;
  const showBasePrice =
    Number.isFinite(Number(basePrice)) &&
    Number.isFinite(unitPrice) &&
    Number(basePrice) > unitPrice;

  const updateQuantity = (nextQuantity) => {
    setQuantity(String(nextQuantity));
    setShowQuantityError(true);
  };

  const adjustQuantity = (amount) => {
    let currentQuantity = quantityValue;
    if (!isQuantityValid) {
      currentQuantity = amount > 0 ? 0 : 1;
    }
    const nextQuantity = Math.max(1, currentQuantity + amount);
    updateQuantity(
      hasValidStock ? Math.min(nextQuantity, stockValue) : nextQuantity,
    );
  };

  const quantityError = !isQuantityValid
    ? "Enter a whole number of at least 1."
    : exceedsStock
      ? `Only ${stockValue} item${stockValue === 1 ? "" : "s"} available.`
      : null;
  const buyNowLabel = isInStock
    ? "Buy now"
    : hasValidStock
      ? "Out of stock"
      : "Unavailable";

  const handleBuyNow = () => {
    if (!isInStock || !isQuantityValid || exceedsStock || !subtotal) {
      return;
    }

    navigate("/checkout", { state: { product, quantity: quantityValue } });
  };


  const handleAddToCart = () => {
    setCartError("");

    if (!isInStock || !isQuantityValid || exceedsStock || !subtotal) {
      setShowQuantityError(true);
      return;
    }

    const added = addToCart(product, quantityValue);

    if (!added) {
      setCartError("Unable to add this product to your cart.");
    }
  };

  return (
    <section className={styles["product-card"]} aria-label="Product details">
      <div className={styles["image-box"]}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title || "Product"}
            className={styles["product-image"]}
          />
        ) : (
          <span className={styles["image-placeholder"]}>Image unavailable</span>
        )}
      </div>

      <div className={styles["product-info"]}>
        <div className={styles["product-heading"]}>
          {sku && <p className={styles["product-sku"]}>SKU: {sku}</p>}
          <h2 className={styles["product-title"]}>{title || "Product"}</h2>
        </div>

        <div className={styles["price-row"]}>
          {formatPrice(discountPrice) ? (
            <span className={styles["discount-price"]}>
              {formatPrice(discountPrice)}
            </span>
          ) : (
            <span className={styles["discount-price"]}>Price unavailable</span>
          )}
          {showBasePrice && (
            <del className={styles["base-price"]}>{formatPrice(basePrice)}</del>
          )}
          <span className={styles["price-caption"]}>per item</span>
        </div>

        <div className={styles["quantity-section"]}>
          <label
            className={styles["quantity-label"]}
            htmlFor="product-quantity"
          >
            Quantity
          </label>
          <div className={styles["quantity-control"]}>
            <button
              type="button"
              className={styles["quantity-button"]}
              onClick={() => adjustQuantity(-1)}
              disabled={isQuantityValid && quantityValue <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              id="product-quantity"
              className={styles["quantity-input"]}
              type="number"
              min="1"
              max={hasValidStock ? stockValue : undefined}
              step="1"
              inputMode="numeric"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              onBlur={() => setShowQuantityError(true)}
              aria-invalid={showQuantityError && Boolean(quantityError)}
              aria-describedby={
                showQuantityError && quantityError
                  ? "quantity-error"
                  : undefined
              }
            />
            <button
              type="button"
              className={styles["quantity-button"]}
              onClick={() => adjustQuantity(1)}
              disabled={hasValidStock && quantityValue >= stockValue}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {isInStock ? (
            <p className={styles["stock-status"]}>{stockValue} in stock</p>
          ) : (
            <p className={styles["stock-error"]}>
              {hasValidStock
                ? "Out of stock."
                : "Stock availability unavailable."}
            </p>
          )}
          {showQuantityError && quantityError && (
            <p className={styles["quantity-error"]} id="quantity-error">
              {quantityError}
            </p>
          )}
        </div>

        <div className={styles.subtotal} aria-live="polite">
          <span className={styles["subtotal-label"]}>Subtotal</span>
          <strong>{subtotal || "—"}</strong>
        </div>

        <div>
          <Button
            className={styles["buy-now-button"]}
            size="md"
            variant="primary"
            type="button"
            disabled={
              !isInStock || !isQuantityValid || exceedsStock || !subtotal
            }
            onClick={handleBuyNow}
          >
            {buyNowLabel}
          </Button>
          <Button
            className={styles["buy-now-button"]}
            size="md"
            variant="primary"
            type="button"
            disabled={
              !isInStock || !isQuantityValid || exceedsStock || !subtotal
            }
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VariantPicker;
