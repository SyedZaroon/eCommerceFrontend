import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hook/useCart";
import styles from "./cartPage.module.css";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, updateQuantity, removeFromCart } = useCart();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Your order</p>
        <h1>Shopping cart</h1>
        <p>{cartItems.length} {cartItems.length === 1 ? "product" : "products"}</p>
      </header>

      {cartItems.length === 0 ? (
        <section className={styles.emptyState}>
          <h2>Your cart is empty</h2>
          <p>Browse our products and add something to your order.</p>
          <button type="button" onClick={() => navigate("/")}>
            Continue shopping
          </button>
        </section>
      ) : (
        <>
          <section className={styles.items} aria-label="Cart items">
            {cartItems.map((item) => (
              <article className={styles.item} key={item._id}>
                <div className={styles.imageBox}>
                  {item.productImg ? (
                    <img src={item.productImg} alt={item.title} />
                  ) : (
                    <span>No image</span>
                  )}
                </div>
                <div className={styles.details}>
                  <h2>{item.title}</h2>
                  {item.sku && <p className={styles.sku}>SKU: {item.sku}</p>}
                  <p>{currencyFormatter.format(item.price)} each</p>
                  <div className={styles.actions}>
                    <div className={styles.quantity} aria-label={`Quantity for ${item.title}`}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease ${item.title} quantity`}
                      >
                        −
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label={`Increase ${item.title} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <strong className={styles.lineTotal}>
                  {currencyFormatter.format(item.price * item.quantity)}
                </strong>
              </article>
            ))}
          </section>

          <footer className={styles.summary}>
            <div>
              <span>Subtotal</span>
              <strong>{currencyFormatter.format(subtotal)}</strong>
            </div>
            <p>Shipping and taxes are calculated at checkout.</p>
            <button type="button" onClick={() => navigate("/checkout")}>
              Proceed to checkout
            </button>
            <button
              type="button"
              className={styles.continue}
              onClick={() => navigate("/")}
            >
              Continue shopping
            </button>
          </footer>
        </>
      )}
    </main>
  );
};

export default CartPage;