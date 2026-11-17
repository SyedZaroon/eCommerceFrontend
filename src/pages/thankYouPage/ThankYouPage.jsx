import React from 'react'
import styles from './thankYouPage.module.css'
import OrderDetails from '@/components/orderDetails/OrderDetails';
import IconBox from "@/components/iconBox/IconBox";
import OrderConfirmation from '../../components/orderConfirmation/OrderConfirmation';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import Check from "@/assets/icons/Check";


const ThankYouPage = () => {
  const location = useLocation();
  const orderItems = location.state?.orderItems ?? [];
  const orderId = location.state?.orderId;

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
            <strong>#{orderId}</strong>
          </p>
        )}
      </section>

      <section className={styles.orderSection} aria-labelledby="order-summary-heading">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Your purchase</p>
            <h2 id="order-summary-heading">Order summary</h2>
          </div>
          <span className={styles.paymentStatus}>Cash on delivery</span>
        </div>
        <OrderDetails items={orderItems} />
      </section>

    </main>
  );
}

export default ThankYouPage