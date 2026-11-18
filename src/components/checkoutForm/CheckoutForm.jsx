import React, { useState } from "react";
import InputFields from "@/components/inputFields/InputFields";
import SearchIcon from "@/assets/icons/SearchIcon";
import ArrowDown from "@/assets/icons/ArrowDown";
import styles from "./checkoutForm.module.css";
import Button from "../button/Button";
import Bank from "../../assets/icons/Bank";
import Paypal from "../../assets/icons/Paypal";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hook/useCart";
import { createOrder } from "../../services/order";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [checkoutForm, setCheckoutForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    postCode: "",
    address: "",
    additionalInfo: "",
    town: "",
    country: "",
    paymentMethod: "COD",
    postage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCheckoutForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const submittedItems = cartItems.map((item) => ({
      _id: item._id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      productImg: item.productImg,
    }));

    // Cart total calculate karne ke liye (agar aapke paas useCart mein total hai toh wahan se le lein)
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0); 
    // Note: Agar shipping fee bhi hai toh wo bhi totalPrice mein add kar lein

    try {
      // --------------------------------------------------
      // CASE 1: JAZZCASH PAYMENT FLOW
      // --------------------------------------------------
      if (checkoutForm.paymentMethod === "JazzCash") {
        const paymentPayload = {
          paymentMethod: "JazzCash",
          totalPrice: totalPrice, // Total amount
          userInfo: {
            name: checkoutForm.fullName,
            email: checkoutForm.email,
            phone: checkoutForm.phoneNumber,
          },
          shippingAddress: {
            postalCode: checkoutForm.postCode,
            address: checkoutForm.address,
            additionalInfo: checkoutForm.additionalInfo,
            town: checkoutForm.town,
            country: checkoutForm.country,
          },
          orderItems: submittedItems.map((item) => ({
            product: item._id,
            qty: item.quantity,
          })),
        };

        // Backend ke unified payment route par request bhejiin
        const response = await fetch("http://localhost:5000/api/payment/initiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentPayload),
        });

        const data = await response.json();

        if (data.success) {
          // Backend se hash aur gateway data mil gaya!
          // Ab JazzCash gateway par auto-submit form ke zariye redirect karein
          submitToJazzCashGateway(data.paymentUrl, data.gatewayData);
          return; // Yahin rok dein taake aage ka COD code na chale
        } else {
          throw new Error(data.message || "Failed to initiate JazzCash payment.");
        }
      }

      // --------------------------------------------------
      // CASE 2: COD (CASH ON DELIVERY) FLOW (Purana Code)
      // --------------------------------------------------
      const result = await createOrder({
        orderItems: submittedItems.map((item) => ({
          product: item._id,
          qty: item.quantity,
        })),
        userInfo: {
          name: checkoutForm.fullName,
          email: checkoutForm.email,
          phone: checkoutForm.phoneNumber,
        },
        shippingAddress: {
          postalCode: checkoutForm.postCode,
          address: checkoutForm.address,
          additionalInfo: checkoutForm.additionalInfo,
          town: checkoutForm.town,
          country: checkoutForm.country,
        },
        paymentMethod: checkoutForm.paymentMethod,
      });

      if (!result.success || !result.order?._id) {
        throw new Error(result.message || "Unable to create your order.");
      }

      const orderItems = Array.isArray(result.order.orderItems)
        ? result.order.orderItems.map((item) => ({
            _id: String(item.product),
            title: item.title,
            quantity: item.qty,
            price: item.price,
            productImg: item.productImg,
          }))
        : submittedItems;

      const confirmationState = {
        orderItems,
        order: result.order,
        orderId: result.order._id,
        totalPrice: result.order.totalPrice,
        currency: result.order.currency,
      };

      navigate("/thankyou", {
        replace: true,
        state: confirmationState,
      });

    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          error.message ||
          "Unable to place your order. Please try again.",
      );
    } finally {
      // Agar JazzCash hai toh loading state on rehne dein kyunki page redirect ho raha hai
      if (checkoutForm.paymentMethod !== "JazzCash") {
        setIsSubmitting(false);
      }
    }
  };

  // Helper function to submit data to JazzCash securely via POST form
