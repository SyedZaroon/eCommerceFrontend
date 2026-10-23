import React, { useEffect, useState } from "react";
import styles from "./offerPage.module.css";
import { NavLink, useParams } from "react-router-dom";
import ArrowDown from "../../assets/icons/ArrowDown";
import Error from "../errorPage/Error";
import VariantPicker from "../../components/variantPicker/VariantPicker.jsx";
import clsx from "clsx";
import { getSingleProduct } from "../../services/product.js";

const OfferPage = () => {
  const { model } = useParams();
  const [product, setProduct] = useState();
  const [notfound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getSingleProduct(model);
        setProduct(data?.data);
      } catch (error) {
        setNotFound(true);
        console.error(error);
      }
    };

    fetchProduct();
  }, [model]);

  if (notfound) {
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
          <span>{model}</span>
        </div>

        <div className={styles["variant-picker-box"]}>
          <VariantPicker product={product} />

        </div>
      </div>

      <hr className={styles.line}></hr>

      <div className={clsx(styles.wdthbox, styles["product-offer-box"])}>
        <h2>Product Description</h2>
        <p>{product?.description}</p>
      </div>
    </>
  );
};

export default OfferPage;
