import React from 'react'
import styles from './homeBanner.module.css'
import BannerImg from '../../assets/images/HomeBannerMobile.png'
import ProductSearch from "../searchDrawer/ProductSearch";

const HomeBanner = () => {
  return (
    <div className={styles["home-banner"]}>
      <div className={styles["home-banner-content"]}>
        <h1 className={styles["banner-heading"]}>
          <span>Get Top</span> Offers <span>For Your</span> Old Phone{" "}
          <span>or</span> Gadget
        </h1>
        <p className={styles["banner-description"]}>
          We match you with top rated recyclers offering competitive prices.
        </p>
        <div className={styles["banner-newsletter"]}>
          <ProductSearch mode="inline" />
        </div>
      </div>
      <div className={styles["banner-box"]} >
        <img className={styles["banner-img"]} src={BannerImg} width="370px" height="383px" />
      </div>
    </div>
  );
}

export default HomeBanner