import React from 'react'
import styles from './orderDetails.module.css'
import clsx from 'clsx';
import { useCart } from '../../hook/useCart';

const OrderDetails = ({
  items,
  currency = "PKR",
  totalPrice,
  shippingPrice,
  shippingLabel,
}) => {
  const { cartItems } = useCart();
  const orderItems = Array.isArray(items) ? items : cartItems;
  const currencyFormatter = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency,
  });
  const subtotal = orderItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity ?? item.qty),
    0
  );
  const amountDue = Number.isFinite(Number(totalPrice))
    ? Number(totalPrice)
    : subtotal + (Number(shippingPrice) || 0);
  const formatMoney = (amount) =>
    currencyFormatter.format(Number(amount) || 0);

  return (
    <div className={styles["container-wrapper"]}>
      <div className={styles["order-details-box"]}>
        <section className={clsx(styles["section"], styles["grid-flex"])}>
          <p className={styles["order-heading"]}>Order products</p>
          <div className={styles["order-items"]}>
            {orderItems.map((item) => (
              <div
                className={clsx(styles["device-img-box"], styles["grid-flex-row"])}
                key={item._id || item.product}
              >
                {item.productImg && (
                  <img
                    className={styles["device-img"]}
                    src={item.productImg}
                    alt={item.title}
                  />
                )}
                <div className={clsx(styles["order-details"], styles["grid-flex"])}>
                  <p className={styles["order-title"]}>{item.title}</p>
                  <p>
                    {item.quantity ?? item.qty} ×{" "}
                    {currencyFormatter.format(Number(item.price))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {(shippingLabel || Number.isFinite(Number(shippingPrice))) && (
          <section className={clsx(styles["section"], styles["grid-flex"])}>
            <p className={styles["order-heading"]}>Shipping details</p>
            <div className={styles["shipping-line"]}>
              <span>{shippingLabel || "Shipping"}</span>
              <span>
                {Number(shippingPrice) === 0
                  ? "Free"
                  : formatMoney(shippingPrice)}
              </span>
            </div>
          </section>
        )}

        <section className={clsx(styles["section"], styles["grid-flex"])}>
          <p className={styles["order-heading"]}>Order details</p>
          <div className={styles["summary-lines"]}>
            <div className={styles["summary-line"]}>
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className={styles["summary-line"]}>
              <span>Total</span>
              <span className={styles["order-price"]}>
                {formatMoney(amountDue)}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OrderDetails