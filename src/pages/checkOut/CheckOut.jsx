import React from "react";
import styles from "./checkout.module.css";
import CheckoutForm from "@/components/checkoutForm/CheckoutForm.jsx";
import OrderDetails from "../../components/orderDetails/OrderDetails";
import whyus from "../../data/whyUs";
import { Navigate } from "react-router-dom";
import { useCart } from "../../hook/useCart";

const Checkout = () => {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className={styles["checout-box"]}>
      
      <div className={styles["mobile-order-details"]}>
        <OrderDetails />
      </div>

      <div className={styles["col-1"]}>
        <CheckoutForm />
      </div>

      <div className={styles["col-2"]}>
        <div className={styles["order-details"]}>
          <OrderDetails />
        </div>

        <div className={styles["why-us"]}>
          {whyus.map((value, index) => {
            const clonedIcon = React.isValidElement(value.icon)
              ? React.cloneElement(value.icon, {
                  svgClass: styles["svgicon"],
                  pathClass: styles["svgpath"],
                })
              : null;

            return (
              <div className={styles["why-us-box"]} key={index}>
                <div className={styles["icon"]}>
                  <span>{clonedIcon}</span>
                </div>
                <div>
                  <h4 className={styles["title"]}>{value.title}</h4>
                  <p className={styles["desc"]}>{value.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
