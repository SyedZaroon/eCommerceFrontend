import React, { useEffect, useState } from "react";
import styles from "./checkout.module.css";
import CheckoutForm from "@/components/checkoutForm/CheckoutForm.jsx";
import OrderDetails from "../../components/orderDetails/OrderDetails";
import whyus from "../../data/whyUs";
import { Navigate } from "react-router-dom";
import { useCart } from "../../hook/useCart";
import { getShippingOptions } from "../../services/order";

const Checkout = () => {
  const { cartItems } = useCart();
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [shippingCurrency, setShippingCurrency] = useState("PKR");
  const [shippingOptionsLoading, setShippingOptionsLoading] = useState(true);
  const [shippingOptionsError, setShippingOptionsError] = useState("");
  const itemsPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );
  const selectedShipping = shippingOptions.find(
    (option) => option.method === shippingMethod,
  );

  useEffect(() => {
    let isCurrentRequest = true;
    setShippingOptionsLoading(true);
    setShippingOptionsError("");
    getShippingOptions(itemsPrice)
      .then(({ options, currency }) => {
        if (isCurrentRequest) {
          setShippingOptions(options);
          setShippingCurrency(currency);
        }
      })
      .catch((error) => {
        if (isCurrentRequest) {
          console.error("Failed to load shipping options:", error);
          setShippingOptionsError(
            error.response?.data?.message ||
              "Unable to load shipping options. Please try again.",
          );
        }
      })
      .finally(() => {
        if (isCurrentRequest) setShippingOptionsLoading(false);
      });
    return () => {
      isCurrentRequest = false;
    };
  }, [itemsPrice]);

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className={styles["checout-box"]}>
      
      <div className={styles["mobile-order-details"]}>
        <OrderDetails
          currency={shippingCurrency}
          shippingLabel={selectedShipping?.label}
          shippingPrice={selectedShipping?.price}
        />
      </div>

      <div className={styles["col-1"]}>
        <CheckoutForm
          shippingOptions={shippingOptions}
          shippingMethod={shippingMethod}
          onShippingMethodChange={setShippingMethod}
          shippingOptionsLoading={shippingOptionsLoading}
          shippingOptionsError={shippingOptionsError}
          shippingPrice={selectedShipping?.price}
          itemsPrice={itemsPrice}
        />
      </div>

      <div className={styles["col-2"]}>
        <div className={styles["order-details"]}>
          <OrderDetails
            currency={shippingCurrency}
            shippingLabel={selectedShipping?.label}
            shippingPrice={selectedShipping?.price}
          />
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