const submitToJazzCashGateway = (actionUrl, params) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = actionUrl;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = params[key];
      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
};

  return (
    <form onSubmit={handleSubmit} className={styles["checkout-form"]}>
      {/* Personal Details */}
      <div>
        <h4 className={styles["form-title"]}>Enter Your Details</h4>
        <div className={styles["fields-group"]}>
          <InputFields
            className={styles["checout-field"]}
            label="Name*"
            placeholder="Full Name"
            variant="border"
            type="text"
            name="fullName"
            value={checkoutForm.fullName}
            onChange={handleChange}
            required
          />
          <InputFields
            className={styles["checout-field"]}
            label="Email*"
            placeholder="Email Address"
            variant="border"
            type="email"
            name="email"
            value={checkoutForm.email}
            onChange={handleChange}
            required
          />
          <InputFields
            className={styles["checout-field"]}
            label="Mobile Phone*"
            placeholder="Phone Number"
            variant="border"
            type="tel"
            name="phoneNumber"
            value={checkoutForm.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <h4 className={styles["form-title"]}>Enter Your Address</h4>
        <div className={styles["fields-group"]}>
          <InputFields
            className={styles["checout-field"]}
            label="Post Code*"
            placeholder="e.g. SW1A 2AA"
            variant="border"
            type="text"
            name="postCode"
            value={checkoutForm.postCode}
            onChange={handleChange}
            suffixIcon={<SearchIcon />}
            required
          />
          <InputFields
            className={styles["checout-field"]}
            label="Choose Address*"
            placeholder="Please select your address"
            variant="border"
            type="text"
            name="address"
            value={checkoutForm.address}
            onChange={handleChange}
            suffixIcon={<ArrowDown />}
            required
          />
          <InputFields
            className={styles["checout-field"]}
            label="Additional Information"
            placeholder="Apartment, suite, etc (optional)"
            variant="border"
            type="text"
            name="additionalInfo"
            value={checkoutForm.additionalInfo}
            onChange={handleChange}
          />
          <div className={styles["row-flex-field"]}>
            <InputFields
              className={styles["checout-field"]}
              label="Town"
              placeholder="Town"
              variant="border"
              type="text"
              name="town"
              value={checkoutForm.town}
              onChange={handleChange}
              required
            />
            <InputFields
              className={styles["checout-field"]}
              label="Country"
              placeholder="Country"
              variant="border"
              type="text"
              name="country"
              value={checkoutForm.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div>
        <h4 className={styles["form-title"]}>Payment</h4>
        <div className={styles["fields-group"]}>
          <div className={styles["row-flex-field"]}>
            <InputFields
              className={styles["checout-field"]}
              variant="border"
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={checkoutForm.paymentMethod === "COD"}
              onChange={handleChange}
              required
            >
              <div className={styles["radio-child"]}>
                <span>
                  <Bank />
                </span>
                <span>Cash on delivery</span>
              </div>
            </InputFields>

            <InputFields
              className={styles["checout-field"]}
              variant="border"
              type="radio"
              name="paymentMethod"
              value="JazzCash"
              checked={checkoutForm.paymentMethod === "JazzCash"}
              onChange={handleChange}
            >
              <div className={styles["radio-child"]}>
                <span>
                  <Paypal />
                </span>
                <span>JazzCash</span>
              </div>
            </InputFields>
          </div>


        </div>
      </div>



      {submitError && (
        <p className={styles["submit-error"]} role="alert">
          {submitError}
        </p>
      )}

      <Button
        size="md"
        variant="primary"
        type="submit"
        disabled={isSubmitting || cartItems.length === 0}
      >
        {isSubmitting ? "Placing order..." : "Complete Your Order"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
