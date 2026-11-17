import React from 'react'
import styles from './orderDetails.module.css'
import sellingimg from '@/assets/images/urphone.png'
import trustpilotlogo from "@/assets/images/trustpilotlogo.png";
import clsx from 'clsx';
import { useCart } from '../../hook/useCart';

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const OrderDetails = ({ items }) => {
  const { cartItems } = useCart();
  const orderItems = items ?? cartItems;
  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

    const orderPrice = (
      <div
        className={
                clsx(
                    styles["device-details-box"],
                    styles["grid-flex"],
                    styles["order-price-box"]
                )
        }
      >
        <p className={styles["order-heading"]}>Offered Price</p>

        <div>
          <p className={styles["order-price"]}>{currencyFormatter.format(subtotal)}</p>
        </div>
      </div>
    );


  return (
    <div className={styles["container-wrapper"]} >
      <div className={styles["order-details-box"]}>
        <div
          className={(clsx(styles["device-details-box"]), styles["grid-flex"])}
        >
          <p className={styles["order-heading"]}>Order Details</p>
          <div className={styles["order-items"]}>
            {orderItems.map((item) => (
              <div
                className={clsx(styles["device-img-box"], styles["grid-flex-row"])}
                key={item._id}
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
                  <p>{item.quantity} × {currencyFormatter.format(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={clsx(styles["selling-details-box"], styles["grid-flex"])}
        >

          <div className={styles["order-review-box"]}>
            <p className={clsx(styles["order-heading"])}>Reviews</p>
            <img
              className={styles["device-img"]}
              src={trustpilotlogo}
              height="56px"
              width="144px"
            />
          </div>

          <div className={clsx(styles["price-wrapper"], styles.DesktopHide)}>
            {orderPrice}
          </div>
        </div>

        <div className={clsx(styles["price-wrapper"], styles.MobileHide)}>
          {orderPrice}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails