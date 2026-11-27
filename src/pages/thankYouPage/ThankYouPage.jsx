import React, { useEffect, useState } from 'react'
import styles from './thankYouPage.module.css'
import OrderDetails from '@/components/orderDetails/OrderDetails';
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import Check from "@/assets/icons/Check";
import { useCart } from "../../hook/useCart";
import { getStripeOrderConfirmation } from "../../services/order";

const ThankYouPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");
  const confirmation = location.state?.orderId ? location.state : null;
  const [stripeOrder, setStripeOrder] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(Boolean(sessionId));
  const [stripeError, setStripeError] = useState("");
  const order = stripeOrder || confirmation?.order;
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
    if (!sessionId) return undefined;

    let active = true;
    setStripeLoading(true);
    setStripeError("");
    getStripeOrderConfirmation(sessionId)
      .then((confirmedOrder) => {
        if (active) setStripeOrder(confirmedOrder);
      })
      .catch((error) => {
        if (active) {
          setStripeError(
            error.response?.data?.message ||
              "We could not verify your payment. Please contact support with your Stripe receipt.",
          );
        }
      })
      .finally(() => {
        if (active) setStripeLoading(false);
      });

    return () => {
      active = false;
    };
  }, [sessionId]);

  useEffect(() => {
    if (orderId) {
      clearCart();
    }
  }, [clearCart, orderId]);

  if (!orderId && !sessionId) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className={styles.page}>
      <section className={styles.confirmation} aria-labelledby="thankyou-heading">
        <span className={styles.successIcon} aria-hidden="true">
          <Check svgClass={styles.checkIcon} />
        </span>
        <p className={styles.eyebrow}>
          {stripeError ? "Payment verification issue" : "Order confirmed"}
        </p>
        <h1 className={styles["thankyou-heading"]} id="thankyou-heading">
          {stripeLoading
            ? "Verifying your payment"
            : stripeError && !orderId
              ? "We could not verify your payment"
              : "Thank you for your order"}
        </h1>
        <p className={styles.confirmationText}>
          {stripeError ||
            (stripeLoading
              ? "Please wait while we retrieve your order details."
              : order?.paymentStatus === "Paid"
                ? "Your payment has been received. We’ll contact you with the next steps."
                : "Your order has been received. We’ll contact you with the next steps.")}
        </p>
        {orderId && (
          <p className={styles.orderNumber}>
            <span>Order number</span>
            <strong>#{orderNumber}</strong>
          </p>
        )}
        {stripeError && !orderId && (
          <p role="alert" className={styles.confirmationText}>
            Keep your Stripe receipt and contact customer support for help.
          </p>
        )}
      </section>

      {stripeLoading && (
        <p role="status" className={styles.confirmationText}>
          Loading your order details…
        </p>
      )}

      {Array.isArray(orderItems) && orderItems.length > 0 && (
        <section className={styles.orderSection} aria-labelledby="order-summary-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Your purchase</p>
              <h2 id="order-summary-heading">Order summary</h2>
            </div>
            <span className={styles.paymentStatus}>
              {order?.paymentMethod === "COD"
                ? "Cash on delivery"
                : `${order?.paymentMethod || "Payment"} · ${order?.paymentStatus || "Pending"}`}
            </span>
          </div>
          <OrderDetails
            items={orderItems}
            currency={order?.currency || confirmation?.currency || "PKR"}
            totalPrice={order?.totalPrice ?? confirmation?.totalPrice}
            shippingPrice={order?.shippingPrice ?? confirmation?.shippingPrice}
            shippingLabel={
              order?.shippingPrice !== undefined ||
              confirmation?.shippingPrice !== undefined
                ? order?.shippingMethod === "next_day"
                  ? "Next Day Delivery"
                  : Number(order?.shippingPrice ?? confirmation?.shippingPrice) === 0
                    ? "Free Shipping"
                    : "Standard Delivery"
                : ""
            }
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