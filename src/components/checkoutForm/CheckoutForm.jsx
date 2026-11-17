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

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const [checkoutForm, setCheckoutForm] = useState({
    firstName: "",
    Email: "",
    phoneNumber: "",
    postCode: "",
    Address: "",
    AdditionalInfo: "",
    town: "",
    country: "",
    payment: "",
    sortCode: "",
    AccountNumber: "",
    postage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCheckoutForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/thankyou", { state: { orderItems: cartItems } });
    clearCart();
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
            name="firstName"
            value={checkoutForm.firstName}
            onChange={handleChange}
          />
          <InputFields
            className={styles["checout-field"]}
            label="Email*"
            placeholder="Email Address"
            variant="border"
            type="email"
            name="Email"
            value={checkoutForm.Email}
            onChange={handleChange}
          />
          <InputFields
            className={styles["checout-field"]}
            label="Mobile Phone*"
            placeholder="Phone Number"
            variant="border"
            type="text"
            name="phoneNumber"
            value={checkoutForm.phoneNumber}
            onChange={handleChange}
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
          />
          <InputFields
            className={styles["checout-field"]}
            label="Choose Address*"
            placeholder="Please select your address"
            variant="border"
            type="text"
            name="Address"
            value={checkoutForm.Address}
            onChange={handleChange}
            suffixIcon={<ArrowDown />}
          />
          <InputFields
            className={styles["checout-field"]}
            label="Additional Information"
            placeholder="Apartment, suite, etc (optional)"
            variant="border"
            type="text"
            name="AdditionalInfo"
            value={checkoutForm.AdditionalInfo}
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
              name="payment"
              value="bank"
              checked={checkoutForm.payment === "bank"}
              onChange={handleChange}
            >
              <div className={styles["radio-child"]}>
                <span>
                  <Bank />
                </span>
                <span>Bank</span>
              </div>
            </InputFields>

            <InputFields
              className={styles["checout-field"]}
              variant="border"
              type="radio"
              name="payment"
              value="paypal"
              checked={checkoutForm.payment === "paypal"}
              onChange={handleChange}
            >
              <div className={styles["radio-child"]}>
                <span>
                  <Paypal />
                </span>
                <span>Paypal</span>
              </div>
            </InputFields>
          </div>

          {checkoutForm.payment === "bank" && (
            <div className={styles["row-flex-field"]}>
              <InputFields
                className={styles["checout-field"]}
                label="Sort Code*"
                placeholder="e.g. 111111"
                variant="border"
                type="text"
                name="sortCode"
                value={checkoutForm.sortCode}
                onChange={handleChange}
              />
              <InputFields
                className={styles["checout-field"]}
                label="Bank Account Number*"
                placeholder="e.g. 12345678"
                variant="border"
                type="text"
                name="AccountNumber"
                value={checkoutForm.AccountNumber}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Postage */}
      <div>
        <h4 className={styles["form-title"]}>Postage</h4>
        <div className={styles["fields-group"]}>
          <InputFields
            className={styles["checout-field"]}
            variant="border"
            type="radio"
            name="postage"
            value="label"
            checked={checkoutForm.postage === "Pre-paid Postage"}
            onChange={handleChange}
          >
            <div>
              <p className={styles["radio-heading"]}>Postage Label</p>
              <p className={styles["radio-desc"]}>
                Receive a pre-paid postage label via email and attach it to your
                own packaging.
              </p>
            </div>
          </InputFields>

          <InputFields
            className={styles["checout-field"]}
            variant="border"
            type="radio"
            name="postage"
            value="pack"
            checked={checkoutForm.postage === "postage-paid"}
            onChange={handleChange}
          >
            <div>
              <p className={styles["radio-heading"]}>Send me a postage pack</p>
              <p className={styles["radio-desc"]}>
                You’ll be sent a postage-paid pack ready to pop your device in.
              </p>
            </div>
          </InputFields>
        </div>
      </div>

      <Button size="md" variant="primary" type="submit">
        Complete Your Order
      </Button>
    </form>
  );
};

export default CheckoutForm;
