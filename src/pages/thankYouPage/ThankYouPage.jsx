import React from 'react'
import styles from './thankYouPage.module.css'
import OrderDetails from '@/components/orderDetails/OrderDetails';
import IconBox from "@/components/iconBox/IconBox";
import OrderConfirmation from '../../components/orderConfirmation/OrderConfirmation';
import { useLocation } from 'react-router-dom';


const ThankYouPage = () => {
  const location = useLocation();
  const orderItems = location.state?.orderItems ?? [];

  return (
    <>
      <div className={styles["thankyou-box"]}>
        <div>
          <h1 className={styles["thankyou-heading"]}>
            Thank you for your order!
          </h1>
          <div className={styles["order-details"]} >
            <OrderDetails items={orderItems} />
          </div>
          <div className={styles["icon-box"]} >
            <IconBox
              title="Please remove your iCloud account before sending your device"
              desc="PhoneBox can only offer a non-working price for devices locked to an iCloud account. Please remove your iCloud account before sending your device to PhoneBox."
              variant="disclaimer"
            />
          </div>
        </div>
        <div className={styles["next-step"]} >
          <h1 className={styles["thankyou-heading"]}>What to do next?</h1>
          <div className={styles["order-confirmation"]} >
            <OrderConfirmation />
          </div>
        </div>
      </div>
    </>
  );
}

export default ThankYouPage