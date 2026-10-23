import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button.jsx";
import styles from "./errorPage.module.css";

const Error = () => {
  const navigate = useNavigate(); // ✅ Component ke andar

  return (
    <main className={styles["error-page"]}>
      <section
        className={styles["error-content"]}
        aria-labelledby="error-title"
      >
        <p className={styles["error-code"]} aria-hidden="true">
          404
        </p>

        <p className={styles["error-eyebrow"]}>Page not found</p>

        <h1 className={styles["error-title"]} id="error-title">
          Looks like this page is out of stock
        </h1>

        <p className={styles["error-description"]}>
          The page you’re looking for may have moved or no longer exists. Let’s
          get you back to finding a great deal.
        </p>

        <Button
          size="md"
          variant="primary"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </section>
    </main>
  );
};

export default Error;