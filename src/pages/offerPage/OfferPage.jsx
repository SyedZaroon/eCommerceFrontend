import React from "react";
import styles from "./offerPage.module.css";
import { NavLink, useParams } from "react-router-dom";
import ArrowDown from "../../assets/icons/ArrowDown";
import Error from "../errorPage/Error";
import VariantPicker from "../../components/variantPicker/VariantPicker.jsx";
import Label from "@/components/labels/Label"
import buyerImg from '../../assets/images/urphone.png'
import Button from "../../components/button/Button.jsx";
import ProductOffer from "../../components/productOffer/ProductOffer.jsx";
import clsx from "clsx";


const OfferPage = () => {
  const { brand, model } = useParams();
  

  const isValidBrand = brandMenu.some((items) => items === brand);
const isValidModel = menu.some((items) => items.slug === model);
  
  if (!isValidBrand || !isValidModel) {
    return <Error />;
  }

  return (
    <>
      <div className={clsx(styles["offer-box"], styles.wdthbox)}>
        <div className={styles.slug}>
          <span>Home</span>
          <span>
            <ArrowDown />
          </span>
          <span>{brand}</span>
          <span>
            <ArrowDown />
          </span>
          <span>{model}</span>
        </div>

        <div className={styles["variant-picker-box"]}>
          <VariantPicker model={model} />

          <div className={styles["order-box"]}>
            <div className={styles["order-details-box"]}>
              <div className={styles["highest-offer-box"]}>
                <Label text="Highest Price Offer" success="true" />
                <div className={styles.selling}>
                  <img src={buyerImg}></img>
                  <p className={"order-price"}>£2,220.00</p>
                </div>
                <div style={{ width: "100%" }}>
                  <NavLink to="/checkout" >
                    <Button
                      className={styles["sell-btn"]}
                      size="md"
                      variant="primary"
                    >
                      Sell Now
                    </Button>
                  </NavLink>
                </div>
              </div>
            </div>

            <div className={styles["order-highlight"]}>
              <p>Reserve Your Sale Price</p>
              <p>
                Secure today’s top offer, even if your device value drops
                tomorrow.
              </p>
            </div>

            <div className={styles["order-highlight"]}>
              <p>No Pressure to Sell</p>
              <p>
                Change your mind anytime. There’s no commitment until you send
                your device.
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className={styles.line}></hr>

      <div className={clsx(styles.wdthbox, styles["product-offer-box"])}>
        <ProductOffer />
      </div>
    </>
  );
};

export default OfferPage;
