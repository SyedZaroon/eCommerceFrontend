import React, { useEffect } from 'react'
import styles from './thankYouPage.module.css'
import OrderDetails from '@/components/orderDetails/OrderDetails';
import { Navigate, useLocation } from "react-router-dom";
import Check from "@/assets/icons/Check";
import { useCart } from "../../hook/useCart";

const ThankYouPage = () => {
  const location = useLocation();
  const { clearCart } = useCart();
  const confirmation = location.state?.orderId ? location.state : null;
  const order = confirmation?.order;
  const orderId = confirmation?.orderId || order?._id;
  const orderNumber = order?.orderNumber || confirmation?.orderNumber || orderId;
  const orderItems = confirmation?.orderItems ?? order?.orderItems?.map((item) => ({
    _id: String(item.product?._id || item.product),
    title: item.title,
    quantity: item.qty,
    price: item.price,
    productImg: item.productImg,
  }));

  useEffect(() => {
    if (orderId) {
      clearCart();
    }
  }, [clearCart, orderId]);

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className={styles.page}>
      <section className={styles.confirmation} aria-labelledby="thankyou-heading">
        <span className={styles.successIcon} aria-hidden="true">
          <Check svgClass={styles.checkIcon} />
        </span>
        <p className={styles.eyebrow}>Order confirmed</p>
        <h1 className={styles["thankyou-heading"]} id="thankyou-heading">
          Thank you for your order
        </h1>
        <p className={styles.confirmationText}>
          Your order has been received. We’ll contact you with the next steps.
        </p>
        {orderId && (
          <p className={styles.orderNumber}>
            <span>Order number</span>
            <strong>#{orderNumber}</strong>
          </p>
        )}
      </section>

      {Array.isArray(orderItems) && orderItems.length > 0 && (
        <section className={styles.orderSection} aria-labelledby="order-summary-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Your purchase</p>
              <h2 id="order-summary-heading">Order summary</h2>
            </div>
            <span className={styles.paymentStatus}>Cash on delivery</span>
          </div>
          <OrderDetails
            items={orderItems}
            currency={order?.currency || confirmation?.currency || "GBP"}
            totalPrice={order?.totalPrice ?? confirmation?.totalPrice}
          />
          {order && (
            <dl className={styles.orderInformation}>
              <div>
                <dt>Order status</dt>
                <dd>{order.orderStatus}</dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>{order.paymentMethod === "COD" ? "Cash on delivery" : order.paymentMethod}</dd>
              </div>
              <div>
                <dt>Customer</dt>
                <dd>{order.userInfo?.fullName}</dd>
              </div>
              <div>
                <dt>Delivery address</dt>
                <dd>
                  {[order.shippingAddress?.address, order.shippingAddress?.town,
                    order.shippingAddress?.postCode, order.shippingAddress?.country]
                    .filter(Boolean)
                    .join(", ")}
                </dd>
              </div>
            </dl>
          )}
        </section>
      )}

    </main>
  );
}

export default ThankYouPage