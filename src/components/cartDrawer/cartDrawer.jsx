import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cartDrawer.module.css";
import { useCart } from "../../hook/useCart";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const formatPrice = (price) => currencyFormatter.format(price);

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    subtotal,
    totalQuantity,
    updateQuantity,
    removeFromCart,
    closeCart,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();

    navigate("/checkout", {
      state: {
        fromCart: true,
        cartItems,
      },
    });
  };

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      closeCart();
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayMouseDown}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <header className={styles.header}>
          <div className={styles.heading}>
            <h2 id="cart-title">Your Cart</h2>
            <p aria-live="polite">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={closeCart}
            aria-label="Close cart"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <span className={styles.emptyCartIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
                <circle cx="10" cy="20" r="1" fill="currentColor" />
                <circle cx="18" cy="20" r="1" fill="currentColor" />
              </svg>
            </span>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven’t found your next favourite yet.</p>
            <button
              type="button"
              className={styles.continueButton}
              onClick={closeCart}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <section className={styles.items} aria-label="Cart items">
              {cartItems.map((item) => (
                <article className={styles.cartItem} key={item._id}>
                  <div className={styles.imageBox}>
                    {item.productImg ? (
                      <img
                        src={item.productImg}
                        alt={item.title}
                        className={styles.productImage}
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </div>

                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeading}>
                      <h3>{item.title}</h3>
                      <strong className={styles.price}>
                        {formatPrice(item.price)}
                      </strong>
                    </div>

                    {item.sku && (
                      <p className={styles.sku}>SKU: {item.sku}</p>
                    )}

                    {item.basePrice > item.price && (
                      <p className={styles.originalPrice}>
                        Was {formatPrice(item.basePrice)}
                      </p>
                    )}

                    <div className={styles.itemActions}>
                      <div
                        className={styles.quantityControl}
                        role="group"
                        aria-label={`Quantity for ${item.title}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease ${item.title} quantity`}
                        >
                          −
                        </button>

                        <span aria-live="polite">{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          aria-label={`Increase ${item.title} quantity`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => removeFromCart(item._id)}
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        Remove
                      </button>
                    </div>

                    <p className={styles.lineTotal}>
                      Item total:{" "}
                      <strong>
                        {formatPrice(item.price * item.quantity)}
                      </strong>
                    </p>
                  </div>
                </article>
              ))}
            </section>

            <footer className={styles.footer}>
              <div className={styles.subtotalRow}>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>

              <p className={styles.note}>
                Shipping and taxes are calculated at checkout.
              </p>

              <button
                type="button"
                className={styles.checkoutButton}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>

              <button
                type="button"
                className={styles.continueButton}
                onClick={closeCart}
              >
                Continue Shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
