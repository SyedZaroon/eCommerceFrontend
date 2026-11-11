import React from "react";
import styles from "../collectionPage.module.css";

const CollectionHeader = ({ title, productCount }) => (
  <>
    <div className={styles.breadcrumbs} aria-label="Breadcrumb">
      <span>Home</span>
      <span className={styles.breadcrumbSeparator} aria-hidden="true">
        /
      </span>
      <span aria-current="page">{title}</span>
    </div>

    <section className={styles.collectionHero}>
      <div>
        <p className={styles.eyebrow}>PRE-LOVED. PRICE-FIRST.</p>
        <h1>{title}</h1>
        <p className={styles.heroDescription}>
          Find your next favourite device for less. Every phone is carefully
          checked and ready for a new home.
        </p>
      </div>

      <div className={styles.heroStat}>
        <span>{productCount}</span>
        <span>devices to explore</span>
      </div>
    </section>
  </>
);

export default CollectionHeader;
